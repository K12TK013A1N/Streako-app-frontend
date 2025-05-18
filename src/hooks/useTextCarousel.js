import { useState, useEffect } from 'react'

/**
 * Cycles through an array of texts at a given interval.
 * @param {string[]} items - The texts to cycle.
 * @param {number} delay - Milliseconds between changes.
 */
export default function useTextCarousel(items, delay = 3000) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % items.length)
    }, delay)
    return () => clearInterval(id)
  }, [items, delay])

  return items[idx]
}