import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (teamName.trim().length < 3) {
      toast.error('Team name must be at least 3 characters');
      return;
    }

    try {
      setLoading(true);
      await api.post(
        '/teams/create',
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Team created successfully!');
      setTimeout(() => navigate('/teams'), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, borderRadius: 3 }}>
      <Typography variant="h5" mb={3}>
        Create a New Team
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Team Name"
          fullWidth
          required
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Team'}
        </Button>
      </form>
    </Paper>
  );
};

export default CreateTeam;
