const fb = require('express').Router();
// readAndAppend, readFromFile, writeToFile are all scripts supplied by UCF
const { readAndAppend, readFromFile, writeToFile } = require('../scripts/fsUtils');
// Logger is a module i am working on to make console logging less tedious for me
// with the ability to make pretty things
const { log, info, warn, error } = new (require('../scripts/logger'));
// uuid.jd id is a script supplied by UCF
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
        // read the file and add our new note to it with UCF helper readAndAppend
        readAndAppend(newNote, './db/db.json');
        // send our response back to client
        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        // an error occured
        error('Failed to write a new note')
        res.json('Error in posting feedback');
    }
});

fb.delete('/*', (req, res) => {
    warn(['Preparing to delete note with id matching: ',req.params[0]]);
    let notes = [];
    // get all existing notes, then filter the results to remove any result with an id matching 
    readFromFile('./db/db.json').then((data) => {
        notes = JSON.parse(data);
        res.json(JSON.parse(data))

        log(['old notes', notes], 'red', 'bgBlack');
        // use Array.filter() to remove any note with the same id as the client selected note
        notes = notes.filter((note) => note.id != req.params[0])
        // log our new notes
        log(['new notes', notes], 'green', 'bgBlack');
       

    }
    ).then(() => {
        // We're done getting our new notes data ready, time to write!
        log(['Writing modified notes to db.',notes], 'yellow');
        writeToFile('./db/db.json', notes);
    })
});

module.exports = fb;
