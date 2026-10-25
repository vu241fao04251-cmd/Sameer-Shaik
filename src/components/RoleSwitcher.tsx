import React from 'react';
import { UserRole } from '../types/foodDonation';
import { Store, UtensilsCrossed, Bike, Globe, CheckCircle2 } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  availableCount: number;
  openMissionsCount: number;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  availableCount,
  openMissionsCount,
}) => {
  const roles: {
    id: UserRole;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'recipient',
      label: 'Recipient Shelter',
      sublabel: 'Hope Harbor Community Kitchen',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      badge: `${availableCount} Available`,
    },
    {
      id: 'donor',
      label: 'Food Donor',
      sublabel: 'Olive & Hearth Bistro & Market',
      icon: <Store className="w-4 h-4" />,
    },
    {
      id: 'volunteer',
      label: 'Volunteer Courier',
      sublabel: 'Alex Rivera (Cargo Bike)',
      icon: <Bike className="w-4 h-4" />,
      badge: `${openMissionsCount} Runs Open`,
    },
    {
      id: 'public_explorer',
      label: 'Impact Explorer',
      sublabel: 'Public Transparency View',
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-neutral-900 text-white border-b border-neutral-800 text-xs py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium uppercase tracking-wider text-[10px]">
            Active Persona:
          </span>
          <span className="text-neutral-200 font-medium">
            {roles.find((r) => r.id === currentRole)?.sublabel}
          </span>
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-400 hidden sm:inline">
            Switch role to test full lifecycle
          </span>
        </div>

        {/* Segmented role toggle buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map((role) => {
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onRoleChange(role.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {role.icon}
                <span>{role.label}</span>
                {role.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    {role.badge}
                  </span>
                )}
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
