import React, { useMemo, useState } from 'react'
import { CssBaseline, AppBar, Toolbar, Typography, Container, BottomNavigation, BottomNavigationAction, Paper, IconButton } from '@mui/material'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import TimelineIcon from '@mui/icons-material/Timeline'
import TodayIcon from '@mui/icons-material/Today'
import SettingsIcon from '@mui/icons-material/Settings'
import { Boards } from './pages/Boards.jsx'
import { TimelinePage } from './pages/Timeline.jsx'
import { MyDay } from './pages/MyDay.jsx'
import { SettingsPage } from './pages/Settings.jsx'
import { useStorage } from './utils/storage.js'

export default function App() {
  const { state, saveState } = useStorage()
  const [tab, setTab] = useState(0)

  const pages = useMemo(() => [
    { label: 'Boards', icon: <DashboardCustomizeIcon />, element: <Boards state={state} saveState={saveState} /> },
    { label: 'Timeline', icon: <TimelineIcon />, element: <TimelinePage state={state} saveState={saveState} /> },
    { label: 'My Day', icon: <TodayIcon />, element: <MyDay state={state} saveState={saveState} /> },
    { label: 'Settings', icon: <SettingsIcon />, element: <SettingsPage state={state} saveState={saveState} /> },
  ], [state])

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Planorama</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ pb: 10, pt: 2 }}>
        {pages[tab].element}
      </Container>
      <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation
          value={tab}
          onChange={(_, v) => setTab(v)}
          showLabels
        >
          {pages.map((p, idx) => (
            <BottomNavigationAction key={idx} label={p.label} icon={p.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  )
}
