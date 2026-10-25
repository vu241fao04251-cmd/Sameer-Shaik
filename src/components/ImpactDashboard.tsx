import React, { useState } from 'react';
import { PlatformMetrics, DonationListing } from '../types/foodDonation';
import { formatCurrency } from '../utils/formatters';
import {
  FileText,
  Printer,
  Sparkles,
  TrendingUp,
  Award,
  ShieldCheck,
  Leaf,
  Droplets,
  Heart,
  Scale,
} from 'lucide-react';

interface ImpactDashboardProps {
  metrics: PlatformMetrics;
  donations: DonationListing[];
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  metrics,
  donations,
}) => {
  const [donorBusinessName, setDonorBusinessName] = useState('Olive & Hearth Kitchen LLC');
  const [donorEIN, setDonorEIN] = useState('94-3829104');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2026 (Current Period)');
  const [authorizedRep, setAuthorizedRep] = useState('Marcus Vance, Food Logistics Director');

  // Completed or active donations for this donor
  const donorDonations = donations.filter(
    (d) => d.donor.name.includes('Olive') || d.status === 'completed' || d.status === 'reserved'
  );

  const totalDonationValue = donorDonations.reduce((sum, d) => sum + d.estimatedValueUSD, 0);
  const totalWeightKg = donorDonations.reduce((sum, d) => sum + d.weightKg, 0);
  const totalMeals = donorDonations.reduce((sum, d) => sum + d.servingsEquivalent, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Impact Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Community Food Rescue Transparency Ledger</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Collective Impact & Landfill Diversion
          </h2>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Every tray of surplus food rescued from disposal prevents methane emission in landfills and immediately nourishes local families, shelters, and youth in need.
          </p>
        </div>

        {/* Big 4 Impact Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-800/60">
          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs">
              <Heart className="w-4 h-4" />
              <span>Meals Rescued</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {metrics.totalMealsRescued.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Distributed to local pantries</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs">
              <Scale className="w-4 h-4" />
              <span>Surplus Diverted</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {metrics.totalKgDiverted.toLocaleString()} kg
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Kept out of city waste stream</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs">
              <Leaf className="w-4 h-4" />
              <span>GHG Averted</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {metrics.co2eAvertedKg.toLocaleString()} kg
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Landfill CO₂e emissions prevented</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs">
              <Droplets className="w-4 h-4" />
              <span>Water Footprint Saved</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {metrics.waterSavedGallons.toLocaleString()} gal
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Agricultural embedded water</div>
          </div>
        </div>
      </div>

      {/* Tax Deduction Certificate & Receipt Generator */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>IRS § 170(e)(3) / 501(c)(3) Tax Compliance</span>
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900">
              Tax-Deductible Donation Receipt & Diversion Certificate
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Generate an official corporate substantiation receipt certifying surplus food donation to qualified 501(c)(3) non-profit entities.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-neutral-700" />
            <span>Print / Save Receipt PDF</span>
          </button>
        </div>

        {/* Certificate Customization Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <div>
            <label className="block text-neutral-600 font-medium mb-1">
              Donor Entity Name
            </label>
            <input
              type="text"
              value={donorBusinessName}
              onChange={(e) => setDonorBusinessName(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-neutral-600 font-medium mb-1">
              Employer ID (EIN) / Tax Number
            </label>
            <input
              type="text"
              value={donorEIN}
              onChange={(e) => setDonorEIN(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 font-mono text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-600 font-medium mb-1">
              Accounting Period
            </label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900"
            >
              <option value="Q4 2026 (Current Period)">Q4 2026 (Current Period)</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Full Year 2026">Full Year 2026</option>
            </select>
          </div>
        </div>

        {/* The Printable Official Certificate Box */}
        <div className="border-2 border-neutral-800 rounded-xl p-6 sm:p-8 bg-neutral-50/30 space-y-6 print:border-none print:p-0">
          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-300 pb-5">
            <div>
              <div className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-mono">
                FORM NO. NB-170E3 · OFFICIAL TAX SUBSTANTIATION
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
                CERTIFICATE OF FOOD DONATION & INVENTORY RELIEF
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Issued via NourishBridge Verified Food Rescue Clearinghouse
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono text-neutral-500">Document ID: <strong className="text-neutral-900">NBR-2026-9812</strong></div>
              <div className="font-mono text-neutral-500 mt-0.5">Date: <strong className="text-neutral-900">{new Date().toLocaleDateString()}</strong></div>
            </div>
          </div>

          {/* Donor & Non-profit Recipient Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-3.5 bg-white rounded-lg border border-neutral-200">
              <div className="text-neutral-400 uppercase text-[10px] font-bold">DONATING ENTITY</div>
              <div className="font-bold text-sm text-neutral-900 mt-1">{donorBusinessName}</div>
              <div className="text-neutral-600 mt-0.5">Tax EIN: <span className="font-mono">{donorEIN}</span></div>
              <div className="text-neutral-500">428 Market Street, San Francisco, CA 94105</div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-neutral-200">
              <div className="text-neutral-400 uppercase text-[10px] font-bold">QUALIFIED RECIPIENT ENTITY</div>
              <div className="font-bold text-sm text-neutral-900 mt-1">Hope Harbor Community Kitchen & Shelters</div>
              <div className="text-neutral-600 mt-0.5">IRS 501(c)(3) Exempt Status: <span className="font-mono text-emerald-700 font-bold">VERIFIED #94-2771092</span></div>
              <div className="text-neutral-500">150 Golden Gate Ave, San Francisco, CA</div>
            </div>
          </div>

          {/* Itemized Table of Donations */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 text-neutral-600 border-y border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Listing / Food Description</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Net Weight</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Portions / Meals</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Fair Market Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {donorDonations.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2.5 px-3 font-medium text-neutral-900">
                      {d.title}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 capitalize">
                      {d.category.replace('_', ' ')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-700">
                      {d.weightKg} kg
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-900 font-medium">
                      {d.servingsEquivalent}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-800 font-semibold">
                      {formatCurrency(d.estimatedValueUSD)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-neutral-50 border-t-2 border-neutral-300 font-bold text-neutral-900">
                <tr>
                  <td colSpan={2} className="py-3 px-3 uppercase text-xs">
                    Total Period Claim
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {totalWeightKg.toFixed(1)} kg
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {totalMeals} Meals
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-900 text-sm">
                    {formatCurrency(totalDonationValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legal Certification and Digital Stamp */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs text-neutral-600">
            <div className="max-w-md space-y-1">
              <div className="font-semibold text-neutral-900">IRC § 170(e)(3) Recipient Substantiation:</div>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                The donee organization confirms receipt of the wholesome food products itemized above. In accordance with federal regulations, the donated food will be used exclusively for the care of the ill, needy, or infants, and no goods or services were provided in exchange for this contribution.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-emerald-300 bg-emerald-50/50 p-3 rounded-xl shrink-0">
              <Award className="w-8 h-8 text-emerald-700 shrink-0" />
              <div>
                <div className="font-bold text-neutral-900 text-xs">DIGITALLY CERTIFIED</div>
                <div className="text-[11px] text-neutral-600 font-mono">Timestamp: {new Date().toISOString().slice(0, 10)}</div>
                <div className="text-[10px] text-emerald-800 font-semibold">NourishBridge Verification Trust Network</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
