"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setLocation } from '@/utils/slice/userSlice';
import { initializeApp } from 'firebase/app';

const SOSComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    description: '',
    contactNumber: '',
    emergencyType: 'medical'
  });

  // Get user and location from Redux store
  const userFromRedux = useSelector((state) => state.user);
  
  // Move getCurrentLocation to a useCallback hook
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      const successCallback = (position) => {
        // Update Redux with location
        dispatch(setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        resolve(position);
      };

      const errorCallback = (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
        }
        reject(new Error(errorMessage));
      };

      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, [dispatch]);

  // Move getAddressFromCoords to a useCallback hook
  const getAddressFromCoords = useCallback(async (coords) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
      );
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      return data.display_name || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not available';
    }
  }, []);

  // Fetch user data if not in Redux
  useEffect(() => {
    const fetchUser = async () => {
      if (!userFromRedux?.id) {
        try {
          const response = await fetch('/api/GetUser');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const fetchedUser = await response.json();
          dispatch(setUser(fetchedUser));
          setUserData(fetchedUser);
        } catch (error) {
          console.error('Error fetching user:', error);
          setUserData(null);
          setError('Failed to fetch user data. Please try again.');
        }
      } else {
        setUserData(userFromRedux);
      }
    };

    fetchUser();
  }, [dispatch, userFromRedux]);

  // Get the effective user data (either from Redux or API)
  const getEffectiveUser = useCallback(() => {
    return {
      id: userData?.id || userFromRedux?.id || 'anonymous',
      given_name: userData?.given_name || userFromRedux?.given_name || 'Anonymous',
      email: userData?.email || userFromRedux?.email || 'anonymous',
      phone_number: userData?.phone_number || userFromRedux?.phone_number || ''
    };
  }, [userData, userFromRedux]);

  const handleInstantSOS = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user data is available
      const effectiveUser = getEffectiveUser();
      if (effectiveUser.id === 'anonymous') {
        throw new Error('User data is required. Please sign in.');
      }

      // Get location
      const position = await getCurrentLocation();
      const address = await getAddressFromCoords(position.coords);
      
      const sosData = {
        timestamp: Date.now(),
        type: 'instant',
        userId: effectiveUser.id,
        userName: effectiveUser.given_name,
        email: effectiveUser.email,
        phone_number: effectiveUser.phone_number,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: address
        },
        status: 'pending'
      };

      // Initialize Firebase and send data

      // Initialize Firebase with minimal config since rules are public
      const app = initializeApp({
        databaseURL: "https://emergenc-671d8-default-rtdb.firebaseio.com/"
      });
      const db = getDatabase(app);
      await push(ref(db, 'sos-alerts'), sosData);
      
      setIsOpen(false);
      alert('Emergency alert sent! Help is on the way.');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to send alert. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocation, getAddressFromCoords, getEffectiveUser]);

  const handleDetailedSOS = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.description.trim() || !formData.contactNumber.trim()) {
        throw new Error('Please fill in all required fields.');
      }

      // Check if user data is available
      const effectiveUser = getEffectiveUser();
      if (effectiveUser.id === 'anonymous') {
        throw new Error('User data is required. Please sign in.');
      }

      // Get location
      const position = await getCurrentLocation();
      const address = await getAddressFromCoords(position.coords);
      
      const sosData = {
        timestamp: Date.now(),
        type: 'detailed',
        userId: effectiveUser.id,
        userName: effectiveUser.given_name,
        email: effectiveUser.email,
        phone_number: effectiveUser.phone_number,
        description: formData.description.trim(),
        emergencyType: formData.emergencyType,
        contactNumber: formData.contactNumber.trim(),
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: address
        },
        status: 'pending'
      };

      // Initialize Firebase and send data
      const db = getDatabase();
      await push(ref(db, 'sos-alerts'), sosData);
      
      setIsOpen(false);
      setShowForm(false);
      setFormData({
        description: '',
        contactNumber: '',
        emergencyType: 'medical'
      });
      alert('Emergency alert sent! Help is on the way.');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to send alert. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, getCurrentLocation, getAddressFromCoords, getEffectiveUser]);

  // Rest of your JSX remains the same...
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main SOS Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 h-16 bg-red-600 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-all duration-300 animate-pulse"
      >
        <i className="ri-alarm-warning-fill text-3xl text-white"></i>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {!showForm ? (
              // Initial Options
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Emergency Alert</h2>
                <p className="text-center text-gray-600">Choose your emergency type</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all"
                  >
                    <i className="ri-file-list-3-line"></i>
                    <span>Detailed Emergency Report</span>
                  </button>
                  <button
                    onClick={handleInstantSOS}
                    disabled={loading}
                    className="w-full py-3 bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-all disabled:bg-red-400"
                  >
                    <i className="ri-alarm-warning-fill"></i>
                    <span>{loading ? 'Sending...' : 'Instant SOS'}</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setError(null);
                  }}
                  className="w-full py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // Detailed Form
              <form onSubmit={handleDetailedSOS} className="space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Emergency Details</h2>
                
                <div className="space-y-2">
                  <label className="block text-gray-700">Emergency Type</label>
                  <select
                    value={formData.emergencyType}
                    onChange={(e) => setFormData({...formData, emergencyType: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="medical">Medical Emergency</option>
                    <option value="fire">Fire Emergency</option>
                    <option value="police">Police Emergency</option>
                    <option value="accident">Accident</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Briefly describe your emergency..."
                    className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    placeholder="Emergency contact number"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-all disabled:bg-red-400"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <i className="ri-send-plane-fill"></i>
                        <span>Send Alert</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setError(null);
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSComponent;