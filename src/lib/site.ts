/**
 * Single source of truth for every navigation surface in StudioSpace:
 * the navbar, the account dropdown and the footer.
 *
 * Keeping the labels/hrefs here means the header and footer can never
 * drift apart, and re-theming the chrome later is a one-file change.
 */

export type NavLink = {
  label: string;
  href: string;
};

export type AccountIconName =
  | "dashboard"
  | "studio-add"
  | "studio"
  | "calendar";

export type AccountLink = NavLink & {
  icon: AccountIconName;
  /** Short helper shown under the label in the account panel. */
  hint: string;
};

/** Primary header navigation. */
export const MAIN_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

/** Signed-in account menu — shown in the avatar dropdown and the mobile sheet. */
export const ACCOUNT_LINKS: AccountLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    hint: "Overview & activity",
  },
  {
    label: "Add New Studio",
    href: "/studios/new",
    icon: "studio-add",
    hint: "Publish a space",
  },
  {
    label: "My Studio Listings",
    href: "/dashboard/listings",
    icon: "studio",
    hint: "Manage your spaces",
  },
  {
    label: "My Bookings",
    href: "/dashboard/bookings",
    icon: "calendar",
    hint: "Upcoming & past slots",
  },
];

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "List Your Studio", href: "/studios/new" },
];

export const FOOTER_CATEGORIES: NavLink[] = [
  { label: "Photography Cyc Walls", href: "/studios?category=cyc-wall" },
  { label: "Cinema Sound Stages", href: "/studios?category=sound-stage" },
  { label: "Podcast Lounges", href: "/studios?category=podcast-lounge" },
  { label: "Music Recording Suites", href: "/studios?category=recording-suite" },
  { label: "Art Workshops", href: "/studios?category=art-workshop" },
  { label: "Green Screen Rooms", href: "/studios?category=green-screen" },
];

export const FOOTER_HOST_LINKS: NavLink[] = [
  { label: "Become a Host", href: "/become-a-host" },
  { label: "Host Dashboard", href: "/dashboard" },
  { label: "Pricing & Payouts", href: "/become-a-host#payouts" },
  { label: "Host Protection", href: "/become-a-host#protection" },
];

export const FOOTER_SUPPORT_LINKS: NavLink[] = [
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
  { label: "Cancellation Policy", href: "/policies/cancellation" },
  { label: "Safety & Trust", href: "/safety" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

export type SocialLink = {
  label: string;
  href: string;
  icon: "x" | "instagram" | "youtube" | "linkedin";
};

/** Replace the hrefs with your own profiles when they are ready. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
];

export const SITE = {
  name: "StudioSpace",
  wordmarkLead: "Studio",
  wordmarkTail: "Space",
  tagline: "Creative studio marketplace",
  mission:
    "StudioSpace exists so every creator can walk into a ready-to-shoot space — cyc walls, sound stages, podcast lounges and recording suites — booked by the hour, with transparent pricing and no surprise fees.",
  ribbon:
    "Live in 27 cities — photo studios, sound stages and podcast suites booked by the hour.",
  copyrightYear: 2026,
} as const;

/** Shared active-link check used by the header and the account menus. */
export function isActivePath(pathname: string, href: string): boolean {
  const target = href.split("?")[0].split("#")[0];
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(`${target}/`);
}
