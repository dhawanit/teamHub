import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import teamRoutes from './src/routes/team.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';

import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/teams', teamRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
