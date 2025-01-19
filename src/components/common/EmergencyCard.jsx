import React from 'react';

const EmergencyCard = ({ data, id, onResolve }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 transform transition-all hover:scale-[1.02] border-l-4 border-blue-500">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 font-medium">{data.location.address}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-gray-600">
              <span className="font-medium">{data.contactInfo.name}</span>
              <span className="mx-2">•</span>
              <span className="text-blue-600">{data.contactInfo.phone}</span>
            </p>
          </div>

          {data.additionalDetails && (
            <div className="flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">{data.additionalDetails}</p>
            </div>
          )}
        </div>

        <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
          <button
            onClick={() => onResolve(id)}
            className="w-full md:w-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Resolve</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;