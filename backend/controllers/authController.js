import { registerUser, loginUser } from '../services/userService.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const data = await registerUser(email, password, name);

    return res.status(201).json({
      message: 'User registered successfully',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = await loginUser(email, password);

    return res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
