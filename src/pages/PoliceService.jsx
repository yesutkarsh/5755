import React from 'react';
import useEmergencies from '../hooks/useEmergencies';
import EmergencyCard from '../components/common/EmergencyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NotificationBell from '../components/common/NotificationBell';

const PoliceService = () => {
  const {
    emergencies,
    loading,
    handleResolve,
    newEmergencyAlert,
    clearAlert
  } = useEmergencies('police');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Police Emergency Response
            </h1>

            <NotificationBell 
              isActive={newEmergencyAlert} 
              onClick={clearAlert}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : Object.keys(emergencies).length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(emergencies).map(([id, data]) => (
              <EmergencyCard
                key={id}
                id={id}
                data={data}
                onResolve={handleResolve}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
              No active emergencies
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              The situation is under control.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PoliceService;
