// ============================================================
//  FORENSIC AUTOPSY ASSISTANT – Student Notebook Module
// ============================================================

const Notebook = (() => {
    const KEY_PREFIX = () => `${window.APP_CONFIG.storageKeys.notebooks}_`;

    let _notes = [];

    function userKey(userId) {
        return KEY_PREFIX() + userId;
    }

    async function fetchNotes(userId) {
        try {
            const res = await fetch(`/api/notebook/${userId}`);
            if (res.ok) {
                _notes = await res.json();
            }
        } catch (e) { console.error(e); }
        return _notes;
    }

    function getNotes(userId) {
        return _notes;
    }

    async function addNote(userId, { text, category = 'General', source = 'manual' }) {
        try {
            const res = await fetch('/api/notebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, text, category, source }) // Notice it includes source here
            });
            if (!res.ok) return null;
            const newNote = await res.json();
            _notes.unshift(newNote);
            return newNote;
        } catch (e) {
            return null;
        }
    }

    async function updateNote(userId, noteId, changes) {
        try {
            const res = await fetch(`/api/notebook/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...changes })
            });
            if (!res.ok) return false;
            const updated = await res.json();
            const idx = _notes.findIndex(n => n.id === noteId);
            if (idx !== -1) _notes[idx] = updated;
            return true;
        } catch (e) { return false; }
    }

    async function deleteNote(userId, noteId) {
        try {
            const res = await fetch(`/api/notebook/${noteId}`, { method: 'DELETE' });
            if (res.ok) {
                _notes = _notes.filter(n => n.id !== noteId);
            }
        } catch (e) { }
    }

    function getCategories(userId) {
        const notes = getNotes(userId);
        const cats = [...new Set(notes.map(n => n.category))];
        return cats.length ? cats : ['General'];
    }

    return { fetchNotes, getNotes, addNote, updateNote, deleteNote, getCategories };
})();

window.Notebook = Notebook;
