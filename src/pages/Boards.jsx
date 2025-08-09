import React from 'react'
import { Grid, Card, CardHeader, CardContent, Button, Box, Typography } from '@mui/material'
import { loadData, saveData, updateTask, addTask, updateProject } from '../utils/storage'
import TaskCard from '../components/TaskCard'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

const statuses = ['Backlog','In Progress','Review','Completed']

function Column({name, tasks, onDrop, onAdd, onUpdateTask}){
  return (
    <Card sx={{ width: 320, mr:2, display:'flex', flexDirection:'column' }}>
      <CardHeader title={name} />
      <CardContent sx={{ flex:1, minHeight:200 }}>
        <SortableContext items={tasks.map(t=>t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(t => (
            <div key={t.id} style={{ marginBottom:8 }}>
              <TaskCard task={t} onUpdate={onUpdateTask} />
            </div>
          ))}
        </SortableContext>
      </CardContent>
      <Box sx={{ p:1 }}>
        <Button size="small" variant="outlined" fullWidth onClick={()=>onAdd(name)}>Add task</Button>
      </Box>
    </Card>
  )
}

export default function Boards(){
  const [data, setData] = React.useState(()=> loadData())
  const [projectId, setProjectId] = React.useState(data.projects?.[0]?.id || null)

  React.useEffect(()=> { saveData(data) }, [data])

  function onAddTask(status){
    const t = { projectId, title: 'New Task', status, priority:'medium', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() }
    const newTask = addTask(t)
    setData(loadData())
  }

  function onUpdateTask(task){
    updateTask(task)
    setData(loadData())
  }

  // basic drag across columns handled by HTML5 drag/drop to keep code manageable
  function allowDrop(e){ e.preventDefault() }
  function onDragStart(e, id){ e.dataTransfer.setData('text/plain', id) }
  function onDrop(e, newStatus){
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    const all = loadData()
    const t = all.tasks.find(x=>x.id===id)
    if(t){
      t.status = newStatus
      t.updatedAt = new Date().toISOString()
      updateTask(t)
      setData(loadData())
    }
  }

  const projects = data.projects || []
  const tasksFor = (status) => (data.tasks || []).filter(t=>t.projectId===projectId && t.status===status).sort((a,b)=> (a.updatedAt < b.updatedAt)?1:-1)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardHeader title="Projects" />
          <CardContent>
            {projects.map(p => (
              <Button key={p.id} fullWidth variant={p.id===projectId? 'contained':'outlined'} onClick={()=>setProjectId(p.id)} sx={{ mb:1 }}>
                {p.name}
              </Button>
            ))}
            <Button fullWidth variant="text">+ New Project</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={9}>
        <Box sx={{ display:'flex', overflowX:'auto' }}>
          {statuses.map(s => (
            <div key={s} onDrop={(e)=>onDrop(e,s)} onDragOver={allowDrop}>
              <Column name={s} tasks={tasksFor(s)} onAdd={onAddTask} onUpdateTask={onUpdateTask} />
            </div>
          ))}
        </Box>
      </Grid>
    </Grid>
  )
}
