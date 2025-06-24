import React, { useEffect, useState } from 'react';
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

const AssignProject = () => {
  const [formData, setFormData] = useState({
    projectId: '',
    teamId: '',
  });

  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, projectRes] = await Promise.all([
          api.get('/teams/my-teams', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          api.get('/projects/my-projects', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        setTeams(teamRes.data.teams || []);
        setProjects(projectRes.data.projects || []);
      } catch (err) {
        toast.error('Failed to load teams or projects');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${formData.projectId}`, {
        teamId: formData.teamId,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Project assigned to team');
      setFormData({ projectId: '', teamId: '' });
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Assignment failed');
    }
  };

  const noTeams = teams.length === 0;

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
      <Typography variant="h5" mb={3}>Assign Project to Team</Typography>

      {noTeams && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are not part of any team. Create or join a team to assign projects.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Select Project"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          select
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={noTeams}
        >
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Select Team"
          name="teamId"
          value={formData.teamId}
          onChange={handleChange}
          select
          fullWidth
          required
          sx={{ mb: 3 }}
          disabled={noTeams}
        >
          {teams.map((t) => (
            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" disabled={noTeams}>
          Assign
        </Button>
      </form>
    </Paper>
  );
};

export default AssignProject;
