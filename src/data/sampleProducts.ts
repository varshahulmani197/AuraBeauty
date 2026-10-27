export interface SamplePresetProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  tagline: string;
  ingredients: string;
  expectedVerdictPreview: string;
}

export const SAMPLE_POPULAR_PRODUCTS: SamplePresetProduct[] = [
  {
    id: 'sample-ceramide-barrier',
    name: 'Hydro-Barrier Ceramide Moisture Cream',
    brand: 'DermAesthetic Labs',
    category: 'Moisturizer',
    tagline: 'Formulated with 3 essential ceramides, squalane, and hyaluronic acid.',
    ingredients:
      'Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Hyaluronic Acid, Squalane, Panthenol, Carbomer, Dimethicone, Sodium Lauroyl Lactylate, Phenoxyethanol, Disodium EDTA, Dipotassium Phosphate.',
    expectedVerdictPreview: 'Green Light · High Barrier Synergy',
  },
  {
    id: 'sample-coconut-cleansing-butter',
    name: 'Viral Glow Coconut Cleansing Melt Butter',
    brand: 'Trending Botanicals',
    category: 'Cleanser',
    tagline: 'Heavy viral butter formulated with virgin coconut oil and exotic fruit fragrances.',
    ingredients:
      'Cocos Nucifera (Coconut) Oil, Ethylhexyl Palmitate, Isopropyl Myristate, Myristyl Myristate, Euphorbia Cerifera Cera, Fragrance/Parfum, Citrus Limon Peel Oil, Linalool, Limonene, BHT, Tocopheryl Acetate.',
    expectedVerdictPreview: 'Hard Stop · High Comedogenic Pore Risk',
  },
  {
    id: 'sample-viral-exfoliating-toner',
    name: 'Triple Acid High-Gloss Resurfacing Tonic',
    brand: 'Social Skincare Co.',
    category: 'Toner',
    tagline: 'Intense clarifying treatment with salicylic acid and astringent citrus oils.',
    ingredients:
      'Aqua, Alcohol Denat., Hamamelis Virginiana (Witch Hazel) Water, Salicylic Acid, Niacinamide, Glycerin, Sodium Hydroxide, Mentha Piperita (Peppermint) Oil, Eucalyptus Globulus Leaf Oil, Limonene, Polysorbate 20, Disodium EDTA.',
    expectedVerdictPreview: 'Caution · Patch Test & Zone Selectivity Required',
  },
  {
    id: 'sample-cica-centella-ampoule',
    name: 'Centella Asiatica Calming Recovery Ampoule',
    brand: 'K-Derma Bio',
    category: 'Serum',
    tagline: 'Pure soothing madecassoside extract designed for redness and reactive skin.',
    ingredients:
      'Centella Asiatica Extract (85%), Glycerin, Butylene Glycol, Panthenol (Pro-Vitamin B5), Niacinamide, Madecassoside, Asiaticoside, Sodium Hyaluronate, Allantoin, Carbomer, Arginine, 1,2-Hexanediol.',
    expectedVerdictPreview: 'Green Light · Calms Capillary Erythema',
  },
];
