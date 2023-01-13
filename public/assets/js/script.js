let writtenTitle;
let writtenText;
let saveNoteButton;
let newNoteButton;
let noteList;

if (window.location.pathname === '/notes') {
  writtenTitle = document.querySelector('.note-title');
  writtenText = document.querySelector('.note-textarea');
  saveNoteButton = document.querySelector('.save-note');
  newNoteButton = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteButton);

  if (activeNote.id) {
    writtenTitle.setAttribute('readonly', true);
    writtenText.setAttribute('readonly', true);
    writtenTitle.value = activeNote.title;
    writtenText.value = activeNote.text;
  } else {
    writtenTitle.removeAttribute('readonly');
    writtenText.removeAttribute('readonly');
    writtenTitle.value = '';
    writtenText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: writtenTitle.value,
    text: writtenText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Remove the selected note
const handleNoteDelete = (e) => {
  // it would stop the selected listener for the list from being called when the button inside of it is selected
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

// Puts the activeNote and illustrates it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Puts the activeNote to and empty element and admit the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!writtenTitle.value.trim() || !writtenText.value.trim()) {
    hide(saveNoteButton);
  } else {
    show(saveNoteButton);
  }
};

// Provides the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Put back the HTML component with or without a delete button
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

// Obtains notes from the db and show them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteButton.addEventListener('click', handleNoteSave);
  newNoteButton.addEventListener('click', handleNewNoteView);
  writtenTitle.addEventListener('keyup', handleRenderSaveBtn);
  writtenText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();