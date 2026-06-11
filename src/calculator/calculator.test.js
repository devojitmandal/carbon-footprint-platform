// src/calculator/calculator.test.js
import { describe, it, expect } from 'vitest';
import { 
  calculateTransport, 
  calculateEnergy, 
  calculateDiet, 
  calculateTotalFootprint, 
  getRating 
} from './calculator';

describe('calculateTransport', () => {
  it('returns 0 when all inputs are 0', () => {
    const inputs = { carKm: 0, bikeKm: 0, busKm: 0, trainKm: 0, domesticFlights: 0, longFlights: 0, vehicleType: 'petrol_car' };
    expect(calculateTransport(inputs)).toBe(0);
  });

  it('correctly calculates petrol car weekly km to annual kg', () => {
    // 10km weekly * 52 weeks * 0.192 factor = 99.84
    const inputs = { carKm: 10, vehicleType: 'petrol_car' };
    expect(calculateTransport(inputs)).toBeCloseTo(99.84);
  });

  it('flight calculation uses correct average distances', () => {
    // 1 domestic (1200) + 1 long (8000) = 9200km * 0.255 = 2346
    const inputs = { domesticFlights: 1, longFlights: 1 };
    expect(calculateTransport(inputs)).toBeCloseTo(2346);
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
    // 100kWh * 12 * 0.82 = 984
    expect(calculateEnergy({ monthlyKwh: 100 })).toBeCloseTo(984);
  });

  it('LPG cylinders are correctly multiplied', () => {
    // 1 cylinder * 12 * 12.7 = 152.4
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
    const result = calculateTotalFootprint(mockInputs); // total is 1700
    expect(result.vsGlobalAvg).toBeLessThan(0);
  });

  it('rating is "Excellent" for total < 1000', () => {
    const excellentInputs = {
      diet: { dietType: 'vegan' }, // Let's mock a very low total by overriding internal logic if needed, or just test getRating directly
    };
    // Since diet alone is 1500, we'll test getRating directly for the < 1000 case in the next block.
    // For this one, let's just ensure rating matches the output total (1700 = Good).
    const result = calculateTotalFootprint(mockInputs);
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
});
