// tests/artists.test.js
const request = require('supertest');
const app = require('../src/app');
const { connect, closeDatabase, clearDatabase } = require('./test-db');
const Artist = require('../src/models/Artist');

beforeAll(async () => {
    await connect();       // DB en mémoire
});

afterEach(async () => {
    await clearDatabase(); // on nettoie après chaque test
});

afterAll(async () => {
    await closeDatabase(); // on ferme tout à la fin
});

describe('API Artists', () => {
    it('POST /api/artists - crée un artiste', async () => {
        const res = await request(app)
            .post('/api/artists')
            .send({
                name: 'Chinchilla Nebula',
                genre: 'Cosmic Fluffy Metal',
                country: 'France',
                description: 'Chinchillas dans l’espace qui font du metal.',
                imageUrl: 'https://example.com/chinchilla.jpg'
            });

        // on s’assure que le statut est bon
        expect(res.statusCode).toBe(201);

        // on peut vérifier le contenu de la réponse
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Chinchilla Nebula');

        // et on peut vérifier directement en base
        const artistsInDb = await Artist.find();
        expect(artistsInDb).toHaveLength(1);
        expect(artistsInDb[0].name).toBe('Chinchilla Nebula');
    });
});

it('GET /api/artists - retourne la liste des artistes', async () => {
    // on prépare des données en BD
    await Artist.create({
        name: 'Fluffy Doom',
        genre: 'Doom',
        country: 'France',
        description: 'Doom metal de chinchillas.'
    });

    const res = await request(app).get('/api/artists');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Fluffy Doom');
});

