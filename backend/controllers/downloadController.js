import * as downloadService from '../services/downloadService.js';

export const downloadPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const url = await downloadService.getDownloadUrl(photoId);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Download photo error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const requestZipDownload = async (req, res) => {
  try {
    const { photoIds, eventId, sessionId } = req.body;
    const zipData = await downloadService.requestZipDownload(photoIds, eventId, sessionId);
    res.status(200).json(zipData);
  } catch (error) {
    console.error('Request zip error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getZipProgress = async (req, res) => {
  try {
    const { downloadId } = req.params;
    const progress = await downloadService.getZipProgress(downloadId);
    res.status(200).json(progress);
  } catch (error) {
    console.error('Get zip progress error:', error);
    res.status(500).json({ error: error.message });
  }
};
