import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography,
  TextField, MenuItem, Select, FormControl, InputLabel, Chip,
  CircularProgress, IconButton, Menu, MenuItem as MuiMenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import taskService from '../../services/taskService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import api from '../../services/api';

const statusColors = {
  TODO: 'default',
  INPROGRESS: 'primary',
  DONE: 'success',
};

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ title: '', createdBy: '', assignee: '', status: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', dueDate: '', status: '', assigneeId: '' });
  const [projectMembers, setProjectMembers] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const token = localStorage.getItem('token');
  const currentUserId = token ? jwtDecode(token).userId : null;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await taskService.listTasks();
        setTasks(data.tasks || []);
        setFilteredTasks(data.tasks || []);
      } catch {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const { title, createdBy, assignee, status } = filters;
    const lower = (s) => s.toLowerCase();
    const result = tasks.filter((task) =>
      task.title.toLowerCase().includes(lower(title)) &&
      task.creator?.name?.toLowerCase().includes(lower(createdBy)) &&
      (task.assignee?.name || '').toLowerCase().includes(lower(assignee)) &&
      (status ? task.status === status : true)
    );
    setFilteredTasks(result);
  }, [filters, tasks]);

  const canEdit = (task) => {
    return task?.createdBy === currentUserId || task?.assignee?.id === currentUserId;
  };

  const openMenu = (e, task) => {
    setAnchorEl(e.currentTarget);
    setSelectedTask(task);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openDialog = async (type) => {
    setDialogType(type);
    setDialogOpen(true);
    setAnchorEl(null);

    if (type === 'update') {
        setUpdateForm({
            title: selectedTask.title,
            description: selectedTask.description,
            dueDate: selectedTask.dueDate?.split('T')[0] || '',
            assigneeId: selectedTask.assignee?.id || '',
            status: selectedTask.status,
        });
        if (selectedTask?.projectId) {
            try {
                setMemberLoading(true);
                const { data } = await api.get(`/projects/${selectedTask?.projectId}/members`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(data);
                setProjectMembers(data.members || []);
            } catch (err) {
                toast.error('Failed to load project members');
            } finally {
                setMemberLoading(false);
            }
        }
    }

    if (type === 'history') {
      fetchHistory(selectedTask.id);
    }
  };

  const fetchHistory = async (taskId) => {
    try {
      const { data } = await taskService.getHistory(taskId);
      setHistoryData(data.history || []);
    } catch {
      toast.error('Failed to load history');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText) return;
    try {
      await taskService.addComment(selectedTask.id, commentText);
      toast.success('Comment added');
      setCommentText('');
      setDialogOpen(false);
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await taskService.updateTaskDetails(selectedTask.id, {
        ...updateForm,
        dueDate: new Date(updateForm.dueDate).toISOString(),
      });
      toast.success('Task updated');
      setDialogOpen(false);
    } catch {
      toast.error('Update failed');
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>All Tasks</Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField label="Title" value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} sx={{ mr: 2 }} />
        <TextField label="Created By" value={filters.createdBy} onChange={(e) => setFilters({ ...filters, createdBy: e.target.value })} sx={{ mr: 2 }} />
        <TextField label="Assignee" value={filters.assignee} onChange={(e) => setFilters({ ...filters, assignee: e.target.value })} sx={{ mr: 2 }} />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} label="Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.project.name}</TableCell>
                  <TableCell>{task.assignee?.name || 'Unassigned'}</TableCell>
                  <TableCell>{task.creator.name}</TableCell>
                  <TableCell sx={{ color: new Date(task.dueDate).toDateString() === new Date().toDateString() ? 'red' : 'inherit' }}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={statusColors[task.status]}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => openMenu(e, task)}><MoreVertIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MuiMenuItem onClick={() => openDialog('comment')}>Comment</MuiMenuItem>
        <MuiMenuItem onClick={() => {
          if (canEdit(selectedTask)) openDialog('update');
          else toast.error('You are not authorized to update this task.');
        }}>Update Task</MuiMenuItem>
        <MuiMenuItem onClick={() => openDialog('history')}>View History</MuiMenuItem>
      </Menu>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedTask?.title || 'Task'}</DialogTitle>
        <DialogContent dividers>
          {/* Comment Dialog */}  
          {dialogType === 'comment' && (
            <>
              <TextField
                label="Add a comment"
                fullWidth
                multiline
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </>
          )}

          {/* Update Dialog */}
          {dialogType === 'update' && (
            <Box component="form">
              <Grid container spacing={2} mt={1}>
                <Grid item size={12}>
                  <TextField label="Title" name="title" value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} fullWidth />
                </Grid>
                <Grid item size={12}>
                  <TextField label="Description" name="description" value={updateForm.description} onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })} fullWidth multiline rows={3} />
                </Grid>
                <Grid item size={12}>
                    <TextField
                        label="Assign To"
                        name="assigneeId"
                        value={updateForm.assigneeId}
                        onChange={handleUpdateChange}
                        select
                        fullWidth
                        sx={{ mb: 2 }}
                        disabled={memberLoading || !projectMembers.length} >
                        <MenuItem value="">None</MenuItem>
                        {projectMembers.map((member) => (
                        <MenuItem key={member.user.id} value={member.user.id}>
                            {member.user.name} ({member.user.email})
                        </MenuItem>
                        ))}
                    </TextField>

                </Grid>
                <Grid item size={6}>
                  <TextField label="Due Date" type="date" name="dueDate" value={updateForm.dueDate} onChange={(e) => setUpdateForm({ ...updateForm, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                <Grid item size={6}>
                  <TextField label="Status" name="status" value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })} fullWidth select>
                    <MenuItem value="TODO">TODO</MenuItem>
                    <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
                    <MenuItem value="DONE">DONE</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          )}
        
          {/* View History Dialog*/}
          {dialogType === 'history' && (
            <Box>
              {historyData.map((entry) => (
                <Paper key={entry.id} sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                  <Typography fontWeight="bold" color="text.secondary">           
                    {entry.type == 'comment' ? `Comment: ${entry.content}` : (entry.fromStatus
                      ? `Status Changed: ${entry.fromStatus} ➜ ${entry.toStatus}`
                      : `Created as ${entry.toStatus}`)}
                  </Typography>
                  <Typography variant='body2'>{entry.user.name}</Typography>
                  
                  <Typography variant="caption">
                    {new Date(entry.timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {dialogType === 'comment' && <Button onClick={handleCommentSubmit} variant="contained">Add Comment</Button>}
          {dialogType === 'update' && <Button onClick={handleUpdateSubmit} variant="contained">Submit</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllTasks;
