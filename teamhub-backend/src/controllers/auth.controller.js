import { AuthService } from '../services/auth.service.js';
import { prisma } from '../prisma/client.js';

const authService = new AuthService();

export const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {

    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};