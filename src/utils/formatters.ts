import { FoodCategory, StorageRequirement } from '../types/foodDonation';

export function getTimeRemaining(expiryIso: string): {
  text: string;
  isUrgent: boolean;
  isExpired: boolean;
  minutesLeft: number;
} {
  const target = new Date(expiryIso).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return {
      text: 'Expired',
      isUrgent: true,
      isExpired: true,
      minutesLeft: 0,
    };
  }

  const minutesLeft = Math.floor(diffMs / (1000 * 60));
  const hoursLeft = Math.floor(minutesLeft / 60);
  const remainingMins = minutesLeft % 60;

  if (hoursLeft === 0) {
    return {
      text: `${remainingMins}m left`,
      isUrgent: true,
      isExpired: false,
      minutesLeft,
    };
  }

  if (hoursLeft < 4) {
    return {
      text: `${hoursLeft}h ${remainingMins}m left`,
      isUrgent: true,
      isExpired: false,
      minutesLeft,
    };
  }

  if (hoursLeft < 24) {
    return {
      text: `${hoursLeft}h left`,
      isUrgent: false,
      isExpired: false,
      minutesLeft,
    };
  }

  const daysLeft = Math.floor(hoursLeft / 24);
  return {
    text: `${daysLeft}d left`,
    isUrgent: false,
    isExpired: false,
    minutesLeft,
  };
}

export function formatCategory(cat: FoodCategory): string {
  switch (cat) {
    case 'prepared_meals':
      return 'Prepared Meals';
    case 'fresh_produce':
      return 'Fresh Produce';
    case 'bakery':
      return 'Bakery & Grains';
    case 'dairy_eggs':
      return 'Dairy & Eggs';
    case 'pantry_staples':
      return 'Pantry Staples';
    case 'beverages':
      return 'Beverages';
    default:
      return cat;
  }
}

export function formatStorage(storage: StorageRequirement): { label: string; temp: string } {
  switch (storage) {
    case 'hot_holding':
      return { label: 'Hot Holding', temp: '≥ 140°F (60°C)' };
    case 'refrigerated':
      return { label: 'Refrigerated', temp: '34°F - 39°F' };
    case 'frozen':
      return { label: 'Frozen', temp: '≤ 0°F (-18°C)' };
    case 'ambient':
      return { label: 'Ambient / Dry', temp: 'Room Temp' };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
