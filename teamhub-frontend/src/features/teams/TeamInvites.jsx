import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const TeamInvites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teams/my-invites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvites(res.data.invites || []);
    } catch (err) {
      toast.error('Failed to fetch team invites');
    } finally {
      setLoading(false);
    }
  };

  const respondToInvite = async (inviteId, status) => {
    try {
      if(status == 'ACCEPTED') {
        await api.post(
          `/teams/accept-invite/${inviteId}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else if(status == 'REJECTED') {
        await api.post(
          `/teams/reject-invite/${inviteId}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      toast.success(`Invite ${status.toLowerCase()} successfully`);
      fetchInvites(); // Refresh list
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Action failed');
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Team Invites
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : invites.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No pending invites.
        </Typography>
      ) : (
        <Paper elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell>Team Name</TableCell>
                <TableCell>Invited By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.team?.name || '—'}</TableCell>
                  <TableCell>{invite.invitedBy?.name || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={invite.status}
                      color={
                        invite.status === 'ACCEPTED'
                          ? 'success'
                          : invite.status === 'REJECTED'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {invite.status === 'PENDING' && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => respondToInvite(invite?.team?.id, 'ACCEPTED')}
                          sx={{ mr: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => respondToInvite(invite?.team?.id, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default TeamInvites;
