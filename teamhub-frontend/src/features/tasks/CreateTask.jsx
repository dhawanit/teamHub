import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import taskService from '../../services/taskService';
import api from '../../services/api';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    projectId: '',
    assigneeId: '',
  });

  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(false);

  const token = localStorage.getItem('token');

  // ✅ Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects/my-projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(data.projects || []);
      } catch (err) {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

  // ✅ Fetch members when project is selected
  useEffect(() => {
    if (!formData.projectId) return;

    const fetchMembers = async () => {
      setMemberLoading(true);
      try {
        const { data } = await api.get(`/projects/${formData.projectId}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjectMembers(data.members || []);
      } catch (err) {
        toast.error('Failed to fetch project members');
      } finally {
        setMemberLoading(false);
      }
    };

    fetchMembers();
  }, [formData.projectId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.dueDate) return 'Due Date is required';
    if (!formData.projectId) return 'Please select a project';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return toast.error(error);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      dueDate: new Date(formData.dueDate).toISOString(),
      projectId: formData.projectId,
      ...(formData.assigneeId && { assigneeId: formData.assigneeId }),
    };

    try {
      const createTask = await taskService.createTask(payload);
      toast.success('Task created successfully!');
      await taskService.assignTask()
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        projectId: '',
        assigneeId: '',
      });
      setProjectMembers([]);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to create task');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: {xs: '100%', md: '50%'}}} >
      <Typography variant="h5" mb={3}>Create New Task</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} >
            <Grid item size={12} >
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item size={12}>
              <TextField maxRows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6} size={6}>
              <TextField
                label="Select Project"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} size={6}>
              <TextField
                label="Assign To"
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                select
                fullWidth
                disabled={memberLoading || !projectMembers.length}
              >
                <MenuItem value="">None</MenuItem>
                {projectMembers.map((member) => (
                  <MenuItem key={member.user.id} value={member.user.id}>
                    {member.user.name} ({member.user.email})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} size={6}>
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <break></break>
            <Grid item xs={12} size={6}>
              <Button variant="contained" type="submit">Create Task</Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
};

export default CreateTask;
