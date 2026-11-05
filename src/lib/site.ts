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

/* ------------------------------------------------------------------ */
/* Studio categories — the filter vocabulary shared by the home page,  */
/* the /studios listing, the footer and the seeded MongoDB documents.  */
/* ------------------------------------------------------------------ */

export type StudioCategory = {
  /** Stored on the `category` field of every studio document. */
  slug: string;
  label: string;
  blurb: string;
  /** Card artwork (Wikimedia Commons, hot-linked at 1920px). */
  image: string;
  /** Shown in the home page's "Browse by category" rail. */
  featured: boolean;
};

export const STUDIO_CATEGORIES: StudioCategory[] = [
  {
    slug: "photo-studio",
    label: "Photo Studios",
    blurb: "Cyc walls, infinity bays and daylight lofts",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Studio_Bts_%28140066927%29.jpeg/1920px-Studio_Bts_%28140066927%29.jpeg",
    featured: true,
  },
  {
    slug: "sound-stage",
    label: "Sound Stages",
    blurb: "Cinema floors with grid access and blackout",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Sound_stage_4%2C_Shinfield_Studios.jpg/1920px-Sound_stage_4%2C_Shinfield_Studios.jpg",
    featured: true,
  },
  {
    slug: "podcast-room",
    label: "Podcast Rooms",
    blurb: "Treated booths, mic-ready and stream-ready",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Podcasting-wcwc.jpg/1920px-Podcasting-wcwc.jpg",
    featured: true,
  },
  {
    slug: "music-suite",
    label: "Music Suites",
    blurb: "Control rooms, live rooms and drum booths",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Neve_81_Series_Mixing_Console.jpg/1920px-Neve_81_Series_Mixing_Console.jpg",
    featured: true,
  },
  {
    slug: "art-workshop",
    label: "Art Workshops",
    blurb: "Wet studios, kilns and wall-to-wall easels",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Workshop_of_Temo_Svirely_2013.jpg/1920px-Workshop_of_Temo_Svirely_2013.jpg",
    featured: true,
  },
  {
    slug: "green-screen",
    label: "Green Screen Rooms",
    blurb: "Chroma bays with even, wash-free lighting",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Green_screen_studio_%2825113564876%29.jpg/1920px-Green_screen_studio_%2825113564876%29.jpg",
    featured: false,
  },
];

/** Look-up used by cards and the /studios filter rail. */
export const CATEGORY_BY_SLUG = new Map(
  STUDIO_CATEGORIES.map((category) => [category.slug, category]),
);

export function categoryLabel(slug: string): string {
  return CATEGORY_BY_SLUG.get(slug)?.label ?? slug;
}

export const FOOTER_CATEGORIES: NavLink[] = STUDIO_CATEGORIES.map(
  (category) => ({
    label: category.label,
    href: `/studios?category=${category.slug}`,
  }),
);

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
