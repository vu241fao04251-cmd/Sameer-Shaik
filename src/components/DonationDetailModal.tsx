import React, { useState } from 'react';
import { DonationListing, UserRole, RecipientShelter } from '../types/foodDonation';
import { formatCategory, formatStorage, formatCurrency, getTimeRemaining } from '../utils/formatters';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  Package,
  Phone,
  Mail,
  CheckCircle2,
  Bike,
  Building2,
  Calendar,
} from 'lucide-react';

interface DonationDetailModalProps {
  donation: DonationListing | null;
  userRole: UserRole;
  shelters: RecipientShelter[];
  onClose: () => void;
  onClaim: (
    donationId: string,
    recipientId: string,
    servings: number,
    pickupMethod: 'self_pickup' | 'volunteer_courier'
  ) => void;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  donation,
  userRole,
  shelters,
  onClose,
  onClaim,
}) => {
  if (!donation) return null;

  const storage = formatStorage(donation.storageRequirement);
  const timeInfo = getTimeRemaining(donation.expiryDeadline);

  // Claim form states
  const [selectedShelterId, setSelectedShelterId] = useState(shelters[0]?.id || 'rec-001');
  const [claimServings, setClaimServings] = useState(donation.servingsEquivalent);
  const [pickupMethod, setPickupMethod] = useState<'self_pickup' | 'volunteer_courier'>('volunteer_courier');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [generatedPIN, setGeneratedPIN] = useState<string | null>(null);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClaim(donation.id, selectedShelterId, claimServings, pickupMethod);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedPIN(pin);
    setClaimSuccess(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl border border-neutral-200 my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-neutral-100 overflow-hidden">
          <img
            src={donation.image}
            alt={donation.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-neutral-900/70 hover:bg-neutral-900 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/40 to-transparent p-4 sm:p-5 text-white">
            <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1">
              <span>{formatCategory(donation.category)}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{donation.servingsEquivalent} Servings</span>
              <span>·</span>
              <span className="font-mono tabular-nums">~{donation.weightKg} kg</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {donation.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/70 text-xs">
            <div>
              <div className="text-neutral-500 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" />
                <span>Storage Chain</span>
              </div>
              <div className="font-medium text-neutral-900 mt-0.5">{storage.label}</div>
              <div className="text-[11px] text-neutral-500 font-mono">{storage.temp}</div>
            </div>

            <div>
              <div className="text-neutral-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Urgency</span>
              </div>
              <div className={`font-medium mt-0.5 tabular-nums ${timeInfo.isUrgent ? 'text-amber-700' : 'text-neutral-900'}`}>
                {timeInfo.text}
              </div>
              <div className="text-[11px] text-neutral-500">Pick up by {donation.pickupWindowEnd}</div>
            </div>

            <div>
              <div className="text-neutral-500 flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>Quantity</span>
              </div>
              <div className="font-medium text-neutral-900 mt-0.5 font-mono tabular-nums">
                {donation.quantity} {donation.unit}
              </div>
              <div className="text-[11px] text-neutral-500">~{donation.servingsEquivalent} adult meals</div>
            </div>

            <div>
              <div className="text-neutral-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Fair Market Value</span>
              </div>
              <div className="font-medium text-neutral-900 mt-0.5 font-mono tabular-nums">
                {formatCurrency(donation.estimatedValueUSD)}
              </div>
              <div className="text-[11px] text-emerald-700">Tax Deductible</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-1.5">
              Item Details & Composition
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {donation.description}
            </p>
          </div>

          {/* Food Safety & Safe Handling Section */}
          <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                  Food Safety Compliance & Chain of Custody
                </h4>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Safe Handling
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {donation.handlingInstructions ||
                'Maintained under standard commercial refrigeration. Inspected and verified by culinary staff prior to transfer listing.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Packaging & Containers:</span>
                <span className="text-neutral-800 font-medium">{donation.packagingType}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                <span className="text-neutral-500 block text-[11px]">Allergen Declarations:</span>
                <span className="text-neutral-800 font-medium capitalize">
                  {donation.allergens.length > 0 ? donation.allergens.join(', ') : 'None reported'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 flex items-start gap-1.5 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>
                Protected under the <strong>Bill Emerson Good Samaritan Food Donation Act</strong> (42 U.S. Code § 1791), protecting donors and recipient charities from liability when donating apparently wholesome food in good faith.
              </span>
            </div>
          </div>

          {/* Donor Location & Direct Handover Instructions */}
          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2">
              Donor Facility & Pickup Bay
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-700">
              <div>
                <div className="font-semibold text-neutral-900 text-sm">{donation.donor.name}</div>
                <div className="flex items-center gap-1.5 text-neutral-600 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{donation.donor.address} ({donation.donor.neighborhood})</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`tel:${donation.donor.contactPhone}`}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-2.5 py-1.5 rounded-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{donation.donor.contactPhone}</span>
                </a>
                <a
                  href={`mailto:${donation.donor.contactEmail}`}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-2.5 py-1.5 rounded-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Claim Section or Existing Claim Summary */}
          {donation.status === 'available' ? (
            <div className="border-t border-neutral-200 pt-5">
              {claimSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                  <h4 className="font-display text-base font-bold text-emerald-900">
                    Donation Successfully Reserved!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Present this 4-digit verification PIN to the donor at pickup or share with the assigned volunteer courier:
                  </p>
                  <div className="inline-block bg-white border border-emerald-300 font-mono text-2xl font-bold tracking-widest text-emerald-950 py-2 px-6 rounded-lg my-1">
                    #{generatedPIN}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Pickup window: <strong>{donation.pickupWindowStart} — {donation.pickupWindowEnd}</strong>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-neutral-900 text-sm">
                      Reserve this Surplus for Your Shelter or Pantry
                    </h4>
                    <span className="text-xs text-neutral-500">
                      Step 1 of 1 · Instant Confirmation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">
                        Claiming Organization:
                      </label>
                      <select
                        value={selectedShelterId}
                        onChange={(e) => setSelectedShelterId(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        {shelters.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.neighborhood})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">
                        Servings to Claim (Max {donation.servingsEquivalent}):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={donation.servingsEquivalent}
                        value={claimServings}
                        onChange={(e) => setClaimServings(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                  </div>

                  {/* Pickup Logistics selector */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Fulfillment & Transport Method:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setPickupMethod('volunteer_courier')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          pickupMethod === 'volunteer_courier'
                            ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <Bike className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-neutral-900">Request Volunteer Courier</div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            Broadcast to our local courier hero network for electric bike or vehicle dispatch.
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickupMethod('self_pickup')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          pickupMethod === 'self_pickup'
                            ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-neutral-900">Direct Shelter Staff Pickup</div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            Our team van or staff will arrive directly at donor pickup bay during window.
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Reservation</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="border-t border-neutral-200 pt-4 bg-neutral-50 p-4 rounded-xl">
              <div className="text-xs text-neutral-600 space-y-1.5">
                <div className="font-semibold text-neutral-900">
                  Status: {donation.status.toUpperCase()}
                </div>
                {donation.claimInfo && (
                  <>
                    <div>Claimed By: <strong>{donation.claimInfo.recipientName}</strong></div>
                    <div>Fulfillment: <span className="capitalize">{donation.claimInfo.pickupMethod.replace('_', ' ')}</span></div>
                    {donation.claimInfo.volunteerCourierName && (
                      <div>Assigned Courier: <strong>{donation.claimInfo.volunteerCourierName}</strong></div>
                    )}
                    <div className="font-mono text-sm pt-1">
                      Verification PIN: <span className="font-bold text-neutral-900">#{donation.claimInfo.pickupPIN}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
