import React, { useEffect, useMemo, useState } from 'react'
import CurrencyDropdown from './components/CurrencyDropdown'
import { fetchCurrencyNames, fetchRates, fetchFlag } from './services/api'
import { calculateConversion, flagUrlForCurrency, formatNumber, isValidAmount } from './utils/currency'
import { formatSeconds, useCountdown } from './hooks/useCountdown'

type CurrencyItem = { code: string; name: string }

export default function App() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('GBP')
  const [to, setTo] = useState('EUR')

  const [names, setNames] = useState<Record<string, string>>({})
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loadingRates, setLoadingRates] = useState(false)
  const [flag,setFlag] = useState<Record<string,number>>({});

  const [lastConversionKey, setLastConversionKey] = useState<number | null>(null)
  const remaining = useCountdown(10 * 60, lastConversionKey)

  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrencyNames().then(setNames).catch(console.error)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoadingRates(true)
        const res = await fetchRates(from)
        const resFlag = await fetchFlag(from);
        console.log("flag.. ",resFlag);

        if (!cancelled) setRates(res.rates)
      } catch (e) {
        console.error(e)
        if (!cancelled) setRates({})
      } finally {
        if (!cancelled) setLoadingRates(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [from])

 




  const items: CurrencyItem[] = useMemo(
    () =>
      Object.entries(names)
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.code.localeCompare(b.code)),
    [names]
  )

  const amountValid = isValidAmount(amount)
  const canConvert = amountValid && from && to && !loadingRates

  const converted = useMemo(() => {
    if (!amountValid) return null
    if (!rates || rates[to] == null) return null
    const value = calculateConversion(parseFloat(amount), from, to, rates)
    return value
  }, [amount, amountValid, from, to, rates])

  function handleSwap() {
    setFrom(to)
    setTo(from)
  }

  function handleConvert() {
    if (!canConvert || converted == null) return
    // trigger timer by bumping key
    setLastConversionKey(Date.now())
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: 16 }}>Currency Converter</h1>
      <div className="card">
        <div className="row">
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#000000' }}>Amount</label>
            <input
              className={`input ${!amountValid ? 'error' : ''}`}
              placeholder="Enter amount"
              value={amount}
              inputMode="decimal"
              onChange={(e) => setAmount(e.target.value)}
            />
            {!amountValid && (
              <div className="error-text">{amount} is not a valid number</div>
            )}
          </div>
          <div className="controls" style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <button className="button secondary" onClick={handleSwap} title="Swap currencies">
              ⇅ Swap
            </button>
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <CurrencyDropdown label="From" items={items} value={from} onChange={setFrom} />
          <CurrencyDropdown label="To" items={items} value={to} onChange={setTo} />
        </div>

        {converted != null && lastConversionKey != null && remaining > 0 && (
          <div className="result" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>
              {formatNumber(parseFloat(amount))} {from} is equivalent to{' '}
              <strong>{formatNumber(converted)}</strong> {to}
            </span>
            <span className="timer" style={{ marginLeft: 'auto', color:"#fff" }}>
              Expires in {formatSeconds(remaining)}
            </span>
          </div>
        )}

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="button" disabled={!canConvert} onClick={handleConvert}>
            {loadingRates ? 'Loading rates…' : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  )
}
