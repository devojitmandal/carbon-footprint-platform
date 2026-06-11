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
    },
    evidence: {
      source: "International Energy Agency (IEA)",
      summary: "Life-cycle emissions of EVs are around half those of internal combustion engine vehicles, even when accounting for the carbon intensity of battery manufacturing.",
      link: "https://www.iea.org/reports/global-ev-outlook-2023"
    }
  },
  {
    id: 'use_ev_cabs_and_micromobility',
    category: 'transport',
    title: 'Shift to EV Cabs & Micro-mobility',
    description: 'Replace 20% of your driving by utilizing 100% EV ride-hailing (like BluSmart) or scanning a shared e-bike (like Yulu) for last-mile commutes.',
    difficulty: 'easy',
    condition: 'drives_more_than_50km_week',
    calculateSavings: (inputs) => {
      const carKm = inputs.transport?.carKm || 0;
      const factor = TRANSPORT_FACTORS[inputs.transport?.vehicleType] || TRANSPORT_FACTORS.petrol_car;
      return carKm * 52 * 0.20 * factor;
    },
    evidence: {
      source: "UNEP Electric Mobility",
      summary: "Integrating shared electric micro-mobility with public transit can displace millions of tons of urban fossil-fuel emissions annually.",
      link: "https://www.unep.org/explore-topics/transport/what-we-do/electric-mobility"
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
    },
    evidence: {
      source: "European Environment Agency (EEA)",
      summary: "Rail travel is the most environmentally friendly passenger transport mode, producing significantly lower greenhouse gas emissions per passenger-kilometer than cars or planes.",
      link: "https://www.eea.europa.eu/publications/rail-and-waterborne-best"
    }
  },
  {
    id: 'replace_flight_vande_bharat',
    category: 'transport',
    title: 'Swap to High-Speed Rail (e.g., Vande Bharat)',
    description: 'For your annual trip, replace that short-haul domestic flight with an electrified express train. It takes slightly longer but slashes your travel footprint.',
    difficulty: 'medium',
    condition: 'low_domestic_flights', // Triggers for 1-2 flights
    calculateSavings: () => 1200 * (TRANSPORT_FACTORS.flight_domestic - TRANSPORT_FACTORS.train),
    evidence: {
      source: "IEA Railway Report",
      summary: "Electric rail networks emit up to 80% less CO2 per passenger-kilometer compared to domestic aviation on the exact same routes.",
      link: "https://www.iea.org/reports/the-future-of-rail"
    }
  },
  {
    id: 'reduce_frequent_flying',
    category: 'transport',
    title: 'Cut One Domestic Flight per Year',
    description: 'You fly frequently. Replacing just one of those flights with a virtual meeting or rail travel creates a massive emissions drop.',
    difficulty: 'easy',
    condition: 'high_domestic_flights', // Triggers for 3+ flights
    calculateSavings: () => 1200 * TRANSPORT_FACTORS.flight_domestic,
    evidence: {
      source: "Our World in Data",
      summary: "Aviation accounts for around 2.5% of global CO₂ emissions, but its overall contribution to global warming is much higher due to non-CO₂ climate effects at high altitudes.",
      link: "https://ourworldindata.org/co2-emissions-from-aviation"
    }
  },

  // ENERGY ACTIONS
  {
    id: 'switch_to_led',
    category: 'energy',
    title: 'Switch to LED Lighting',
    description: 'LEDs use a fraction of the energy of traditional bulbs.',
    difficulty: 'easy',
    condition: 'uses_electricity',
    calculateSavings: (inputs) => (inputs.energy?.monthlyKwh || 0) * 12 * 0.15 * ENERGY_FACTORS.electricity_india,
    evidence: {
      source: "U.S. Department of Energy",
      summary: "LED lighting uses up to 90% less energy and lasts up to 25 times longer than incandescent lighting, making it one of the easiest and most effective energy-saving upgrades.",
      link: "https://www.energy.gov/energysaver/led-lighting"
    }
  },
  {
    id: 'solar_panels',
    category: 'energy',
    title: 'Install Rooftop Solar Panels',
    description: 'Offset grid electricity reliance by generating your own renewable power.',
    difficulty: 'hard',
    condition: 'monthly_kwh_above_200',
    calculateSavings: (inputs) => (inputs.energy?.monthlyKwh || 0) * 12 * 0.60 * ENERGY_FACTORS.electricity_india,
    evidence: {
      source: "Project Drawdown",
      summary: "Distributed solar photovoltaics (like rooftop panels) prevent emissions by replacing fossil fuel-based grid electricity with clean, renewable energy generated at the source.",
      link: "https://drawdown.org/solutions/distributed-solar-photovoltaics"
    }
  },
  {
    id: 'reduce_lpg',
    category: 'energy',
    title: 'Switch to Induction Cooking',
    description: 'Induction cooktops are highly efficient and reduce reliance on fossil gas.',
    difficulty: 'medium',
    condition: 'uses_lpg',
    calculateSavings: (inputs) => (inputs.energy?.lpgCylindersPerMonth || 0) * 12 * ENERGY_FACTORS.lpg_cylinder * 0.50,
    evidence: {
      source: "Rocky Mountain Institute (RMI)",
      summary: "Transitioning from gas to electric induction cooking reduces dangerous indoor air pollution and entirely eliminates direct fossil fuel combustion in the home.",
      link: "https://rmi.org/insight/gas-stoves-pollution-health/"
    }
  },
  {
    id: 'automate_geyser_smart_plug',
    category: 'energy',
    title: 'Automate Water Heaters with Smart Plugs',
    description: 'Geysers are massive energy drains. Install a smart plug or IoT relay to ensure it only runs 30 minutes before your shower, preventing all-day thermal loss.',
    difficulty: 'medium',
    condition: 'monthly_kwh_above_200', // Targets high energy users
    calculateSavings: (inputs) => (inputs.energy?.monthlyKwh || 0) * 12 * 0.10 * ENERGY_FACTORS.electricity_india, // Assumes 10% total bill reduction
    evidence: {
      source: "Energy Saving Trust",
      summary: "Leaving water heaters on constantly rather than using automated timers leads to significant 'standby' heat loss and wasted grid electricity.",
      link: "https://energysavingtrust.org.uk/"
    }
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
    },
    evidence: {
      source: "IPCC Special Report on Land",
      summary: "Transitioning to plant-based and vegetarian diets can significantly reduce greenhouse gas emissions from the agricultural sector, saving up to 8 gigatons of CO2e annually.",
      link: "https://www.ipcc.ch/srccl/"
    }
  },
  {
    id: 'reduce_meat',
    category: 'diet',
    title: 'Reduce to Average Meat Consumption',
    description: 'Cutting back on high-impact meats like beef makes a massive difference.',
    difficulty: 'medium',
    condition: 'diet_is_meat_heavy',
    calculateSavings: () => DIET_FACTORS.meat_heavy - DIET_FACTORS.meat_medium,
    evidence: {
      source: "World Resources Institute",
      summary: "Beef production requires 20 times more land and emits 20 times more greenhouse gases per gram of edible protein than common plant proteins like beans.",
      link: "https://www.wri.org/insights/sustainable-diets-what-you-need-know"
    }
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
    },
    evidence: {
      source: "University of Oxford (Science Journal)",
      summary: "A vegan diet is probably the single biggest way to reduce your impact on planet Earth, reducing food-related greenhouse gas emissions by up to 73%.",
      link: "https://www.science.org/doi/10.1126/science.aaq0216"
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
    calculateSavings: () => 300,
    evidence: {
      source: "Ellen MacArthur Foundation",
      summary: "Transitioning to a circular economy, including buying second-hand and extending product lifespans, can reduce global GHG emissions from goods by 45%.",
      link: "https://ellenmacarthurfoundation.org/completing-the-picture"
    }
  },
  {
    id: 'reduce_shopping',
    category: 'shopping',
    title: 'Cut Shopping to Average Levels',
    description: 'Adopting a 30-day rule curbs impulse buys and lowers consumer emissions.',
    difficulty: 'medium',
    condition: 'shopping_is_excessive',
    calculateSavings: () => SHOPPING_FACTORS.excessive - SHOPPING_FACTORS.average,
    evidence: {
      source: "UN Environment Programme",
      summary: "Household consumption accounts for over 60% of global greenhouse gas emissions. Reducing overconsumption of disposable goods is critical for 1.5°C pathways.",
      link: "https://www.unep.org/resources/emissions-gap-report-2020"
    }
  }
];