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

export function LockIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
      <path d="M7.75 10.5V7.75a4.25 4.25 0 0 1 8.5 0v2.75" />
      <circle cx="12" cy="15.75" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M2.5 12S6 5.75 12 5.75 21.5 12 21.5 12 18 18.25 12 18.25 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M3.2 3.2 20.8 20.8" />
      <path d="M10.6 6.1A8.9 8.9 0 0 1 12 6c6 0 9.5 6 9.5 6a16.6 16.6 0 0 1-3.1 3.7" />
      <path d="M6.4 7.9A16.4 16.4 0 0 0 2.5 12s3.5 6 9.5 6a9.4 9.4 0 0 0 3.6-.7" />
      <path d="M9.9 10.2a3 3 0 0 0 4.1 4.2" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.5 20.3a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.6" cy="9.6" r="1.6" />
      <path d="m4 17.2 4.6-4.4a2 2 0 0 1 2.7-.05L16 16.6" />
      <path d="m13.6 14.4 1.7-1.6a2 2 0 0 1 2.7-.03L20 14.4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={2} {...props}>
      <path d="m5 12.6 4.5 4.4L19 7.5" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 11v5.4" />
      <circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Google "G" — multi-colour brand mark, so it keeps its official palette. */
export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.89Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.28 6.63l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Marketplace — cards, workflow steps and host assurances             */
/* ------------------------------------------------------------------ */

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M12 21c4.2-4.1 7-7.3 7-10.6a7 7 0 1 0-14 0C5 13.7 7.8 16.9 12 21Z" />
      <circle cx="12" cy="10.3" r="2.6" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.6a.9.9 0 0 1 .83.55l2.2 4.5 4.97.72a.9.9 0 0 1 .5 1.54l-3.6 3.5.85 4.95a.9.9 0 0 1-1.31.95L12 17.03l-4.44 2.33a.9.9 0 0 1-1.31-.95l.85-4.95-3.6-3.5a.9.9 0 0 1 .5-1.54l4.97-.72 2.2-4.5A.9.9 0 0 1 12 2.6Z" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.8} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.9} {...props}>
      <path d="m14.5 5.5-6 6.5 6 6.5" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.9} {...props}>
      <path d="m9.5 5.5 6 6.5-6 6.5" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.7} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.7} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.4V12l3.2 2" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M13.4 2.5 4.8 13.4h6.1l-.9 8.1 8.7-11h-6.1l.8-8Z" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M3 8.6a2 2 0 0 1 2-2h1.9l1.2-2h5.8l1.2 2H19a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="12.8" r="3.4" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M12 2.8 4.8 5.6v5.9c0 4.3 2.9 8.2 7.2 9.7 4.3-1.5 7.2-5.4 7.2-9.7V5.6Z" />
      <path d="m8.8 12.1 2.3 2.3 4.1-4.4" />
    </svg>
  );
}

export function BadgeCheckIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="m12 2.9 2.2 1.7 2.7-.3 1 2.6 2.5 1.2-.7 2.7.7 2.7-2.5 1.2-1 2.6-2.7-.3L12 21.1l-2.2-1.7-2.7.3-1-2.6-2.5-1.2.7-2.7-.7-2.7 2.5-1.2 1-2.6 2.7.3Z" />
      <path d="m9.2 12.2 2 2 3.6-3.9" />
    </svg>
  );
}

export function ToolIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M14.8 6.2a3.9 3.9 0 0 1 5.1-3.7l-2.5 2.5.7 3.1 3.1.7 2.5-2.5" />
      <path d="M14.3 9.7 4.6 19.4a2 2 0 0 1-2.8-2.8l9.7-9.7" />
      <path d="m13.2 10.8 2.6 2.6" />
    </svg>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <svg {...stroke} strokeWidth={1.6} {...props}>
      <path d="M4.2 14.5v-2.7a7.8 7.8 0 0 1 15.6 0v2.7" />
      <path d="M4.2 13.6h1.9a1.3 1.3 0 0 1 1.3 1.3v3.4a1.3 1.3 0 0 1-1.3 1.3H5.5a1.3 1.3 0 0 1-1.3-1.3Z" />
      <path d="M19.8 13.6h-1.9a1.3 1.3 0 0 0-1.3 1.3v3.4a1.3 1.3 0 0 0 1.3 1.3h.6a1.3 1.3 0 0 0 1.3-1.3Z" />
      <path d="M19.8 18.4v.6a2.4 2.4 0 0 1-2.4 2.4h-3" />
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
