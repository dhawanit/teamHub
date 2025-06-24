import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TextField, CircularProgress, TableSortLabel,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Autocomplete
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');
const decoded = token ? jwtDecode(token) : null;
const currentUserId = decoded?.userId;

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);

  // Invite dialog state
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);


  // 📦 Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await api.get('/teams/my-teams', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const enriched = data.teams.map((team) => {
          const creator = team.members?.find((m) => m.user.id === team.createdBy);
          return {
            ...team,
            createdByName: creator?.user.name || '—',
            createdByEmail: creator?.user.email || '',
            membersCount: team.members?.length || 0,
          };
        });

        setTeams(enriched);
        setFilteredTeams(enriched);
      } catch (err) {
        console.error('❌ Failed to load teams', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // 🔍 Search
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const result = teams.filter(team =>
      team.name.toLowerCase().includes(lowerSearch) ||
      team.createdByName.toLowerCase().includes(lowerSearch)
    );
    setFilteredTeams(result);
  }, [searchTerm, teams]);

  // ↕️ Sort
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);

    const sorted = [...filteredTeams].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? -1 : 1;
      if (a[field] > b[field]) return isAsc ? 1 : -1;
      return 0;
    });
    setFilteredTeams(sorted);
  };

  // ✉️ Invite
  const openInviteDialog = (teamId) => {
    setSelectedTeamId(teamId);
    setSelectedUser(null);
    setUserQuery('');
    setInviteDialogOpen(true);
  };

  const fetchUsers = async (query) => {
    if (query.length < 2) return;
    setLoadingUsers(true);
    try {
        const { data } = await api.get(`/teams/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
        });

        // ❌ Exclude current user
        const filtered = (data.users || []).filter(user => user.id !== currentUserId);
        setUsers(filtered);
    } catch (err) {
        toast.error('Failed to fetch users');
    } finally {
        setLoadingUsers(false);
    }
  };

  const sendInvite = async () => {
    if (!selectedUser || !selectedTeamId) return;

    try {
      await api.post(`/teams/send-invite/${selectedTeamId}`, { email: selectedUser.email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Invite sent successfully!');
      setInviteDialogOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to send invite');
    }
  };

  const openMembersDialog = (members) => {
    setSelectedMembers(members || []);
    setMemberDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>All Teams</Typography>

      <TextField
        label="Search by name or creator"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                {[
                  { id: 'name', label: 'Team Name' },
                  { id: 'createdByName', label: 'Created By' },
                  { id: 'membersCount', label: 'Members' },
                  { id: 'createdAt', label: 'Created At' }
                ].map((col) => (
                  <TableCell key={col.id}>
                    <TableSortLabel
                      active={sortField === col.id}
                      direction={sortField === col.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    <Tooltip title={team.createdByEmail || ''}>
                      <span>{team.createdByName}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Members">
                        <span
                        onClick={() => openMembersDialog(team.members)}
                        style={{
                            cursor: 'pointer',
                            color: '#1976d2',
                            textDecoration: 'underline'
                        }}
                        >
                        {team.membersCount}
                        </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{new Date(team.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Tooltip title="Send Invite">
                      <IconButton onClick={() => openInviteDialog(team.id)}>
                        <PersonAddIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✉️ Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Invite to Team</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Autocomplete
            fullWidth
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            options={users}
            loading={loadingUsers}
            onInputChange={(e, value) => {
              setUserQuery(value);
              fetchUsers(value);
            }}
            onChange={(e, val) => setSelectedUser(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search user by email"
                placeholder="Start typing..."
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingUsers && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={sendInvite} variant="contained" disabled={!selectedUser}>Send Invite</Button>
        </DialogActions>
      </Dialog>

      {/* Member Dialog */}
      <Dialog open={memberDialogOpen} onClose={() => setMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Team Members</DialogTitle>
        <DialogContent dividers>
            {selectedMembers.length === 0 ? (
            <Typography>No members found.</Typography>
            ) : (
            <Table size="small">
                <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {selectedMembers.map((m) => (
                    <TableRow key={m.user.id}>
                    <TableCell>{m.user.name}</TableCell>
                    <TableCell>{m.user.email}</TableCell>
                    <TableCell>{m.status}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setMemberDialogOpen(false)} variant="contained">
            Close
            </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default TeamList;
