import { registerUser, loginUser, updateUserMetadata } from '../services/userService.js';
import { adminSupabase } from '../config/supabase.js';
import path from 'path';

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
export const updateMe = async (req, res) => {
  try {
    const { name, brandColor } = req.body;
    
    // We update the user metadata and optionally sync the name to the photographers table
    const updatedUser = await updateUserMetadata(req.user.id, {
      name,
      brandColor,
    });
    
    return res.status(200).json({
      message: 'Settings updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No logo file provided' });
    }
    
    const fileExt = path.extname(req.file.originalname) || '.png';
    const fileName = `logos/${req.user.id}${fileExt}`;
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'event-photos';
    
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from(bucketName)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });
      
    if (uploadError) throw uploadError;
    
    const logoUrl = uploadData.path;
    
    const updatedUser = await updateUserMetadata(req.user.id, {
      logoUrl,
    });
    
    return res.status(200).json({
      message: 'Logo uploaded successfully',
      user: updatedUser
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
