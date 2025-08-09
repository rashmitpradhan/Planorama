import React from 'react'
import { Box, Typography } from '@mui/material'
import TaskCard from './TaskCard.jsx'

export default function KanbanColumn({ title, tasks, onTitleEdit, onDelete }) {
  return (
    <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 2, minHeight: 200 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>{title}</Typography>
      {tasks.map(t => (
        <TaskCard key={t.id} task={t} onTitleEdit={onTitleEdit} onDelete={onDelete} />
      ))}
    </Box>
  )
}
