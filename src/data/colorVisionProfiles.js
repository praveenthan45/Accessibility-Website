// Sample presentation presets, not simulations or corrections of a person's vision.
// Keep labels and shapes alongside every palette (W3C Use of Color):
// https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
export const colorVisionProfiles = [
  {
    value: 'default', label: 'Normal / Default',
    hint: 'Original sample colors. Choose a preset to compare.',
    style: {},
  },
  {
    value: 'protanopia', label: 'Protanopia Support',
    hint: 'Navy and amber, with labels and outlined controls.',
    style: {
      '--vision-background': '#f2f6fc', '--vision-surface': '#ffffff',
      '--vision-text': '#14243c', '--vision-muted': '#344760',
      '--vision-accent': '#174ea6', '--vision-accent-soft': '#e5edff',
      '--vision-highlight': '#fff2c6', '--vision-highlight-border': '#805500',
    },
  },
  {
    value: 'deuteranopia', label: 'Deuteranopia Support',
    hint: 'Purple and ochre, with labels and outlined controls.',
    style: {
      '--vision-background': '#f7f3fb', '--vision-surface': '#ffffff',
      '--vision-text': '#292039', '--vision-muted': '#51415e',
      '--vision-accent': '#603a91', '--vision-accent-soft': '#eee5f8',
      '--vision-highlight': '#fff0dc', '--vision-highlight-border': '#80501e',
    },
  },
  {
    value: 'tritanopia', label: 'Tritanopia Support',
    hint: 'Magenta and teal, with labels and outlined controls.',
    style: {
      '--vision-background': '#fff4f7', '--vision-surface': '#ffffff',
      '--vision-text': '#2e2330', '--vision-muted': '#574452',
      '--vision-accent': '#90244f', '--vision-accent-soft': '#fbe3eb',
      '--vision-highlight': '#e1f4ef', '--vision-highlight-border': '#145e56',
    },
  },
  {
    value: 'monochrome', label: 'High Distinction / Monochrome',
    hint: 'Black, white and gray, with grayscale imagery and dashed cues.',
    style: {
      '--vision-background': '#ffffff', '--vision-surface': '#ffffff',
      '--vision-text': '#111111', '--vision-muted': '#333333',
      '--vision-accent': '#111111', '--vision-accent-soft': '#eeeeee',
      '--vision-highlight': '#f0f0f0', '--vision-highlight-border': '#333333',
    },
  },
];

export function getColorVisionProfile(value) {
  return colorVisionProfiles.find(profile => profile.value === value) || colorVisionProfiles[0];
}
