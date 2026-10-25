import React from 'react';
import { HeartHandshake } from 'lucide-react';

interface HeaderProps {
  activeTab: 'browse' | 'map' | 'missions' | 'impact' | 'safety';
  onSelectTab: (tab: 'browse' | 'map' | 'missions' | 'impact' | 'safety') => void;
  onOpenCreateDonation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreateDonation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('browse')}
            className="flex items-center gap-2.5 text-left text-neutral-900 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="font-display text-lg font-bold tracking-tight text-neutral-900 block">
                NourishBridge
              </span>
              <span className="text-[11px] text-neutral-500 font-sans block -mt-0.5">
                Surplus Food Rescue Network
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line text links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onSelectTab('browse')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                activeTab === 'browse'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Available Food
            </button>
            <button
              onClick={() => onSelectTab('map')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                activeTab === 'map'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Rescue Map
            </button>
            <button
              onClick={() => onSelectTab('missions')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                activeTab === 'missions'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Volunteer Runs
            </button>
            <button
              onClick={() => onSelectTab('impact')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                activeTab === 'impact'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Impact & Tax Receipts
            </button>
            <button
              onClick={() => onSelectTab('safety')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
                activeTab === 'safety'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Safety Standards
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreateDonation}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 active:bg-emerald-900 transition-colors shadow-xs whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Donate Surplus</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
