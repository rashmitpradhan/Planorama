import React from 'react'
import { List, ListItemButton, ListItemText } from '@mui/material'

export default function ProjectList({ projects, selectedId, onSelect }) {
  return (
    <List>
      {projects.map(p => (
        <ListItemButton key={p.id} selected={p.id === selectedId} onClick={() => onSelect(p.id)}>
          <ListItemText primary={p.name} />
        </ListItemButton>
      ))}
    </List>
  )
}
