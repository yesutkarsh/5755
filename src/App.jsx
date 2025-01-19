import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AmbulanceService from './pages/AmbulanceService';
import PoliceService from './pages/PoliceService';
import FireBrigadeService from './pages/FireBrigadeService';
import EmergencyForm from './components/EmergencyForm';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-800">
                    Emergency Services Portal
                  </h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/ambulance"
                    className="hover:text-red-600 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Ambulance
                  </Link>
                  <Link
                    to="/police"
                    className="hover:text-blue-600 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Police
                  </Link>
                  <Link
                    to="/fire"
                    className="hover:text-orange-600 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Fire Brigade
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/ambulance"
                className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50"
              >
                Ambulance
              </Link>
              <Link
                to="/police"
                className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50"
              >
                Police
              </Link>
              <Link
                to="/fire"
                className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50"
              >
                Fire Brigade
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/ambulance" replace />} />
            <Route path="/ambulance" element={<AmbulanceService />} />
            <Route path="/police" element={<PoliceService />} />
            <Route path="/fire" element={<FireBrigadeService />} />
            <Route path="*" element={<Navigate to="/ambulance" replace />} />
            <Route path="/user" element={<EmergencyForm/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
