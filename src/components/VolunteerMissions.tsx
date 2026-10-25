import React, { useState } from 'react';
import { VolunteerMission, UserRole } from '../types/foodDonation';
import { formatCategory } from '../utils/formatters';
import {
  Bike,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Thermometer,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';

interface VolunteerMissionsProps {
  missions: VolunteerMission[];
  userRole: UserRole;
  onAcceptMission: (missionId: string, volunteerName: string) => void;
  onUpdateMissionStatus: (
    missionId: string,
    status: 'picked_up' | 'completed',
    tempReading?: string
  ) => void;
}

export const VolunteerMissions: React.FC<VolunteerMissionsProps> = ({
  missions,
  userRole,
  onAcceptMission,
  onUpdateMissionStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'open' | 'active' | 'completed'>('open');
  const [pinInputs, setPinInputs] = useState<Record<string, string>>({});
  const [tempInputs, setTempInputs] = useState<Record<string, string>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const openMissions = missions.filter((m) => m.status === 'open');
  const activeMissions = missions.filter(
    (m) => m.status === 'accepted' || m.status === 'picked_up'
  );
  const completedMissions = missions.filter((m) => m.status === 'completed');

  const handleVerifyPickup = (mission: VolunteerMission) => {
    const enteredPin = pinInputs[mission.id]?.trim();
    if (!enteredPin || enteredPin !== mission.pickupPIN) {
      setErrorMessages({
        ...errorMessages,
        [mission.id]: `Invalid PIN. The donor provided code #${mission.pickupPIN}.`,
      });
      return;
    }

    const temp = tempInputs[mission.id] || '38°F Verified';
    onUpdateMissionStatus(mission.id, 'picked_up', temp);
    setErrorMessages({ ...errorMessages, [mission.id]: '' });
  };

  const handleCompleteDelivery = (missionId: string) => {
    onUpdateMissionStatus(missionId, 'completed');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold uppercase tracking-wider mb-1">
            <Bike className="w-4 h-4 text-emerald-700" />
            <span>Community Food Rescue Dispatch Network</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-neutral-900 tracking-tight">
            Volunteer Courier Delivery Runs
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
            Pick up surplus batches from restaurants & grocery bays and transport them securely to neighborhood shelters. Zero vehicle emissions preferred (cargo bikes, walkers, transit).
          </p>
        </div>

        {/* Courier Fast Stats */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <div className="text-neutral-500">Available Runs</div>
            <div className="text-xl font-bold text-neutral-900 font-mono tabular-nums">
              {openMissions.length}
            </div>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div>
            <div className="text-neutral-500">In Transit</div>
            <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums">
              {activeMissions.length}
            </div>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div>
            <div className="text-neutral-500">Delivered Today</div>
            <div className="text-xl font-bold text-neutral-900 font-mono tabular-nums">
              {completedMissions.length + 14}
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('open')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'open'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Open Pickup Runs ({openMissions.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          My Active Missions ({activeMissions.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Completed Rescues ({completedMissions.length})
        </button>
      </div>

      {/* Tab 1: Open Missions */}
      {activeTab === 'open' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {openMissions.length === 0 ? (
            <div className="col-span-full bg-white border border-neutral-200 rounded-2xl p-10 text-center text-neutral-500">
              <PackageCheck className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="font-semibold text-neutral-800">All current runs have been assigned!</p>
              <p className="text-xs text-neutral-500 mt-1">
                New surplus alerts appear in real-time as local restaurants finish shift prep.
              </p>
            </div>
          ) : (
            openMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span className="font-medium text-emerald-700">
                      {formatCategory(mission.foodCategory)}
                    </span>
                    <span className="font-mono tabular-nums text-neutral-700 font-semibold">
                      ~{mission.servings} Meals ({mission.weightKg} kg)
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-neutral-900 text-sm leading-snug">
                    {mission.donationTitle}
                  </h3>

                  {/* Route Steps */}
                  <div className="mt-4 space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                    <div className="relative pl-6 text-xs">
                      <span className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white"></span>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                        Pickup Location
                      </div>
                      <div className="font-semibold text-neutral-900">{mission.donorName}</div>
                      <div className="text-neutral-500 truncate">{mission.donorAddress}</div>
                    </div>

                    <div className="relative pl-6 text-xs">
                      <span className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-sky-600 border-2 border-white"></span>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                        Delivery Destination
                      </div>
                      <div className="font-semibold text-neutral-900">{mission.recipientName}</div>
                      <div className="text-neutral-500 truncate">{mission.recipientAddress}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                    <div className="flex items-center gap-1 font-mono tabular-nums">
                      <Navigation className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{mission.distanceMiles} miles</span>
                      <span>·</span>
                      <span>~{mission.estimatedDurationMins} mins</span>
                    </div>

                    <div className="flex items-center gap-1 text-neutral-500">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{mission.pickupDeadline}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <button
                    onClick={() =>
                      onAcceptMission(
                        mission.id,
                        userRole === 'volunteer'
                          ? 'Alex Rivera (Electric Cargo Bike)'
                          : 'Community Volunteer Courier'
                      )
                    }
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Accept Rescue Run</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Active Missions (Interactive Step-by-Step Execution) */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeMissions.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center text-neutral-500">
              <p className="font-semibold text-neutral-800">You have no runs in progress right now.</p>
              <p className="text-xs text-neutral-500 mt-1">
                Select an open rescue run above to begin dispatch.
              </p>
            </div>
          ) : (
            activeMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white border border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>MISSION IN PROGRESS · ID #{mission.id.toUpperCase()}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-neutral-900">
                      {mission.donationTitle}
                    </h3>
                  </div>

                  <div className="text-xs font-mono text-neutral-600 bg-neutral-100 py-1.5 px-3 rounded-lg self-start sm:self-auto">
                    Assigned: <strong className="text-neutral-900">{mission.volunteerName}</strong>
                  </div>
                </div>

                {/* Step Flow indicator */}
                <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div
                    className={`p-3 rounded-xl border ${
                      mission.status === 'accepted'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-neutral-200 bg-white text-neutral-600'
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">Step 1</div>
                    <div className="text-sm font-bold mt-0.5">En Route to Donor</div>
                    <div className="text-[11px] font-normal text-neutral-500 mt-0.5">
                      {mission.donorName} ({mission.donorAddress})
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      mission.status === 'picked_up'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-neutral-200 bg-white text-neutral-600'
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">Step 2</div>
                    <div className="text-sm font-bold mt-0.5">In Transit to Shelter</div>
                    <div className="text-[11px] font-normal text-neutral-500 mt-0.5">
                      {mission.recipientName} ({mission.recipientAddress})
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-neutral-200 bg-white text-neutral-600">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">Step 3</div>
                    <div className="text-sm font-bold mt-0.5">Shelter Handover</div>
                    <div className="text-[11px] font-normal text-neutral-500 mt-0.5">
                      Confirm temperature & sign-off
                    </div>
                  </div>
                </div>

                {/* Action Area based on active state */}
                {mission.status === 'accepted' && (
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Arrived at Donor? Verify Chain of Custody Handover</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Ask the donor kitchen staff for their 4-digit pickup code and log temperature:
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div>
                        <input
                          type="text"
                          placeholder="Enter 4-digit PIN (e.g. 6482)"
                          value={pinInputs[mission.id] || ''}
                          onChange={(e) =>
                            setPinInputs({ ...pinInputs, [mission.id]: e.target.value })
                          }
                          className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-mono text-neutral-900 w-44"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Temp reading (e.g. 38°F chilled)"
                          value={tempInputs[mission.id] || ''}
                          onChange={(e) =>
                            setTempInputs({ ...tempInputs, [mission.id]: e.target.value })
                          }
                          className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-900 w-48"
                        />
                      </div>

                      <button
                        onClick={() => handleVerifyPickup(mission)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                      >
                        Confirm Donor Handover
                      </button>

                      <span className="text-[11px] text-neutral-400">
                        (Demo PIN: <strong>#{mission.pickupPIN}</strong>)
                      </span>
                    </div>

                    {errorMessages[mission.id] && (
                      <p className="text-xs text-rose-600 font-medium">
                        {errorMessages[mission.id]}
                      </p>
                    )}
                  </div>
                )}

                {mission.status === 'picked_up' && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Food Safely in Transit to {mission.recipientName}</span>
                      </div>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Delivering ~{mission.servings} meals ({mission.weightKg} kg). Destination address: {mission.recipientAddress}.
                      </p>
                    </div>

                    <button
                      onClick={() => handleCompleteDelivery(mission.id)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Confirm Shelter Delivery</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Completed Missions */}
      {activeTab === 'completed' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Rescued Item</th>
                <th className="py-3 px-4 font-semibold">Donor & Shelter</th>
                <th className="py-3 px-4 font-semibold text-right">Servings</th>
                <th className="py-3 px-4 font-semibold text-right">Weight (kg)</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {completedMissions.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-50/50">
                  <td className="py-3.5 px-4 font-medium text-neutral-900">
                    {m.donationTitle}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    <div>{m.donorName}</div>
                    <div className="text-[11px] text-neutral-400">→ {m.recipientName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-900 font-semibold">
                    {m.servings}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-700">
                    {m.weightKg} kg
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-700 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
