/**
 * Curated Clinical Sample Face Profiles for instant testing
 * Formatted as SVG Data URLs for reliable, zero-broken-image testing
 */

export interface SampleProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  skinType: string;
  concerns: string[];
  description: string;
  imageDataUrl: string;
}

// Generate realistic SVG face data URI
function createFaceSvg(skinColor: string, hairColor: string, lipColor: string, eyeColor: string, blushColor: string, title: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fdfbf9" />
      <stop offset="100%" stop-color="#e7e5e4" />
    </radialGradient>
    <radialGradient id="skin" cx="50%" cy="45%" r="48%">
      <stop offset="0%" stop-color="${skinColor}" />
      <stop offset="85%" stop-color="${skinColor}" stop-opacity="0.94" />
      <stop offset="100%" stop-color="#cca78b" stop-opacity="0.6" />
    </radialGradient>
    <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${hairColor}" />
      <stop offset="100%" stop-color="#1c1917" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Studio Neutral Background -->
  <rect width="400" height="500" fill="url(#bg)" />

  <!-- Shoulder / Bust -->
  <path d="M 60 500 C 70 410, 140 370, 200 370 C 260 370, 330 410, 340 500 Z" fill="#292524" />
  
  <!-- Neck -->
  <path d="M 160 320 C 160 380, 240 380, 240 320 Z" fill="${skinColor}" />
  <path d="M 170 330 C 170 350, 230 350, 230 330" stroke="#cca78b" stroke-width="2" fill="none" opacity="0.4" />

  <!-- Back Hair -->
  <path d="M 100 240 C 90 380, 110 440, 130 460 C 110 380, 110 300, 120 220 Z" fill="url(#hair)" />
  <path d="M 300 240 C 310 380, 290 440, 270 460 C 290 380, 290 300, 280 220 Z" fill="url(#hair)" />

  <!-- Face Contour -->
  <path d="M 125 180 C 120 280, 150 345, 200 348 C 250 345, 280 280, 275 180 C 270 100, 130 100, 125 180 Z" fill="url(#skin)" />

  <!-- Natural Cheek Blush -->
  <ellipse cx="155" cy="245" rx="28" ry="18" fill="${blushColor}" opacity="0.4" filter="url(#softGlow)" />
  <ellipse cx="245" cy="245" rx="28" ry="18" fill="${blushColor}" opacity="0.4" filter="url(#softGlow)" />

  <!-- Forehead / T-Zone Micro-Contour -->
  <path d="M 140 160 C 170 152, 230 152, 260 160" stroke="#b08968" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.25" />

  <!-- Eyebrows -->
  <path d="M 140 178 C 155 170, 175 171, 185 178" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none" />
  <path d="M 215 178 C 225 171, 245 170, 260 178" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none" />

  <!-- Eyes -->
  <path d="M 145 198 C 155 190, 175 190, 183 198 C 175 204, 155 204, 145 198 Z" fill="#ffffff" />
  <circle cx="164" cy="197" r="6" fill="${eyeColor}" />
  <circle cx="164" cy="197" r="2.5" fill="#0c0a09" />
  <circle cx="166" cy="195" r="1.5" fill="#ffffff" />

  <path d="M 217 198 C 225 190, 245 190, 255 198 C 245 204, 225 204, 217 198 Z" fill="#ffffff" />
  <circle cx="236" cy="197" r="6" fill="${eyeColor}" />
  <circle cx="236" cy="197" r="2.5" fill="#0c0a09" />
  <circle cx="238" cy="195" r="1.5" fill="#ffffff" />

  <!-- Eyelids & Eyelashes -->
  <path d="M 143 196 C 155 188, 175 188, 185 196" stroke="#292524" stroke-width="2.5" fill="none" stroke-linecap="round" />
  <path d="M 215 196 C 225 188, 245 188, 257 196" stroke="#292524" stroke-width="2.5" fill="none" stroke-linecap="round" />

  <!-- Under-Eye Tear Trough Shadow -->
  <path d="M 148 206 C 160 214, 175 214, 182 208" stroke="#cca78b" stroke-width="1.8" fill="none" opacity="0.45" />
  <path d="M 218 208 C 225 214, 240 214, 252 206" stroke="#cca78b" stroke-width="1.8" fill="none" opacity="0.45" />

  <!-- Nose -->
  <path d="M 197 185 L 195 240 C 195 248, 186 248, 184 250 C 187 254, 213 254, 216 250 C 214 248, 205 248, 205 240" stroke="#b08968" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.7" />
  <circle cx="192" cy="248" r="1.5" fill="#78350f" opacity="0.3" />
  <circle cx="208" cy="248" r="1.5" fill="#78350f" opacity="0.3" />

  <!-- Lips -->
  <path d="M 175 285 C 188 280, 200 282, 200 282 C 200 282, 212 280, 225 285 C 220 295, 200 297, 175 285 Z" fill="${lipColor}" />
  <path d="M 175 285 C 190 290, 210 290, 225 285 C 215 304, 185 304, 175 285 Z" fill="${lipColor}" opacity="0.9" />
  <path d="M 177 285 C 190 287, 210 287, 223 285" stroke="#7f1d1d" stroke-width="1.2" fill="none" opacity="0.5" />

  <!-- Chin Crease -->
  <path d="M 190 318 C 196 322, 204 322, 210 318" stroke="#b08968" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.35" />

  <!-- Front Hair Style -->
  <path d="M 124 165 C 120 100, 160 65, 200 65 C 240 65, 280 100, 276 165 C 255 125, 220 120, 200 120 C 180 120, 145 125, 124 165 Z" fill="url(#hair)" />

  <!-- Subtle Studio Rim Watermark Label -->
  <text x="200" y="475" text-anchor="middle" fill="#78716c" font-size="11" font-family="sans-serif" letter-spacing="1.5">${title}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    age: 26,
    gender: 'female',
    skinType: 'Combination',
    concerns: ['T-Zone Pores', 'Mild Dehydration', 'Infraorbital Shadowing'],
    description: 'Fair-warm complexion with elevated T-zone sebum output and slight under-eye fatigue lines.',
    imageDataUrl: createFaceSvg('#f7d5b8', '#382216', '#db7b7b', '#3b2f2f', '#f4a261', 'ELENA · COMBINATION SKIN')
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    age: 33,
    gender: 'male',
    skinType: 'Sensitive / Normal',
    concerns: ['Malar Redness', 'Shaving Micro-texture', 'Sun Spots'],
    description: 'Neutral olive undertone with localized capillary reactivity around cheeks and razor sensitivity.',
    imageDataUrl: createFaceSvg('#eed0b1', '#1f1e24', '#c97a7e', '#292524', '#e76f51', 'MARCUS · SENSITIVE PROFILE')
  },
  {
    id: 'sophia',
    name: 'Sophia Laurent',
    age: 48,
    gender: 'female',
    skinType: 'Dry / Mature',
    concerns: ['Forehead Dynamic Lines', 'Crow\'s Feet', 'Luminosity Loss'],
    description: 'Golden porcelain tone with prominent expression elasticity changes and trans-epidermal moisture loss.',
    imageDataUrl: createFaceSvg('#fbe3d2', '#523a28', '#c46060', '#4a3b32', '#f28482', 'SOPHIA · MATURE SKIN PROTOCOL')
  }
];
