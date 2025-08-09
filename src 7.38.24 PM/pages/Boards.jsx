import React, { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { DndContext, closestCorners } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import KanbanColumn from '../components/KanbanColumn.jsx'
import { useDebouncedCallback } from '../utils/useDebouncedCallback.js'

const STATUSES = ['Backlog','In Progress','Review','Completed']

export function Boards({ state, saveState }) {
  const [projectId, setProjectId] = useState(state.projects[0]?.id || null)
  const [open, setOpen] = useState(false)
  const [taskDraft, setTaskDraft] = useState({ title: '', status: 'Backlog', dueDate: '' })
  const project = useMemo(() => state.projects.find(p => p.id === projectId) || null, [state, projectId])

  function createProject() {
    const id = uuidv4()
    const newProj = { id, name: `Project ${state.projects.length + 1}`, tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    saveState({ ...state, projects: [...state.projects, newProj] })
    setProjectId(id)
  }

  function deleteProject(id) {
    const filtered = state.projects.filter(p => p.id !== id)
    saveState({ ...state, projects: filtered })
    if (projectId === id) setProjectId(filtered[0]?.id || null)
  }

  function addTask() {
    if (!project) return
    const t = { id: uuidv4(), title: taskDraft.title || 'Untitled', status: taskDraft.status, dueDate: taskDraft.dueDate || undefined, start: undefined, end: undefined }
    const updated = { ...project, tasks: [...project.tasks, t], updatedAt: new Date().toISOString() }
    saveState({ ...state, projects: state.projects.map(p => p.id === project.id ? updated : p) })
    setOpen(false); setTaskDraft({ title: '', status: 'Backlog', dueDate: '' })
  }

  function onDragEnd({ active, over }) {
    if (!over || !project) return
    if (active.id === over.id) return
    const tasks = project.tasks
    const oldIndex = tasks.findIndex(t => t.id === active.id)
    const overTaskIndex = tasks.findIndex(t => t.id === over.id)
    // If dragging across columns, update status based on over's column (encoded in data)
    const activeTask = tasks[oldIndex]
    let newTasks = tasks.slice()
    if (over.data?.current?.column) {
      newTasks[oldIndex] = { ...activeTask, status: over.data.current.column }
    }
    // Recompute indices within filtered by status
    // Simpler approach: move within full list relative to over index
    const newIndex = overTaskIndex === -1 ? tasks.length - 1 : overTaskIndex
    newTasks = arrayMove(newTasks, oldIndex, newIndex)
    const updated = { ...project, tasks: newTasks, updatedAt: new Date().toISOString() }
    saveState({ ...state, projects: state.projects.map(p => p.id === project.id ? updated : p) })
  }

  const debouncedTitleSave = useDebouncedCallback((taskId, newTitle) => {
    if (!project) return
    const newTasks = project.tasks.map(t => t.id === taskId ? { ...t, title: newTitle } : t)
    const updated = { ...project, tasks: newTasks, updatedAt: new Date().toISOString() }
    saveState({ ...state, projects: state.projects.map(p => p.id === project.id ? updated : p) })
  }, 500)

  function deleteTask(taskId) {
    if (!project) return
    const newTasks = project.tasks.filter(t => t.id !== taskId)
    const updated = { ...project, tasks: newTasks, updatedAt: new Date().toISOString() }
    saveState({ ...state, projects: state.projects.map(p => p.id === project.id ? updated : p) })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Project"
          value={projectId || ''}
          onChange={e => setProjectId(e.target.value)}
          size="small"
          sx={{ minWidth: 240 }}
        >
          {state.projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          {state.projects.length === 0 && <MenuItem value="">No projects yet</MenuItem>}
        </TextField>
        <Button startIcon={<AddIcon />} variant="contained" onClick={createProject}>New Project</Button>
        {project && (
          <IconButton color="error" onClick={() => deleteProject(project.id)}><DeleteIcon/></IconButton>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {project && <Button onClick={() => setOpen(true)} startIcon={<AddIcon/>} variant="outlined">Add Task</Button>}
      </Box>

      {project ? (
        <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
          <Grid container spacing={2}>
            {STATUSES.map(col => (
              <Grid key={col} item xs={12} md={3}>
                <SortableContext items={project.tasks.filter(t => t.status === col).map(t => t.id)} strategy={rectSortingStrategy}>
                  <KanbanColumn
                    title={col}
                    tasks={project.tasks.filter(t => t.status === col)}
                    onTitleEdit={(id, title) => debouncedTitleSave(id, title)}
                    onTitleEditImmediate={(id, title) => debouncedTitleSave.flushImmediate && debouncedTitleSave.flushImmediate(id, title)}
                    onDelete={deleteTask}
                  />
                </SortableContext>
              </Grid>
            ))}
          </Grid>
        </DndContext>
      ) : (
        <Typography variant="body1" color="text.secondary">Create a project to get started.</Typography>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Task</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Title" value={taskDraft.title} onChange={e => setTaskDraft({ ...taskDraft, title: e.target.value })} />
          <TextField select label="Status" value={taskDraft.status} onChange={e => setTaskDraft({ ...taskDraft, status: e.target.value })}>
            {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={taskDraft.dueDate} onChange={e => setTaskDraft({ ...taskDraft, dueDate: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addTask} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
