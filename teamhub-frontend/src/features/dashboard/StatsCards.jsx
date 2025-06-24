import React from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';

const StatsCards = ({ stats }) => {
  const cardData = [
    { label: 'Projects', count: stats.projects, icon: <FolderIcon />, color: '#1976d2' },
    { label: 'Tasks', count: stats.tasks, icon: <AssignmentIcon />, color: '#388e3c' },
    { label: 'Teams', count: stats.teams, icon: <GroupIcon />, color: '#f57c00' },
  ];

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }} >
      <Grid container spacing={3}>
        {cardData.map((card, idx) => (
          <Grid key={idx} size={4}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                padding: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: '100%',
              }}
            >
              <Box sx={{ backgroundColor: card.color, color: '#fff', p: 1.5, borderRadius: '50%' }}>
                {card.icon}
              </Box>
              <Box>
                <Typography variant="h6">{card.count}</Typography>
                <Typography color="textSecondary">{card.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatsCards;
