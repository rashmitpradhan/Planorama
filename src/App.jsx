import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Boards from './pages/Boards'
import Timeline from './pages/Timeline'
import MyDay from './pages/MyDay'
import Settings from './pages/Settings'

export default function App(){
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr:2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Brand & Web PM</Typography>
          <Button color="inherit" component={Link} to="/">Boards</Button>
          <Button color="inherit" component={Link} to="/timeline">Timeline</Button>
          <Button color="inherit" component={Link} to="/myday">My Day</Button>
          <Button color="inherit" component={Link} to="/settings">Settings</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p:2 }}>
        <Routes>
          <Route path="/" element={<Boards />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/myday" element={<MyDay />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}
