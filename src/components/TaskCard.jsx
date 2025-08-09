import React from 'react'
import { Paper, Typography, TextField, Box, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

export default function TaskCard({task, onUpdate}){
  const [editing, setEditing] = React.useState(false)
  const [title, setTitle] = React.useState(task.title)

  function save(){
    onUpdate({...task, title})
    setEditing(false)
  }

  return (
    <Paper sx={{ p:1, mb:1 }}>
      {!editing ? (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="subtitle1">{task.title}</Typography>
            <Typography variant="caption" color="text.secondary">{task.assignedTo || ''} {task.dueDate ? ' • '+task.dueDate : ''}</Typography>
          </div>
          <IconButton size="small" onClick={()=>setEditing(true)}><EditIcon fontSize="small" /></IconButton>
        </Box>
      ) : (
        <Box>
          <TextField fullWidth size="small" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') save(); if(e.key==='Escape') setEditing(false)}} />
          <Box sx={{ mt:1, display:'flex', gap:1 }}>
            <IconButton onClick={save}><SaveIcon /></IconButton>
            <IconButton onClick={()=>setEditing(false)}><CloseIcon /></IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
