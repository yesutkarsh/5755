import React, { useState } from 'react';

const EmergencyForm = () => {
  const [formData, setFormData] = useState({
    emergencyType: "",
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: "Middle of XYZ road, near ABC landmark",
    },
    timestamp: new Date().toISOString(),
    contactInfo: {
      name: "John Doe",
      phone: "+919876543210",
    },
    additionalDetails: "",
    deviceInfo: {
      deviceId: "abc123xyz",
      deviceType: "smartphone",
      os: "Android 12",
    },
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyTypes = [
    {
      id: 'ambulance',
      label: 'Medical Emergency',
      description: 'For medical assistance and ambulance services'
    },
    {
      id: 'police',
      label: 'Police Emergency',
      description: 'For immediate police assistance'
    },
    {
      id: 'firebrigade',
      label: 'Fire Emergency',
      description: 'For fire-related emergencies'
    }
  ];

  const handleEmergencyTypeChange = (type) => {
    setFormData({ ...formData, emergencyType: type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://emergency-sos-60679-default-rtdb.asia-southeast1.firebasedatabase.app/emergencies.json",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      setSuccessMessage("Emergency request sent successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Failed to send emergency request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency SOS</h1>
          <p className="text-gray-600">Select emergency type and provide details for immediate assistance</p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Emergency Type Selection */}
            <div className="grid md:grid-cols-3 gap-4">
              {emergencyTypes.map(({ id, label, description }) => (
                <div
                  key={id}
                  onClick={() => handleEmergencyTypeChange(id)}
                  className={`cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 ${
                    formData.emergencyType === id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <h3 className={`font-semibold mb-1 ${
                      formData.emergencyType === id ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {label}
                    </h3>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Details Input */}
            <div className="space-y-2">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                Emergency Details
              </label>
              <textarea
                id="details"
                name="additionalDetails"
                placeholder="Please provide specific details about the emergency situation..."
                value={formData.additionalDetails}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[120px] text-gray-900"
                rows={4}
              />
            </div>

            {/* Location Info Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Location</h4>
              <p className="text-sm text-gray-600">{formData.location.address}</p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={!formData.emergencyType || isSubmitting}
                className="w-full md:w-2/3 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Emergency Alert...' : 'Send Emergency Alert'}
              </button>
              
              {successMessage && (
                <div className="mt-4 w-full text-center p-4 bg-green-50 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Your device information and precise location will be shared with emergency services</p>
          <p className="mt-2">Emergency Contact: 112</p>
        </footer>
      </div>
    </div>
  );
};

export default EmergencyForm;