import React from 'react';
import { ArrowUpRight, Car, Film, Flame, ShoppingBag, Utensils } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, color, href }) => (
  <a href={href} className="group relative flex flex-col p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm flex-grow">{description}</p>
    <div className="flex items-center mt-4 text-sm font-medium text-gray-900">
      Learn more
      <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </div>
  </a>
);

const ServiceCards = () => {
  const services = [
    {
      icon: Car,
      title: "Rides",
      description: "Get a ride in minutes, or schedule one for later",
      color: "bg-black",
      href: "/TApps/Uber"
    },
    {
      icon: Film,
      title: "Netflix",
      description: "Watch unlimited movies, TV shows, and more",
      color: "bg-red-600",
      href: "/TApps/Netflix"
    },
    {
      icon: Utensils,
      title: "Food Delivery",
      description: "Your favorite restaurants delivered to your door",
      color: "bg-green-600",
      href: "/Swiggy"
    },
  
    {
      icon: Flame,
      title: "Hot Songs",
      description: "Discover trending Songs",
      color: "bg-orange-500",
      href: "/TApps/Jiosavan"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Popular Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;