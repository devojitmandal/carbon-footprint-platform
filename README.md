# FootprintAware — Carbon Footprint Awareness Platform

## What it does
FootprintAware is an ultra-lightweight, offline-capable React application that bridges the gap between climate awareness and real-world action. Users input their daily lifestyle parameters—spanning transport, energy, diet, and shopping habits—and the deterministic engine instantly calculates their annual carbon footprint. In return, users receive a scientifically benchmarked impact scorecard, personalized and highly actionable recommendations, and the ability to export their climate commitments directly to their personal calendar for long-term accountability.

## Live Demo
https://carbon-footprint-platform-psi.vercel.app/

## Technical Approach

### Architecture
The application strictly enforces a separation of concerns to ensure high performance and maintainability. The calculation layer (`calculator.js`) is a pure, deterministic math engine completely decoupled from the UI. The UI layer (React components) exclusively handles state hydration and presentation, while the data layer (`emissions.js`) acts as the single source of truth for all constants and benchmarks. This modular architecture makes the core logic 100% testable without requiring DOM mocking or complex React testing utilities.

### Emission Factors
All calculations are grounded in peer-reviewed scientific data and standardized government metrics:
- Transport: IPCC/DEFRA emission factors
- India electricity grid: 0.82 kg CO₂/kWh (CEA 2023)
- Diet: Oxford University food systems research
- LPG: BEE India standards

### Security
Client-side data integrity is enforced via a robust `sanitize.js` utility that intercepts all form inputs before they hit the calculation engine. This layer protects against edge cases, missing data, and malicious inputs by employing strict numeric boundaries (min/max fallbacks) and allowlist validation for categorical dropdowns. This ensures the engine never crashes due to `NaN` or undefined states.

### Testing
The deterministic core is protected by a comprehensive Vitest testing suite. The tests cover input sanitization boundaries, algorithmic accuracy across all lifestyle categories, and edge-case handling for zero-emission states. The test suite runs entirely decoupled from the UI. 
Run tests via: `npm test`

### Accessibility
The UI is engineered for strict WCAG 2.1 AA compliance. Forms utilize explicit `htmlFor` and `id` pairing for screen readers, while semantic `aria-labelledby` attributes map complex layout sections to their respective headings. Mobile accessibility is prioritized using `inputMode="numeric"` to trigger appropriate soft keyboards, and all icon-only buttons include descriptive `aria-label` tags.

## Assumptions
- Transport km are weekly averages annualized by ×52
- Diet emissions are annual fixed estimates per dietary pattern
- India electricity grid factor: 0.82 kg CO₂/kWh (CEA 2023)
- Flight distances: domestic avg 1,200km, long-haul avg 8,000km
- LPG cylinder weight: standard 14.2kg Indian cylinder

## How to Run Locally
```bash
npm install
npm run dev
npm test
