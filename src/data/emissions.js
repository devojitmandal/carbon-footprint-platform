// src/data/emissions.js

// TRANSPORT: kg CO₂ per km
export const TRANSPORT_FACTORS = {
    petrol_car: 0.192,
    diesel_car: 0.171,
    electric_car: 0.053,
    bus: 0.089,
    train: 0.041,
    motorcycle: 0.114,
    walking_cycling: 0.000,
    flight_domestic: 0.255, 
    flight_long: 0.195      
  };
  
  // DIET: kg CO₂ per year
  export const DIET_FACTORS = {
    meat_heavy: 3300,
    meat_medium: 2500,
    pescatarian: 1900,
    vegetarian: 1700,
    vegan: 1500
  };
  
  // ENERGY: Various units
  export const ENERGY_FACTORS = {
    electricity_india: 0.82, // kg CO₂ per kWh
    natural_gas: 2.04,       // kg CO₂ per cubic meter
    lpg_cylinder: 12.7       // kg CO₂ per cylinder
  };
  
  // SHOPPING: kg CO₂ per year
  export const SHOPPING_FACTORS = {
    minimal: 200,
    average: 600,
    heavy: 1200,
    excessive: 2000
  };
  
  // BENCHMARKS: kg CO₂ per year
  export const BENCHMARKS = {
    GLOBAL_AVG: 4000,
    INDIA_AVG: 1900
  };