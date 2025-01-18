import React from 'react';
import styles from './styles.module.css';
import Link from 'next/link';
const MapAnalytics = () => {
  return (
    <div id={styles.container} className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-2xl">
      {/* Map container */}
      <div className="absolute inset-0 filter blur-[1px]">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15057.534307180755!2d-75.6815!3d45.4215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1621231234567!5m2!1sen!2sus"
          className="w-full h-full object-cover"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>
      
      {/* Overlay with modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      {/* Content container */}
      <div className="relative h-full flex items-center px-6 md:px-10">
        <div className="max-w-md space-y-4">
          {/* Title with fancy badge */}
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
              Live Updates
            </span>
            <span className="flex items-center text-xs text-gray-300">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Real-time data
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Traffic Analytics Dashboard
          </h1>
          
          <p style={{color:"#b9b4b3"}}>
            Access comprehensive traffic insights and movement patterns in your area
          </p>
          
          {/* Stats row */}
          <div className="flex space-x-6 py-4">
            <div>
              <p style={{color:"#b9b4b3"}} className="text-xs  uppercase">Daily Traffic</p>
              <p style={{color:"#b9b4b3"}}>24.5K</p>
            </div>
            <div className="border-l border-white/10 pl-6">
              <p style={{color:"#b9b4b3"}} className="text-xs uppercase">Peak Time</p>
              <p className="text-xl font-bold text-white" style={{color:"#b9b4b3"}}>2PM-6PM</p>
            </div>
          </div>
          
          {/* Modern button with accent color */}
          <Link href="/Analytics">
          <button 
            className={styles.button}
            >
            <span style={{color:"white"}}>Open Full Analytics</span>
            <i className="ri-arrow-right-line text-white ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Link>
        </div>
      </div>
      
      {/* Modern accent elements */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full -mr-16 -mb-16" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-2xl rounded-full -mr-12 -mt-12" />
    </div>
  );
};

export default MapAnalytics;