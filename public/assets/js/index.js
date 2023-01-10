let noteSubject;
let noteContents;
let saveNoteButton;
let newNoteButton;
let noteList;

if (window.location.pathname === '/notes') {
    noteSubject = document.querySelector('.note-title');
    noteContents = document.querySelector('.note-textarea');
    saveNoteButton = document.querySelector('.save-note');
    newNoteButton = document.querySelector('.new-note');
    noteList = document.querySelectorAll('.list-container .list-group');
}

// Illustrate an component
const show = (elem) => {
    elem.style.display = 'inline';
};

// Conceil an component
const hide = (elem) => {
    elem.style.display = 'none';
};

// activeNote is utilized in keeping traces of the note within the textarea
let activeNote = {};

// obtain petitition for the notes
const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

// post petition for the notes
const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });

// delete petition for the notes
const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

// Application to conceil the save button until there is a note attached to save
const renderActiveNote = () => {
    hide(saveNoteButton);

    if (activeNote.id) {
        noteSubject.setAttribute('readonly', true);
        noteContents.setAttribute('readonly', true);
        noteSubject.value = activeNote.title;
        noteContents.value = activeNote.text;
    } else {
        noteSubject.removeAttribute('readonly');
        noteContents.removeAttribute('readonly');
        noteSubject.value = '';
        noteContents.value = '';
    }
};

// save note
const handleNoteSave = () => {
    const newNote = {
        title: noteSubject.value,
        text: noteContents.value,
    };
    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Delete the selected note
const handleNoteDelete = (e) => {
    // Stop the selected listener from being called when the button inside of it is selected
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
        activeNote = {};
    }

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Place the activeNote and illustrates it
const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
};

// Place the activeNote to and empty object and provides the end user to insert a new note
const handleNewNoteView = (e) => {
    activeNote = {};
    renderActiveNote();
};

const handleRenderSaveBtn = () => {
    if (!noteSubject.value.trim() || !noteContents.value.trim()) {
        hide(saveNoteButton);
    } else {
        show(saveNoteButton);
    }
};

// Provide the list of notes subjects
const renderNoteList = async (notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));
    }

    let noteListItems = [];

    // Remits HTML unit with or without delete button
    const createLi = (text, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');

        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView);

        liEl.append(spanEl);

        if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
                'fas',
                'fa-trash-alt',
                'float-right',
                'text-danger',
                'delete-note'
            );
            delBtnEl.addEventListener('click', handleNoteDelete);

            liEl.append(delBtnEl);
        }

        return liEl;
    };

    if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);

        noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
    }
};

// Obtains notes from the db and make them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
    saveNoteButton.addEventListener('click', handleNoteSave);
    newNoteButton.addEventListener('click', handleNewNoteView);
    noteSubject.addEventListener('keyup', handleRenderSaveBtn);
    noteContents.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();