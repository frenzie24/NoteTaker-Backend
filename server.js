const express = require('express');
const logger = new (require('./scripts/logger'));
const fs = require('fs');
const path = require('path');
// var to store data from db
const notesData = require('./db/db.json')
const app = express();
const PORT = 3001;

// Serving files from the public folder
app.use(express.static('public'));
//app.get('/', (req, res) => res.send('Navigate to /send or /routes'));


// ## region API 
/*
    fetch the notes from the db
*/
app.get('/api/notes', (req, res) => {
    //logger({"notes-data":`${notesData}`,"res":`${res}`,"req":`${req}`}, 'green');
    res.json(notesData);
});

// adding a note
app.post('/api/notes', (req, res) => {

    // Log that a POST request was received
    logger.info(`${req.method} request received to add a review`);
    logger.log({ notesdata: notesData}, 'green', 'bgBlack');

// destructuring assignment for items in the req.body



});

// ## endregion

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//back to home with an invalid path!
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// TODO: Create a route that will serve up the `public/paths.html` page
app.get('/paths', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/paths.html'))
});
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);


const writeNoteToDB = (note) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);

            // Add a new note
            parsedNotes.push(note);

            // Write updated noes back to the file
            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated reviews!')
            );
        }
    });
}