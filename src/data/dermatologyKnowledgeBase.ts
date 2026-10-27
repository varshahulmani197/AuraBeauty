import { SkinAnalysisResult } from '../types/skinAnalysis.ts';

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'actives' | 'zones' | 'concerns' | 'protocols';
  tags: string[];
  content: string;
}

export const DERMATOLOGY_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'kb-niacinamide',
    title: 'Niacinamide (Vitamin B3) Mechanism & Tolerability',
    category: 'actives',
    tags: ['niacinamide', 'sebum', 'pores', 'oiliness', 'barrier', 't-zone'],
    content:
      'Niacinamide at 2% to 5% concentrations downregulates sebaceous lipogenesis, visibly refines dilated follicular openings (pores), and stimulates endogenous ceramide synthesis in the stratum corneum. Compatible with most actives including hyaluronic acid and peptides; avoid simultaneous high-percentage ascorbic acid in the same layer to prevent flushing.',
  },
  {
    id: 'kb-bha-salicylic',
    title: 'Salicylic Acid (BHA 2%) Lipophilic Exfoliation',
    category: 'actives',
    tags: ['bha', 'salicylic acid', 'pores', 'blackheads', 'filaments', 'nose', 'acne', 'congestion'],
    content:
      'Salicylic acid is a lipophilic beta-hydroxy acid capable of penetrating through sebum inside the pilosebaceous unit. It dissolves intracellular desmosomes of dead corneocytes, clearing blackheads and sebaceous filaments across the nose and T-zone. Optimal usage frequency is 2-3 nights per week to prevent barrier disruption.',
  },
  {
    id: 'kb-retinal-retinol',
    title: 'Retinaldehyde & Retinoid Cellular Turnover Protocol',
    category: 'actives',
    tags: ['retinal', 'retinol', 'wrinkles', 'fine lines', 'anti-aging', 'collagen', 'texture'],
    content:
      'Retinaldehyde converts directly into active retinoic acid in one enzymatic step, yielding faster collagen-stimulating efficacy than standard retinol with lower mucosal irritation. Promotes epidermal micro-relief renewal, softens expression creases, and thickens the dermis. Strictly applied at night followed by broad-spectrum daytime SPF 50+.',
  },
  {
    id: 'kb-ceramides-barrier',
    title: 'Ceramide NP/AP/EOP & Barrier Lipid Architecture',
    category: 'actives',
    tags: ['ceramides', 'moisture', 'barrier', 'dry', 'trans-epidermal', 'hydration', 'cheeks'],
    content:
      'The physiological skin barrier relies on an equimolar ratio of ceramides (50%), cholesterol (25%), and free fatty acids (15%). When cheeks experience moisture deficits or trans-epidermal water loss (TEWL), ceramide emulsions reinforce cellular lamellar sheets and relieve micro-stinging and redness.',
  },
  {
    id: 'kb-caffeine-undereyes',
    title: 'Periorbital Microcirculation & Caffeine Dynamics',
    category: 'actives',
    tags: ['caffeine', 'under-eyes', 'dark circles', 'eye bags', 'peri-orbital', 'vascular'],
    content:
      'The infraorbital eyelid skin is only 0.5 mm thick, making underlying venous microcapillary pooling easily visible as bluish dark circles. Topical caffeine functions as an effective vasoconstrictor that accelerates venous drainage and reduces puffiness, especially when paired with Matrixyl peptides for collagen density.',
  },
  {
    id: 'kb-centella-azelaic',
    title: 'Azelaic Acid & Centella Asiatica for Erythema & Redness',
    category: 'actives',
    tags: ['azelaic acid', 'centella', 'cica', 'redness', 'erythema', 'rosacea', 'sensitivity', 'cheeks'],
    content:
      'Azelaic acid (10%) inhibits toll-like receptor 2 (TLR-2) activation and neutrophil reactive oxygen species, rapidly calming facial flushing and capillary erythema. Centella Asiatica (madecassoside) speeds epidermal re-epithelialization and dampens inflammatory cytokines on reactive cheek quadrants.',
  },
  {
    id: 'kb-combination-skin',
    title: 'Zone-Specific Management of Combination Skin',
    category: 'zones',
    tags: ['combination', 't-zone', 'oily', 'dry cheeks', 'routine', 'balancing'],
    content:
      'Combination skin requires zone-differentiated application: apply oil-controlling BHA and lightweight niacinamide gel onto the hyper-secreting T-Zone (forehead and nose), while layering restorative lipid-rich ceramide creams and multi-weight hyaluronic acid onto the normal-to-dry lateral cheeks and jawline.',
  },
  {
    id: 'kb-spf-uv',
    title: 'Broad-Spectrum UV Photoprotection & Melanin Prevention',
    category: 'protocols',
    tags: ['spf', 'sunscreen', 'spots', 'hyperpigmentation', 'melanin', 'sun spots', 'uv'],
    content:
      'UVA radiation degrades dermal elastin fibers (solar elastosis) and triggers melanocyte hyper-activity, worsening sun spots and freckles. Daily application of broad-spectrum SPF 50+ PA++++ is non-negotiable for preserving diagnostic skin health scores and preventing rebound pigmentation.',
  },
];

// RAG Retrieval Algorithm: Match user query against Knowledge Base + Current Facial Scan Context
export function retrieveRagContext(
  query: string,
  currentAnalysis?: SkinAnalysisResult
): {
  retrievedSnippets: string[];
  sources: string[];
  userScanGroundedContext: string;
} {
  const normalizedQuery = query.toLowerCase();
  const matchedDocs: { doc: KnowledgeDocument; score: number }[] = [];

  // 1. Query matching against Knowledge Base
  for (const doc of DERMATOLOGY_KNOWLEDGE_BASE) {
    let score = 0;
    // Check tags
    for (const tag of doc.tags) {
      if (normalizedQuery.includes(tag)) {
        score += 3;
      }
    }
    // Check content and title keywords
    const keywords = doc.title.toLowerCase().split(' ');
    for (const word of keywords) {
      if (word.length > 3 && normalizedQuery.includes(word)) {
        score += 2;
      }
    }
    if (doc.content.toLowerCase().includes(normalizedQuery.slice(0, 5))) {
      score += 1;
    }

    if (score > 0) {
      matchedDocs.push({ doc, score });
    }
  }

  // Sort by relevance score
  matchedDocs.sort((a, b) => b.score - a.score);
  const topDocs = matchedDocs.slice(0, 3).map((m) => m.doc);

  // If no direct matches, provide baseline combination and barrier documents
  const finalDocs =
    topDocs.length > 0 ? topDocs : [DERMATOLOGY_KNOWLEDGE_BASE[0], DERMATOLOGY_KNOWLEDGE_BASE[6]];

  const retrievedSnippets = finalDocs.map((d) => `[${d.title}]: ${d.content}`);
  const sources = finalDocs.map((d) => d.title);

  // 2. Extract Grounded Facts from Current User Skin Analysis
  let userScanGroundedContext = 'User has not performed a scan yet.';
  if (currentAnalysis) {
    const primaryConcerns = (currentAnalysis.concernsSummary || [])
      .slice(0, 3)
      .map((c) => `${c.name} (Score: ${c.score}/100, Level: ${c.severityLevel})`)
      .join('; ');

    const segmentSummary = Object.entries(currentAnalysis.segments || {})
      .map(
        ([key, s]) =>
          `${s.name}: Health ${s.zoneScore}/100, Moisture ${s.moisture}%, Sebum ${s.oiliness}%`
      )
      .join(' | ');

    userScanGroundedContext = `
USER ACTIVE CLINICAL SKIN PROFILE:
- Overall Health Score: ${currentAnalysis.overallScore}/100
- Biological Skin Age: ${currentAnalysis.skinAge} years (Chronological: ${currentAnalysis.chronologicalAgeEstimate} years)
- Skin Type: ${currentAnalysis.skinType} (${currentAnalysis.skinTypeDescription})
- Segment Metrics: ${segmentSummary}
- Priority Concerns: ${primaryConcerns}
- Diagnostic Summary: ${currentAnalysis.summary}
    `.trim();

    sources.unshift('Current Facial Scan Diagnostic Context');
  }

  return {
    retrievedSnippets,
    sources,
    userScanGroundedContext,
  };
}
