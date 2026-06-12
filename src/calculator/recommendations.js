import { ACTIONS } from '../data/actions';

export function getRecommendations(sanitizedInputs) {
    console.log('DEBUG inputs:', JSON.stringify(sanitizedInputs));
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