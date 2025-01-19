import { useState, useEffect } from 'react';
import axios from 'axios';

const useEmergencies = (serviceType) => {
  const [emergencies, setEmergencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [newEmergencyAlert, setNewEmergencyAlert] = useState(false);
  
  const FIREBASE_URL = "https://emergency-sos-60679-default-rtdb.asia-southeast1.firebasedatabase.app/emergencies.json";

  useEffect(() => {
    let previousCount = 0;
    
    const fetchEmergencies = async () => {
      try {
        const response = await axios.get(FIREBASE_URL);
        const filteredEmergencies = {};
        
        if (response.data) {
          // Filter emergencies based on service type
          Object.entries(response.data).forEach(([id, data]) => {
            if (data.emergencyType === serviceType) {
              filteredEmergencies[id] = data;
            }
          });

          // Check for new emergencies
          const currentCount = Object.keys(filteredEmergencies).length;
          if (previousCount !== 0 && currentCount > previousCount) {
            setNewEmergencyAlert(true);
            // Play notification sound
            new Audio('/notification-sound.mp3').play().catch(e => console.log('Audio play failed:', e));
          }
          previousCount = currentCount;
        }
        
        setEmergencies(filteredEmergencies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching emergencies:", error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchEmergencies();

    // Set up polling interval for real-time updates
    const intervalId = setInterval(fetchEmergencies, 5000); // Poll every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [serviceType]);

  // Handle resolving (deleting) emergencies
  const handleResolve = async (id) => {
    try {
      await axios.delete(
        `https://emergency-sos-60679-default-rtdb.asia-southeast1.firebasedatabase.app/emergencies/${id}.json`
      );
      setEmergencies((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Error deleting emergency:", error);
    }
  };

  return {
    emergencies,
    loading,
    handleResolve,
    newEmergencyAlert,
    clearAlert: () => setNewEmergencyAlert(false)
  };
};

export default useEmergencies;