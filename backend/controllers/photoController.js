import * as photoService from '../services/photoService.js';

export const listPhotos = async (req, res) => {
  try {
    const { eventId } = req.params;
    const photos = await photoService.listPhotos(eventId);
    res.status(200).json({ photos, total: photos.length });
  } catch (error) {
    console.error('List photos error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'No photo file provided' });
    }
    const photo = await photoService.uploadAndProcessPhoto(eventId, req.file, req.body);
    res.status(201).json(photo);
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getSignedUrl = async (req, res) => {
  try {
    const { photoId } = req.params;
    const signedUrlData = await photoService.getSignedUrl(photoId);
    res.status(200).json(signedUrlData);
  } catch (error) {
    console.error('Get signed URL error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getProcessingProgress = async (req, res) => {
  try {
    const { eventId } = req.params;
    const progress = await photoService.getProcessingProgress(eventId);
    res.status(200).json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const triggerProcessing = async (req, res) => {
  try {
    const { eventId } = req.params;
    await photoService.triggerProcessing(eventId);
    res.status(200).json({ message: 'Processing triggered' });
  } catch (error) {
    console.error('Trigger processing error:', error);
    res.status(500).json({ error: error.message });
  }
};
