import express from "express";
import { createListing,upload, uploadCloudinaryImages ,deleteListing , updateListing , getListing , getListings} from '../controllers/listing.controller.js'; 
import { verifyToken } from '../utils/verfiyUser.js';

const router = express.Router();

router.post('/upload-cloudinary', upload.array('images', 6), uploadCloudinaryImages);
router.post('/create', verifyToken, createListing);
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id', verifyToken,updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;