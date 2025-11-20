import { fetchFlag } from "../services/api"
export function isValidAmount(input: string): boolean {
  if (input.trim() === '') return false
  // Allow integers or decimals with dot, no thousands separator
  return /^\d+(?:\.\d{1,6})?$/.test(input.trim())
}

export function formatNumber(num: number, maximumFractionDigits = 6): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(num)
}

export function calculateConversion(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to) return amount
  // rates are relative to base "from"
  const rate = rates[to]
  if (rate == null) throw new Error(`Missing rate for ${to}`)
  return amount * rate
}

// Very lightweight currency->flag mapping. Fallback: lowercase first two letters.
const currencyToFlag: Record<string, string> = {
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb',
  JPY: 'jp',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  NZD: 'nz',
  INR: 'in',
  AED: 'ae',
  AFN: 'af',
  ALL: 'al',
  AMD: 'am',
  ARS: 'ar',
  BRL: 'br',
  CLP: 'cl',
  COP: 'co',
  CZK: 'cz',
  DKK: 'dk',
  HKD: 'hk',
  HUF: 'hu',
  ILS: 'il',
  KRW: 'kr',
  KZT: 'kz',
  MXN: 'mx',
  NOK: 'no',
  PLN: 'pl',
  RON: 'ro',
  RUB: 'ru',
  SAR: 'sa',
  SEK: 'se',
  SGD: 'sg',
  THB: 'th',
  TRY: 'tr',
  TWD: 'tw',
  ZAR: 'za',
}

export function flagUrlForCurrency(code: string): string {
  const country = currencyToFlag[code.toUpperCase()] || code.slice(0, 2).toLowerCase()
  // Flagpedia PNG 24px height
  return `https://flagcdn.com/w20/${country}.png`
}
