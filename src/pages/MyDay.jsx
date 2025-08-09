import React, { useMemo, useState } from 'react'
import { Box, Checkbox, List, ListItem, ListItemText, TextField, IconButton, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

export function MyDay({ state, saveState }) {
  const today = dayjs().format('YYYY-MM-DD')
  const tasksDueToday = useMemo(() => {
    return state.projects.flatMap(p => p.tasks.filter(t => t.dueDate === today)).map(t => ({ ...t, projectId: state.projects.find(p => p.tasks.some(x => x.id === t.id))?.id }))
  }, [state])

  const [newTitle, setNewTitle] = useState('')

  function toggleDone(itemId, listType) {
    if (listType === 'myDayOnly') {
      const list = state.myDayOnly.map(x => x.id === itemId ? { ...x, done: !x.done } : x)
      saveState({ ...state, myDayOnly: list })
    }
  }

  function addMyDay() {
    if (!newTitle.trim()) return
    const list = [...state.myDayOnly, { id: uuidv4(), title: newTitle.trim(), done: false }]
    saveState({ ...state, myDayOnly: list })
    setNewTitle('')
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Due Today</Typography>
        <List>
          {tasksDueToday.length === 0 && <Typography color="text.secondary">No tasks due today.</Typography>}
          {tasksDueToday.map(t => (
            <ListItem key={t.id} dense>
              <Checkbox disabled />
              <ListItemText primary={t.title} secondary={t.dueDate} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>My Day</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Add a quick task"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMyDay()}
          />
          <IconButton color="primary" onClick={addMyDay}><AddIcon/></IconButton>
        </Box>
        <List>
          {state.myDayOnly.map(item => (
            <ListItem key={item.id} dense>
              <Checkbox checked={!!item.done} onChange={() => toggleDone(item.id, 'myDayOnly')} />
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}
