import Listing from '../models/listing.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
export const upload = multer({ storage });

// Upload temp images
export const uploadTempImages = (req, res) => {
  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  res.status(200).json({ imageUrls });
};

// Cleanup temp images
export const cleanupTempImages = (req, res) => {
  const { imageUrls } = req.body;
  if (Array.isArray(imageUrls)) {
    imageUrls.forEach(url => {
      const filePath = path.join(process.cwd(), url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
  res.status(200).json({ success: true });
};

// Create listing (expects imageUrls in body)
export const createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      imageUrls: req.body.imageUrls,
    };
    const listing = await Listing.create(listingData);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};