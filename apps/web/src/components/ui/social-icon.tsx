import { Link2 } from 'lucide-react';
import {
  siFacebook,
  siInstagram,
  siTiktok,
  siX,
  siYoutube,
  type SimpleIcon,
} from 'simple-icons';

/**
 * Brand marks for the social links.
 *
 * lucide-react dropped brand icons in v1, so the marks come from simple-icons
 * (CC0) instead. LinkedIn is not distributed there, so it — and anything else
 * without a mark — falls back to a generic link glyph; the accessible name
 * still identifies the network either way.
 */
const BRAND_MARKS: Record<string, SimpleIcon | undefined> = {
  facebook: siFacebook,
  instagram: siInstagram,
  youtube: siYoutube,
  x: siX,
  tiktok: siTiktok,
  linkedin: undefined,
};

interface SocialIconProps {
  network: string;
  className?: string;
}

export function SocialIcon({ network, className = 'size-4' }: SocialIconProps) {
  const mark = BRAND_MARKS[network];

  if (!mark) {
    return <Link2 aria-hidden className={className} />;
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role="presentation"
    >
      <path d={mark.path} />
    </svg>
  );
}

/** Display names, used as the link's accessible name. */
export const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X',
  tiktok: 'TikTok',
};

export const SOCIAL_NETWORKS = [
  'facebook',
  'instagram',
  'linkedin',
  'youtube',
  'x',
  'tiktok',
] as const;
