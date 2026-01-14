// tests/test-db.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

// 🔹 démarre une base Mongo en mémoire
async function connect() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
}

// 🔹 nettoie toutes les collections entre les tests
async function clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

// 🔹 ferme la connexion et stoppe le serveur Mongo en mémoire
async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
        await mongoServer.stop();
    }
}

module.exports = {
    connect,
    clearDatabase,
    closeDatabase,
};
