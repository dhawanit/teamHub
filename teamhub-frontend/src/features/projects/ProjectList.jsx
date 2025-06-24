import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  TableContainer,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import api from '../../services/api';

const Row = ({ project }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{project.name}</TableCell>
        <TableCell>{project.description || 'NA'}</TableCell>
        <TableCell>{project.team?.name || 'NA'}</TableCell>
        <TableCell>{new Date(project.createdAt).toLocaleString()}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Team Info
              </Typography>
              {project.team ? (
                <ul>
                  {project.team.members?.map((member) => (
                    <li key={member.user.id}>
                      {member.user.name} ({member.user.email}) - {member.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No Teams assigned to this project
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects/my-projects', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setProjects(res.data.projects || []);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);
    
    return (
        <Box>
            <Typography variant="h5" mb={3}>
                All Projects
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                            <TableRow>
                                <TableCell />
                                <TableCell>Project Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                            {projects.map((project) => (
                                <Row key={project.id} project={project} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default ProjectList;
