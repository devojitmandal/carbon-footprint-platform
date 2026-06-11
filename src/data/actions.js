// src/data/actions.js
import { TRANSPORT_FACTORS, DIET_FACTORS, ENERGY_FACTORS, SHOPPING_FACTORS } from './emissions';

export const ACTIONS = [
  // TRANSPORT ACTIONS
  {
    id: 'switch_to_ev',
    category: 'transport',
    title: 'Switch to an Electric Vehicle',
    description: 'Electric vehicles produce significantly lower emissions per kilometer than petrol or diesel cars.',
    difficulty: 'hard',
    condition: 'has_petrol_or_diesel_car',
    calculateSavings: (inputs) => {
      const carKm = inputs.transport?.carKm || 0;
      const currentFactor = inputs.transport?.vehicleType === 'diesel_car' ? TRANSPORT_FACTORS.diesel_car : TRANSPORT_FACTORS.petrol_car;
      return carKm * 52 * (currentFactor - TRANSPORT_FACTORS.electric_car);
    }
  },
  {
    id: 'reduce_car_use',
    category: 'transport',
    title: 'Reduce Car Use by 20%',
    description: 'Combine errands or replace short drives with walking or cycling.',
    difficulty: 'medium',
    condition: 'drives_more_than_50km_week',
    calculateSavings: (inputs) => {
      const carKm = inputs.transport?.carKm || 0;
      const factor = TRANSPORT_FACTORS[inputs.transport?.vehicleType] || TRANSPORT_FACTORS.petrol_car;
      return carKm * 52 * 0.20 * factor;
    }
  },
  {
    id: 'shift_to_train',
    category: 'transport',
    title: 'Replace Car Trips with Train',
    description: 'Trains are highly efficient for long distances compared to individual driving.',
    difficulty: 'medium',
    condition: 'drives_more_than_100km_week',
    calculateSavings: (inputs) => {
      const carKm = inputs.transport?.carKm || 0;
      const factor = TRANSPORT_FACTORS[inputs.transport?.vehicleType] || TRANSPORT_FACTORS.petrol_car;
      return carKm * 52 * 0.30 * (factor - TRANSPORT_FACTORS.train);
    }
  },
  {
    id: 'reduce_flights',
    category: 'transport',
    title: 'Cut One Domestic Flight per Year',
    description: 'Aviation is highly carbon-intensive. Opt for rail travel for one trip instead.',
    difficulty: 'easy',
    condition: 'has_domestic_flights',
    calculateSavings: () => 1200 * TRANSPORT_FACTORS.flight_domestic // Fixed estimate
  },

  // ENERGY ACTIONS
  {
    id: 'switch_to_led',
    category: 'energy',
    title: 'Switch to LED Lighting',
    description: 'LEDs use a fraction of the energy of traditional bulbs.',
    difficulty: 'easy',
    condition: 'uses_electricity',
    calculateSavings: (inputs) => (inputs.energy?.monthlyKwh || 0) * 12 * 0.15 * ENERGY_FACTORS.electricity_india
  },
  {
    id: 'solar_panels',
    category: 'energy',
    title: 'Install Rooftop Solar Panels',
    description: 'Offset grid electricity reliance by generating your own renewable power.',
    difficulty: 'hard',
    condition: 'monthly_kwh_above_200',
    calculateSavings: (inputs) => (inputs.energy?.monthlyKwh || 0) * 12 * 0.60 * ENERGY_FACTORS.electricity_india
  },
  {
    id: 'reduce_lpg',
    category: 'energy',
    title: 'Switch to Induction Cooking',
    description: 'Induction cooktops are highly efficient and reduce reliance on fossil gas.',
    difficulty: 'medium',
    condition: 'uses_lpg',
    calculateSavings: (inputs) => (inputs.energy?.lpgCylindersPerMonth || 0) * 12 * ENERGY_FACTORS.lpg_cylinder * 0.50
  },

  // DIET ACTIONS
  {
    id: 'go_vegetarian',
    category: 'diet',
    title: 'Switch to a Vegetarian Diet',
    description: 'Eliminating meat significantly lowers the agricultural footprint of your food.',
    difficulty: 'hard',
    condition: 'diet_is_meat_heavy_or_medium',
    calculateSavings: (inputs) => {
      const currentDiet = inputs.diet?.dietType || 'meat_medium';
      return DIET_FACTORS[currentDiet] - DIET_FACTORS.vegetarian;
    }
  },
  {
    id: 'reduce_meat',
    category: 'diet',
    title: 'Reduce to Average Meat Consumption',
    description: 'Cutting back on high-impact meats like beef makes a massive difference.',
    difficulty: 'medium',
    condition: 'diet_is_meat_heavy',
    calculateSavings: () => DIET_FACTORS.meat_heavy - DIET_FACTORS.meat_medium // Fixed 800
  },
  {
    id: 'go_vegan',
    category: 'diet',
    title: 'Switch to a Vegan Diet',
    description: 'Plant-based diets have the lowest carbon footprint of all dietary patterns.',
    difficulty: 'hard',
    condition: 'diet_is_not_vegan',
    calculateSavings: (inputs) => {
      const currentDiet = inputs.diet?.dietType || 'meat_medium';
      return DIET_FACTORS[currentDiet] - DIET_FACTORS.vegan;
    }
  },

  // SHOPPING ACTIONS
  {
    id: 'buy_secondhand',
    category: 'shopping',
    title: 'Buy Second-Hand Where Possible',
    description: 'Thrifting reduces manufacturing emissions and diverts items from landfills.',
    difficulty: 'easy',
    condition: 'shopping_heavy_or_excessive',
    calculateSavings: () => 300 // Fixed estimate
  },
  {
    id: 'reduce_shopping',
    category: 'shopping',
    title: 'Cut Shopping to Average Levels',
    description: 'Adopting a 30-day rule curbs impulse buys and lowers consumer emissions.',
    difficulty: 'medium',
    condition: 'shopping_is_excessive',
    calculateSavings: () => SHOPPING_FACTORS.excessive - SHOPPING_FACTORS.average // Fixed 1400
  }
];