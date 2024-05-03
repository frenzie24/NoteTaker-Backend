const fb = require('express').Router();
const { readAndAppend, readFromFile } = require('../scripts/fsUtils');
const uuid = require('../scripts/uuid');

// GET Route for retrieving all notes
fb.get('/', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting a note
fb.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text ) {
        // Variable for the object we will save
        const newNote = {
            title, 
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting feedback');
    }
});

module.exports = fb;
