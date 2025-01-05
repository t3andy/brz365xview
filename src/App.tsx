import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Upload from './pages/Upload';

const DRAWER_WIDTH = 240;

export default function App() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box component="h1" sx={{ fontSize: '1.2rem', m: 0 }}>
            BRZ365 XInvoice Viewer
          </Box>
        </Toolbar>
      </AppBar>

      {/* Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: DRAWER_WIDTH, 
            boxSizing: 'border-box',
            bgcolor: 'background.paper'
          },
        }}
      >
        <Toolbar /> {/* Spacer für AppBar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => navigate('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem button onClick={() => navigate('/upload')}>
              <ListItemIcon>
                <UploadFileIcon />
              </ListItemIcon>
              <ListItemText primary="Rechnung hochladen" />
            </ListItem>

            <ListItem button onClick={() => navigate('/history')}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Verlauf" />
            </ListItem>

            <ListItem button onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Einstellungen" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 0,
        pl: 3,
        pt: 3,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: 0
      }}>
        <Toolbar /> {/* Spacer für AppBar */}
        <Routes>
          <Route path="/upload" element={<Upload />} />
          <Route path="/" element={<Upload />} />
          {/* Weitere Routen werden später hinzugefügt */}
          <Route path="/history" element={<div>Verlauf (coming soon)</div>} />
          <Route path="/settings" element={<div>Einstellungen (coming soon)</div>} />
        </Routes>
      </Box>
    </Box>
  );
}
