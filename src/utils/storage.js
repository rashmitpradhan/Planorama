import { useEffect, useState } from 'react'

const KEY = 'planorama_state'

const defaultState = {
  projects: [],
  myDayOnly: []
}

export function useStorage() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  function saveState(next) {
    setState(next)
  }

  return { state, saveState }
}
