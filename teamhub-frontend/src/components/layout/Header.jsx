import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Popover,
  MenuItem,
  Menu,
  Divider,
  Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';

const Header = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [inviteCount, setInviteCount] = useState(0);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserAndInvites = async () => {
      try {
        if (!token) return;
        const { data: userData } = await api.get('/auth/getuser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: userData.user.name,
          email: userData.user.email,
        });

        const { data: inviteData } = await api.get('/teams/my-invites', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pendingCount = inviteData.invites?.filter((inv) => inv.status === 'PENDING').length || 0;
        setInviteCount(pendingCount);
      } catch (err) {
        console.error('Failed to fetch user/invites:', err);
      }
    };

    fetchUserAndInvites();
  }, [token]);

  const handleNotifClick = (e) => {
    setAnchorNotif(e.currentTarget);
  };

  const handleAvatarClick = (e) => {
    setAnchorUser(e.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const closeMenus = () => {
    setAnchorNotif(null);
    setAnchorUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Hello {user.name || 'User'}, Welcome to Team Hub
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          {/* Notifications */}
          <IconButton onClick={handleNotifClick}>
            <NotificationsIcon />
            {inviteCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  backgroundColor: '#f44336',
                  color: 'white',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  fontSize: 12,
                  top: 10,
                  right: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {inviteCount}
              </Box>
            )}
          </IconButton>

          <Popover
            open={Boolean(anchorNotif)}
            anchorEl={anchorNotif}
            onClose={() => setAnchorNotif(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Box p={2} minWidth={200}>
              <Typography variant="body1">
                You have {inviteCount} pending team invite{inviteCount !== 1 ? 's' : ''}.
              </Typography>
              <Button
                variant="text"
                onClick={() => {
                  navigate('/teams/my-invites');
                  closeMenus();
                }}
              >
                View All
              </Button>
            </Box>
          </Popover>

          {/* User Avatar */}
          <Tooltip title={user.email || ''}>
            <IconButton onClick={handleAvatarClick}>
              <Avatar>{user.name?.charAt(0) || 'U'}</Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorUser}
            open={Boolean(anchorUser)}
            onClose={() => setAnchorUser(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MenuItem disabled>{user.name}</MenuItem>
            <MenuItem disabled>{user.email}</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
