import { IngredientAuditItem, ProductAnalysisVerdict, ProductVerdictStatus } from '../types/myShelf.ts';
import { SkinAnalysisResult } from '../types/skinAnalysis.ts';

interface IngredientMetadata {
  normalizedName: string;
  aliases: string[];
  role: 'hero_active' | 'comedogenic_risk' | 'barrier_irritant' | 'neutral_support' | 'conflict_active';
  comedogenicRating: number; // 0-5
  irritancyRating: number; // 0-5
  description: string;
  benefits: string;
  conflictsWith: ('oily' | 'sensitive' | 'compromised_barrier' | 'acne_prone' | 'dry')[];
  synergizesWith: ('oily' | 'sensitive' | 'compromised_barrier' | 'acne_prone' | 'dry')[];
}

export const INGREDIENT_DICTIONARY: IngredientMetadata[] = [
  // Comedogenic Lipids
  {
    normalizedName: 'Coconut Oil',
    aliases: ['cocos nucifera oil', 'coconut oil', 'cocos nucifera'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'High in lauric and myristic fatty acids that form occlusive plugs in sebaceous follicles.',
    benefits: 'Deep emollience on dry body skin, but problematic for facial T-zones.',
    conflictsWith: ['oily', 'acne_prone', 'compromised_barrier'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Isopropyl Myristate',
    aliases: ['isopropyl myristate', 'ipm'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 3,
    description: 'Synthetic ester penetrant that rapidly clogs pores and provokes comedogenic papules.',
    benefits: 'Provides velvety slip to formulations.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Ethylhexyl Palmitate',
    aliases: ['ethylhexyl palmitate', 'octyl palmitate'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'Palmitic acid ester with high comedogenic potential for congested or large pore types.',
    benefits: 'Solvent and emollient in cleansing balms.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Myristyl Myristate',
    aliases: ['myristyl myristate'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 2,
    description: 'Heavy waxy ester with very high pore-plugging index.',
    benefits: 'Thickening agent in rich creams.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Wheat Germ Oil',
    aliases: ['triticum vulgare germ oil', 'wheat germ oil'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 2,
    description: 'Extremely dense lipid profile with top-tier comedogenicity.',
    benefits: 'High Vitamin E content.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },

  // Barrier Irritants & Harsh Additives
  {
    normalizedName: 'Alcohol Denat.',
    aliases: ['alcohol denat', 'sd alcohol', 'denatured alcohol', 'ethanol'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 4,
    description: 'Volatile low-molecular alcohol that strips stratum corneum intercellular lipids.',
    benefits: 'Imparts quick-drying astringent sensation.',
    conflictsWith: ['sensitive', 'compromised_barrier', 'dry'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Fragrance / Parfum',
    aliases: ['fragrance', 'parfum', 'aroma'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 4,
    description: 'Complex proprietary allergen mixture responsible for contact dermatitis flares.',
    benefits: 'Sensory scent profile.',
    conflictsWith: ['sensitive', 'compromised_barrier'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Essential Oils (Limonene / Linalool)',
    aliases: ['limonene', 'linalool', 'citrus limon peel oil', 'lavandula angustifolia oil', 'eucalyptus oil', 'peppermint oil'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 4,
    description: 'Volatile botanical terpenes that oxidize on the skin into potent cytotoxic sensitizers.',
    benefits: 'Natural aroma and temporary antimicrobial action.',
    conflictsWith: ['sensitive', 'compromised_barrier'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Sodium Lauryl Sulfate (SLS)',
    aliases: ['sodium lauryl sulfate', 'sls'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 5,
    description: 'Aggressive ionic surfactant that denatures epidermal proteins and disrupts barrier cohesion.',
    benefits: 'Heavy lathering foaming agent.',
    conflictsWith: ['sensitive', 'compromised_barrier', 'dry'],
    synergizesWith: [],
  },

  // Hero Actives & Barrier Restorers
  {
    normalizedName: 'Ceramides (NP/AP/EOP)',
    aliases: ['ceramide np', 'ceramide ap', 'ceramide eop', 'ceramides', 'ceramide 3'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Key physiological lipid restoring lamellar barrier membranes and halting trans-epidermal water loss.',
    benefits: 'Restores hydration, eases redness, and accelerates barrier recovery.',
    conflictsWith: [],
    synergizesWith: ['dry', 'sensitive', 'compromised_barrier', 'oily'],
  },
  {
    normalizedName: 'Niacinamide (Vitamin B3)',
    aliases: ['niacinamide', 'nicotinamide', 'vitamin b3'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Regulates sebaceous lipogenesis, tightens pore contours, and reinforces ceramide synthesis.',
    benefits: 'Dual sebum normalization and tone brightening.',
    conflictsWith: [],
    synergizesWith: ['oily', 'acne_prone', 'combination' as any, 'sensitive'],
  },
  {
    normalizedName: 'Hyaluronic Acid',
    aliases: ['sodium hyaluronate', 'hyaluronic acid', 'hydrolyzed hyaluronic acid', 'sodium acetylated hyaluronate'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Powerful humectant binding up to 1000x its molecular weight in water.',
    benefits: 'Plumps skin micro-relief and relieves dehydration fine lines.',
    conflictsWith: [],
    synergizesWith: ['dry', 'compromised_barrier', 'sensitive', 'oily'],
  },
  {
    normalizedName: 'Centella Asiatica Extract',
    aliases: ['centella asiatica extract', 'madecassoside', 'asiaticoside', 'cica'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Botanical triterpenoid proven to calm capillary erythema and speed tissue repair.',
    benefits: 'Rapid redness relief and cellular resilience.',
    conflictsWith: [],
    synergizesWith: ['sensitive', 'compromised_barrier'],
  },
  {
    normalizedName: 'Salicylic Acid (BHA)',
    aliases: ['salicylic acid', 'betaine salicylate'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 1,
    description: 'Lipophilic beta-hydroxy acid that dissolves keratin plugs inside follicles.',
    benefits: 'Purifies blackheads, refines pores, and balances oily T-zones.',
    conflictsWith: ['compromised_barrier'],
    synergizesWith: ['oily', 'acne_prone'],
  },
  {
    normalizedName: 'Azelaic Acid',
    aliases: ['azelaic acid', 'potassium azeloyl diglycinate'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 1,
    description: 'Dicarboxylic acid curbing abnormal keratinization and decreasing capillary erythema.',
    benefits: 'Soothes redness and fades post-inflammatory hyperpigmentation.',
    conflictsWith: [],
    synergizesWith: ['sensitive', 'acne_prone', 'oily'],
  },
  {
    normalizedName: 'Squalane',
    aliases: ['squalane', 'hydrogenated squalene'],
    role: 'hero_active',
    comedogenicRating: 1,
    irritancyRating: 0,
    description: 'Biomimetic saturated lipid mirroring human sebum without causing follicular clogging.',
    benefits: 'Weightless lipid restoration without greasiness.',
    conflictsWith: [],
    synergizesWith: ['dry', 'compromised_barrier', 'sensitive', 'oily'],
  },
  {
    normalizedName: 'Panthenol (Pro-Vitamin B5)',
    aliases: ['panthenol', 'dexpanthenol'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Deep penetrating provitamin that converts to pantothenic acid for stratum corneum repair.',
    benefits: 'Soothes stinging, locks hydration, and reduces erythema.',
    conflictsWith: [],
    synergizesWith: ['sensitive', 'compromised_barrier', 'dry'],
  },
  {
    normalizedName: 'Glycerin',
    aliases: ['glycerin', 'glycerol'],
    role: 'neutral_support',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Foundational humectant with excellent biocompatibility and zero pore congestion risk.',
    benefits: 'Essential cellular hydration.',
    conflictsWith: [],
    synergizesWith: ['dry', 'sensitive', 'compromised_barrier', 'oily'],
  },
];

export function auditProductIngredients(
  rawIngredientsText: string,
  userAnalysis?: SkinAnalysisResult,
  productName = 'Skincare Formula'
): ProductAnalysisVerdict {
  const normalizedRaw = rawIngredientsText.toLowerCase();
  const splitIngredients = rawIngredientsText
    .split(/[,;\n•]+/)
    .map((s) => s.trim().replace(/^[\d.\s-]+/, ''))
    .filter((s) => s.length > 1);

  const auditedItems: IngredientAuditItem[] = [];
  const matchedHeroes: string[] = [];
  const flaggedConflicts: string[] = [];

  let comedogenicScoreDeduction = 0;
  let irritancyScoreDeduction = 0;
  let heroActivesBonus = 0;

  // Determine user's active skin risks from YouCam Analysis profile
  const userSkinType = userAnalysis?.skinType?.toLowerCase() || 'combination';
  const isAcneProneOrOily = userSkinType.includes('oily') || userSkinType.includes('combination');
  const isSensitiveOrBarrierWeak =
    userSkinType.includes('sensitive') ||
    userSkinType.includes('dry') ||
    (userAnalysis?.overallScore && userAnalysis.overallScore < 75);

  // Check each recognized ingredient
  for (const item of INGREDIENT_DICTIONARY) {
    const isPresent = item.aliases.some((alias) => normalizedRaw.includes(alias));

    if (isPresent) {
      let isConflict = false;
      let matchNote = item.description;

      if (item.role === 'comedogenic_risk') {
        if (isAcneProneOrOily) {
          isConflict = true;
          comedogenicScoreDeduction += item.comedogenicRating * 7;
          flaggedConflicts.push(`${item.normalizedName} (Comedogenic Rating: ${item.comedogenicRating}/5)`);
          matchNote = `🚨 High pore-clogging risk for your ${userAnalysis?.skinType || 'Combination'} profile. Comedogenic index: ${item.comedogenicRating}/5.`;
        } else {
          matchNote = `Emollient lipid with rating ${item.comedogenicRating}/5. Safe on dry cheek areas, but caution on T-zone.`;
        }
      } else if (item.role === 'barrier_irritant') {
        if (isSensitiveOrBarrierWeak) {
          isConflict = true;
          irritancyScoreDeduction += item.irritancyRating * 6;
          flaggedConflicts.push(`${item.normalizedName} (Irritancy Rating: ${item.irritancyRating}/5)`);
          matchNote = `⚠️ Potential barrier irritant for your sensitive/compromised profile. May cause stinging or redness.`;
        } else {
          matchNote = `Solvent/sensory agent with irritancy index ${item.irritancyRating}/5. Patch test recommended.`;
        }
      } else if (item.role === 'hero_active') {
        heroActivesBonus += 8;
        matchedHeroes.push(item.normalizedName);
        matchNote = `✨ Synergistic Hero: ${item.benefits}`;
      }

      auditedItems.push({
        name: item.normalizedName,
        inciName: item.aliases[0],
        role: isConflict ? (item.role === 'comedogenic_risk' ? 'comedogenic_risk' : 'barrier_irritant') : item.role,
        comedogenicRating: item.comedogenicRating,
        irritancyRating: item.irritancyRating,
        matchNote,
        conflictWithUserProfile: isConflict,
        targetBenefit: item.benefits,
      });
    }
  }

  // Calculate final compatibility score (0 - 100)
  const baseScore = 88;
  const rawCalculated = baseScore - comedogenicScoreDeduction - irritancyScoreDeduction + heroActivesBonus;
  const finalCompatibility = Math.max(12, Math.min(98, rawCalculated));

  // Determine Verdict Status
  let verdictStatus: ProductVerdictStatus = 'green_light';
  let verdictHeadline = 'Safe to use — synergistic with your skin profile';
  let verdictSummary = `This formula contains active ingredients that complement your ${userAnalysis?.skinType || 'current'} skin metrics with low risk of barrier disruption.`;
  let recommendedFrequency = 'Safe for daily use (AM / PM)';
  let segmentSpecificAdvice = 'Safe for application across all 6 facial segments.';

  if (comedogenicScoreDeduction >= 20 || irritancyScoreDeduction >= 20 || finalCompatibility < 50) {
    verdictStatus = 'hard_stop';
    verdictHeadline = 'Hard Stop / Conflict Alert — High risk for your skin profile';
    verdictSummary = `Contains ingredients with elevated pore-clogging or barrier-stripping properties that clash with your YouCam ${userAnalysis?.skinType || 'active'} diagnostics.`;
    recommendedFrequency = 'Do not apply to face (or repurpose as body treatment)';
    segmentSpecificAdvice = isAcneProneOrOily
      ? 'High comedogenic lipids will congest the nasal bridge, glabella, and chin mandibular zones.'
      : 'Harsh irritants may provoke flare-ups and trans-epidermal moisture loss across delicate cheek quadrants.';
  } else if (comedogenicScoreDeduction > 0 || irritancyScoreDeduction > 0 || finalCompatibility < 75) {
    verdictStatus = 'caution';
    verdictHeadline = 'Proceed with Caution — Conditional use & patch test required';
    verdictSummary = `Formula contains beneficial ingredients, but also includes potential sensitizers or moderate lipids that require zone-selective application.`;
    recommendedFrequency = 'Start 2 nights per week; monitor skin barrier response';
    segmentSpecificAdvice = 'Apply exclusively to lateral cheek zones. Avoid applying to active T-Zone pore areas.';
  }

  return {
    productId: `prod-${Date.now().toString(36)}`,
    productName,
    productCategory: normalizedRaw.includes('cleanser') || normalizedRaw.includes('wash') ? 'cleanser' : normalizedRaw.includes('toner') ? 'toner' : normalizedRaw.includes('cream') ? 'moisturizer' : 'serum',
    verdictStatus,
    verdictHeadline,
    verdictSummary,
    compatibilityScore: finalCompatibility,
    recommendedFrequency,
    segmentSpecificAdvice,
    keyActiveHighlights: matchedHeroes.length > 0 ? matchedHeroes : ['General hydrating base'],
    flaggedConcerns: flaggedConflicts.length > 0 ? flaggedConflicts : ['No severe comedogenic or sensitizing conflicts detected'],
    ingredientDetails: auditedItems,
    rawIngredientList: rawIngredientsText,
    analyzedAt: new Date().toISOString(),
  };
}
