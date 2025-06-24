import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../features/auth/AuthPage.jsx';
import Dashboard from '../features/dashboard/Dashboard.jsx';
import CreateProject from '../features/projects/CreateProject.jsx';
import ProjectList from '../features/projects/ProjectList.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import AssignToTeam from '../features/projects/AssignToTeam';
import UpdateProject from '../features/projects/UpdateProject';
import DeleteProject from '../features/projects/DeleteProject';
import ProjectsByTeam from '../features/projects/ProjectsByTeam';
import CreateTeam from '../features/teams/CreateTeam';
import TeamList from '../features/teams/TeamList';
import TeamInvites from '../features/teams/TeamInvites';
import CreateTask from '../features/tasks/CreateTask.jsx';
import AllTask from '../features/tasks/AllTasks.jsx';

const AppRoutes = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      {/* 🔄 Redirect root path to login or dashboard based on auth */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Public Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />

      {/* Private Routes inside MainLayout */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/list" element={<ProjectList />} />
        <Route path="/projects/create" element={<CreateProject />} />
        <Route path="/projects/assign" element={<AssignToTeam />} />
        <Route path="/projects/update" element={<UpdateProject />} />
        <Route path="/projects/delete" element={<DeleteProject />} />
        <Route path="/projects/team" element={<ProjectsByTeam />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams/list" element={<TeamList />} />
        <Route path="/teams/my-invites" element={<TeamInvites />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/tasks/list" element={<AllTask />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
