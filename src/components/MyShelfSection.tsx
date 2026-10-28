import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  Camera,
  FileText,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Info,
  ChevronRight,
  Droplets,
  Activity,
  Layers,
  Trash2,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { SkinAnalysisResult } from '../types/skinAnalysis.ts';
import { ProductAnalysisVerdict, StoredShelfProduct, ProductVerdictStatus } from '../types/myShelf.ts';
import { SAMPLE_POPULAR_PRODUCTS, SamplePresetProduct } from '../data/sampleProducts.ts';
import { auditProductIngredients } from '../data/cosmeticScienceDatabase.ts';

interface MyShelfSectionProps {
  currentAnalysis: SkinAnalysisResult;
}

const STORAGE_KEY_SHELF = 'aurabeauty_saved_shelf_products';

export const MyShelfSection: React.FC<MyShelfSectionProps> = ({ currentAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'presets'>('presets');
  const [productNameInput, setProductNameInput] = useState('');
  const [ingredientsTextInput, setIngredientsTextInput] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [currentVerdict, setCurrentVerdict] = useState<ProductAnalysisVerdict | null>(null);
  const [savedShelf, setSavedShelf] = useState<StoredShelfProduct[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'caution' | 'stop'>('all');
  const [targetSkinProfile, setTargetSkinProfile] = useState<string>('acne_prone');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved shelf from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SHELF);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedShelf(parsed);
          return;
        }
      }
      // Initialize with default audited sample item (evaluating against acne-prone skin)
      const initialAudit = auditProductIngredients(
        SAMPLE_POPULAR_PRODUCTS[0].ingredients,
        currentAnalysis,
        SAMPLE_POPULAR_PRODUCTS[0].name,
        'acne_prone'
      );
      const initialSaved: StoredShelfProduct = {
        ...initialAudit,
        brandName: SAMPLE_POPULAR_PRODUCTS[0].brand,
        savedAt: new Date().toISOString(),
      };
      setSavedShelf([initialSaved]);
      setCurrentVerdict(initialAudit);
    } catch (err) {
      console.warn('Shelf storage load notice:', err);
    }
  }, []);

  const handleAudit = async (
    customText?: string,
    customName?: string,
    customImg?: string | null,
    customProfile?: string
  ) => {
    const textToAnalyze = (customText !== undefined ? customText : ingredientsTextInput).trim();
    const nameToAnalyze = (customName !== undefined ? customName : productNameInput).trim() || 'Skincare Formula';
    const imgToAnalyze = customImg !== undefined ? customImg : productImage;
    const profileToAudit = customProfile !== undefined ? customProfile : targetSkinProfile;

    setIsAuditing(true);

    try {
      const res = await fetch('/api/analyze-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imgToAnalyze,
          rawIngredientsText: textToAnalyze,
          productName: nameToAnalyze,
          userSkinProfile: currentAnalysis,
          targetSkinProfile: profileToAudit,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const verdict: ProductAnalysisVerdict = await res.json();
      setCurrentVerdict(verdict);
      if (verdict.productName && verdict.productName !== 'Skincare Formula') {
        setProductNameInput(verdict.productName);
      }
      if (verdict.rawIngredientList && !ingredientsTextInput) {
        setIngredientsTextInput(verdict.rawIngredientList);
      }
    } catch (err: any) {
      console.warn('Client audit fallback:', err);
      const fallbackVerdict = auditProductIngredients(
        textToAnalyze || 'Aqua, Glycerin, Stearic Acid, Isopropyl Palmitate, Ceramide NP.',
        currentAnalysis,
        nameToAnalyze,
        profileToAudit
      );
      setCurrentVerdict(fallbackVerdict);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSelectPreset = (preset: SamplePresetProduct) => {
    setProductNameInput(preset.name);
    setIngredientsTextInput(preset.ingredients);
    handleAudit(preset.ingredients, preset.name, null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProductImage(reader.result);
          handleAudit('', productNameInput || file.name.replace(/\.[^/.]+$/, ''), reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToShelf = () => {
    if (!currentVerdict) return;
    const exists = savedShelf.some((p) => p.productName === currentVerdict.productName);
    let updated: StoredShelfProduct[];
    if (exists) {
      updated = savedShelf.map((p) =>
        p.productName === currentVerdict.productName
          ? { ...currentVerdict, savedAt: new Date().toISOString() }
          : p
      );
    } else {
      updated = [
        {
          ...currentVerdict,
          savedAt: new Date().toISOString(),
        },
        ...savedShelf,
      ].slice(0, 25);
    }
    setSavedShelf(updated);
    localStorage.setItem(STORAGE_KEY_SHELF, JSON.stringify(updated));
  };

  const handleRemoveFromShelf = (productId: string) => {
    const updated = savedShelf.filter((p) => p.productId !== productId);
    setSavedShelf(updated);
    localStorage.setItem(STORAGE_KEY_SHELF, JSON.stringify(updated));
  };

  const isCurrentProductSaved = currentVerdict
    ? savedShelf.some((p) => p.productName === currentVerdict.productName)
    : false;

  const filteredShelf = savedShelf.filter((p) => {
    if (activeFilter === 'safe') return p.verdictStatus === 'green_light';
    if (activeFilter === 'caution') return p.verdictStatus === 'caution';
    if (activeFilter === 'stop') return p.verdictStatus === 'hard_stop';
    return true;
  });

  const getVerdictStyles = (status: ProductVerdictStatus) => {
    switch (status) {
      case 'green_light':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          borderAccent: 'border-l-4 border-l-emerald-500',
          title: 'GREEN LIGHT · SAFE & SYNERGISTIC',
        };
      case 'caution':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          icon: AlertTriangle,
          borderAccent: 'border-l-4 border-l-amber-500',
          title: 'PROCEED WITH CAUTION · PATCH TEST REQUIRED',
        };
      case 'hard_stop':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badge: 'bg-rose-600 text-white',
          icon: XCircle,
          borderAccent: 'border-l-4 border-l-rose-500',
          title: 'HARD STOP / CONFLICT ALERT · AVOID ON FACE',
        };
    }
  };

  return (
    <div id="myshelf" className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 uppercase tracking-wider font-semibold">
            <span>Cosmetic Science & INCI Audit</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Barrier Protection Safety Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-1">
            MyShelf · Product Ingredient Analyzer
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl text-balance">
            Never guess whether trending social media skincare is safe for your skin barrier. Upload a photo or paste the formula to cross-reference against your live YouCam biometric scan.
          </p>
        </div>

        {/* User Biometric Link Pill & Skin Profile Selector */}
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs shrink-0 self-start md:self-auto space-y-2 min-w-[260px]">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5 font-mono text-[11px] uppercase text-rose-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              Biometric Compatibility
            </div>
            <span className="text-[10px] font-mono text-stone-500">
              Scan: {currentAnalysis.skinType}
            </span>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-stone-500 font-semibold block mb-1">
              Audit Target Skin Type:
            </label>
            <select
              value={targetSkinProfile}
              onChange={(e) => {
                const newProfile = e.target.value;
                setTargetSkinProfile(newProfile);
                handleAudit(undefined, undefined, undefined, newProfile);
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer shadow-2xs"
            >
              <option value="acne_prone">🔥 Acne-Prone & Breakouts (Strict)</option>
              <option value="oily">💧 Oily & Congested Pores</option>
              <option value="combination">⚖️ Combination T-Zone ({currentAnalysis.skinType})</option>
              <option value="sensitive">🛡️ Sensitive & Weak Barrier</option>
              <option value="dry">🌸 Dry & Dehydrated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Product Input on Left, Audit Verdict on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product & Ingredient Intake */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>Product & INCI Intake</span>
              </h3>
              <span className="text-[10px] font-mono text-stone-400">OCR Supported</span>
            </div>

            {/* Input Method Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors cursor-pointer text-center ${
                  activeTab === 'presets'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Viral Presets (4)
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === 'upload'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Snap / Upload</span>
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors cursor-pointer text-center ${
                  activeTab === 'text'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Paste INCI
              </button>
            </div>

            {/* Tab 1: Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-2">
                <p className="text-[11px] text-stone-500">
                  Select a trending product to inspect safety against your barrier:
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {SAMPLE_POPULAR_PRODUCTS.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelectPreset(prod)}
                      className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-rose-400 bg-white hover:bg-rose-50/20 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                            {prod.name}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                            {prod.brand} · {prod.category}
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-600 shrink-0 mt-0.5" />
                      </div>
                      <div className="mt-1.5 text-[10px] font-mono text-stone-600 bg-stone-100/70 px-2 py-0.5 rounded">
                        {prod.expectedVerdictPreview}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Upload Photo */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-rose-400 bg-white hover:bg-rose-50/20 rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-stone-900">
                    Snap or Upload Ingredient Label
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 max-w-xs">
                    Our OCR engine extracts INCI chemical names directly from bottle packaging.
                  </p>
                </div>

                {isAuditing && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
                    <RefreshCw className="w-4 h-4 animate-spin text-rose-600 shrink-0" />
                    <div>
                      <div className="font-bold">Analyzing Product & INCI Chemicals...</div>
                      <div className="text-[10px] text-rose-700">Checking against 60+ pore-clogging comedogenic ratings for acne-prone skin</div>
                    </div>
                  </div>
                )}

                {productImage && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-stone-200 text-xs">
                      <img
                        src={productImage}
                        alt="Uploaded formula"
                        className="w-10 h-10 rounded object-cover border border-stone-200"
                      />
                      <div className="flex-1 truncate">
                        <span className="font-semibold text-stone-800">Label Image Uploaded</span>
                        <p className="text-[10px] text-stone-500 font-mono">
                          {isAuditing ? 'Scanning with Vision OCR...' : 'Vision Scanned & Audited'}
                        </p>
                      </div>
                      <button
                        onClick={() => setProductImage(null)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {currentVerdict && currentVerdict.rawIngredientList && !isAuditing && (
                      <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 font-semibold">
                          <span>Detected: {currentVerdict.productName}</span>
                          <span className="text-emerald-700 font-bold">✓ Complete INCI Parsed</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-mono line-clamp-2">
                          {currentVerdict.rawIngredientList}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Paste Text */}
            {activeTab === 'text' && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Product Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={productNameInput}
                    onChange={(e) => setProductNameInput(e.target.value)}
                    placeholder="e.g. Ceramide Hydrating Cream"
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Paste INCI Chemical Ingredients
                  </label>
                  <textarea
                    rows={5}
                    value={ingredientsTextInput}
                    onChange={(e) => setIngredientsTextInput(e.target.value)}
                    placeholder="e.g. Water/Aqua, Glycerin, Niacinamide, Salicylic Acid, Cocos Nucifera (Coconut) Oil, Fragrance, Ceramide NP..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white font-mono"
                  />
                </div>

                <button
                  onClick={() => handleAudit()}
                  disabled={!ingredientsTextInput.trim() || isAuditing}
                  className="w-full py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditing Safety...</span>
                    </>
                  ) : (
                    <span>Analyze Ingredients</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: The Verdict & Actionable Recommendation Card */}
        <div className="lg:col-span-7 space-y-5">
          {currentVerdict ? (
            <div className="space-y-5">
              {/* The Master Verdict Card */}
              {(() => {
                const styles = getVerdictStyles(currentVerdict.verdictStatus);
                const Icon = styles.icon;
                return (
                  <div
                    className={`rounded-2xl border p-5 sm:p-6 shadow-xs transition-all space-y-4 ${styles.bg}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-black/10">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-1.5 rounded-lg ${styles.badge}`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <div>
                          <div className="text-[11px] font-mono font-bold tracking-wider uppercase">
                            {styles.title}
                          </div>
                          <h4 className="text-base sm:text-lg font-bold font-display mt-0.5">
                            {currentVerdict.productName}
                          </h4>
                        </div>
                      </div>

                      {/* Compatibility Score */}
                      <div className="flex items-center gap-3 self-start sm:self-auto bg-white/70 px-3 py-1.5 rounded-xl border border-black/10 font-mono">
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase">Barrier Match</div>
                          <div className="text-lg font-extrabold text-stone-900 leading-none mt-0.5">
                            {currentVerdict.compatibilityScore}%
                          </div>
                        </div>

                        <button
                          onClick={handleSaveToShelf}
                          className="p-2 text-stone-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title={isCurrentProductSaved ? 'Saved in MyShelf' : 'Save to MyShelf Vanity'}
                        >
                          {isCurrentProductSaved ? (
                            <BookmarkCheck className="w-5 h-5 text-rose-600" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Verdict Summary & Headline */}
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-stone-900">
                        {currentVerdict.verdictHeadline}
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {currentVerdict.verdictSummary}
                      </p>
                    </div>

                    {/* Actionable Usage Protocol */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-white/80 p-3 rounded-xl border border-black/10 space-y-1">
                        <div className="text-[10px] font-mono uppercase text-stone-500 font-semibold">
                          Recommended Frequency
                        </div>
                        <div className="text-xs font-bold text-stone-900">
                          {currentVerdict.recommendedFrequency}
                        </div>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-black/10 space-y-1">
                        <div className="text-[10px] font-mono uppercase text-stone-500 font-semibold">
                          Facial Zone Guidance
                        </div>
                        <div className="text-xs text-stone-800 leading-normal">
                          {currentVerdict.segmentSpecificAdvice}
                        </div>
                      </div>
                    </div>

                    {/* Acne Compatibility & Comedogenic Risk Scorecard */}
                    <div className="p-3.5 rounded-xl border border-black/10 bg-white/90 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-stone-900">
                          <Flame
                            className={`w-4 h-4 ${
                              (currentVerdict.maxComedogenicRating && currentVerdict.maxComedogenicRating >= 4) ||
                              currentVerdict.acneSafetyLevel === 'high_risk'
                                ? 'text-rose-600'
                                : (currentVerdict.maxComedogenicRating && currentVerdict.maxComedogenicRating >= 2) ||
                                  currentVerdict.acneSafetyLevel === 'caution'
                                ? 'text-amber-500'
                                : 'text-emerald-600'
                            }`}
                          />
                          <span>Acne-Prone & Comedogenicity Audit</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              (currentVerdict.maxComedogenicRating && currentVerdict.maxComedogenicRating >= 4) ||
                              currentVerdict.acneSafetyLevel === 'high_risk'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : (currentVerdict.maxComedogenicRating && currentVerdict.maxComedogenicRating >= 2) ||
                                  currentVerdict.acneSafetyLevel === 'caution'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            Max Comedogenic Index:{' '}
                            {currentVerdict.maxComedogenicRating !== undefined
                              ? `${currentVerdict.maxComedogenicRating}/5`
                              : '0-1/5'}
                          </span>

                          {currentVerdict.fungalAcneSafe !== undefined && (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                currentVerdict.fungalAcneSafe
                                  ? 'bg-stone-100 text-stone-700'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {currentVerdict.fungalAcneSafe ? '🛡️ Fungal Acne Safe' : '⚠️ Malassezia Trigger'}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed">
                        {(currentVerdict.maxComedogenicRating && currentVerdict.maxComedogenicRating >= 4) ||
                        currentVerdict.acneSafetyLevel === 'high_risk' ? (
                          <span className="text-rose-950 font-medium">
                            🚨 <strong>NOT Safe for Acne-Prone Skin:</strong> Contains heavy comedogenic lipids that solidify in sebaceous follicles, provoking closed comedones, blackheads, and inflamed pustules.
                          </span>
                        ) : (currentVerdict.maxComedogenicRating && currentVerdict.maxComedogenicRating >= 2) ||
                          currentVerdict.acneSafetyLevel === 'caution' ? (
                          <span className="text-amber-950 font-medium">
                            ⚠️ <strong>Use with Caution on Breakout-Prone Skin:</strong> Contains moderate pore-clogging ingredients. May cause congestion if applied to oily T-zones or worn under occlusive masks.
                          </span>
                        ) : (
                          <span className="text-emerald-950 font-medium">
                            🟢 <strong>Safe for Acne-Prone Skin:</strong> 100% non-comedogenic active profile (0-1/5). Zero heavy occlusive waxes or breakout-provoking esters detected.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Detailed Ingredient Safety & Efficacy Audit Breakdown */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-800">
                    Ingredient Audit Details ({currentVerdict.ingredientDetails.length} Detected)
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Cosmetic Science Engine
                  </span>
                </div>

                {/* Flagged Concerns (if any) */}
                {currentVerdict.verdictStatus !== 'green_light' && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono font-bold text-rose-700 uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flagged Skin Conflicts</span>
                    </div>
                    <div className="space-y-1.5">
                      {currentVerdict.flaggedConcerns.map((concern, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 leading-normal flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                          <span>{concern}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hero Actives Detected */}
                {currentVerdict.keyActiveHighlights.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-mono font-bold text-emerald-700 uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Beneficial Hero Actives Detected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentVerdict.keyActiveHighlights.map((hero, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium"
                        >
                          {hero}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Chemical Registry */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="text-[11px] font-mono uppercase text-stone-500">
                    Recognized Actives & Formulations:
                  </div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {currentVerdict.ingredientDetails.map((ing, iIdx) => (
                      <div
                        key={iIdx}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 ${
                          ing.conflictWithUserProfile
                            ? 'bg-rose-50/80 border-rose-200'
                            : ing.role === 'hero_active'
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-stone-900">{ing.name}</span>
                          <span
                            className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                              ing.role === 'comedogenic_risk'
                                ? 'bg-rose-100 text-rose-800'
                                : ing.role === 'barrier_irritant'
                                ? 'bg-amber-100 text-amber-800'
                                : ing.role === 'hero_active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {ing.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-normal">
                          {ing.matchNote}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 space-y-2">
              <FileText className="w-8 h-8 text-stone-400 mx-auto" />
              <div className="text-sm font-semibold text-stone-700">No Formula Audited Yet</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Select one of the viral preset products or upload a label photo on the left to see the instant verdict.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Virtual Vanity Shelf Inventory */}
      <div className="pt-6 border-t border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-rose-600" />
              <span>My Virtual Vanity Shelf ({savedShelf.length} Audited Products)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Your personal inventory of tested skincare products saved with YouCam compatibility scores
            </p>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({savedShelf.length})
            </button>
            <button
              onClick={() => setActiveFilter('safe')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer text-emerald-700 ${
                activeFilter === 'safe'
                  ? 'bg-white shadow-2xs font-semibold'
                  : 'hover:text-emerald-900'
              }`}
            >
              Green Light
            </button>
            <button
              onClick={() => setActiveFilter('caution')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer text-amber-700 ${
                activeFilter === 'caution'
                  ? 'bg-white shadow-2xs font-semibold'
                  : 'hover:text-amber-900'
              }`}
            >
              Caution
            </button>
            <button
              onClick={() => setActiveFilter('stop')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer text-rose-700 ${
                activeFilter === 'stop'
                  ? 'bg-white shadow-2xs font-semibold'
                  : 'hover:text-rose-900'
              }`}
            >
              Hard Stop
            </button>
          </div>
        </div>

        {filteredShelf.length === 0 ? (
          <div className="text-xs text-stone-500 italic p-6 bg-stone-50 rounded-xl text-center">
            No products match this filter in your vanity shelf.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShelf.map((shelfItem) => {
              const styles = getVerdictStyles(shelfItem.verdictStatus);
              const Icon = styles.icon;
              return (
                <div
                  key={shelfItem.productId}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate font-display">
                          {shelfItem.productName}
                        </h4>
                        <div className="text-[10px] text-stone-500 font-mono">
                          Audited: {new Date(shelfItem.savedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${styles.badge} shrink-0`}>
                        {shelfItem.compatibilityScore}%
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                      {shelfItem.verdictSummary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => setCurrentVerdict(shelfItem)}
                      className="text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Full Audit</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromShelf(shelfItem.productId)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove from Shelf"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
