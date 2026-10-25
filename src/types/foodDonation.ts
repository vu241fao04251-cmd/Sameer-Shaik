export type FoodCategory =
  | 'prepared_meals'
  | 'fresh_produce'
  | 'bakery'
  | 'dairy_eggs'
  | 'pantry_staples'
  | 'beverages';

export type StorageRequirement = 'ambient' | 'refrigerated' | 'frozen' | 'hot_holding';

export type DonationStatus = 'available' | 'reserved' | 'in_transit' | 'completed' | 'expired';

export type UserRole = 'donor' | 'recipient' | 'volunteer' | 'public_explorer';

export interface DonorInfo {
  id: string;
  name: string;
  type: 'restaurant' | 'bakery' | 'supermarket' | 'farm' | 'catering' | 'hotel';
  address: string;
  neighborhood: string;
  contactPhone: string;
  contactEmail: string;
  verified: boolean;
  distanceMiles: number;
  lat: number;
  lng: number;
}

export interface ClaimInfo {
  recipientId: string;
  recipientName: string;
  recipientType: string;
  claimedAt: string;
  claimServings: number;
  pickupMethod: 'self_pickup' | 'volunteer_courier';
  pickupPIN: string;
  volunteerCourierId?: string;
  volunteerCourierName?: string;
  status: 'claimed' | 'picked_up' | 'delivered';
}

export interface DonationListing {
  id: string;
  title: string;
  donor: DonorInfo;
  category: FoodCategory;
  quantity: number;
  unit: string;
  servingsEquivalent: number;
  weightKg: number;
  estimatedValueUSD: number;
  description: string;
  storageRequirement: StorageRequirement;
  allergens: string[];
  dietaryTags: string[];
  packagingType: string;
  preparedAt: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  expiryDeadline: string; // ISO date string
  status: DonationStatus;
  image: string;
  safetyChecklistPassed: boolean;
  handlingInstructions?: string;
  claimInfo?: ClaimInfo;
  createdAt: string;
}

export interface RecipientShelter {
  id: string;
  name: string;
  type: 'homeless_shelter' | 'soup_kitchen' | 'community_pantry' | 'family_center' | 'youth_shelter';
  address: string;
  neighborhood: string;
  capacityMealsPerDay: number;
  contactPerson: string;
  contactPhone: string;
  acceptsRefrigerated: boolean;
  acceptsPrepared: boolean;
  activeResidentsCount: number;
  lat: number;
  lng: number;
}

export interface VolunteerMission {
  id: string;
  donationId: string;
  donationTitle: string;
  foodCategory: FoodCategory;
  servings: number;
  weightKg: number;
  donorName: string;
  donorAddress: string;
  recipientName: string;
  recipientAddress: string;
  distanceMiles: number;
  estimatedDurationMins: number;
  pickupDeadline: string;
  status: 'open' | 'accepted' | 'picked_up' | 'completed';
  volunteerName?: string;
  pickupPIN: string;
  temperatureVerified?: string;
  completedAt?: string;
}

export interface PlatformMetrics {
  totalMealsRescued: number;
  totalKgDiverted: number;
  co2eAvertedKg: number;
  waterSavedGallons: number;
  activeDonorsCount: number;
  partnerSheltersCount: number;
  completedMissionsCount: number;
}
