
import express from 'express';
import mongoose from 'mongoose';
import UserRouter from './routes/user.route.js';
import AuthRouter from './routes/auth.route.js';
import ListingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import ContactRouter from './routes/contact.route.js';
import path from 'path';



const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const __dirname = path.resolve();

// Middleware
app.use(express.json());

app.use(cookieParser());


// Routes
app.use('/api/users', UserRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/listing' , ListingRouter);
app.use('/api/contact', ContactRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//     console.log('Catch-all hit:', req.originalUrl);
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// })




// Middleware to handle try-catch
app.use((err, req, res, next) => {
    console.error('Error Middleware:', err);
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ 
        success: false,
        statusCode,
        message,
    });
})



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

