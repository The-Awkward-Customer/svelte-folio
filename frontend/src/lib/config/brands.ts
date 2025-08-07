export const BRANDS = {
  godesk: '#DDFF00',     // --color-brand-godesk: rgba(221, 255, 0, 1)
  fresha: '#6950F3',     // --color-brand-fresha: rgba(105, 80, 243, 1)
  jio: '#3E0084',        // --color-brand-jio: rgba(2, 35, 134, 1)
  ikea: '#FFDA1A',       // --color-brand-ikea: rgba(255, 218, 26, 1)
  warhammer: '#000000',  // --color-brand-warhammer: rgba(0, 0, 0, 1)
  shell: '#FBCE07',      // --color-brand-shell: rgba(251, 206, 7, 1)
  suzuki: '#013044',     // --color-brand-suzuki: rgba(1, 48, 68, 1)
  postoffice: '#EE2722', // --color-brand-postoffice: rgba(238, 39, 34, 1)
  hsbc: '#FFFFFF',       // --color-brand-hsbc: rgba(255, 255, 255, 1)
  unilever: '#0F0E9A',   // --color-brand-unilever: rgba(15, 14, 154, 1)
  axa: '#343C3D',        // --color-brand-axa: rgba(52, 60, 61, 1)
  tsb: '#00A8E1',        // --color-brand-tsb: rgba(0, 168, 225, 1)
  foolproof: '#FF5722'   // --color-brand-foolproof: rgba(255, 87, 34, 1)
} as const;

export type BrandKey = keyof typeof BRANDS;

// Helper to determine if a brand needs light or dark text
export function getBrandTextTheme(brand: BrandKey): 'light' | 'dark' {
  const lightTextBrands: BrandKey[] = ['warhammer', 'jio', 'suzuki', 'unilever', 'axa'];
  return lightTextBrands.includes(brand) ? 'light' : 'dark';
}