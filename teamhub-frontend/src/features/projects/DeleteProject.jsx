import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DeleteProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const hasProjects = projects.length > 0;
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects/my-projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(res.data.projects || []);
      } catch (err) {
        toast.error('Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    try {
        await api.delete(`/projects/${selectedProjectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Project deleted successfully');
        setConfirmOpen(false);
        setTimeout(() => {
            navigate('/projects/list');
        }, 1000);
    } catch (err) {
        setConfirmOpen(false);
        toast.error(err?.response?.data?.error || 'Failed to delete project');
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
        <Typography variant="h5" mb={3}>Delete Project</Typography>

        {!hasProjects && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You haven’t created any projects yet.
          </Alert>
        )}

        <TextField
          label="Select Project to Delete"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          select
          fullWidth
          sx={{ mb: 3 }}
          disabled={!hasProjects}
        >
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="error"
          onClick={() => setConfirmOpen(true)}
          disabled={!selectedProjectId}
        >
          Delete Project
        </Button>
      </Paper>

      {/* 🔐 Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the project{' '}
            <strong>{selectedProject?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteProject;
