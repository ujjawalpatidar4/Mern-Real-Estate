import express from 'express';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Real Estate API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});