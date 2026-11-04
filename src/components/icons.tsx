import type { ComponentType, SVGProps } from "react";

import type { AccountIconName, SocialLink } from "@/lib/site";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

/** Six-blade camera aperture — the StudioSpace mark. */
export function ApertureIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
      <line x1="9.69" y1="8" x2="21.17" y2="8" />
      <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
      <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
      <line x1="14.31" y1="16" x2="2.83" y2="16" />
      <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* UI                                                                  */
/* ------------------------------------------------------------------ */

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.8} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.8} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.8} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.8} {...props}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 8.1 5.4a1.5 1.5 0 0 0 1.8 0L21 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Account menu                                                        */
/* ------------------------------------------------------------------ */

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

export function StudioAddIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M3 20.5V9.2a2 2 0 0 1 1.1-1.8l6-3a2 2 0 0 1 1.8 0l6 3A2 2 0 0 1 19 9.2v11.3" />
      <path d="M2.5 20.5h19" />
      <path d="M15.5 13.5h5" />
      <path d="M18 11v5" />
    </svg>
  );
}

export function StudioIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M4 20.5V6.4a2 2 0 0 1 1.2-1.84l7-3.08a2 2 0 0 1 1.6 0l7 3.08A2 2 0 0 1 22 6.4v14.1" />
      <path d="M2.5 20.5h19" />
      <path d="M9 20.5v-5h6v5" />
      <path d="M9.5 9.5h1.5" />
      <path d="M13.5 9.5H15" />
      <path d="M9.5 13h1.5" />
      <path d="M13.5 13H15" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M7.5 14.5h3" />
      <path d="M13.5 17.5h3" />
      <path d="M13.5 14.5h3" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M14.5 4.5h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3" />
      <path d="m9.5 16 4-4-4-4" />
      <path d="M13.5 12H3.5" />
    </svg>
  );
}

const ACCOUNT_ICONS: Record<AccountIconName, ComponentType<IconProps>> = {
    dashboard: DashboardIcon,
    "studio-add": StudioAddIcon,
    studio: StudioIcon,
    calendar: CalendarIcon,
  };

export function AccountIcon({
  name,
  ...props
}: { name: AccountIconName } & IconProps) {
  const Icon = ACCOUNT_ICONS[name];
  return <Icon {...props} />;
}

/* ------------------------------------------------------------------ */
/* Social — X (current mark), Instagram, YouTube, LinkedIn             */
/* ------------------------------------------------------------------ */

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.7} {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9C0 8.8 0 12 0 12s0 3.2.5 5.1a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.1.5-5.1s0-3.2-.5-5.1Zm-13.9 8.2V8.9L15.7 12l-6.1 3.1Z"
      />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4V9Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<SocialLink["icon"], ComponentType<IconProps>> = {
  x: XIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
};

export function SocialIcon({
  name,
  ...props
}: { name: SocialLink["icon"] } & IconProps) {
  const Icon = SOCIAL_ICONS[name];
  return <Icon {...props} />;
}
