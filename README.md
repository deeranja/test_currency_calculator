# Currency Converter (React + Vite + TS)

A simple currency converter implementing the provided requirements: amount validation, two reusable currency dropdowns with search and flags, swap button, convert button, and a 10 minute countdown that hides the result when expired.

## How to run

Use Node 18+. From the project root run:

```powershell
npm install
npm run dev
```

Then open the printed local URL in your browser.


## Notes

- Rates API: https://api.exchangerate-api.com/v4/latest/{BASE}
- Currency names: https://openexchangerates.org/api/currencies.json
- Flag images: https://flagcdn.com (Flagpedia CDN)

The dropdown shows images using a light currency->country mapping; not all currencies are mapped perfectly but the UX remains functional.
