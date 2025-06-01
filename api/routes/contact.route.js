import express from 'express';
import { contactLandlord } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/contact-landlord', contactLandlord);

export default router;