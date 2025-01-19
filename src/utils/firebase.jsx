import axios from 'axios';

// Firebase configuration
const FIREBASE_CONFIG = {
  baseURL: 'https://emergency-sos-60679-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Firebase utility class
class FirebaseService {
  // Get all emergencies
  static async getAllEmergencies() {
    try {
      const response = await axios.get(`${FIREBASE_CONFIG.baseURL}/emergencies.json`);
      return response.data || {};
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      throw error;
    }
  }

  // Get specific type of emergencies (ambulance, police, firebrigade)
  static async getEmergenciesByType(type) {
    try {
      const response = await axios.get(`${FIREBASE_CONFIG.baseURL}/emergencies.json`);
      const allEmergencies = response.data || {};
      
      // Filter emergencies by type
      return Object.entries(allEmergencies).reduce((filtered, [id, data]) => {
        if (data.emergencyType === type) {
          filtered[id] = data;
        }
        return filtered;
      }, {});
    } catch (error) {
      console.error('Error fetching emergencies by type:', error);
      throw error;
    }
  }

  // Create a new emergency
  static async createEmergency(emergencyData) {
    try {
      const response = await axios.post(
        `${FIREBASE_CONFIG.baseURL}/emergencies.json`,
        {
          ...emergencyData,
          timestamp: new Date().toISOString(),
          status: 'active'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating emergency:', error);
      throw error;
    }
  }

  // Update an emergency
  static async updateEmergency(emergencyId, updateData) {
    try {
      const response = await axios.patch(
        `${FIREBASE_CONFIG.baseURL}/emergencies/${emergencyId}.json`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating emergency:', error);
      throw error;
    }
  }

  // Delete an emergency
  static async deleteEmergency(emergencyId) {
    try {
      await axios.delete(
        `${FIREBASE_CONFIG.baseURL}/emergencies/${emergencyId}.json`
      );
      return true;
    } catch (error) {
      console.error('Error deleting emergency:', error);
      throw error;
    }
  }

  // Example emergency data structure
  static emergencyTemplate = {
    emergencyType: '', // 'ambulance', 'police', or 'firebrigade'
    location: {
      address: '',
      latitude: null,
      longitude: null
    },
    contactInfo: {
      name: '',
      phone: ''
    },
    additionalDetails: '',
    timestamp: '',
    status: 'active' // or 'resolved'
  };

  // Helper method to create a properly structured emergency object
  static createEmergencyObject(type, location, contact, details) {
    return {
      emergencyType: type,
      location: {
        address: location.address || '',
        latitude: location.latitude || null,
        longitude: location.longitude || null
      },
      contactInfo: {
        name: contact.name || '',
        phone: contact.phone || ''
      },
      additionalDetails: details || '',
      timestamp: new Date().toISOString(),
      status: 'active'
    };
  }

  // Helper method to validate emergency data
  static validateEmergencyData(data) {
    const required = ['emergencyType', 'location', 'contactInfo'];
    const validTypes = ['ambulance', 'police', 'firebrigade'];

    if (!validTypes.includes(data.emergencyType)) {
      throw new Error('Invalid emergency type');
    }

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!data.location.address) {
      throw new Error('Location address is required');
    }

    if (!data.contactInfo.name || !data.contactInfo.phone) {
      throw new Error('Contact name and phone are required');
    }

    return true;
  }
}

// Usage examples:
/*
// Create a new emergency
const newEmergency = FirebaseService.createEmergencyObject(
  'ambulance',
  { address: '123 Main St', latitude: 12.34, longitude: 56.78 },
  { name: 'John Doe', phone: '123-456-7890' },
  'Patient experiencing chest pain'
);

// Save to Firebase
await FirebaseService.createEmergency(newEmergency);

// Get all ambulance emergencies
const ambulanceEmergencies = await FirebaseService.getEmergenciesByType('ambulance');

// Delete an emergency
await FirebaseService.deleteEmergency('emergencyId');
*/

export default FirebaseService;