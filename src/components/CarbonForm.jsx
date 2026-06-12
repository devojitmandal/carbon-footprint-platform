import React, { useState } from 'react';
import { sanitizeFormInputs } from '../utils/sanitize';
import { calculateTotalFootprint } from '../calculator/calculator';

export default function CarbonForm({ onCalculate }) {
  const [formData, setFormData] = useState({
    vehicleType: 'petrol_car',
    carKm: '',
    bikeKm: '',
    busKm: '',
    trainKm: '',
    domesticFlights: '',
    longFlights: '',
    monthlyKwh: '',
    lpgCylinders: '',
    dietType: 'meat_medium',
    shoppingLevel: 'average',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedInputs = sanitizeFormInputs(formData);
    const results = calculateTotalFootprint(sanitizedInputs);
    onCalculate(results, sanitizedInputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Transport Section */}
      <section aria-labelledby="transport-heading" className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <h3 id="transport-heading" className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
         <span aria-hidden="true">🚗</span> Transport
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Primary Vehicle</label>
            <select id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="petrol_car">Petrol Car</option>
              <option value="diesel_car">Diesel Car</option>
              <option value="electric_car">Electric Car</option>
              <option value="none">No Car</option>
            </select>
          </div>
          <div>
            <label htmlFor="carKm" className="block text-sm font-medium text-gray-700 mb-1">Car Distance (km/week)</label>
            <input id="carKm" type="number" inputMode="numeric" name="carKm"
              value={formData.carKm} onChange={handleChange} placeholder="e.g. 50" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label htmlFor="bikeKm" className="block text-sm font-medium text-gray-700 mb-1">Motorbike / Scooter (km/week)</label>
            <input id="bikeKm" type="number" inputMode="numeric" name="bikeKm"
              value={formData.bikeKm} onChange={handleChange} placeholder="e.g. 20" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label htmlFor="busKm" className="block text-sm font-medium text-gray-700 mb-1">Bus Distance (km/week)</label>
            <input id="busKm" type="number" inputMode="numeric" name="busKm"
              value={formData.busKm} onChange={handleChange} placeholder="e.g. 20" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="trainKm" className="block text-sm font-medium text-gray-700 mb-1">Train Distance (km/week)</label>
            <input id="trainKm" type="number" inputMode="numeric" name="trainKm"
              value={formData.trainKm} onChange={handleChange} placeholder="e.g. 100" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="domesticFlights" className="block text-sm font-medium text-gray-700 mb-1">Domestic Flights (per year)</label>
            <input id="domesticFlights" type="number" inputMode="numeric" name="domesticFlights"
              value={formData.domesticFlights} onChange={handleChange} placeholder="e.g. 2" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="longFlights" className="block text-sm font-medium text-gray-700 mb-1">Long-Haul Flights (per year)</label>
            <input id="longFlights" type="number" inputMode="numeric" name="longFlights"
              value={formData.longFlights} onChange={handleChange} placeholder="e.g. 0" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </section>

      {/* Energy Section */}
      <section aria-labelledby="energy-heading" className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <h3 id="energy-heading" className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span aria-hidden="true">⚡</span> Home Energy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="monthlyKwh" className="block text-sm font-medium text-gray-700 mb-1">Electricity (kWh/month)</label>
            <input id="monthlyKwh" type="number" inputMode="numeric" name="monthlyKwh"
              value={formData.monthlyKwh} onChange={handleChange} placeholder="e.g. 150" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="lpgCylinders" className="block text-sm font-medium text-gray-700 mb-1">LPG Cylinders (per month)</label>
            <input id="lpgCylinders" type="number" inputMode="numeric" name="lpgCylinders"
              value={formData.lpgCylinders} onChange={handleChange} placeholder="e.g. 1" min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section aria-labelledby="lifestyle-heading" className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <h3 id="lifestyle-heading" className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span aria-hidden="true">🛒</span> Lifestyle
    </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 mb-1">Diet Type</label>
            <select id="dietType" name="dietType" value={formData.dietType} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="meat_heavy">Heavy Meat</option>
              <option value="meat_medium">Average Meat</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          <div>
            <label htmlFor="shoppingLevel" className="block text-sm font-medium text-gray-700 mb-1">Shopping Habits</label>
            <select id="shoppingLevel" name="shoppingLevel" value={formData.shoppingLevel} onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="minimal">Minimal / Thrifty</option>
              <option value="average">Average</option>
              <option value="heavy">Frequent Shopper</option>
              <option value="excessive">Excessive</option>
            </select>
          </div>
        </div>
      </section>

      <div>
        <button
          type="submit"
          aria-describedby="submit-hint"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm"
        >
          Calculate My Footprint
        </button>
        <p id="submit-hint" className="text-xs text-center text-gray-500 mt-2">
          Results appear instantly on the right
        </p>
      </div>

    </form>
  );
}