import { describe, test, expect } from 'vitest'
import { calculateConversion, isValidAmount } from '../utils/currency'

describe('validation', () => {
  test.each(['', 'abc', '10,0', '  ', '0.', '.5'])('invalid: %s', (v) => {
    expect(isValidAmount(v)).toBe(false)
  })
  test.each(['0', '1', '10', '10.5', '1000.123456'])('valid: %s', (v) => {
    expect(isValidAmount(v)).toBe(true)
  })
})

describe('conversion', () => {
  const rates = { EUR: 1.16, USD: 1.24 }
  test('multiplies by target rate', () => {
    expect(calculateConversion(100, 'GBP', 'EUR', rates)).toBeCloseTo(116)
  })
})
