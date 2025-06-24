import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Folder,
  Group,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  AddCircleOutline,
  Link as LinkIcon,
  Edit,
  Delete,
  Search,
  PeopleAlt,
  Menu as MenuIcon
} from '@mui/icons-material';

import AssignmentIcon from '@mui/icons-material/Assignment';
import AddTaskIcon from '@mui/icons-material/PlaylistAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';

import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

const drawerWidth = 240;
const collapsedWidth = 64;

const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    width: ${(props) => (props.open ? drawerWidth : collapsedWidth)}px;
    transition: width 0.3s ease;
    height: 100%;
    overflow-x: hidden;
    background-color: #ffffff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  }
`;

const Sidebar = ({ open, toggleOpen }) => {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const toggleTasks = () => setTasksOpen(!tasksOpen);

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:768px)');

  const isActive = (path) => location.pathname === path;

  const toggleProjects = () => setProjectsOpen(!projectsOpen);
  const toggleTeams = () => setTeamsOpen(!teamsOpen);

  const toggleDrawer = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else toggleOpen();
  };

  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname]);

  const renderMenuItems = (
    <>
      <Tooltip title={!open && !mobileOpen ? 'Dashboard' : ''} placement="right">
        <ListItemButton
          selected={isActive('/dashboard')}
          onClick={() => navigate('/dashboard')}
        >
          <ListItemIcon><Dashboard /></ListItemIcon>
          {(open || mobileOpen) && <ListItemText primary="Dashboard" />}
        </ListItemButton>
      </Tooltip>

      {/* Projects */}
      <ListItemButton onClick={toggleProjects}>
        <ListItemIcon><Folder /></ListItemIcon>
        {(open || mobileOpen) && (
          <>
            <ListItemText primary="Projects" />
            {projectsOpen ? <ExpandLess /> : <ExpandMore />}
          </>
        )}
      </ListItemButton>
      <Collapse in={projectsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {[
            { label: 'All Projects', icon: <Folder fontSize="small" />, path: '/projects/list' },
            { label: 'Create Project', icon: <AddCircleOutline fontSize="small" />, path: '/projects/create' },
            { label: 'Assign to Team', icon: <LinkIcon fontSize="small" />, path: '/projects/assign' },
            { label: 'Update Project', icon: <Edit fontSize="small" />, path: '/projects/update' },
            { label: 'Delete Project', icon: <Delete fontSize="small" />, path: '/projects/delete' },
            { label: 'Projects by Team', icon: <PeopleAlt fontSize="small" />, path: '/projects/team' }
          ].map((item, idx) => (
            <ListItemButton
              key={idx}
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{ pl: 4 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>

        {/* Teams */}
        <ListItemButton onClick={toggleTeams}>
            <ListItemIcon><Group /></ListItemIcon>
            {(open || mobileOpen) && (
                <>
                <ListItemText primary="Teams" />
                {teamsOpen ? <ExpandLess /> : <ExpandMore />}
                </>
            )}
        </ListItemButton>
        <Collapse in={teamsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {[
                { label: 'My Teams', path: '/teams/list' },
                { label: 'Create Team', path: '/teams/create' },
                { label: 'My Invites', path: '/teams/my-invites' }
                ].map((item, idx) => (
                <ListItemButton
                    key={idx}
                    selected={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    sx={{ pl: 4 }}
                >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                    <Group fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItemButton>
                ))}
            </List>
        </Collapse>

        {/* Tasks */}
        <ListItemButton onClick={toggleTasks}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            {(open || mobileOpen) && (
                <>
                <ListItemText primary="Tasks" />
                {tasksOpen ? <ExpandLess /> : <ExpandMore />}
                </>
            )}
        </ListItemButton>
        <Collapse in={tasksOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {[
                { label: 'All Tasks', icon: <ListAltIcon fontSize="small" />, path: '/tasks/list' },
                { label: 'Create Task', icon: <AddTaskIcon fontSize="small" />, path: '/tasks/create' }
                ].map((item, idx) => (
                <ListItemButton
                    key={idx}
                    selected={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    sx={{ pl: 4 }}
                >
                    <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItemButton>
                ))}
            </List>
        </Collapse>
    </>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {isMobile ? (
        <>
          <IconButton
            onClick={toggleDrawer}
            sx={{ m: 1, position: 'fixed', top: 8, left: 10, zIndex: 2500 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
              sx: {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
              },
            }}
          >
            <Box display="flex" flexDirection="column" p={2}>
              <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <img src="/logo.svg" alt="Logo" width={40} />
                <Box ml={1} fontWeight="bold" fontSize={18}>TeamHub</Box>
              </Box>
              <Divider />
              <List>{renderMenuItems}</List>
            </Box>
          </Drawer>
        </>
      ) : (
        <StyledDrawer variant="permanent" open={open}>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" py={2}>
            <img src="/logo.svg" alt="Logo" width={open ? 40 : 30} />
            {open && <Box fontWeight="bold" fontSize={18}>TeamHub</Box>}
          </Box>
          <Divider />
          <List>{renderMenuItems}</List>

          {/* Toggle Button */}
          <IconButton
            onClick={toggleDrawer}
            sx={{
              position: 'absolute',
              bottom: '10px',
              left:'10px',
              transform: 'translateX(-50%, -50%)',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              // borderRadius: '50%',
              width: 32,
              height: 32,
              zIndex: 2000,
              boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
              // transition: 'left 0.3s ease',
              margin: '0px auto'
            }}
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </StyledDrawer>
      )}
    </Box>
  );
};

export default Sidebar;
