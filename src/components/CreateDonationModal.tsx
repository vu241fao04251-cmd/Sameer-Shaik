import React, { useState } from 'react';
import { DonationListing, FoodCategory, StorageRequirement } from '../types/foodDonation';
import { ASSETS } from '../data/mockFoodData';
import { X, Sparkles, ShieldCheck, Info } from 'lucide-react';

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDonation: DonationListing) => void;
}

export const CreateDonationModal: React.FC<CreateDonationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FoodCategory>('prepared_meals');
  const [quantity, setQuantity] = useState(25);
  const [unit, setUnit] = useState('boxed meals');
  const [servingsEquivalent, setServingsEquivalent] = useState(25);
  const [weightKg, setWeightKg] = useState(12.5);
  const [estimatedValueUSD, setEstimatedValueUSD] = useState(350);
  const [description, setDescription] = useState('');
  const [storageRequirement, setStorageRequirement] = useState<StorageRequirement>('refrigerated');
  const [pickupWindowStart, setPickupWindowStart] = useState('Today, 3:00 PM');
  const [pickupWindowEnd, setPickupWindowEnd] = useState('Today, 6:00 PM');
  const [expiryHours, setExpiryHours] = useState(4);
  const [allergens, setAllergens] = useState<string[]>(['dairy']);
  const [dietaryTags, setDietaryTags] = useState<string[]>(['vegetarian', 'gluten_free']);
  const [packagingType, setPackagingType] = useState('Sealed compostable food containers');
  const [safetyAttestation, setSafetyAttestation] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(ASSETS.prepared);

  const allergenOptions = ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'sesame'];
  const dietaryOptions = ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free', 'high_protein'];

  const toggleAllergen = (item: string) => {
    setAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const toggleDietary = (item: string) => {
    setDietaryTags((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleCategoryChange = (cat: FoodCategory) => {
    setCategory(cat);
    if (cat === 'bakery') {
      setSelectedImage(ASSETS.bakery);
      setUnit('loaves & boxes');
      setStorageRequirement('ambient');
    } else if (cat === 'fresh_produce') {
      setSelectedImage(ASSETS.produce);
      setUnit('wooden crates');
      setStorageRequirement('ambient');
    } else if (cat === 'prepared_meals') {
      setSelectedImage(ASSETS.prepared);
      setUnit('boxed meals');
      setStorageRequirement('refrigerated');
    } else {
      setSelectedImage(ASSETS.hero);
      setUnit('cases');
      setStorageRequirement('ambient');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!safetyAttestation) {
      alert('Please confirm the Good Samaritan Food Safety attestation.');
      return;
    }

    const expiryDate = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

    const newDonation: DonationListing = {
      id: `don-${Date.now().toString().slice(-6)}`,
      title: title || 'Fresh Surplus Food Lot',
      donor: {
        id: 'donor-101',
        name: 'Olive & Hearth Kitchen',
        type: 'restaurant',
        address: '428 Market Street, Suite 100',
        neighborhood: 'Downtown Financial District',
        contactPhone: '(415) 890-3412',
        contactEmail: 'donations@oliveandhearth.com',
        verified: true,
        distanceMiles: 0.8,
        lat: 37.7892,
        lng: -122.4014,
      },
      category,
      quantity,
      unit,
      servingsEquivalent,
      weightKg,
      estimatedValueUSD,
      description: description || 'High-quality freshly prepared surplus food packaged ready for redistribution.',
      storageRequirement,
      allergens,
      dietaryTags,
      packagingType,
      preparedAt: new Date().toISOString(),
      pickupWindowStart,
      pickupWindowEnd,
      expiryDeadline: expiryDate,
      status: 'available',
      image: selectedImage,
      safetyChecklistPassed: true,
      handlingInstructions: 'Prepared and held according to local commercial health safety guidelines.',
      createdAt: new Date().toISOString(),
    };

    onSubmit(newDonation);
    onClose();
  };

  // Environmental and impact calculations
  const co2AvoidedKg = (weightKg * 2.5).toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl border border-neutral-200 my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div>
            <h2 className="font-display text-lg font-bold text-neutral-900">
              List Surplus Food for Immediate Rescue
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Broadcasted immediately to verified shelters, food pantries, and community kitchens.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Food Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 30 Boxed Roasted Vegetable & Chicken Grain Bowls"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Category & Image Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as FoodCategory)}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="prepared_meals">Prepared Meals & Catering</option>
                <option value="bakery">Bakery & Grains</option>
                <option value="fresh_produce">Fresh Produce & Greens</option>
                <option value="dairy_eggs">Dairy & Eggs</option>
                <option value="pantry_staples">Pantry Staples & Dry Goods</option>
                <option value="beverages">Beverages & Juices</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Storage Requirement *
              </label>
              <select
                value={storageRequirement}
                onChange={(e) => setStorageRequirement(e.target.value as StorageRequirement)}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="refrigerated">Refrigerated (34°F - 39°F)</option>
                <option value="hot_holding">Hot Holding (≥ 140°F)</option>
                <option value="ambient">Ambient / Room Temperature</option>
                <option value="frozen">Frozen (≤ 0°F)</option>
              </select>
            </div>
          </div>

          {/* Quantities & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setQuantity(val);
                  setServingsEquivalent(val);
                  setWeightKg(Math.round(val * 0.5 * 10) / 10);
                }}
                className="w-full bg-white border border-neutral-300 rounded-md px-2.5 py-1.5 font-mono text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Unit Description</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="meals, boxes, crates"
                className="w-full bg-white border border-neutral-300 rounded-md px-2.5 py-1.5 text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Est. Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-white border border-neutral-300 rounded-md px-2.5 py-1.5 font-mono text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Fair Market Value ($)</label>
              <input
                type="number"
                min="0"
                value={estimatedValueUSD}
                onChange={(e) => setEstimatedValueUSD(Number(e.target.value))}
                className="w-full bg-white border border-neutral-300 rounded-md px-2.5 py-1.5 font-mono text-neutral-900"
              />
            </div>
          </div>

          {/* Description & Packaging */}
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Description & Ingredients
            </label>
            <textarea
              rows={2}
              placeholder="Describe dishes, ingredients, preparation specifics, and container counts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Pickup Window & Expiry Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Pickup Start
              </label>
              <input
                type="text"
                value={pickupWindowStart}
                onChange={(e) => setPickupWindowStart(e.target.value)}
                placeholder="e.g. Today, 2:00 PM"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Pickup Cut-off
              </label>
              <input
                type="text"
                value={pickupWindowEnd}
                onChange={(e) => setPickupWindowEnd(e.target.value)}
                placeholder="e.g. Today, 5:30 PM"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Safe Shelf-Life Hours
              </label>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(Number(e.target.value))}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-900"
              >
                <option value={2}>2 Hours (Immediate Hot Foods)</option>
                <option value={4}>4 Hours (Cooked Refrigerated)</option>
                <option value={8}>8 Hours (Bakery / Day-of)</option>
                <option value={24}>24 Hours (Produce / Bread)</option>
                <option value={72}>72 Hours (Chilled Dairy)</option>
                <option value={168}>7 Days (Pantry / Canned)</option>
              </select>
            </div>
          </div>

          {/* Dietary Tags & Allergens Selection */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5">
                Dietary Attributes:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {dietaryOptions.map((tag) => {
                  const active = dietaryTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleDietary(tag)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize cursor-pointer transition-colors ${
                        active
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {tag.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5">
                Contains Allergens:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allergenOptions.map((allergen) => {
                  const active = allergens.includes(allergen);
                  return (
                    <button
                      type="button"
                      key={allergen}
                      onClick={() => toggleAllergen(allergen)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize cursor-pointer transition-colors ${
                        active
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-transparent'
                      }`}
                    >
                      {allergen}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real-time Environmental Impact Estimate Callout */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-emerald-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-semibold">Projected Rescue Impact: </span>
                <span>Feeds ~{servingsEquivalent} individuals · Diverts {weightKg}kg from landfill</span>
              </div>
            </div>
            <span className="text-[11px] font-mono tabular-nums text-emerald-800 font-medium">
              ~{co2AvoidedKg} kg CO₂e saved
            </span>
          </div>

          {/* Legal Safety Attestation */}
          <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={safetyAttestation}
                onChange={(e) => setSafetyAttestation(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-neutral-700 text-[11px] leading-relaxed">
                <strong>Good Samaritan Safety Attestation:</strong> I certify that this surplus food was prepared and held under sanitary conditions in compliance with state & local health department requirements. Pursuant to the <em>Bill Emerson Good Samaritan Food Donation Act (42 U.S.C. § 1791)</em>, this food is donated in good faith for non-profit distribution.
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-neutral-600 hover:text-neutral-900 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Publish Donation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
