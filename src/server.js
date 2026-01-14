// src/server.js
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app'); // ⬅️ on récupère l'app qu'on vient de factoriser

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
