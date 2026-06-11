// src/calculator/calculator.js
import { 
    TRANSPORT_FACTORS, 
    DIET_FACTORS, 
    ENERGY_FACTORS, 
    SHOPPING_FACTORS, 
    BENCHMARKS 
  } from '../data/emissions';
  
  export function calculateTransport(inputs) {
    // Handle 'none' or missing vehicle types
    const carFactor = inputs.vehicleType === 'none' ? 0 : (TRANSPORT_FACTORS[inputs.vehicleType] || 0);
    
    const weeklyCarKm = (inputs.carKm || 0) * 52;
    const weeklyBikeKm = (inputs.bikeKm || 0) * 52; 
    const weeklyBusKm = (inputs.busKm || 0) * 52;
    const weeklyTrainKm = (inputs.trainKm || 0) * 52;
    
    const domesticFlightEmissions = (inputs.domesticFlights || 0) * 1200 * TRANSPORT_FACTORS.flight_domestic;
    const longFlightEmissions = (inputs.longFlights || 0) * 8000 * TRANSPORT_FACTORS.flight_long;
  
    const total = (weeklyCarKm * carFactor) + 
                  (weeklyBikeKm * TRANSPORT_FACTORS.motorcycle) + 
                  (weeklyBusKm * TRANSPORT_FACTORS.bus) + 
                  (weeklyTrainKm * TRANSPORT_FACTORS.train) + 
                  domesticFlightEmissions + longFlightEmissions; 
  
    return total;
  }
  
  export function calculateEnergy(inputs) {
    const electricityAnnual = (inputs.monthlyKwh || 0) * 12 * ENERGY_FACTORS.electricity_india;
    const lpgAnnual = (inputs.lpgCylindersPerMonth || 0) * 12 * ENERGY_FACTORS.lpg_cylinder;
    
    return electricityAnnual + lpgAnnual;
  }
  
  export function calculateDiet(inputs) {
    if (!inputs || !inputs.dietType || !DIET_FACTORS[inputs.dietType]) {
      return null; // Invalid or missing diet type
    }
    return DIET_FACTORS[inputs.dietType];
  }
  
  export function calculateShopping(inputs) {
    if (!inputs || !inputs.shoppingLevel || !SHOPPING_FACTORS[inputs.shoppingLevel]) {
      return SHOPPING_FACTORS.average; // Fallback
    }
    return SHOPPING_FACTORS[inputs.shoppingLevel];
  }
  
  export function getRating(total) {
    if (total < 1000) return "Excellent";
    if (total < 2000) return "Good";
    if (total < 3500) return "Average";
    if (total < 5000) return "High";
    return "Very High";
  }
  
  export function calculateTotalFootprint(inputs) {
    const transport = calculateTransport(inputs.transport || {});
    const energy = calculateEnergy(inputs.energy || {});
    const diet = calculateDiet(inputs.diet || {}) || 0;
    const shopping = calculateShopping(inputs.shopping || {});
  
    const total = transport + energy + diet + shopping;
  
    return {
      total,
      breakdown: { transport, energy, diet, shopping },
      vsGlobalAvg: ((total - BENCHMARKS.GLOBAL_AVG) / BENCHMARKS.GLOBAL_AVG) * 100,
      vsIndiaAvg: ((total - BENCHMARKS.INDIA_AVG) / BENCHMARKS.INDIA_AVG) * 100,
      rating: getRating(total)
    };
  }