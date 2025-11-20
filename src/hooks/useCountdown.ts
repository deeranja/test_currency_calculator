import { useEffect, useRef, useState } from 'react'

export function useCountdown(seconds: number, startKey: number | null) {
  const [remaining, setRemaining] = useState(seconds)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (startKey == null) return
    // reset
    setRemaining(seconds)
    if (timer.current != null) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setRemaining((s: number) => {
        if (s <= 1) {
          if (timer.current != null) window.clearInterval(timer.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (timer.current != null) window.clearInterval(timer.current)
    }
  }, [startKey, seconds])

  return remaining
}

export function formatSeconds(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
