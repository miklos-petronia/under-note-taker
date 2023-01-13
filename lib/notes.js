//Dependecies
const fs = require('fs');
const path = require('path');

function developNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writtenFileSync(
        path.join(__dirname, '../db/notes.json'),
        JSON.stringify({ notesArray }, null, 2)
    );
    return note;
}

// Take out note with similar sign
function removeNote(id, notes) {
    let notesArray = notes.filter(el => {
        if (el.id == id) {
            return false
        } else {
            return true
        }
    })

    // re-index 
    let index = 0;
    notesArray.forEach(note => {
        note.id = index;
        index += 1;
    });

    //Note to file
    fs.writtenFileSync(
        path.join(__dirname, '../db/notes.json'),
        JSON.stringify({ notesArray }, null, 2)
    );
    return notesArray;
}

// routing
module.exports = {
    developNewNote,
    removeNote
};