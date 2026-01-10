const express = require('express');
const Artist = require('../models/Artist');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log('GET /api/artists called'); // debug
        const artists = await Artist.find();
        res.json(artists);
    } catch (error) {
        console.error('Error fetching Artists', error);
        res.status(500).json({ message: 'Server error while fetching artists'});
    }
});

router.get('/:id', async (req, res) => {
        const id = req.params.id;
        const artist = await Artist.findById(id);
    if (!artist){
        res.status(500).json({ message: 'Error fetching Artist'});
    } else {
        res.json(artist);
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('POST /api/artists body:', req.body);

        const newArtist = new Artist(req.body);
        const artistRegistered = await newArtist.save();

        res.status(201).json(artistRegistered);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Artist', error: error });
    }
});

router.put('/:id', async (request, result) => {
    try {
        const {id} = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return result.status(400).json({message: 'Invalid artist ID'});
        }

        const updatedArtist = await Artist.findByIdAndUpdate(
            id,
            request.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedArtist) {
            return result.status(400).json({message: 'Artist not found'});
        }

        result.json(updatedArtist);
    } catch (error) {
        console.error('Error updating Artist', error);
        result.status(500).json({ message: 'Server error while updating Artist', error: error });
    }
});

router.delete('/:id', async (request, result) => {
    try {
        const {id} = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return result.status(400).json({ message: 'Invalid artist id' });
        }

        const deleteArtist = await Artist.findByIdAndDelete(id);

        if (!deleteArtist) {
            return result.status(400).json({message: 'Artist not found' });
        }

        result.json({ message: 'Artist successfully deleted' });
    } catch (error) {
        console.error('Error deleting Artist', error);
        result.status(500).json({ message: 'Server error while deleting' });
    }
});

module.exports = router;