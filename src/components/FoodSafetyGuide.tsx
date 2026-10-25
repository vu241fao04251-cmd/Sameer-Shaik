import React, { useState } from 'react';
import {
  ShieldCheck,
  Thermometer,
  AlertOctagon,
  Scale,
  CheckCircle2,
  FileCheck,
  Info,
} from 'lucide-react';

export const FoodSafetyGuide: React.FC = () => {
  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({
    sanitary: true,
    temp_logged: true,
    containers_labeled: true,
    no_recall: true,
  });

  const toggleCheck = (key: string) => {
    setActiveChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allPassed = Object.values(activeChecklist).every(Boolean);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero header */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Food Safety & Regulatory Compliance Standard</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Safe Food Rescue Protocols & Legal Protections
        </h2>
        <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
          NourishBridge enforces rigorous food safety standards grounded in the FDA Food Code and federal Good Samaritan statutes so both donors and recipients operate with total confidence.
        </p>
      </div>

      {/* Bill Emerson Good Samaritan Act & 2023 Update Card */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-emerald-950">
              The Bill Emerson Good Samaritan Food Donation Act (42 U.S.C. § 1791)
            </h3>
            <p className="text-xs text-emerald-800">
              Full Federal Civil and Criminal Liability Immunity for Donors & Charities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-emerald-900 leading-relaxed pt-2">
          <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
            <h4 className="font-bold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Broad Legal Protection</span>
            </h4>
            <p className="text-neutral-600">
              Protects food businesses, restaurants, caterers, grocery chains, and community organizers from civil and criminal liability when donating "apparently wholesome food" in good faith to non-profit organizations.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
            <h4 className="font-bold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Food Donation Improvement Act Expansion</span>
            </h4>
            <p className="text-neutral-600">
              Expands protections to direct donations to needy individuals and allows certified food service operations to donate surplus directly without requiring an intermediate charitable entity.
            </p>
          </div>
        </div>
      </div>

      {/* Temperature Safety Zones Visual */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-neutral-900">
            FDA Food Code Temperature Safe Zones
          </h3>
          <p className="text-xs text-neutral-600 mt-1">
            Pathogenic bacteria grow fastest in the "Danger Zone" between 40°F (4°C) and 140°F (60°C).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Hot Holding */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
            <div className="flex items-center justify-between font-bold text-rose-900">
              <span>Hot Holding Zone</span>
              <span className="font-mono tabular-nums text-sm">≥ 140°F (60°C)</span>
            </div>
            <p className="text-neutral-600 mt-2 leading-relaxed">
              Cooked surplus foods (stews, roasted meats, grains, soups) must be maintained at or above 140°F until packaging or rapidly cooled to 40°F within 2 hours.
            </p>
          </div>

          {/* Danger Zone */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70">
            <div className="flex items-center justify-between font-bold text-amber-950">
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                <span>The Danger Zone</span>
              </span>
              <span className="font-mono tabular-nums text-sm">40°F – 140°F</span>
            </div>
            <p className="text-neutral-700 mt-2 leading-relaxed">
              Perishable food cannot remain in this temperature range for more than 2 cumulative hours. If elapsed time exceeds 2 hours, food must be composted, not donated.
            </p>
          </div>

          {/* Cold Refrigeration */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40">
            <div className="flex items-center justify-between font-bold text-sky-900">
              <span>Cold Storage Zone</span>
              <span className="font-mono tabular-nums text-sm">≤ 40°F (4°C)</span>
            </div>
            <p className="text-neutral-600 mt-2 leading-relaxed">
              Dairy, meats, cut produce, and prepared meals must be continuously held in verified commercial refrigeration below 40°F. Frozen foods at ≤ 0°F.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 4-Point Safety Checklist */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-900">
              Donor Rapid Pre-Transfer Verification Checklist
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Every donor must satisfy all 4 food safety checkpoints before publishing a rescue run:
            </p>
          </div>

          {allPassed && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Compliance Verified</span>
            </span>
          )}
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={activeChecklist.sanitary}
              onChange={() => toggleCheck('sanitary')}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-neutral-900">
                1. Wholesome & Unadulterated Source
              </span>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Food was prepared in a licensed commercial kitchen or sealed facility; was never served to a guest or table-touched.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={activeChecklist.temp_logged}
              onChange={() => toggleCheck('temp_logged')}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-neutral-900">
                2. Continuous Cold / Hot Chain Documented
              </span>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Food has been kept below 40°F or above 140°F continuously without exceeding the 2-hour window.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={activeChecklist.containers_labeled}
              onChange={() => toggleCheck('containers_labeled')}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-neutral-900">
                3. Sealed Packaging & Clear Allergen Disclosure
              </span>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Packed in clean, food-grade disposable containers with major allergens declared for shelter kitchen staff.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={activeChecklist.no_recall}
              onChange={() => toggleCheck('no_recall')}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-neutral-900">
                4. Zero Active Product Recalls
              </span>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Packaged ingredients are verified free from FDA / USDA active contamination or recall notices.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
