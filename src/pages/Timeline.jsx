import React from 'react'
import { Paper, Typography } from '@mui/material'
import Gantt from 'frappe-gantt'
import { loadData, updateTask } from '../utils/storage'
import { format, parseISO } from 'date-fns'

export default function Timeline(){
  const ref = React.useRef()

  React.useEffect(()=> {
    const data = loadData()
    const tasks = (data.tasks || []).map(t => ({
      id: t.id,
      name: t.title,
      start: t.startDate ? t.startDate : (t.dueDate? t.dueDate : new Date().toISOString().slice(0,10)),
      end: t.dueDate ? t.dueDate : (t.startDate? t.startDate : new Date().toISOString().slice(0,10)),
      progress: t.completed ? 100 : 0,
      dependencies: ''
    }))
    if(!ref.current) return
    ref.current.innerHTML = ''
    const gantt = new Gantt(ref.current, tasks, {
      on_click: task => { console.log('click', task) },
      on_date_change: (task, start, end) => {
        // persist date change
        const all = loadData()
        const t = all.tasks.find(x=>x.id===task.id)
        if(t){
          t.startDate = start
          t.dueDate = end
          t.updatedAt = new Date().toISOString()
          updateTask(t)
        }
      },
      on_view_change: (mode) => console.log('view', mode)
    })
    return ()=>{}
  }, [])

  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6" gutterBottom>Timeline (Gantt)</Typography>
      <div ref={ref} style={{ minHeight: 300 }} />
      <Typography variant="body2" sx={{ mt:2 }}>Drag bars to change start/end dates — changes are saved to LocalStorage.</Typography>
    </Paper>
  )
}
