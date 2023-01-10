// Dependency
const path = require('path');

// Routing
module.exports = (app) => {

// Developing routes
// GET /notes ought to restore the notes.html file.
    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

// GET * ought to restore the index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    })
};