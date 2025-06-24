import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamId: '',
  });

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await api.get('/teams/my-teams', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTeams(data.teams || []);
      } catch (err) {
        toast.error('Failed to load teams');
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name || !description) {
      toast.error('Project name and description are required');
      return;
    }

    // Prepare the payload
    const payload = {
      name,
      description,
    };

    if (formData.teamId) {
      payload.teamId = formData.teamId;
    }

    try {
      await api.post('/projects/create', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Project created successfully!');
      setFormData({ name: '', description: '', teamId: '' });
      navigate('/projects/list'); // Redirect to project list
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create project');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
      <Typography variant="h5" mb={3}>
        Create New Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Assign to Team (Optional)"
          name="teamId"
          value={formData.teamId}
          onChange={handleChange}
          select
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="">None</MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" type="submit">
          Create Project
        </Button>
      </form>
    </Paper>
  );
};

export default CreateProject;
