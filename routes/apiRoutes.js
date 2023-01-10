// dependency 
const path = require('path');
const fs = require('fs')

// npm package grants for unique ids to be developed
var uniqid = require('uniqid');

// Routing
module.exports = (app) => {

    // GET /api/notes should obtain the db.json file and recovery all saved notes as JSON.
    app.get('/api/notes', (req, res) => {
        res.sendFile(path.join(__dirname, '../db/db.json'));
    });

    // POST /api/notes should obtain a new note to save on the application body, 
    // introduce it to the db.json file, and then rebound the new note to the client. 
    app.post('/api/notes', (req, res) => {
        let db = fs.readFileSync('db/db.json');
        db = JSON.parse(db);
        res.json(db);
        // Developing body for note
        let userNote = {
            title: req.body.title,
            text: req.body.text,
            // Developing unique id for each note
            id: uniqid(),
        };
        // Forward developed note to be written in the db.json file
        db.push(userNote);
        fs.writeFileSync('db/db.json', JSON.stringify(db));
        res.json(db);

    });


    // DELETE /api/notes/:id should hold a inquery specification holding the id of a note to delete.
    app.delete('/api/notes/:id', (req, res) => {
        // Reading notes derived form db.json
        let db = JSON.parse(fs.readFileSync('db/db.json'))
        // Discard note with id
        let deleteNotes = db.filter(item => item.id !== req.params.id);
        // Adjusted note to db.json
        fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes));
        res.json(deleteNotes);

    })
};