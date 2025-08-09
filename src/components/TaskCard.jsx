import React, { useState } from 'react'
import { Card, CardContent, IconButton, TextField, Typography, Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, onTitleEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id, data: { column: task.status } })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <Card ref={setNodeRef} style={style} variant="outlined" sx={{ mb: 1 }} {...attributes} {...listeners}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flexGrow: 1 }} onDoubleClick={() => setEditing(true)}>
          {editing ? (
            <TextField
              size="small"
              value={draft}
              autoFocus
              onChange={e => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { onTitleEdit(task.id, draft); setEditing(false); }
                if (e.key === 'Escape') { setDraft(task.title); setEditing(false); }
              }}
              onBlur={() => { onTitleEdit(task.id, draft); setEditing(false); }}
            />
          ) : (
            <Typography variant="body1">{task.title}</Typography>
          )}
          {task.dueDate && <Typography variant="caption" color="text.secondary">Due {task.dueDate}</Typography>}
        </Box>
        <IconButton size="small" onClick={() => setEditing(true)}><EditIcon fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(task.id)}><DeleteIcon fontSize="small" /></IconButton>
      </CardContent>
    </Card>
  )
}
