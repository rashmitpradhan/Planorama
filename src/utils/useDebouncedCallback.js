import { useRef } from 'react'

export function useDebouncedCallback(fn, delay=500) {
  const tRef = useRef(null)
  function debounced(...args) {
    if (tRef.current) clearTimeout(tRef.current)
    tRef.current = setTimeout(() => fn(...args), delay)
  }
  debounced.flushImmediate = (...args) => fn(...args)
  return debounced
}
