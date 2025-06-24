import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const UpdateProject = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamId: ''
  });

  const hasProjects = projects.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const fetchProjects = async () => {
            try {
            const res = await api.get('/projects/my-projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data.projects || []);
            } catch (err) {
                console.error('❌ Failed to load projects:', err);
            }
        };

        const fetchTeams = async () => {
            try {
            const res = await api.get('/teams/my-teams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeams(res.data.teams || []);
            } catch (err) {
                console.error('❌ Failed to load teams:', err);
            }
        };
        fetchProjects();
        fetchTeams();
      } catch (err) {
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleProjectSelect = (id) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProjectId(id);
      setFormData({
        name: project.name,
        description: project.description || '',
        teamId: project.teamId || ''
      });
    }
  };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...formData };
        if (!payload.teamId) delete payload.teamId;

        try {
            await api.put(`/projects/${selectedProjectId}`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Project updated successfully!');
            navigate('/projects/list'); // ✅ Redirect after success
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to update project');
        }
    };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
      <Typography variant="h5" mb={3}>Update Project</Typography>
      {!hasProjects && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You haven’t created any projects yet to update.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Select Project"
          value={selectedProjectId}
          onChange={(e) => handleProjectSelect(e.target.value)}
          select
          fullWidth
          sx={{ mb: 2 }}
          disabled={!hasProjects}
        >
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={!hasProjects}
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          disabled={!hasProjects}
        />

        <TextField
          label="Assign to Team (optional)"
          name="teamId"
          value={formData.teamId}
          onChange={handleChange}
          select
          fullWidth
          sx={{ mb: 3 }}
          disabled={!hasProjects}
        >
          <MenuItem value="">None</MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" disabled={!hasProjects || !selectedProjectId}>
          Update Project
        </Button>
      </form>
    </Paper>
  );
};

export default UpdateProject;
