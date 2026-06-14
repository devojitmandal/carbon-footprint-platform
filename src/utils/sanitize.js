/**
 * Parses input to a float and clamps it within acceptable boundaries.
 * Prevents NaN crashes and limits malicious or accidental extreme values.
 * * @param {string|number} value - The raw input from the user.
 * @param {number} min - The absolute minimum acceptable value.
 * @param {number} max - The absolute maximum acceptable value.
 * @param {number} fallback - The default value if parsing fails entirely.
 * @returns {number} The sanitized, safe integer/float.
 */
export function sanitizeNumber(value, min, max, fallback) {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return fallback;
    if (parsed < min) return min;
    if (parsed > max) return max;
    return parsed;
  }
  
  export function sanitizeSelect(value, allowedValues, fallback) {
    if (allowedValues.includes(value)) return value;
    return fallback;
  }
  
  export function sanitizeFormInputs(rawFormData) {
    return {
      transport: {
        carKm: sanitizeNumber(rawFormData.carKm, 0, 2000, 0),
        bikeKm: sanitizeNumber(rawFormData.bikeKm, 0, 500, 0),
        busKm: sanitizeNumber(rawFormData.busKm, 0, 500, 0),
        trainKm: sanitizeNumber(rawFormData.trainKm, 0, 1000, 0),
        domesticFlights: sanitizeNumber(rawFormData.domesticFlights, 0, 50, 0),
        longFlights: sanitizeNumber(rawFormData.longFlights, 0, 20, 0),
        vehicleType: sanitizeSelect(
          rawFormData.vehicleType, 
          ['petrol_car', 'diesel_car', 'electric_car', 'none'], 
          'petrol_car'
        )
      },
      energy: {
        monthlyKwh: sanitizeNumber(rawFormData.monthlyKwh, 0, 10000, 0),
        lpgCylindersPerMonth: sanitizeNumber(rawFormData.lpgCylinders, 0, 20, 0)
      },
      diet: {
        dietType: sanitizeSelect(
          rawFormData.dietType, 
          ['meat_heavy', 'meat_medium', 'pescatarian', 'vegetarian', 'vegan'], 
          'meat_medium'
        )
      },
      shopping: {
        shoppingLevel: sanitizeSelect(
          rawFormData.shoppingLevel, 
          ['minimal', 'average', 'heavy', 'excessive'], 
          'average'
        )
      }
    };
  }