import { getDashboardSummaryService } from '../services/dashboard.service.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const stats = await getDashboardSummaryService(userId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};
