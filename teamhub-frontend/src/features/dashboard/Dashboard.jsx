import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Box, CircularProgress } from '@mui/material';
import StatsCards from '../../features/dashboard/StatsCards';
import ChartsSection from '../../features/dashboard/ChartsSection';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    projects: 0,
    tasks: 0,
    teams: 0,
    weeklyTaskChart: [],
    statusChart: [],
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/dashboard/summary', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSummary(data);
      } catch (err) {
        toast.error('Failed to load dashboard summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1, padding: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <StatsCards stats={summary} />
            <ChartsSection chartData={summary} />
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
