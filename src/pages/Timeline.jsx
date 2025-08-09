import React, { useMemo, useState } from 'react'
import { Box, TextField, MenuItem, Typography } from '@mui/material'
import { Gantt, ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import dayjs from 'dayjs'

export function TimelinePage({ state, saveState }) {
  const [projectId, setProjectId] = useState(state.projects[0]?.id || '')
  const project = useMemo(() => state.projects.find(p => p.id === projectId) || null, [state, projectId])

  const tasks = (project?.tasks || []).map(t => ({
    id: t.id,
    name: t.title,
    start: t.start ? new Date(t.start) : new Date(),
    end: t.end ? new Date(t.end) : dayjs().add(2, 'day').toDate(),
    type: 'task',
    progress: 0,
    isDisabled: false,
  }))

  function onDateChange(task) {
    if (!project) return
    const newTasks = project.tasks.map(t => t.id === task.id ? { ...t, start: dayjs(task.start).format('YYYY-MM-DD'), end: dayjs(task.end).format('YYYY-MM-DD') } : t)
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
      </Box>
      {project ? (
        <Gantt
          tasks={tasks}
          viewMode={ViewMode.Day}
          onDateChange={onDateChange}
          listCellWidth="200px"
        />
      ) : (
        <Typography variant="body1" color="text.secondary">Create a project and add tasks to use the timeline.</Typography>
      )}
    </Box>
  )
}
