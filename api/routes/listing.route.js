import express from "express";
import { createListing, upload, uploadTempImages, cleanupTempImages } from '../controllers/listing.controller.js'; 

const router = express.Router();

router.post('/upload-temp', upload.array('images', 6), uploadTempImages);
router.post('/cleanup-temp', express.json(), cleanupTempImages);
router.post('/create', express.json(), createListing);

export default router;