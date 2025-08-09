import React from 'react'
import { Typography, Paper, List, ListItem, ListItemText, Checkbox } from '@mui/material'
import { loadData, saveData, updateTask } from '../utils/storage'

export default function MyDay(){
  const [data, setData] = React.useState(()=> loadData())
  React.useEffect(()=> saveData(data), [data])

  const today = new Date().toISOString().slice(0,10)
  const auto = (data.tasks || []).filter(t => !t.completed && t.dueDate && t.dueDate.slice(0,10)===today)
  const manual = (data.tasks || []).filter(t => !t.completed && t.myDay)

  function toggleDone(id){
    const all = loadData()
    const t = all.tasks.find(x=>x.id===id)
    if(t){ t.completed = !t.completed; t.updatedAt = new Date().toISOString(); updateTask(t); setData(loadData()) }
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>My Day — {new Date().toLocaleDateString()}</Typography>
      <Typography variant="subtitle1">Due today</Typography>
      <Paper sx={{ mb:2, p:1 }}>
        <List>
          {auto.length===0 && <ListItem><ListItemText primary="No tasks due today" /></ListItem>}
          {auto.map(t => (
            <ListItem key={t.id} secondaryAction={<Checkbox checked={t.completed} onChange={()=>toggleDone(t.id)} />}>
              <ListItemText primary={t.title} secondary={`${t.projectId} • ${t.dueDate}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Typography variant="subtitle1">Added to My Day</Typography>
      <Paper sx={{ p:1 }}>
        <List>
          {manual.length===0 && <ListItem><ListItemText primary="No tasks in My Day" /></ListItem>}
          {manual.map(t => (
            <ListItem key={t.id} secondaryAction={<Checkbox checked={t.completed} onChange={()=>toggleDone(t.id)} />}>
              <ListItemText primary={t.title} secondary={`${t.projectId} • ${t.dueDate || 'no date'}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}
