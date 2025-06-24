import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#9e9e9e', '#1976d2', '#388e3c']; // Grey, Blue, Green for TODO, INPROGRESS, DONE

const ChartsSection = ({ chartData }) => {
  const pieData = chartData.statusChart.map((s) => ({
    name: s.status,
    value: s.count,
  }));

  const lineData = chartData.weeklyTaskChart.map((day) => ({
    name: day.day,
    tasks: day.count,
  }));

  return (
    <Grid container sx={{ pt: 6 }} spacing={3}>
      <Grid item size={4}>
        <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>Tasks This Week</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item size={4}>
        <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>Status Overview</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item size={4}>
        <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>Task Distribution</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChartsSection;
