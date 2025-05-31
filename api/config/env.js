import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname in ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file from the root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });