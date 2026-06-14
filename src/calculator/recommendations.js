import { ACTIONS } from '../data/actions';
/**
 * Evaluates sanitized user inputs against a matrix of climate actions
 * to generate personalized, high-impact carbon reduction recommendations.
 * * @param {Object} inputs - The sanitized user form data.
 * @param {Object} inputs.transport - Transport-related metrics.
 * @param {number} inputs.transport.carKm - Weekly car kilometers driven.
 * @param {string} inputs.transport.vehicleType - Type of vehicle (e.g., 'petrol_car').
 * @returns {Array<{id: string, title: string, savingsKg: number, evidence: Object}>} Array of valid recommendations.
 */

export function getRecommendations(sanitizedInputs) {
    const { transport = {}, energy = {}, diet = {}, shopping = {} } = sanitizedInputs || {};

  const conditions = {
    has_petrol_or_diesel_car: transport.vehicleType === 'petrol_car' || transport.vehicleType === 'diesel_car',
    drives_more_than_50km_week: (transport.carKm || 0) > 50,
    drives_more_than_100km_week: (transport.carKm || 0) > 100,
    low_domestic_flights: (transport.domesticFlights || 0) >= 1 && (transport.domesticFlights || 0) <= 2,
    high_domestic_flights: (transport.domesticFlights || 0) > 2,
    uses_electricity: (energy.monthlyKwh || 0) > 0,
    monthly_kwh_above_200: (energy.monthlyKwh || 0) > 200,
    uses_lpg: (energy.lpgCylindersPerMonth || 0) > 0,
    diet_is_meat_heavy_or_medium: ['meat_heavy', 'meat_medium'].includes(diet.dietType),
    diet_is_meat_heavy: diet.dietType === 'meat_heavy',
    diet_is_not_vegan: diet.dietType !== 'vegan',
    shopping_heavy_or_excessive: ['heavy', 'excessive'].includes(shopping.shoppingLevel),
    shopping_is_excessive: shopping.shoppingLevel === 'excessive'
  };

  const validRecommendations = [];

  ACTIONS.forEach(action => {
    if (conditions[action.condition]) {
      const savingsKg = action.calculateSavings(sanitizedInputs);
      if (savingsKg > 0) {
        validRecommendations.push({
            id: action.id,
            category: action.category,
            title: action.title,
            description: action.description,
            difficulty: action.difficulty,
            savingsKg: savingsKg,
            evidence: action.evidence
          });
      }
    }
  });

  return validRecommendations
    .sort((a, b) => b.savingsKg - a.savingsKg)
    .slice(0, 6);
}