import React, { useMemo, useRef, useState } from 'react'
import { flagUrlForCurrency } from '../utils/currency'

type Item = { code: string; name: string }

type Props = {
  items: Item[]
  value: string
  onChange: (code: string) => void
  label?: string
}

export default function CurrencyDropdown({ items, value, onChange, label }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) => i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
    )
  }, [items, query])

  console.log("items... ",items)
  const current = items.find((i) => i.code === value)
  const hasNoResults = filtered.length === 0 && query.trim() !== ''

  return (
    <div className="dropdown">
      {label && <label style={{ display: 'block', marginBottom: 6, color: '#9ca3af' }}>{label}</label>}
      <button
        ref={buttonRef}
        className="select"
        onClick={() => setOpen((o: boolean) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <img className="flag" src={`https://flagcdn.com/16x12/${current?.code.slice(0,2).toLowerCase()}.png`} />
        <span style={{ fontWeight: 700 }}>{current?.name ?? value}</span>
        <span className="code">{value}</span>
        <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>▾</span>
      </button>
      {open && (
        <div className="menu" role="listbox">
          <div className="search" style={{ borderColor: hasNoResults ? '#ef4444' : '#1f2937' }}>
            <input
              autoFocus
              placeholder="Search currency"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {filtered.length === 0 ? (
            <div className="no-results">No results</div>
          ) : (
            filtered.map((i) => (
              <div
                role="option"
                key={i.code}
                className="option"
                onClick={() => {
                  onChange(i.code)
                  setOpen(false)
                  setQuery('')
                  buttonRef.current?.focus()
                }}
              >
                <img className="flag" src={`https://flagcdn.com/16x12/${i.code.slice(0,2).toLowerCase()}.png`} alt="" />
                <span style={{ fontWeight: 600 }}>{i.name}</span>
                <span className="code">{i.code}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
