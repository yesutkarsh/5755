import React from 'react';
import useEmergencies from '../hooks/useEmergencies';
import EmergencyCard from '../components/common/EmergencyCard';

const AmbulanceService = () => {
  const {
    emergencies,
    loading,
    handleResolve,
    newEmergencyAlert,
    clearAlert
  } = useEmergencies('ambulance');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Ambulance Service Dashboard
            </h1>

            {/* Notification Bell */}
            {newEmergencyAlert && (
              <div
                className="animate-bounce cursor-pointer relative"
                onClick={clearAlert}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-white border"></span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-red-500"></div>
          </div>
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
              All current emergencies have been resolved.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AmbulanceService;
