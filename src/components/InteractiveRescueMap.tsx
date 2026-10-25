import React, { useState } from 'react';
import { DonationListing, RecipientShelter, VolunteerMission } from '../types/foodDonation';
import { formatCategory, getTimeRemaining, formatStorage } from '../utils/formatters';
import { MapPin, Navigation, Store, Building2, Bike, Layers, Clock } from 'lucide-react';

interface InteractiveRescueMapProps {
  donations: DonationListing[];
  shelters: RecipientShelter[];
  missions: VolunteerMission[];
  onSelectDonation: (donation: DonationListing) => void;
  onOpenCreateDonation: () => void;
}

export const InteractiveRescueMap: React.FC<InteractiveRescueMapProps> = ({
  donations,
  shelters,
  missions,
  onSelectDonation,
  onOpenCreateDonation,
}) => {
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(donations[0]?.id || null);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [radiusFilter, setRadiusFilter] = useState<number>(5);
  const [activeLayer, setActiveLayer] = useState<'all' | 'donors' | 'shelters' | 'routes'>('all');

  const selectedDonation = donations.find((d) => d.id === selectedDonationId);
  const selectedShelter = shelters.find((s) => s.id === selectedShelterId);

  // Map coordinates projection logic
  // SF Metro bounding box: lat: 37.74 to 37.80, lng: -122.44 to -122.38
  const mapWidth = 900;
  const mapHeight = 520;

  const projectCoord = (lat: number, lng: number) => {
    const minLat = 37.745;
    const maxLat = 37.798;
    const minLng = -122.435;
    const maxLng = -122.382;

    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 100) + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 80) + 40;
    return {
      x: Math.max(30, Math.min(mapWidth - 30, x)),
      y: Math.max(30, Math.min(mapHeight - 30, y)),
    };
  };

  const filteredDonations = donations.filter((d) => d.donor.distanceMiles <= radiusFilter);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
      {/* Top Map Toolbar */}
      <div className="p-4 sm:px-6 bg-neutral-50/90 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold text-neutral-900">
            Live Urban Rescue Grid
          </span>
          <span className="text-neutral-400">·</span>
          <span className="text-neutral-600">
            {filteredDonations.length} Active Surplus Donors · {shelters.length} Partner Shelters
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-lg p-0.5">
            {[1, 3, 5, 10].map((r) => (
              <button
                key={r}
                onClick={() => setRadiusFilter(r)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  radiusFilter === r
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {r} mi
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-lg p-0.5">
            {(['all', 'donors', 'shelters', 'routes'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-2.5 py-1 rounded text-xs capitalize font-medium cursor-pointer transition-colors ${
                  activeLayer === layer
                    ? 'bg-emerald-700 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Graphic Area */}
      <div className="relative bg-[#f8fafc] overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-[400px] sm:h-[480px] object-cover"
        >
          {/* Subtle Map Background: Bay Coastline & City Blocks */}
          <rect width={mapWidth} height={mapHeight} fill="#f1f5f9" />
          
          {/* Water Body (San Francisco Bay on right side) */}
          <path
            d={`M ${mapWidth - 110} 0 
                C ${mapWidth - 140} 100, ${mapWidth - 90} 220, ${mapWidth - 130} 340 
                C ${mapWidth - 160} 420, ${mapWidth - 120} 500, ${mapWidth - 90} ${mapHeight} 
                L ${mapWidth} ${mapHeight} L ${mapWidth} 0 Z`}
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />

          {/* Urban Grid Streets */}
          <g stroke="#cbd5e1" strokeWidth="1" strokeDasharray="none" opacity="0.7">
            {/* Major avenues */}
            <line x1="40" y1="90" x2={mapWidth - 140} y2="90" />
            <line x1="40" y1="180" x2={mapWidth - 130} y2="180" />
            <line x1="40" y1="270" x2={mapWidth - 150} y2="270" />
            <line x1="40" y1="360" x2={mapWidth - 130} y2="360" />
            <line x1="40" y1="450" x2={mapWidth - 100} y2="450" />

            {/* Cross streets */}
            <line x1="120" y1="30" x2="120" y2={mapHeight - 30} />
            <line x1="240" y1="30" x2="240" y2={mapHeight - 30} />
            <line x1="360" y1="30" x2="360" y2={mapHeight - 30} />
            <line x1="480" y1="30" x2="480" y2={mapHeight - 30} />
            <line x1="600" y1="30" x2="600" y2={mapHeight - 30} />
            <line x1="720" y1="30" x2="720" y2={mapHeight - 30} />

            {/* Diagonal arterial (Market Street simulation) */}
            <line x1="100" y1="460" x2="740" y2="80" stroke="#94a3b8" strokeWidth="2.5" />
          </g>

          {/* Park area */}
          <rect
            x="280"
            y="290"
            width="130"
            height="70"
            rx="8"
            fill="#dcfce7"
            stroke="#bbf7d0"
            strokeWidth="1"
          />
          <text x="345" y="330" fill="#15803d" fontSize="10" textAnchor="middle" fontWeight="500">
            Civic Center Plaza
          </text>

          {/* In-Transit Active Mission Delivery Route lines */}
          {(activeLayer === 'all' || activeLayer === 'routes') && (
            <g>
              {missions
                .filter((m) => m.status === 'accepted')
                .map((m) => {
                  const don = donations.find((d) => d.id === m.donationId);
                  const shel = shelters[0];
                  if (!don || !shel) return null;
                  const pt1 = projectCoord(don.donor.lat, don.donor.lng);
                  const pt2 = projectCoord(shel.lat, shel.lng);
                  const midX = (pt1.x + pt2.x) / 2;
                  const midY = (pt1.y + pt2.y) / 2 - 25;

                  return (
                    <g key={m.id}>
                      <path
                        d={`M ${pt1.x} ${pt1.y} Q ${midX} ${midY} ${pt2.x} ${pt2.y}`}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      {/* Courier Icon at midpoint */}
                      <circle cx={midX} cy={midY + 12} r="12" fill="#047857" />
                      <text
                        x={midX}
                        y={midY + 16}
                        fill="#ffffff"
                        fontSize="11"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        🚲
                      </text>
                    </g>
                  );
                })}
            </g>
          )}

          {/* Recipient Shelter Markers (Blue) */}
          {(activeLayer === 'all' || activeLayer === 'shelters') && (
            <g>
              {shelters.map((shelter) => {
                const pt = projectCoord(shelter.lat, shelter.lng);
                const isSelected = selectedShelterId === shelter.id;

                return (
                  <g
                    key={shelter.id}
                    className="cursor-pointer transition-transform"
                    onClick={() => {
                      setSelectedShelterId(shelter.id);
                      setSelectedDonationId(null);
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="22"
                        fill="#38bdf8"
                        fillOpacity="0.25"
                      />
                    )}
                    <rect
                      x={pt.x - 14}
                      y={pt.y - 14}
                      width="28"
                      height="28"
                      rx="6"
                      fill={isSelected ? '#0284c7' : '#0369a1'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 4}
                      fill="#ffffff"
                      fontSize="12"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      🍲
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Food Donor Markers (Green) */}
          {(activeLayer === 'all' || activeLayer === 'donors') && (
            <g>
              {filteredDonations.map((donation) => {
                const pt = projectCoord(donation.donor.lat, donation.donor.lng);
                const isSelected = selectedDonationId === donation.id;
                const isUrgent = getTimeRemaining(donation.expiryDeadline).isUrgent;

                return (
                  <g
                    key={donation.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedDonationId(donation.id);
                      setSelectedShelterId(null);
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="24"
                        fill="#10b981"
                        fillOpacity="0.25"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill={isUrgent ? '#d97706' : '#059669'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 4}
                      fill="#ffffff"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {donation.servingsEquivalent}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-neutral-200 text-[11px] space-y-1 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
            <span className="text-neutral-700">Surplus Food Donors</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-sky-700 inline-block"></span>
            <span className="text-neutral-700">Recipient Pantries / Kitchens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-700 inline-block border-t border-dashed"></span>
            <span className="text-neutral-700">Live Courier Dispatch Route</span>
          </div>
        </div>

        {/* Bottom Drawer Card: Selected Donor or Shelter details */}
        {selectedDonation && (
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 bg-white rounded-xl border border-neutral-200 p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={selectedDonation.image}
                alt={selectedDonation.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-900">{selectedDonation.donor.name}</span>
                  <span>·</span>
                  <span>{selectedDonation.donor.neighborhood}</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{selectedDonation.donor.distanceMiles} mi away</span>
                </div>
                <h4 className="font-display font-bold text-sm text-neutral-900 line-clamp-1 mt-0.5">
                  {selectedDonation.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-neutral-600 mt-1">
                  <span className="font-mono tabular-nums">~{selectedDonation.servingsEquivalent} meals</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">
                    {formatStorage(selectedDonation.storageRequirement).label}
                  </span>
                  <span>·</span>
                  <span className="tabular-nums font-medium text-amber-700">
                    {getTimeRemaining(selectedDonation.expiryDeadline).text}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectDonation(selectedDonation)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer text-center"
              >
                Inspect & Claim Listing
              </button>
            </div>
          </div>
        )}

        {selectedShelter && !selectedDonation && (
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 bg-white rounded-xl border border-neutral-200 p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xl shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-neutral-500 font-medium">Verified Partner Shelter</div>
                <h4 className="font-display font-bold text-sm text-neutral-900">
                  {selectedShelter.name}
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {selectedShelter.address} · Serving {selectedShelter.capacityMealsPerDay} meals/day
                </p>
              </div>
            </div>

            <div className="text-xs text-neutral-600 shrink-0 font-mono">
              Phone: {selectedShelter.contactPhone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
