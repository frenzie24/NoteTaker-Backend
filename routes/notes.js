const fb = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../scripts/fsUtils');
const { log, info, warn, error } = new (require('../scripts/logger'));
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
    if (title && text) {
        // Variable for the object we will save
        log(['text: ', text], 'white', 'bgBlue');
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

fb.delete('/*', (req, res) => {
    log(['Preparing to delete note with id matching: ',req.params[0]], 'magenta');
    let notes = [];
    // get all existing notes, then filter the results to remove any result with an id matching 
    readFromFile('./db/db.json').then((data) => {
        notes = JSON.parse(data);
        res.json(JSON.parse(data))

        log(['old notes', notes], 'red', 'bgBlack');
        notes = notes.filter((note) => note.id != req.params[0])

        log(['new notes', notes], 'green', 'yellow');
       

    }
    ).then(() => {
        log(['Writing modified notes to db.',notes], 'magenta');
        writeToFile('./db/db.json', notes);
    })
});

module.exports = fb;
