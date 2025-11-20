export type RatesResponse = {
  base: string
  rates: Record<string, number>
}

let namesCache: Record<string, string> | null = null
let ratesCache: { base: string; rates: Record<string, number> } | null = null

export async function fetchCurrencyNames(): Promise<Record<string, string>> {
  if (namesCache) return namesCache
  const res = await fetch('https://openexchangerates.org/api/currencies.json')
  console.log("Currency ",res)
  if (!res.ok) throw new Error('Failed to fetch currency names')
  const data = (await res.json()) as Record<string, string>
  console.log("data ",data)
  namesCache = data
  return data
}

export async function fetchRates(base: string): Promise<RatesResponse> {
  if (ratesCache && ratesCache.base === base) return ratesCache
  const url = `https://api.exchangerate-api.com/v4/latest/${encodeURIComponent(base)}`
  //INR
  const res = await fetch(url)
  console.log("Exchange ", res)
  if (!res.ok) throw new Error('Failed to fetch exchange rates')
  const json = await res.json()
  const data: RatesResponse = {
    base: json.base || base,
    rates: json.rates as Record<string, number>,
  }
  ratesCache = data
  return data
}

export async function fetchFlag(base: string): Promise<RatesResponse> {
  if (ratesCache && ratesCache.base === base) return ratesCache
  const url = `https:/flagpedia.net/download/api`;
  //INR
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch exchange rates')
  const json = await res.json()
  console.log("Api flag.. ",json);
  const data: RatesResponse = {
    base: json.base || base,
    rates: json.rates as Record<string, number>,
  }
  ratesCache = data
  return data
}
