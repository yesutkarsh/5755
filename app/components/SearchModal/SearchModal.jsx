"use client";
import React, { useState, useMemo } from 'react';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const allRecommendations = [
    {
      category: 'Food & Dining',
      items: [
        { icon: '🍽️', title: 'Restaurants Nearby', keywords: ['food', 'eat', 'dining', 'restaurant'] },
        { icon: '🛵', title: 'Food Delivery', keywords: ['delivery', 'food', 'order'] },
        { icon: '☕', title: 'Cafes & Bakeries', keywords: ['coffee', 'cafe', 'bakery', 'bread', 'pastry'] }
      ]
    },
    {
      category: 'Entertainment',
      items: [
        { icon: '🎬', title: 'Movies & Shows', keywords: ['movie', 'cinema', 'theatre', 'show'] },
        { icon: '🎮', title: 'Gaming Centers', keywords: ['game', 'gaming', 'play'] },
        { icon: '🎨', title: 'Art & Culture', keywords: ['art', 'museum', 'culture', 'exhibition'] }
      ]
    },
    {
      category: 'Services',
      items: [
        { icon: '🏥', title: 'Healthcare', keywords: ['health', 'doctor', 'medical', 'hospital'] },
        { icon: '🛒', title: 'Shopping', keywords: ['shop', 'mall', 'store', 'retail'] },
        { icon: '🚗', title: 'Transportation', keywords: ['transport', 'taxi', 'ride', 'travel'] }
      ]
    }
  ];

  // Filter recommendations based on search query
  const filteredRecommendations = useMemo(() => {
    if (!searchQuery.trim()) return allRecommendations;

    const query = searchQuery.toLowerCase().trim();
    
    return allRecommendations.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.keywords.some(keyword => keyword.includes(query))
      )
    })).filter(section => section.items.length > 0);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for food, entertainment, services..."
              className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  {section.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 group"
                    >
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <span className="text-gray-700 group-hover:text-gray-900">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No matches found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try searching for something else</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
              Nearby Places
            </button>
            <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
              Top Rated
            </button>
            <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
              Open Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;