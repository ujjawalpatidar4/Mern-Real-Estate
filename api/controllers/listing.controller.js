import '../config/env.js';
import Listing from '../models/listing.model.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { errorHandler } from '../utils/error.js';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer-Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'real-estate-listings',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});
export const upload = multer({ storage });

// Upload images to Cloudinary
export const uploadCloudinaryImages = (req, res, next) => {
  // console.log('req.files:', req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const imageUrls = req.files.map(file => file.path); // file.path is the Cloudinary URL
  res.status(200).json({ imageUrls });
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

export const deleteListing = async (req, res, next) => {
  
    const listing = await Listing.findById(req.params.id);

    if(!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if(req.user.id !== listing.userRef) {
      return next(errorHandler(403, 'You can only delete your own listings'));
    }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Listing deleted successfully' });
  }
  catch (error) {
    next(error);
  }
}

export const updateListing = async (req, res, next) => {

  const listing = await Listing.findById(req.params.id);
  if(!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }

  if(req.user.id !== listing.userRef) {
    return next(errorHandler(403, 'You can only update your own listings'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
}

export const getListing = async (req, res, next) => {

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
  
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}
