"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { initializeApp } from 'firebase/app';

const STATUS_COLORS = {
  pending: 'bg-yellow-500',
  inProgress: 'bg-blue-500',
  resolved: 'bg-green-500',
  rejected: 'bg-red-500'
};

const EmergencyDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Calculate time elapsed since alert
  const getTimeElapsed = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  };

  // Update alert status
  const handleStatusUpdate = async (alertId, newStatus) => {
    try {
      const db = getDatabase();
      await update(ref(db, `sos-alerts/${alertId}`), {
        status: newStatus,
        statusUpdatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // Fetch alerts from Firebase
  useEffect(() => {

     const app = initializeApp({
            databaseURL: "https://emergenc-671d8-default-rtdb.firebaseio.com/"
          });
          const db = getDatabase(app);
    const alertsRef = ref(db, 'sos-alerts');

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alertsArray = Object.entries(data).map(([id, alert]) => ({
          id,
          ...alert,
        }));
        
        // Sort by timestamp (most recent first)
        alertsArray.sort((a, b) => b.timestamp - a.timestamp);
        setAlerts(alertsArray);
        
        // Center map on most recent alert if it exists
        if (alertsArray.length > 0) {
          const mostRecent = alertsArray[0];
          setMapCenter({
            lat: mostRecent.location.latitude,
            lng: mostRecent.location.longitude
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAlerts = alerts.filter(alert => 
    filterStatus === 'all' ? true : alert.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Emergency Response Dashboard</h1>
        
        {/* Status Filter */}
        <div className="mb-6">
          <label className="text-gray-700 mr-3">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Alerts</option>
            <option value="pending">Pending</option>
            <option value="inProgress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Google Maps */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Emergency Locations</h2>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={5}
              >
                {filteredAlerts.map((alert) => (
                  <Marker
                    key={alert.id}
                    position={{
                      lat: alert.location.latitude,
                      lng: alert.location.longitude
                    }}
                    onClick={() => setSelectedAlert(alert)}
                    icon={{
                      url: `http://maps.google.com/mapfiles/ms/icons/${
                        alert.status === 'resolved' ? 'green' :
                        alert.status === 'inProgress' ? 'yellow' :
                        alert.status === 'rejected' ? 'red' : 'blue'
                      }-dot.png`
                    }}
                  />
                ))}

                {selectedAlert && (
                  <InfoWindow
                    position={{
                      lat: selectedAlert.location.latitude,
                      lng: selectedAlert.location.longitude
                    }}
                    onCloseClick={() => setSelectedAlert(null)}
                  >
                    <div className="max-w-xs">
                      <h3 className="font-semibold">{selectedAlert.emergencyType || 'Emergency Alert'}</h3>
                      <p className="text-sm">{selectedAlert.description || 'Instant SOS'}</p>
                      <p className="text-sm mt-1">Status: {selectedAlert.status}</p>
                      <p className="text-sm">{formatDate(selectedAlert.timestamp)}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Alerts List */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Emergency Alerts</h2>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No alerts found</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedAlert(alert);
                      setMapCenter({
                        lat: alert.location.latitude,
                        lng: alert.location.longitude
                      });
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {alert.emergencyType || 'Instant SOS'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {alert.userName} • {getTimeElapsed(alert.timestamp)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs text-white ${STATUS_COLORS[alert.status || 'pending']}`}>
                        {alert.status || 'pending'}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">
                      {alert.description || 'Emergency assistance needed'}
                    </p>
                    
                    <div className="text-sm text-gray-600">
                      <p>📍 {alert.location.address}</p>
                      <p>📞 {alert.contactNumber || alert.phone_number || 'No contact provided'}</p>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {alert.status !== 'inProgress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(alert.id, 'inProgress');
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Start Response
                        </button>
                      )}
                      {alert.status !== 'resolved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(alert.id, 'resolved');
                          }}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {alert.status !== 'rejected' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(alert.id, 'rejected');
                          }}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;