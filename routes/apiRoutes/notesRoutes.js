//Dependencies
const router = require('express').Router();
const { createNewNote, deleteNote } = require('../../lib/notes');
let { notesArray } = require('../../db/notes');

// Notes are reachable at api/notes in json 
router.get('/notes', (req, res) => {
    let results = notesArray;
    res.json(results);
});

router.post('/notes', (req, res) => {
    // Designate id accepted on what the next index of the array will be
    if (notesArray) {
        req.body.id = notesArray.length.toString();
    } else { req.body.id = 0 }
    res.json(createNewNote(req.body, notesArray));
});

// Routing elements :
router.delete('/notes/:id', async (req, res) => {
    const { id } = req.params
    notesArray = await deleteNote(id, notesArray);
    res.json(notesArray);
});


module.exports = router;