export const site = {
  name: 'AccesseEase',
  contactEndpoint: import.meta.env.VITE_CONTACT_API_URL?.trim() || '',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL?.trim() || '',
  url: import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || '',
  socials: [],
};
export const navigation = [
  ['Home', '/'], ['Features', '/features'], ['How It Works', '/how-it-works'], ['About Us', '/about'], ['Contact', '/contact'],
];
export const metadata = {
  '/': ['Your digital world. Your way.', 'Explore practical accessibility adjustments for a more comfortable, personalized digital experience with AccesseEase.'],
  '/features': ['Accessibility tools built around you', 'Explore 13 accessibility settings for visual customization, reading assistance, comfort and navigation.'],
  '/how-it-works': ['A little adjustment. A better experience.', 'Discover, try and reset AccesseEase accessibility preferences with a working interactive preview.'],
  '/about': ['Building a more inclusive digital world', 'Learn about the AccesseEase mission, product philosophy and approach to accessible design.'],
  '/contact': ['Let’s make digital access easier together', 'Ask about AccesseEase, share accessibility feedback or discuss a product demonstration.'],
  '/faq': ['A little clarity goes a long way', 'Find answers about getting started, accessibility settings, customization, compatibility and support.'],
  '/privacy': ['Privacy policy — review draft', 'Review the clearly marked draft privacy information for the AccesseEase marketing website.'],
  '/terms': ['Terms of service — review draft', 'Review the clearly marked draft terms for the AccesseEase marketing website.'],
};
