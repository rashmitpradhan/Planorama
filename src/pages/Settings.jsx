import React, { useRef, useState } from 'react'
import { Box, Switch, FormControlLabel, Button, Typography, Divider } from '@mui/material'

export function SettingsPage({ state, saveState }) {
  const [firebaseEnabled, setFirebaseEnabled] = useState(false)
  const fileRef = useRef()

  function exportJSON() {
    const data = JSON.stringify(state, null, 2)
    const dt = new Date()
    const y = dt.getFullYear()
    const m = String(dt.getMonth()+1).padStart(2,'0')
    const d = String(dt.getDate()).padStart(2,'0')
    const blob = new Blob([data], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `planorama_export_${y}${m}${d}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function importJSON(e, replace=false) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.projects) || !Array.isArray(parsed.myDayOnly)) {
          alert('Invalid Planorama JSON schema.')
          return
        }
        if (replace) {
          saveState(parsed)
        } else {
          // merge: by project id, fallback to append
          const merged = { ...state }
          const existingIds = new Set(merged.projects.map(p => p.id))
          const newOnes = parsed.projects.filter(p => !existingIds.has(p.id))
          merged.projects = [...merged.projects, ...newOnes]
          merged.myDayOnly = [...merged.myDayOnly, ...parsed.myDayOnly]
          saveState(merged)
        }
        alert('Import successful.')
      } catch (err) {
        alert('Failed to parse JSON: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Sync</Typography>
      <FormControlLabel
        control={<Switch checked={firebaseEnabled} onChange={e => setFirebaseEnabled(e.target.checked)} />}
        label="Enable Firebase Sync (placeholder)"
      />
      <Typography variant="body2" color="text.secondary">
        This is a placeholder. No Firebase keys in repo. See README for how to enable later.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Data</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={exportJSON}>Export JSON</Button>
        <input type="file" accept="application/json" ref={fileRef} hidden onChange={importJSON} />
        <Button variant="outlined" onClick={() => fileRef.current?.click()}>Import (Merge)</Button>
        <Button color="error" variant="outlined" onClick={(e) => { fileRef.current.onchange = (ev) => importJSON(ev, true); fileRef.current?.click(); }}>Import (Replace)</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Auth (placeholder)</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined">Sign In</Button>
        <Button variant="outlined">Sign Out</Button>
      </Box>
    </Box>
  )
}
