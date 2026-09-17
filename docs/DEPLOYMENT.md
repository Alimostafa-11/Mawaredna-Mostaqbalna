# Deploying to AWS

Written for: the engineer who deploys and operates this site.

Both apps ship as standalone Docker images. Nothing here assumes a particular
IaC tool — the same shape works with the console, CDK, Terraform or Copilot.

---

## Target architecture

```
                    ┌──────────────┐
   visitors ───────▶│  CloudFront  │──── /_next/static, media (S3 origin)
                    └──────┬───────┘
                           │ everything else
                    ┌──────▼───────┐
                    │     ALB      │
                    └──┬────────┬──┘
              web :3000│        │api :4000
              ┌────────▼─┐   ┌──▼────────┐
              │ ECS task │   │ ECS task  │
              │  (web)   │   │   (api)   │
              └──────────┘   └─────┬─────┘
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
              ┌──────▼──────┐            ┌───────▼──────┐
              │ MongoDB      │            │  S3 bucket   │
              │ Atlas / DocDB│            │   (media)    │
              └──────────────┘            └──────────────┘
```

The site is mostly statically generated with ISR, so CloudFront absorbs most
traffic and both services stay small.

---

## 1. Build and push the images

Both Dockerfiles take the **repository root** as build context.

```bash
ACCOUNT=123456789012
REGION=eu-central-1
ECR=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com

aws ecr get-login-password --region $REGION \
  | docker login --username AWS --password-stdin $ECR

aws ecr create-repository --repository-name mawaredna-api --region $REGION
aws ecr create-repository --repository-name mawaredna-web --region $REGION

docker build -f apps/api/Dockerfile -t $ECR/mawaredna-api:latest .
docker push $ECR/mawaredna-api:latest

# NEXT_PUBLIC_* are compiled into the bundle, so they are build args.
docker build -f apps/web/Dockerfile -t $ECR/mawaredna-web:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://api.mawaredna.com/api/v1 \
  --build-arg NEXT_PUBLIC_SITE_URL=https://mawaredna.com \
  --build-arg NEXT_PUBLIC_MEDIA_HOST=cdn.mawaredna.com \
  --build-arg API_URL=https://api.mawaredna.com/api/v1 .
docker push $ECR/mawaredna-web:latest
```

> **The API should be reachable from the build environment.** The web build
> prerenders every page, fetching content as it goes. If the API is
> unreachable the build still succeeds — pages render their placeholders and
> ISR fills them in on the first revalidation (300s) — but the first visitors
> after a deploy would see empty sections. Point `API_URL` at the running API
> when building in CI.

---

## 2. Database

Either option works; the connection string is the only difference.

**MongoDB Atlas** (simplest): create an M10+ cluster in the same region, add
the NAT gateway / VPC peering to the access list, and use the standard SRV
URI.

**Amazon DocumentDB** (stays inside the VPC): DocumentDB does not support
retryable writes, so the URI must disable them:

```
MONGODB_URI=mongodb://user:pass@cluster.cluster-xxxx.eu-central-1.docdb.amazonaws.com:27017/agri?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false
```

DocumentDB requires the Amazon RDS CA bundle in the task image if you enforce
TLS verification.

Put the URI in Secrets Manager and reference it from the task definition —
never inline it.

---

## 3. S3 and CloudFront for media

```bash
aws s3api create-bucket --bucket mawaredna-media --region $REGION \
  --create-bucket-configuration LocationConstraint=$REGION

aws s3api put-public-access-block --bucket mawaredna-media \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

Keep the bucket private and serve it through a CloudFront distribution with an
**Origin Access Control**, then set `S3_PUBLIC_URL=https://cdn.mawaredna.com`.

The browser uploads directly to S3 using a presigned `PUT` from
`POST /api/v1/uploads/presign`, so the bucket needs CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": ["https://mawaredna.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### IAM — use the task role, not access keys

Leave `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` **unset** in AWS. The S3
client only passes explicit credentials when both are present, otherwise it
falls back to the default provider chain and picks up the ECS task role
(`apps/api/src/modules/uploads/s3.service.ts`).

Minimum policy for the API task role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::mawaredna-media/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mawaredna-media"
    }
  ]
}
```

`s3:ListBucket` is only needed for the `HeadBucket` check the API runs at boot;
drop it if you would rather not grant it — the API logs a warning and keeps
running.

---

## 4. ECS services

### API task

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `MONGODB_URI` | from Secrets Manager |
| `JWT_SECRET` | from Secrets Manager, 32+ chars |
| `CORS_ORIGINS` | `https://mawaredna.com` |
| `AWS_REGION` | `eu-central-1` |
| `S3_BUCKET` | `mawaredna-media` |
| `S3_PUBLIC_URL` | `https://cdn.mawaredna.com` |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | `60000` / `60` |
| `ENABLE_SWAGGER` | leave unset (docs off in production) |

- Health check path: `/api/v1/health` (returns `degraded` if Mongo is down, so
  set the ALB matcher to `200` only).
- Swagger is off in production unless `ENABLE_SWAGGER=true`. Leave it unset on
  a public API, or put it behind the VPN / an authenticating proxy.
- 0.5 vCPU / 1 GB is ample to start.

### Web task

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `API_URL` | `https://api.mawaredna.com/api/v1` (server-side fetches) |

`NEXT_PUBLIC_*` values are already baked in at build time; setting them at
runtime has no effect.

Health check path: `/ar`.

### ALB

- `api.mawaredna.com` → API target group, port 4000.
- `mawaredna.com` → web target group, port 3000.
- ACM certificate on both; redirect 80 → 443.

The API calls `app.set('trust proxy', 1)`, so rate limiting sees the real
client IP from `X-Forwarded-For` rather than the load balancer's.

---

## 5. Seeding production

Run once, after the first deploy:

```bash
aws ecs run-task --cluster mawaredna --task-definition mawaredna-api \
  --overrides '{"containerOverrides":[{"name":"api","command":["node","dist/seed/seed.js"]}]}'
```

It is idempotent — every write is an upsert — so re-running it after a content
update only refreshes the brief-derived content.

**Change `ADMIN_PASSWORD` before running it in production**, then remove
`ADMIN_EMAIL` / `ADMIN_PASSWORD` from the task definition; they are only read
by the seed.

---

## 6. Operational notes

**Rate limiting is per container.** `express-rate-limit` counts in memory, so
with more than one task the effective limit is `limit × task count`. If you
need a global limit, put an AWS WAF rate-based rule in front of the ALB, or
back the limiter with ElastiCache.

**ISR revalidation is per container too.** Each web task keeps its own cache,
so after a content edit different tasks may serve stale copies for up to 300
seconds. Options, in increasing order of effort:

1. Accept the window (content changes rarely on this site).
2. Lower `CONTENT_REVALIDATE_SECONDS` in `apps/web/src/lib/api.ts`.
3. Add an on-demand revalidation route the admin panel calls after a save.

**Logs** go to stdout; wire the awslogs driver to CloudWatch. The API logs
every inquiry it receives and every 5xx with a stack trace.

**Scaling**: both services are stateless. Scale on CPU or ALB request count.
The database is the only stateful component.

---

## Pre-launch checklist

- [ ] `JWT_SECRET` is a fresh 32+ character random string in Secrets Manager
- [ ] `ADMIN_PASSWORD` changed from the default, then removed from the task def
- [ ] `CORS_ORIGINS` lists only the production domain
- [ ] S3 bucket is private, served via CloudFront OAC, CORS allows the site origin
- [ ] API task role grants S3 access — no static AWS keys in the task definition
- [ ] `NEXT_PUBLIC_SITE_URL` set correctly (canonical URLs, sitemap, Open Graph)
- [ ] `NEXT_PUBLIC_MEDIA_HOST` set, otherwise `next/image` rejects remote media
- [ ] `ENABLE_SWAGGER` unset, so the API docs are not public
- [ ] Content reviewed against the commercial register and licences
- [ ] Calculator rate table reviewed by the company's agronomist
- [ ] Partner logos published only where written consent is on file
