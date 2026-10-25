import React from 'react';
import { DonationListing, UserRole } from '../types/foodDonation';
import { getTimeRemaining, formatCategory, formatStorage, formatCurrency } from '../utils/formatters';
import { MapPin, Clock, ShieldCheck, Check, ArrowRight } from 'lucide-react';

interface DonationCardProps {
  donation: DonationListing;
  userRole: UserRole;
  onViewDetails: (donation: DonationListing) => void;
  onQuickClaim?: (donation: DonationListing) => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  userRole,
  onViewDetails,
  onQuickClaim,
}) => {
  const timeInfo = getTimeRemaining(donation.expiryDeadline);
  const storage = formatStorage(donation.storageRequirement);

  const isAvailable = donation.status === 'available';
  const isReserved = donation.status === 'reserved';
  const isCompleted = donation.status === 'completed';

  return (
    <article className="group bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col transition-all hover:border-neutral-300 hover:shadow-xs">
      {/* Visual media container with measured contrast scrim and fallback */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={donation.image}
          alt={donation.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          onError={(e) => {
            // Elegant CSS fallback if needed
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Quiet status & urgency indicator - zero-pill, subtle scrim */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-neutral-300" />
            <span
              className={`tabular-nums ${
                timeInfo.isUrgent ? 'text-amber-300 font-semibold' : 'text-neutral-100'
              }`}
            >
              {timeInfo.text}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-200">{donation.pickupWindowEnd}</span>
          </div>

          <div className="text-right">
            {isAvailable && (
              <span className="text-emerald-300 font-medium text-[11px] tracking-wide">
                Available Now
              </span>
            )}
            {isReserved && (
              <span className="text-amber-300 font-medium text-[11px] tracking-wide">
                Reserved · {donation.claimInfo?.recipientName.split(' ')[0]}
              </span>
            )}
            {isCompleted && (
              <span className="text-neutral-300 font-medium text-[11px] tracking-wide flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Rescued
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Zero-pill discipline with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span className="font-medium text-neutral-700">
              {formatCategory(donation.category)}
            </span>
            <span aria-hidden="true" className="text-neutral-300">
              ·
            </span>
            <span>{storage.label}</span>
            <span aria-hidden="true" className="text-neutral-300">
              ·
            </span>
            <span className="font-mono tabular-nums text-neutral-700 font-medium">
              ~{donation.servingsEquivalent} meals
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(donation)}
            className="font-display font-semibold text-neutral-900 text-base leading-snug line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors"
          >
            {donation.title}
          </h3>

          {/* Donor & Location */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-medium text-neutral-900 truncate">
                {donation.donor.name}
              </span>
              {donation.donor.verified && (
                <ShieldCheck
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                  aria-label="Verified Commercial Kitchen"
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-neutral-500 shrink-0 font-mono tabular-nums ml-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{donation.donor.distanceMiles} mi</span>
            </div>
          </div>

          {/* Quiet description preview */}
          <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {donation.description}
          </p>

          {/* Dietary & Allergen tags as quiet inline text */}
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <div className="truncate pr-2">
              <span className="text-neutral-400">Dietary: </span>
              <span className="text-neutral-700 capitalize">
                {donation.dietaryTags.join(', ')}
              </span>
            </div>
            <div className="text-right shrink-0 font-mono tabular-nums text-neutral-500">
              Est. {formatCurrency(donation.estimatedValueUSD)}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(donation)}
            className="flex-1 py-2 px-3 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors cursor-pointer text-center"
          >
            Inspect Details
          </button>

          {isAvailable && (userRole === 'recipient' || userRole === 'public_explorer') && (
            <button
              onClick={() => onQuickClaim ? onQuickClaim(donation) : onViewDetails(donation)}
              className="py-2 px-3.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <span>Claim Food</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isReserved && donation.claimInfo?.pickupPIN && (
            <div className="text-[11px] font-mono text-neutral-600 bg-neutral-100 py-1.5 px-2.5 rounded-lg">
              PIN: <span className="font-bold text-neutral-900">{donation.claimInfo.pickupPIN}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
