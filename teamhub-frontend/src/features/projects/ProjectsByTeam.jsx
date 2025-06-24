import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Collapse,
  IconButton,
  Paper,
  TableContainer,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import api from '../../services/api';

const Row = ({ project, onOpenDialog }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Link underline="hover" sx={{ cursor: 'pointer' }} onClick={() => onOpenDialog('project', project)}>
            {project.name}
          </Link>
        </TableCell>
        <TableCell>{project.description || '—'}</TableCell>
        <TableCell>
          {project.team ? (
            <Link underline="hover" sx={{ cursor: 'pointer' }} onClick={() => onOpenDialog('team', project.team)}>
              {project.team.name}
            </Link>
          ) : '—'}
        </TableCell>
        <TableCell>{new Date(project.createdAt).toLocaleString()}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant="subtitle1">Team Info</Typography>
              {project.team ? (
                <ul>
                  {project.team.members?.map((member) => (
                    <li key={member.user.id}>
                      {member.user.name} ({member.user.email}) - {member.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No Teams assigned to this project</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ProjectsByTeam = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', team: '' });

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenDialog = (type, item) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType(null);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects/my-projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(data.projects || []);
        setFiltered(data.projects || []);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const filteredData = projects.filter((p) =>
      p.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      (p.team?.name || '').toLowerCase().includes(filter.team.toLowerCase())
    );
    setFiltered(filteredData);
  }, [filter, projects]);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[key]?.toString().toLowerCase() || '';
      const bVal = b[key]?.toString().toLowerCase() || '';
      return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    setFiltered(sorted);
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>Projects by Team</Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Filter by Project Name"
          size="small"
          value={filter.name}
          onChange={(e) => setFilter((prev) => ({ ...prev, name: e.target.value }))}
        />
        <TextField
          label="Filter by Team Name"
          size="small"
          value={filter.team}
          onChange={(e) => setFilter((prev) => ({ ...prev, team: e.target.value }))}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell />
                <TableCell sortDirection={sortConfig.key === 'name' ? sortConfig.direction : false}>
                  <TableSortLabel
                    active={sortConfig.key === 'name'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('name')}
                  >
                    Project Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell sortDirection={sortConfig.key === 'team' ? sortConfig.direction : false}>
                  <TableSortLabel
                    active={sortConfig.key === 'team'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('team')}
                  >
                    Team
                  </TableSortLabel>
                </TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((project) => (
                <Row key={project.id} project={project} onOpenDialog={handleOpenDialog} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 🔍 Dialog for Project or Team */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 20, pb: 1 }}>
          {dialogType === 'project' ? '📁 Project Details' : '👥 Team Details'}
        </DialogTitle>
        <Divider />

        <DialogContent dividers sx={{ py: 2, px: 3 }}>
          {dialogType === 'project' && selectedItem && (
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                📌 Project Info
              </Typography>
              <Typography><strong>Name:</strong> {selectedItem.name}</Typography>
              <Typography><strong>Description:</strong> {selectedItem.description || '—'}</Typography>
              <Typography><strong>Created At:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Team:</strong> {selectedItem.team?.name || '—'}</Typography>
            </Box>
          )}

          {dialogType === 'team' && selectedItem && (
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                🛡️ Team Info
              </Typography>
              <Typography><strong>Name:</strong> {selectedItem.name}</Typography>
              <Typography><strong>Description:</strong> {selectedItem.description || '—'}</Typography>

              <Typography mt={2} variant="subtitle2" sx={{ fontWeight: 600 }}>
                👤 Members
              </Typography>

              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                {selectedItem.members?.length > 0 ? (
                  selectedItem.members.map((m) => (
                    <Box component="li" key={m.user.id} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{m.user.name}</strong> ({m.user.email}) —{' '}
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            backgroundColor: m.status === 'ACCEPTED' ? '#4caf50' : '#ff9800',
                            color: '#fff',
                            px: 1,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          {m.status}
                        </Box>
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No members found</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ProjectsByTeam;
