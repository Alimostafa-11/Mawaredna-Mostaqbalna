# syntax=docker/dockerfile:1

# Build context is the REPOSITORY ROOT, not apps/api, because the npm
# workspace lockfile lives there:
#   docker build -f apps/api/Dockerfile -t mawaredna-api .

FROM node:24-alpine AS base
WORKDIR /app
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

# ---- Dependencies -----------------------------------------------------------
FROM base AS deps
# Both workspace manifests are needed for `npm ci` to satisfy the lockfile,
# even though only the API is built here.
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci --workspace @agri/api --include-workspace-root

# ---- Build ------------------------------------------------------------------
FROM deps AS build
COPY apps/api ./apps/api
RUN npm run build --workspace @agri/api

# ---- Production dependencies ------------------------------------------------
FROM base AS prod-deps
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci --workspace @agri/api --include-workspace-root --omit=dev \
  && npm cache clean --force

# ---- Runtime ----------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=4000

# dumb-init reaps zombies and forwards SIGTERM, so ECS task draining actually
# reaches Nest's shutdown hooks.
RUN apk add --no-cache dumb-init

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json

USER node
EXPOSE 4000

# The load balancer uses this too; keeping it in the image means a plain
# `docker run` reports health the same way production does.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
