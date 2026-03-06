export const MAIN_NAV_ITEMS = [
  { label: "DECK", href: "/" },
  { label: "RIM", href: "/rim" },
  { label: "COMPLETE WHEELS", href: "/complete-wheels" },
  { label: "DECK HOTEL", href: "/deck-hotel" },
  { label: "WHEEL ALIGNMENT", href: "/wheel-alignment" },
  { label: "RIM RENOVATION", href: "/rim-renovation" },
  { label: "DC WHEELS", href: "/dc-wheels" },
];

export const UTILITY_NAV_ITEMS = [
  { label: "BOOK AN APPOINTMENT", href: "/book-appointment" },
  { label: "CONTACT", href: "/contact" },
  { label: "TERMS", href: "/terms" },
  { label: "LOG IN", href: "/login" },
];

export function isNavItemActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
