// src/utils/sanitize.test.js
import { describe, it, expect } from 'vitest';
import { sanitizeFormInputs } from './sanitize';

describe('sanitizeFormInputs', () => {
  it('clamps car km above max to 2000', () => {
    const result = sanitizeFormInputs({ carKm: 99999, vehicleType: 'petrol_car', dietType: 'vegan', shoppingLevel: 'minimal' });
    expect(result.transport.carKm).toBe(2000);
  });
  
  it('falls back to petrol_car for invalid vehicle type', () => {
    const result = sanitizeFormInputs({ vehicleType: 'hovercraft', dietType: 'vegan', shoppingLevel: 'minimal' });
    expect(result.transport.vehicleType).toBe('petrol_car');
  });
  
  it('returns 0 for NaN numeric inputs', () => {
    const result = sanitizeFormInputs({ carKm: 'abc', dietType: 'vegan', shoppingLevel: 'minimal' });
    expect(result.transport.carKm).toBe(0);
  });
});