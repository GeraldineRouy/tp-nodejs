const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const artistRoutes = require('./routes/artistRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({status: 'OK', message: 'ChinFest API is alive 🔥'});
});

app.use('/api/artists', artistRoutes);

const port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
    });
});