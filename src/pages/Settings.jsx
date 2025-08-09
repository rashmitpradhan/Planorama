import React from 'react'
import { Paper, Typography, Switch, Button, Box, TextField } from '@mui/material'
import { loadData, exportJSON, importJSON } from '../utils/storage'

export default function Settings(){
  const [syncEnabled, setSyncEnabled] = React.useState(false)
  const [importText, setImportText] = React.useState('')

  function toggleSync(){
    // placeholder: real Firebase init happens when user supplies config (not included)
    setSyncEnabled(v=>!v)
    alert('Firebase sync is a placeholder. Configure Firebase to enable real sync.')
  }

  function doExport(){
    const json = exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'pm_data_export.json'; a.click()
    URL.revokeObjectURL(url)
  }

  function doImport(){
    if(!importText) return alert('Paste JSON into textbox and click Import')
    const ok = importJSON(importText)
    if(ok) alert('Imported successfully — reload the page to see changes')
    else alert('Invalid JSON')
  }

  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">Settings</Typography>
      <Box sx={{ display:'flex', alignItems:'center', gap:2, mt:2 }}>
        <Typography>Enable Firebase Sync</Typography>
        <Switch checked={syncEnabled} onChange={toggleSync} />
      </Box>
      <Box sx={{ mt:3 }}>
        <Typography variant="subtitle1">Backup / Restore</Typography>
        <Box sx={{ display:'flex', gap:1, mt:1 }}>
          <Button variant="outlined" onClick={doExport}>Export JSON</Button>
          <Button variant="outlined" component="label">Import File
            <input hidden type="file" accept="application/json" onChange={e=>{ const f = e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = ev => setImportText(ev.target.result); reader.readAsText(f)}} />
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt:2 }}>Or paste JSON below and click Import</Typography>
        <TextField multiline minRows={6} fullWidth value={importText} onChange={e=>setImportText(e.target.value)} sx={{ mt:1 }} />
        <Box sx={{ mt:1 }}>
          <Button variant="contained" onClick={doImport}>Import</Button>
        </Box>
      </Box>
    </Paper>
  )
}
