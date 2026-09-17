/**
 * Single source of truth for site navigation.
 *
 * `primary` items get a slot in the desktop bar; everything else lives behind
 * the "More" menu there. The mobile drawer always shows the full list, so no
 * section is reachable only on desktop.
 */
export interface NavItem {
  href: string;
  /** Key under the `nav` namespace in the message catalogues. */
  labelKey: string;
  primary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', labelKey: 'home', primary: true },
  { href: '/about', labelKey: 'about', primary: true },
  { href: '/services', labelKey: 'services', primary: true },
  { href: '/compost', labelKey: 'compost', primary: true },
  { href: '/process', labelKey: 'process', primary: true },
  { href: '/projects', labelKey: 'projects', primary: true },
  { href: '/sugarcane', labelKey: 'sugarcane' },
  { href: '/sustainability', labelKey: 'sustainability' },
  { href: '/partners', labelKey: 'partners' },
  { href: '/gallery', labelKey: 'gallery' },
  { href: '/calculator', labelKey: 'calculator' },
  { href: '/contact', labelKey: 'contact' },
];

export const PRIMARY_NAV = NAV_ITEMS.filter((item) => item.primary);
export const SECONDARY_NAV = NAV_ITEMS.filter((item) => !item.primary);

/** Links repeated in the footer's "quick links" column. */
// export const FOOTER_LINKS = NAV_ITEMS.filter((item) => item.href !== '/');


export const ABOUT_LINKS = [
   { href: '/about', labelKey: 'about', primary: true },
    { href: '/projects', labelKey: 'projects', primary: true },
     { href: '/sustainability', labelKey: 'sustainability' },
      { href: '/partners', labelKey: 'partners' },
        { href: '/gallery', labelKey: 'gallery' },

]


export const SERVICES_LINKS = [
   { href: '/services', labelKey: 'services', primary: true },
     { href: '/compost', labelKey: 'compost', primary: true },
     { href: '/process', labelKey: 'process' },
      { href: '/sugarcane', labelKey: 'sugarcane' },
       { href: '/calculator', labelKey: 'calculator' },
]


export const CONTACT_LINKS = [
{ href: '/contact', labelKey: 'contact', primary: true },

]

