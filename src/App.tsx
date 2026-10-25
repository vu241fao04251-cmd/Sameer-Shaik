/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  DonationListing,
  RecipientShelter,
  VolunteerMission,
  PlatformMetrics,
  UserRole,
  FoodCategory,
} from './types/foodDonation';
import {
  INITIAL_DONATIONS,
  RECIPIENT_SHELTERS,
  INITIAL_MISSIONS,
  INITIAL_METRICS,
} from './data/mockFoodData';
import { Header } from './components/Header';
import { RoleSwitcher } from './components/RoleSwitcher';
import { DonationCard } from './components/DonationCard';
import { DonationDetailModal } from './components/DonationDetailModal';
import { CreateDonationModal } from './components/CreateDonationModal';
import { InteractiveRescueMap } from './components/InteractiveRescueMap';
import { VolunteerMissions } from './components/VolunteerMissions';
import { ImpactDashboard } from './components/ImpactDashboard';
import { FoodSafetyGuide } from './components/FoodSafetyGuide';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  // Persistence via localStorage with fallback to initial data
  const [donations, setDonations] = useState<DonationListing[]>(() => {
    try {
      const saved = localStorage.getItem('nourishbridge_donations');
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [missions, setMissions] = useState<VolunteerMission[]>(() => {
    try {
      const saved = localStorage.getItem('nourishbridge_missions');
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [metrics, setMetrics] = useState<PlatformMetrics>(() => {
    try {
      const saved = localStorage.getItem('nourishbridge_metrics');
      return saved ? JSON.parse(saved) : INITIAL_METRICS;
    } catch {
      return INITIAL_METRICS;
    }
  });

  // Active navigation state
  const [activeTab, setActiveTab] = useState<'browse' | 'map' | 'missions' | 'impact' | 'safety'>('browse');
  const [currentRole, setCurrentRole] = useState<UserRole>('recipient');

  // Modals state
  const [selectedDonation, setSelectedDonation] = useState<DonationListing | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('available');
  const [sortBy, setSortBy] = useState<'urgency' | 'distance' | 'servings' | 'newest'>('urgency');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('nourishbridge_donations', JSON.stringify(donations));
    } catch (e) {
      console.error(e);
    }
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem('nourishbridge_missions', JSON.stringify(missions));
    } catch (e) {
      console.error(e);
    }
  }, [missions]);

  useEffect(() => {
    try {
      localStorage.setItem('nourishbridge_metrics', JSON.stringify(metrics));
    } catch (e) {
      console.error(e);
    }
  }, [metrics]);

  // Handle new donation listing created by donor
  const handleCreateDonation = (newDonation: DonationListing) => {
    setDonations((prev) => [newDonation, ...prev]);

    // Automatically update platform metrics
    setMetrics((prev) => ({
      ...prev,
      totalMealsRescued: prev.totalMealsRescued + newDonation.servingsEquivalent,
      totalKgDiverted: prev.totalKgDiverted + newDonation.weightKg,
      co2eAvertedKg: prev.co2eAvertedKg + Math.round(newDonation.weightKg * 2.5),
      activeDonorsCount: prev.activeDonorsCount + 1,
    }));

    showToast(`"${newDonation.title}" published! Notified 19 local community pantries.`);
  };

  // Handle food claimed by recipient shelter
  const handleClaimDonation = (
    donationId: string,
    recipientId: string,
    servings: number,
    pickupMethod: 'self_pickup' | 'volunteer_courier'
  ) => {
    const shelter = RECIPIENT_SHELTERS.find((s) => s.id === recipientId) || RECIPIENT_SHELTERS[0];
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    setDonations((prev) =>
      prev.map((d) => {
        if (d.id === donationId) {
          const updated: DonationListing = {
            ...d,
            status: 'reserved',
            claimInfo: {
              recipientId: shelter.id,
              recipientName: shelter.name,
              recipientType: shelter.type,
              claimedAt: new Date().toISOString(),
              claimServings: servings,
              pickupMethod,
              pickupPIN: pin,
              status: 'claimed',
            },
          };
          return updated;
        }
        return d;
      })
    );

    // If volunteer courier requested, automatically create an open Volunteer Mission!
    if (pickupMethod === 'volunteer_courier') {
      const targetDonation = donations.find((d) => d.id === donationId);
      if (targetDonation) {
        const newMission: VolunteerMission = {
          id: `mis-${Date.now().toString().slice(-4)}`,
          donationId: targetDonation.id,
          donationTitle: targetDonation.title,
          foodCategory: targetDonation.category,
          servings,
          weightKg: targetDonation.weightKg,
          donorName: targetDonation.donor.name,
          donorAddress: targetDonation.donor.address,
          recipientName: shelter.name,
          recipientAddress: shelter.address,
          distanceMiles: targetDonation.donor.distanceMiles,
          estimatedDurationMins: Math.round(targetDonation.donor.distanceMiles * 8 + 5),
          pickupDeadline: targetDonation.pickupWindowEnd,
          status: 'open',
          pickupPIN: pin,
        };
        setMissions((prev) => [newMission, ...prev]);
      }
    }

    showToast(`Reservation confirmed for ${shelter.name}! Verification code: #${pin}`);
  };

  // Handle volunteer accepting a mission
  const handleAcceptMission = (missionId: string, volunteerName: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, status: 'accepted', volunteerName: volunteerName || 'Alex Rivera' }
          : m
      )
    );
    showToast(`Mission #${missionId.toUpperCase()} accepted! Route active in your dashboard.`);
  };

  // Handle volunteer updating mission (picked up, delivered)
  const handleUpdateMissionStatus = (
    missionId: string,
    status: 'picked_up' | 'completed',
    tempReading?: string
  ) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status,
            temperatureVerified: tempReading || m.temperatureVerified,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return m;
      })
    );

    if (status === 'completed') {
      // Also update the underlying donation to completed
      const targetMission = missions.find((m) => m.id === missionId);
      if (targetMission) {
        setDonations((prev) =>
          prev.map((d) =>
            d.id === targetMission.donationId ? { ...d, status: 'completed' } : d
          )
        );
      }
      setMetrics((prev) => ({
        ...prev,
        completedMissionsCount: prev.completedMissionsCount + 1,
      }));
      showToast(`Mission completed! Food safely delivered to community shelter.`);
    } else {
      showToast(`Pickup verified! Temperature recorded (${tempReading || '38°F'}). In transit.`);
    }
  };

  // Reset to initial demo data
  const handleResetData = () => {
    setDonations(INITIAL_DONATIONS);
    setMissions(INITIAL_MISSIONS);
    setMetrics(INITIAL_METRICS);
    localStorage.removeItem('nourishbridge_donations');
    localStorage.removeItem('nourishbridge_missions');
    localStorage.removeItem('nourishbridge_metrics');
    showToast('Platform reset to initial sample food rescues.');
  };

  // Filtered & sorted donations
  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      // Search
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dietaryTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Dietary
      const matchesDietary =
        selectedDietary === 'all' || item.dietaryTags.includes(selectedDietary);

      // Status
      const matchesStatus =
        selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesDietary && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'urgency') {
        return new Date(a.expiryDeadline).getTime() - new Date(b.expiryDeadline).getTime();
      }
      if (sortBy === 'distance') {
        return a.donor.distanceMiles - b.donor.distanceMiles;
      }
      if (sortBy === 'servings') {
        return b.servingsEquivalent - a.servingsEquivalent;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [donations, searchQuery, selectedCategory, selectedDietary, selectedStatus, sortBy]);

  const availableCount = donations.filter((d) => d.status === 'available').length;
  const openMissionsCount = missions.filter((m) => m.status === 'open').length;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-neutral-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-neutral-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role Switcher contextual bar */}
      <RoleSwitcher
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        availableCount={availableCount}
        openMissionsCount={openMissionsCount}
      />

      {/* Main Top Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCreateDonation={() => setIsCreateModalOpen(true)}
      />

      {/* Page Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: Available Food Feed */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Hero Banner with authentic food rescue photo */}
            <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white min-h-[220px] sm:min-h-[260px] flex items-center shadow-xs">
              <img
                src="/src/assets/images/hero_food_rescue_1792904568585.jpg"
                alt="Community food rescue kitchen"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                  <span>Direct Surplus Connection</span>
                  <span>·</span>
                  <span>Zero Food In Landfills</span>
                </div>
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                  Rescuing Fresh Surplus Food for Local Shelters
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-xl">
                  Connect commercial restaurants, bakeries, and food producers with local community kitchens in real time. Certified under the federal Good Samaritan Act.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    + Donate Surplus Lot
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="px-4 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-lg transition-colors cursor-pointer"
                  >
                    View Rescue Map ({donations.length} Locations)
                  </button>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by food type, dish, donor restaurant, or dietary tags (e.g. sourdough, halal)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <span className="text-neutral-500 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="urgency">Urgency / Expiry First</option>
                    <option value="distance">Nearest Distance</option>
                    <option value="servings">Highest Servings</option>
                    <option value="newest">Recently Listed</option>
                  </select>
                </div>
              </div>

              {/* Segmented Category Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'prepared_meals', label: 'Prepared Meals' },
                  { id: 'bakery', label: 'Bakery & Bread' },
                  { id: 'fresh_produce', label: 'Produce & Farms' },
                  { id: 'dairy_eggs', label: 'Dairy & Eggs' },
                  { id: 'pantry_staples', label: 'Pantry Staples' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Secondary filters: Dietary & Availability Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Dietary:</span>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {['all', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free'].map((diet) => (
                      <button
                        key={diet}
                        onClick={() => setSelectedDietary(diet)}
                        className={`px-2.5 py-1 rounded-md text-[11px] capitalize cursor-pointer transition-colors ${
                          selectedDietary === diet
                            ? 'bg-emerald-700 text-white font-semibold'
                            : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                        }`}
                      >
                        {diet.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Status:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'available', label: 'Available Only' },
                      { id: 'reserved', label: 'Reserved' },
                      { id: 'completed', label: 'Delivered' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStatus(st.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] cursor-pointer transition-colors ${
                          selectedStatus === st.id
                            ? 'bg-neutral-800 text-white font-medium'
                            : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
              <div>
                Showing <strong className="text-neutral-900">{filteredDonations.length}</strong> surplus food lots
                {selectedCategory !== 'all' && ` in ${selectedCategory.replace('_', ' ')}`}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Real-time dispatch active</span>
              </div>
            </div>

            {/* Grid of Food Donations */}
            {filteredDonations.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-neutral-800 text-base">
                  No matching food donations found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try adjusting your search filters or clear dietary restrictions to view other available surplus lots.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDietary('all');
                    setSelectedStatus('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                    userRole={currentRole}
                    onViewDetails={setSelectedDonation}
                    onQuickClaim={(d) => {
                      setSelectedDonation(d);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Interactive Urban Map */}
        {activeTab === 'map' && (
          <InteractiveRescueMap
            donations={donations}
            shelters={RECIPIENT_SHELTERS}
            missions={missions}
            onSelectDonation={setSelectedDonation}
            onOpenCreateDonation={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* TAB 3: Volunteer Missions */}
        {activeTab === 'missions' && (
          <VolunteerMissions
            missions={missions}
            userRole={currentRole}
            onAcceptMission={handleAcceptMission}
            onUpdateMissionStatus={handleUpdateMissionStatus}
          />
        )}

        {/* TAB 4: Impact Dashboard & Tax Receipts */}
        {activeTab === 'impact' && (
          <ImpactDashboard metrics={metrics} donations={donations} />
        )}

        {/* TAB 5: Food Safety Standards */}
        {activeTab === 'safety' && <FoodSafetyGuide />}
      </main>

      {/* Detail / Claim Modal */}
      <DonationDetailModal
        donation={selectedDonation}
        userRole={currentRole}
        shelters={RECIPIENT_SHELTERS}
        onClose={() => setSelectedDonation(null)}
        onClaim={handleClaimDonation}
      />

      {/* Create Donation Modal */}
      <CreateDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDonation}
      />

      {/* Footer adhering strictly to Anti-Slop (No telemetry, no fake engines) */}
      <footer className="mt-16 border-t border-neutral-200 bg-white text-xs text-neutral-500 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              NB
            </div>
            <span className="font-semibold text-neutral-900">NourishBridge</span>
            <span>·</span>
            <span>Surplus Food Rescue & Community Allocation Network</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('safety')}
              className="hover:text-neutral-900 cursor-pointer"
            >
              Good Samaritan Act Compliance
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className="hover:text-neutral-900 cursor-pointer"
            >
              IRS § 170(e)(3) Receipts
            </button>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              title="Reset to default mock listings"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
