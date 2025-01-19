import React from 'react';

const NotificationBell = ({ isActive, onClick }) => {
  return (
    <div 
      className={`cursor-pointer ${isActive ? 'animate-bounce' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-8 w-8 ${isActive ? 'text-red-500' : 'text-gray-500'}`}
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
        {isActive && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;