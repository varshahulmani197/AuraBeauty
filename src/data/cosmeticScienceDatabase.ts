import { IngredientAuditItem, ProductAnalysisVerdict, ProductVerdictStatus } from '../types/myShelf.ts';
import { SkinAnalysisResult } from '../types/skinAnalysis.ts';

export interface IngredientMetadata {
  normalizedName: string;
  aliases: string[];
  role: 'hero_active' | 'comedogenic_risk' | 'barrier_irritant' | 'neutral_support' | 'conflict_active';
  comedogenicRating: number; // 0-5
  irritancyRating: number; // 0-5
  isFungalAcneTrigger?: boolean;
  description: string;
  benefits: string;
  conflictsWith: ('oily' | 'sensitive' | 'compromised_barrier' | 'acne_prone' | 'dry')[];
  synergizesWith: ('oily' | 'sensitive' | 'compromised_barrier' | 'acne_prone' | 'dry')[];
}

export const INGREDIENT_DICTIONARY: IngredientMetadata[] = [
  // ==========================================
  // HIGH COMEDOGENIC RISK (Ratings 4 - 5)
  // Severe acne & follicular obstruction triggers
  // ==========================================
  {
    normalizedName: 'Isopropyl Myristate',
    aliases: ['isopropyl myristate', 'ipm'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 3,
    description: 'Severe comedogenic penetrant ester. Known in clinical dermatology to rapidly provoke follicular hyperkeratosis and inflammatory acne papules.',
    benefits: 'Imparts quick velvety spread to oily cleansers and creams.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Wheat Germ Oil',
    aliases: ['triticum vulgare germ oil', 'wheat germ oil', 'triticum vulgare'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 2,
    description: 'Extremely heavy, dense lipid with a 5/5 comedogenic rating. Highly occlusive on sebaceous follicles.',
    benefits: 'Rich in Vitamin E for non-facial body applications.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Laureth-4',
    aliases: ['laureth-4', 'laureth 4'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 4,
    description: 'Aggressive comedogenic ethoxylated surfactant with high propensity for pore blockage and epidermal inflammation.',
    benefits: 'Emulsifying agent.',
    conflictsWith: ['oily', 'acne_prone', 'sensitive'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Oleth-3',
    aliases: ['oleth-3', 'oleth 3'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 3,
    description: 'Oleic alcohol derivative with maximum follicular comedogenicity.',
    benefits: 'Emulsifying surfactant.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Algae Extract / Carrageenan',
    aliases: ['algae extract', 'carrageenan', 'chondrus crispus', 'laminaria saccharina', 'laminaria digitata', 'chondrus crispus extract'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 2,
    description: 'Marine polysaccharide with high molecular occlusiveness that traps sebum within dilated pore lumens, triggering breakout clusters.',
    benefits: 'Moisture binding film former.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Sodium Lauryl Sulfate (SLS)',
    aliases: ['sodium lauryl sulfate', 'sls'],
    role: 'barrier_irritant',
    comedogenicRating: 5,
    irritancyRating: 5,
    description: 'Dual severe comedogen and harsh anionic surfactant. Denatures barrier stratum corneum lipids and inflames micro-comedones.',
    benefits: 'Strong lathering detergent.',
    conflictsWith: ['oily', 'acne_prone', 'sensitive', 'compromised_barrier'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Myristyl Myristate',
    aliases: ['myristyl myristate'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 2,
    description: 'Waxy ester with near-maximum comedogenic index. Strongly solidifies sebum plugs in the pilosebaceous duct.',
    benefits: 'Viscosity builder in rich night creams.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Coconut Oil',
    aliases: ['cocos nucifera oil', 'coconut oil', 'cocos nucifera', 'hydrogenated coconut oil'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'High in lauric (48%) and myristic (18%) fatty acids that solidify inside human sebaceous ducts, creating stubborn closed comedones and breakout cysts.',
    benefits: 'Deep emollience on dry body skin; contraindicated for acne-prone face.',
    conflictsWith: ['oily', 'acne_prone', 'compromised_barrier'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Ethylhexyl Palmitate',
    aliases: ['ethylhexyl palmitate', 'octyl palmitate'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'Heavy palmitic acid ester. Widely documented in acne research as a primary cause of cosmetic-induced acne (acne cosmetica).',
    benefits: 'Gives cleansing balms and liquid makeup a silky melting texture.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Isopropyl Palmitate',
    aliases: ['isopropyl palmitate', 'ipp'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'Fast-spreading ester with clinical comedogenic rating of 4/5. Readily clogs follicular openings in sebum-rich zones.',
    benefits: 'Carrier solvent and binder.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Isopropyl Isostearate',
    aliases: ['isopropyl isostearate'],
    role: 'comedogenic_risk',
    comedogenicRating: 5,
    irritancyRating: 1,
    description: 'Dense branched ester with severe comedogenic potential for acne-prone and blemish-prone profiles.',
    benefits: 'Emollient conditioning.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Cocoa Butter',
    aliases: ['theobroma cacao seed butter', 'theobroma cacao', 'cocoa seed butter', 'cocoa butter'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 0,
    description: 'High melting-point vegetable butter rich in stearic and oleic triglycerides that coat pores in an occlusive lipid film.',
    benefits: 'Superior moisture barrier sealing for severe body xerosis.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Soybean Oil',
    aliases: ['glycine soja oil', 'soybean oil', 'glycine soja'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 0,
    description: 'Polyunsaturated plant oil with a comedogenic rating of 4/5. Prone to lipid peroxidation that exacerbates acne vulgaris.',
    benefits: 'Antioxidant fatty acids.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Palm Oil',
    aliases: ['elaeis guineensis oil', 'palm oil', 'hydrogenated palm oil'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'Saturated lipid with high comedogenic index. Heavy occlusiveness promotes bacterial proliferation (Cutibacterium acnes).',
    benefits: 'Emollient base.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Polyglyceryl-3 Diisostearate',
    aliases: ['polyglyceryl-3 diisostearate', 'polyglyceryl 3 diisostearate'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'Thick water-in-oil emulsifier with high comedogenicity, known to trigger congestion in combination/oily types.',
    benefits: 'Waterproofing emulsifier.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Acetylated Lanolin',
    aliases: ['acetylated lanolin', 'acetylated lanolin alcohol'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 2,
    description: 'Chemical modification of sheep wool fat. Notoriously comedogenic in patch tests.',
    benefits: 'Intense water-repellent emollient.',
    conflictsWith: ['oily', 'acne_prone', 'sensitive'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Oleic Acid',
    aliases: ['oleic acid'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 2,
    description: 'Monounsaturated omega-9 fatty acid that perturbs stratum corneum lamellar structure and promotes follicular hyperkeratinization.',
    benefits: 'Permeation enhancer.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Lauric Acid',
    aliases: ['lauric acid', 'dodecanoic acid'],
    role: 'comedogenic_risk',
    comedogenicRating: 4,
    irritancyRating: 1,
    description: 'Medium-chain saturated fatty acid with high comedogenicity in leave-on facial skincare.',
    benefits: 'Cleansing foaming lipid.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: [],
  },

  // ==========================================
  // MODERATE COMEDOGENIC RISK (Rating 2 - 3)
  // Caution on acne-prone T-zones
  // ==========================================
  {
    normalizedName: 'Myristic Acid',
    aliases: ['myristic acid', 'tetradecanoic acid'],
    role: 'comedogenic_risk',
    comedogenicRating: 3,
    irritancyRating: 1,
    description: 'Saturated 14-carbon fatty acid with moderate pore-clogging potential in non-rinse formulas.',
    benefits: 'Cleanser lather booster.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Stearic Acid',
    aliases: ['stearic acid', 'octadecanoic acid'],
    role: 'comedogenic_risk',
    comedogenicRating: 3,
    irritancyRating: 0,
    description: 'Common saturated fatty acid. Generally tolerable on dry skin, but can exacerbate follicular impaction in oily acne profiles.',
    benefits: 'Emulsion thickener and stabilizer.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Marula Oil',
    aliases: ['sclerocarya birrea seed oil', 'marula oil'],
    role: 'comedogenic_risk',
    comedogenicRating: 3,
    irritancyRating: 0,
    description: 'Oleic-heavy botanical oil. Beneficial for lipid-depleted dry skin, but moderate comedogenic risk for acne sufferers.',
    benefits: 'Antioxidant polyphenol source.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Beeswax',
    aliases: ['cera alba', 'beeswax', 'synthetic beeswax', 'cera flava'],
    role: 'comedogenic_risk',
    comedogenicRating: 2,
    irritancyRating: 0,
    description: 'Natural wax creating an occlusive surface seal. May trap sebum and environmental debris in oily T-zones.',
    benefits: 'Protective lipid barrier against extreme wind and cold.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry'],
  },
  {
    normalizedName: 'Shea Butter',
    aliases: ['butyrospermum parkii', 'shea butter', 'butyrospermum parkii butter'],
    role: 'comedogenic_risk',
    comedogenicRating: 2,
    irritancyRating: 0,
    description: 'Dense vegetal lipid. Excellent on eczema and dry body skin, but can provoke micro-congestion on sebum-rich facial zones.',
    benefits: 'Nutrient-rich lipid replenishment.',
    conflictsWith: ['oily', 'acne_prone'],
    synergizesWith: ['dry', 'compromised_barrier'],
  },
  {
    normalizedName: 'Polysorbates (Fungal Acne / Malassezia Risk)',
    aliases: ['polysorbate 20', 'polysorbate 40', 'polysorbate 60', 'polysorbate 80'],
    role: 'comedogenic_risk',
    comedogenicRating: 3,
    irritancyRating: 1,
    isFungalAcneTrigger: true,
    description: 'Fatty acid ester surfactants that act as nutritional carbon substrates for Malassezia yeast, triggering fungal acne / pityrosporum folliculitis.',
    benefits: 'Solubilizes essential oils and fragrance.',
    conflictsWith: ['acne_prone', 'oily'],
    synergizesWith: [],
  },

  // ==========================================
  // BARRIER IRRITANTS & SENSITIZERS
  // ==========================================
  {
    normalizedName: 'Alcohol Denat.',
    aliases: ['alcohol denat', 'sd alcohol', 'denatured alcohol', 'ethanol'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 4,
    description: 'Low-molecular alcohol that dissolves stratum corneum ceramides, causing trans-epidermal water loss and compensatory hyper-seborrhea.',
    benefits: 'Quick-evaporating carrier for astringents.',
    conflictsWith: ['sensitive', 'compromised_barrier', 'dry', 'acne_prone'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Fragrance / Parfum',
    aliases: ['fragrance', 'parfum', 'aroma'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 4,
    description: 'Complex proprietary allergen mixture responsible for contact dermatitis, subclinical redness, and localized follicular irritation.',
    benefits: 'Sensory aroma.',
    conflictsWith: ['sensitive', 'compromised_barrier', 'acne_prone'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Essential Oils (Citrus / Peppermint / Lavender)',
    aliases: ['limonene', 'linalool', 'citrus limon peel oil', 'lavandula angustifolia oil', 'eucalyptus globulus leaf oil', 'mentha piperita oil', 'peppermint oil', 'citrus aurantium dulcis oil'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 4,
    description: 'Volatile botanical terpenes that oxidize on the skin into cytotoxic sensitizers, triggering redness and inflamed breakouts.',
    benefits: 'Natural fragrance.',
    conflictsWith: ['sensitive', 'compromised_barrier', 'acne_prone'],
    synergizesWith: [],
  },
  {
    normalizedName: 'Witch Hazel',
    aliases: ['hamamelis virginiana', 'witch hazel', 'hamamelis virginiana water'],
    role: 'barrier_irritant',
    comedogenicRating: 0,
    irritancyRating: 3,
    description: 'High-tannin botanical astringent. Constricts pores temporarily but disrupts the epidermal barrier when formulated with high alcohol.',
    benefits: 'Temporary oil-degreasing astringent.',
    conflictsWith: ['sensitive', 'compromised_barrier', 'dry'],
    synergizesWith: [],
  },

  // ==========================================
  // HERO ACTIVES & ACNE-FIGHTING HEROES (0-1 Rating)
  // Proven non-comedogenic, barrier-synergistic
  // ==========================================
  {
    normalizedName: 'Salicylic Acid (BHA)',
    aliases: ['salicylic acid', 'betaine salicylate', 'salicylate'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 1,
    description: 'Gold-standard lipophilic beta-hydroxy acid that penetrates sebaceous follicles to dissolve trapped sebum, keratin debris, and micro-comedones.',
    benefits: 'Purifies blackheads, refines pores, and balances oily T-zones.',
    conflictsWith: ['compromised_barrier'],
    synergizesWith: ['oily', 'acne_prone'],
  },
  {
    normalizedName: 'Niacinamide (Vitamin B3)',
    aliases: ['niacinamide', 'nicotinamide', 'vitamin b3'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Clinical regulator of sebaceous lipogenesis. Reduces sebum excretion rates, strengthens epidermal barrier ceramides, and calms acne erythema.',
    benefits: 'Sebum control, pore tightening, and post-acne mark brightening.',
    conflictsWith: [],
    synergizesWith: ['oily', 'acne_prone', 'sensitive', 'dry'],
  },
  {
    normalizedName: 'Zinc PCA',
    aliases: ['zinc pca', 'zinc gluconate', 'zinc pyrithione'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Physiological zinc salt that suppresses 5-alpha reductase to control sebum production and inhibits C. acnes microbial colonization.',
    benefits: 'Rapid oil reduction and anti-microbial acne suppression.',
    conflictsWith: [],
    synergizesWith: ['oily', 'acne_prone'],
  },
  {
    normalizedName: 'Azelaic Acid',
    aliases: ['azelaic acid', 'potassium azeloyl diglycinate'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 1,
    description: 'Dicarboxylic acid curbing abnormal follicular hyperkeratinization, lowering free fatty acids in sebum, and clearing post-inflammatory marks.',
    benefits: 'Dual blemish clearance and vascular redness calming.',
    conflictsWith: [],
    synergizesWith: ['acne_prone', 'sensitive', 'oily'],
  },
  {
    normalizedName: 'Ceramides (NP/AP/EOP)',
    aliases: ['ceramide np', 'ceramide ap', 'ceramide eop', 'ceramides', 'ceramide 3', 'phytosphingosine'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Essential stratum corneum physiological lipids restoring the skin barrier without clogging pores.',
    benefits: 'Restores hydration, eases redness, and accelerates barrier recovery.',
    conflictsWith: [],
    synergizesWith: ['dry', 'sensitive', 'compromised_barrier', 'acne_prone', 'oily'],
  },
  {
    normalizedName: 'Hyaluronic Acid',
    aliases: ['sodium hyaluronate', 'hyaluronic acid', 'hydrolyzed hyaluronic acid', 'sodium acetylated hyaluronate'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Completely oil-free humectant binding 1000x its molecular weight in water with zero comedogenic obstruction.',
    benefits: 'Plumps skin micro-relief and relieves dehydration.',
    conflictsWith: [],
    synergizesWith: ['dry', 'compromised_barrier', 'sensitive', 'oily', 'acne_prone'],
  },
  {
    normalizedName: 'Centella Asiatica (Cica / Madecassoside)',
    aliases: ['centella asiatica extract', 'madecassoside', 'asiaticoside', 'cica', 'centella asiatica'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Potent botanical triterpenoid proven to inhibit inflammatory cytokines and accelerate healing of acne lesions without congestion.',
    benefits: 'Rapid redness relief, blemish recovery, and barrier resilience.',
    conflictsWith: [],
    synergizesWith: ['sensitive', 'compromised_barrier', 'acne_prone', 'oily'],
  },
  {
    normalizedName: 'Squalane (Biomimetic)',
    aliases: ['squalane', 'hydrogenated squalene'],
    role: 'hero_active',
    comedogenicRating: 1,
    irritancyRating: 0,
    description: '100% saturated biomimetic hydrocarbon mirroring human sebum, unlike squalene which oxidizes into comedogenic squalene peroxide.',
    benefits: 'Weightless lipid restoration without greasiness or pore blockage.',
    conflictsWith: [],
    synergizesWith: ['dry', 'compromised_barrier', 'sensitive', 'oily', 'acne_prone'],
  },
  {
    normalizedName: 'Panthenol (Pro-Vitamin B5)',
    aliases: ['panthenol', 'dexpanthenol'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Deep penetrating provitamin converted to coenzyme A for stratum corneum repair and soothing irritated acne skin.',
    benefits: 'Soothes stinging, locks hydration, and reduces erythema.',
    conflictsWith: [],
    synergizesWith: ['sensitive', 'compromised_barrier', 'dry', 'acne_prone'],
  },
  {
    normalizedName: 'Glycerin',
    aliases: ['glycerin', 'glycerol'],
    role: 'neutral_support',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Gold-standard biocompatible humectant with 0 pore congestion risk.',
    benefits: 'Essential cellular hydration.',
    conflictsWith: [],
    synergizesWith: ['dry', 'sensitive', 'compromised_barrier', 'oily', 'acne_prone'],
  },
  {
    normalizedName: 'Allantoin',
    aliases: ['allantoin'],
    role: 'hero_active',
    comedogenicRating: 0,
    irritancyRating: 0,
    description: 'Keratolytic soothing agent that softens dead skin cells around follicular openings.',
    benefits: 'Epithelial smoothing and irritation reduction.',
    conflictsWith: [],
    synergizesWith: ['sensitive', 'acne_prone', 'compromised_barrier'],
  },
];

export function auditProductIngredients(
  rawIngredientsText: string,
  userAnalysis?: SkinAnalysisResult,
  productName = 'Skincare Formula',
  targetProfile?: string
): ProductAnalysisVerdict {
  const normalizedRaw = rawIngredientsText.toLowerCase();

  const auditedItems: IngredientAuditItem[] = [];
  const matchedHeroes: string[] = [];
  const flaggedConflicts: string[] = [];
  const highComedogenicAlerts: string[] = [];

  let comedogenicScoreDeduction = 0;
  let irritancyScoreDeduction = 0;
  let heroActivesBonus = 0;
  let maxComedogenic = 0;
  let hasFungalAcneTrigger = false;

  // Determine user's active skin risks
  const rawType = (targetProfile || userAnalysis?.skinType || 'combination').toLowerCase();
  
  // Check if target or scan profile is acne-prone or congested
  const hasAcneConcern = Boolean(
    userAnalysis?.concernsSummary?.some(
      (c) => (c.type === 'acne' || c.type === 'pores' || c.type === 'oiliness') &&
        (c.severityLevel === 'concern' || c.severityLevel === 'moderate' || c.score < 80)
    )
  );

  const isAcneProne =
    rawType.includes('acne') ||
    rawType.includes('oily') ||
    rawType.includes('blemish') ||
    rawType.includes('congest') ||
    rawType.includes('combination') ||
    hasAcneConcern;

  const isSensitiveOrBarrierWeak =
    rawType.includes('sensitive') ||
    rawType.includes('dry') ||
    rawType.includes('compromised') ||
    (userAnalysis?.overallScore !== undefined && userAnalysis.overallScore < 75);

  // Scan against our comprehensive cosmetic science dictionary
  for (const item of INGREDIENT_DICTIONARY) {
    const isPresent = item.aliases.some((alias) => normalizedRaw.includes(alias));

    if (isPresent) {
      if (item.comedogenicRating > maxComedogenic) {
        maxComedogenic = item.comedogenicRating;
      }
      if (item.isFungalAcneTrigger) {
        hasFungalAcneTrigger = true;
      }

      let isConflict = false;
      let matchNote = item.description;

      if (item.role === 'comedogenic_risk') {
        // Any ingredient with Comedogenic Rating 4-5 is ALWAYS severe risk for acne-prone skin
        if (item.comedogenicRating >= 4) {
          isConflict = true;
          comedogenicScoreDeduction += item.comedogenicRating * 9; // High penalty
          flaggedConflicts.push(`${item.normalizedName} (Comedogenic Rating: ${item.comedogenicRating}/5 - Severe pore-plugging risk)`);
          highComedogenicAlerts.push(item.normalizedName);
          matchNote = `🚨 SEVERE COMEDOGENIC RISK (${item.comedogenicRating}/5). Clinical studies demonstrate this lipid rapidly plugs sebaceous follicles, provoking acne breakouts and micro-comedones.`;
        } else if (item.comedogenicRating >= 3) {
          if (isAcneProne) {
            isConflict = true;
            comedogenicScoreDeduction += item.comedogenicRating * 6;
            flaggedConflicts.push(`${item.normalizedName} (Comedogenic Rating: ${item.comedogenicRating}/5 - Moderate pore congestion)`);
            matchNote = `⚠️ Moderate pore-clogging potential (${item.comedogenicRating}/5). Caution required on acne-prone and T-zone areas.`;
          } else {
            matchNote = `Emollient lipid with rating ${item.comedogenicRating}/5. Safe on dry cheek areas, but monitor T-zone.`;
          }
        } else if (item.comedogenicRating >= 2 && isAcneProne) {
          comedogenicScoreDeduction += 8;
          matchNote = `Mild lipid with rating ${item.comedogenicRating}/5. Generally tolerated; observe for follicular congestion.`;
        }
      } else if (item.role === 'barrier_irritant') {
        if (isSensitiveOrBarrierWeak || item.irritancyRating >= 4) {
          isConflict = true;
          irritancyScoreDeduction += item.irritancyRating * 6;
          flaggedConflicts.push(`${item.normalizedName} (Irritancy Rating: ${item.irritancyRating}/5)`);
          matchNote = `⚠️ Known irritant (Irritancy: ${item.irritancyRating}/5). Can disrupt stratum corneum lipid cohesion and worsen inflammatory erythema.`;
        } else {
          matchNote = `Aroma/solvent agent with irritancy index ${item.irritancyRating}/5. Patch test recommended.`;
        }
      } else if (item.role === 'hero_active') {
        heroActivesBonus += 8;
        matchedHeroes.push(item.normalizedName);
        matchNote = `✨ Synergistic Active: ${item.benefits}`;
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
  const baseScore = 90;
  const rawCalculated = baseScore - comedogenicScoreDeduction - irritancyScoreDeduction + Math.min(20, heroActivesBonus);
  const finalCompatibility = Math.max(12, Math.min(99, rawCalculated));

  // Determine Verdict Status with strict dermatological acne criteria
  let verdictStatus: ProductVerdictStatus = 'green_light';
  let verdictHeadline = 'Safe to use — great for your skin barrier';
  let verdictSummary = `This formula contains biocompatible actives that support your ${userAnalysis?.skinType || 'current'} skin profile with minimal pore congestion risk.`;
  let recommendedFrequency = 'Safe for daily use (AM / PM)';
  let segmentSpecificAdvice = 'Safe for application across all facial segments.';
  let acneSafetyLevel: 'safe' | 'caution' | 'high_risk' = 'safe';

  // Strict Acne Evaluation:
  // If ANY rating 4 or 5 comedogenic ingredient is present, or multiple rating 3 comedogens:
  if (highComedogenicAlerts.length > 0 || comedogenicScoreDeduction >= 25 || finalCompatibility < 55) {
    verdictStatus = 'hard_stop';
    acneSafetyLevel = 'high_risk';
    verdictHeadline = `Hard Stop / Conflict Alert — Severe Pore-Clogging Risk for Acne-Prone Skin`;
    verdictSummary = `Contains high-risk comedogenic lipids (${highComedogenicAlerts.join(', ') || 'pore-clogging esters'}) rated 4-5/5 on the comedogenicity scale. These form occlusive follicular plugs that directly trigger acne papules and blackheads.`;
    recommendedFrequency = 'Do NOT apply to acne-prone face (repurpose as body cream only)';
    segmentSpecificAdvice = 'Avoid completely on forehead, nose, chin, and mandibular areas. Will exacerbate active breakouts and sebum congestion.';
  } else if (comedogenicScoreDeduction > 0 || irritancyScoreDeduction >= 15 || maxComedogenic >= 3 || finalCompatibility < 76) {
    verdictStatus = 'caution';
    acneSafetyLevel = 'caution';
    verdictHeadline = 'Proceed with Caution — Moderate comedogenic or sensitizing risk';
    verdictSummary = `Formula contains beneficial ingredients, but includes ingredients with comedogenic ratings (up to ${maxComedogenic}/5) that can congest acne-prone zones if used daily.`;
    recommendedFrequency = 'Start 2x weekly; patch test and monitor T-zone';
    segmentSpecificAdvice = 'Apply strictly to lateral cheek perimeters. Avoid congested nasal bridge, glabella, and chin.';
  } else {
    verdictStatus = 'green_light';
    acneSafetyLevel = 'safe';
    verdictHeadline = '🟢 Green Light: Safe for Acne-Prone Skin (Non-Comedogenic)';
    verdictSummary = `All audited ingredients demonstrate non-comedogenic ratings (0-1/5) with zero heavy occlusive waxes. Clean compatibility with active breakout profiles.`;
    recommendedFrequency = 'Safe for daily morning and evening application';
    segmentSpecificAdvice = 'Compatible across all 6 facial zones without follicular congestion.';
  }

  // Deduce product category
  let productCategory: ProductAnalysisVerdict['productCategory'] = 'serum';
  if (normalizedRaw.includes('cleanser') || normalizedRaw.includes('wash') || normalizedRaw.includes('cleansing') || normalizedRaw.includes('soap')) {
    productCategory = 'cleanser';
  } else if (normalizedRaw.includes('toner') || normalizedRaw.includes('essence') || normalizedRaw.includes('tonic')) {
    productCategory = 'toner';
  } else if (normalizedRaw.includes('cream') || normalizedRaw.includes('moisturizer') || normalizedRaw.includes('lotion') || normalizedRaw.includes('butter') || normalizedRaw.includes('balm')) {
    productCategory = 'moisturizer';
  } else if (normalizedRaw.includes('sunscreen') || normalizedRaw.includes('spf') || normalizedRaw.includes('uv')) {
    productCategory = 'sunscreen';
  } else if (normalizedRaw.includes('mask')) {
    productCategory = 'mask';
  } else if (normalizedRaw.includes('treatment') || normalizedRaw.includes('acid') || normalizedRaw.includes('peel')) {
    productCategory = 'treatment';
  }

  return {
    productId: `prod-${Date.now().toString(36)}`,
    productName,
    productCategory,
    verdictStatus,
    verdictHeadline,
    verdictSummary,
    compatibilityScore: finalCompatibility,
    recommendedFrequency,
    segmentSpecificAdvice,
    keyActiveHighlights: matchedHeroes.length > 0 ? matchedHeroes : ['Biocompatible Hydrating Base'],
    flaggedConcerns: flaggedConflicts.length > 0 ? flaggedConflicts : ['No high-risk comedogenic or sensitizing conflicts detected'],
    ingredientDetails: auditedItems,
    rawIngredientList: rawIngredientsText,
    analyzedAt: new Date().toISOString(),
    acneSafetyLevel,
    maxComedogenicRating: maxComedogenic,
    fungalAcneSafe: !hasFungalAcneTrigger,
    evaluatedSkinType: targetProfile || userAnalysis?.skinType || 'Combination',
  };
}
