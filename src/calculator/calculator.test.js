import { describe, it, expect } from 'vitest';
import { 
  calculateTransport, 
  calculateEnergy, 
  calculateDiet, 
  calculateTotalFootprint, 
  getRating 
} from './calculator';
import { getRecommendations } from './recommendations';

describe('calculateTransport', () => {
  it('returns 0 when all inputs are 0', () => {
    const inputs = { carKm: 0, bikeKm: 0, busKm: 0, trainKm: 0, domesticFlights: 0, longFlights: 0, vehicleType: 'petrol_car' };
    expect(calculateTransport(inputs)).toBe(0);
  });

  it('correctly calculates petrol car weekly km to annual kg', () => {
    const inputs = { carKm: 10, vehicleType: 'petrol_car' };
    expect(calculateTransport(inputs)).toBeCloseTo(99.84);
  });

  it('flight calculation uses correct average distances', () => {
    // 1 domestic (1200 * 0.255 = 306) + 1 long (8000 * 0.195 = 1560) = 1866
    const inputs = { domesticFlights: 1, longFlights: 1 };
    expect(calculateTransport(inputs)).toBeCloseTo(1866);
  });

  it('electric car produces lower emissions than petrol for same km', () => {
    const petrol = calculateTransport({ carKm: 100, vehicleType: 'petrol_car' });
    const ev = calculateTransport({ carKm: 100, vehicleType: 'electric_car' });
    expect(ev).toBeLessThan(petrol);
  });
});

describe('calculateEnergy', () => {
  it('returns 0 when inputs are 0', () => {
    expect(calculateEnergy({ monthlyKwh: 0, lpgCylindersPerMonth: 0 })).toBe(0);
  });

  it('monthly kWh is correctly annualized', () => {
    expect(calculateEnergy({ monthlyKwh: 100 })).toBeCloseTo(984);
  });

  it('LPG cylinders are correctly multiplied', () => {
    expect(calculateEnergy({ lpgCylindersPerMonth: 1 })).toBeCloseTo(152.4);
  });
});

describe('calculateDiet', () => {
  it('vegan returns lowest value', () => {
    const vegan = calculateDiet({ dietType: 'vegan' });
    const meat = calculateDiet({ dietType: 'meat_heavy' });
    expect(vegan).toBeLessThan(meat);
    expect(vegan).toBe(1500);
  });

  it('meat heavy returns highest value', () => {
    expect(calculateDiet({ dietType: 'meat_heavy' })).toBe(3300);
  });

  it('returns null for invalid diet type', () => {
    expect(calculateDiet({ dietType: 'junk_food' })).toBeNull();
  });
});

describe('calculateTotalFootprint', () => {
  const mockInputs = {
    transport: { carKm: 0 },
    energy: { monthlyKwh: 0 },
    diet: { dietType: 'vegan' }, // 1500
    shopping: { shoppingLevel: 'minimal' } // 200
  }; // Total should be 1700

  it('returns correct shape { total, breakdown, vsGlobalAvg, vsIndiaAvg, rating }', () => {
    const result = calculateTotalFootprint(mockInputs);
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('vsGlobalAvg');
    expect(result).toHaveProperty('vsIndiaAvg');
    expect(result).toHaveProperty('rating');
  });
  

  it('breakdown values sum to total', () => {
    const result = calculateTotalFootprint(mockInputs);
    const sum = result.breakdown.transport + result.breakdown.energy + result.breakdown.diet + result.breakdown.shopping;
    expect(result.total).toBe(sum);
  });

  it('vsGlobalAvg is negative when total < 4000', () => {
    const result = calculateTotalFootprint(mockInputs);
    expect(result.vsGlobalAvg).toBeLessThan(0);
  });

  // MOVED: Properly nested under calculateTotalFootprint where mockInputs is defined
  it('rating is "Good" for total < 2000', () => { 
    const result = calculateTotalFootprint(mockInputs); // total is 1700
    expect(result.rating).toBe('Good'); 
  });
});

describe('getRating', () => {
  it('covers all 5 rating bands with boundary values', () => {
    expect(getRating(999)).toBe('Excellent');
    expect(getRating(1500)).toBe('Good');
    expect(getRating(3000)).toBe('Average');
    expect(getRating(4500)).toBe('High');
    expect(getRating(5500)).toBe('Very High');
  });

  // MOVED: Isolated rating test
  it('rating is "Excellent" for total < 1000', () => { 
    expect(getRating(500)).toBe('Excellent');
  });
});
describe('getRecommendations', () => {
    const mockInputs = {
      transport: { carKm: 150, vehicleType: 'petrol_car', domesticFlights: 2 },
      energy: { monthlyKwh: 250, lpgCylindersPerMonth: 1 },
      diet: { dietType: 'meat_heavy' },
      shopping: { shoppingLevel: 'excessive' }
    };
  
    it('returns an array', () => {
      const result = getRecommendations(mockInputs);
      expect(Array.isArray(result)).toBe(true);
    });
  
    it('returns maximum 6 items', () => {
      const result = getRecommendations(mockInputs);
      expect(result.length).toBeLessThanOrEqual(6);
    });
  
    it('all items have required fields: id, title, savingsKg, difficulty', () => {
      const result = getRecommendations(mockInputs);
      expect(result.length).toBeGreaterThan(0); // Make sure it populated something
      result.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('savingsKg');
        expect(item).toHaveProperty('difficulty');
      });
    });
  
    it('results are sorted by savingsKg descending', () => {
      const result = getRecommendations(mockInputs);
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].savingsKg).toBeGreaterThanOrEqual(result[i + 1].savingsKg);
      }
    });
  
    it('does not recommend switch_to_ev when vehicleType is electric_car', () => {
      const evInputs = { ...mockInputs, transport: { ...mockInputs.transport, vehicleType: 'electric_car' } };
      const result = getRecommendations(evInputs);
      const hasEvRec = result.some(item => item.id === 'switch_to_ev');
      expect(hasEvRec).toBe(false);
    });
  });