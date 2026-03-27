// ============================================================
//  FORENSIC AUTOPSY ASSISTANT – Knowledge Base Module
// ============================================================

const Knowledge = (() => {
    const KEY = () => window.APP_CONFIG.storageKeys.knowledgeBase;

    let _entries = [];

    async function init() {
        try {
            const res = await fetch('/api/knowledge');
            if (res.ok) {
                _entries = await res.json();
            }
        } catch (e) {
            console.error(e);
        }
    }

    function getAll() {
        return _entries;
    }

    function getById(id) {
        return _entries.find(e => e.id === id) || null;
    }

    // ── CRUD ─────────────────────────────────────────────────
    async function create(user, entry) {
        if (!Auth.canWrite(user)) return { ok: false, error: 'Sin permiso de escritura.' };
        try {
            const res = await fetch('/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...entry, author: user.name, authorId: user.id })
            });
            if (!res.ok) return { ok: false, error: 'Error al crear' };
            const newEntry = await res.json();
            _entries.push(newEntry);
            return { ok: true, entry: newEntry };
        } catch (e) { return { ok: false, error: 'Error de conexión' }; }
    }

    async function update(user, id, changes) {
        if (!Auth.canWrite(user)) return { ok: false, error: 'Sin permiso de escritura.' };
        try {
            const idx = _entries.findIndex(e => e.id === id);
            if (idx === -1) return { ok: false, error: 'Entrada no encontrada.' };
            if (user.role !== 'owner' && _entries[idx].authorId !== user.id) {
                return { ok: false, error: 'Solo puedes editar tus propias entradas.' };
            }
            const updatedData = { ..._entries[idx], ...changes, id };
            const res = await fetch(`/api/knowledge/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!res.ok) return { ok: false, error: 'Error al actualizar' };
            const updated = await res.json();
            _entries[idx] = updated;
            return { ok: true };
        } catch (e) { return { ok: false, error: 'Error de conexión' }; }
    }

    async function remove(user, id) {
        if (!Auth.canWrite(user)) return { ok: false, error: 'Sin permiso.' };
        try {
            const entry = _entries.find(e => e.id === id);
            if (!entry) return { ok: false, error: 'Entrada no encontrada.' };
            if (user.role !== 'owner' && entry.authorId !== user.id) {
                return { ok: false, error: 'Solo puedes eliminar tus propias entradas.' };
            }
            const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
            if (!res.ok) return { ok: false, error: 'Error al eliminar' };
            _entries = _entries.filter(e => e.id !== id);
            return { ok: true };
        } catch (e) { return { ok: false, error: 'Error de conexión' }; }
    }

    // ── Search by keyword ─────────────────────────────────────
    function search(query) {
        const q = query.toLowerCase();
        return getAll().filter(e =>
            e.title.toLowerCase().includes(q) ||
            e.content.toLowerCase().includes(q) ||
            (e.trigger_keywords || []).some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q)) ||
            (e.category || '').toLowerCase().includes(q)
        );
    }

    // ── Find best match for a voice finding ──────────────────
    function findByFinding(findingText) {
        const f = findingText.toLowerCase();
        const all = getAll();
        // Score by keyword overlap
        let best = null, bestScore = 0;
        for (const entry of all) {
            let score = 0;
            for (const kw of (entry.trigger_keywords || [])) {
                if (f.includes(kw.toLowerCase())) score += 2;
            }
            if (entry.title.toLowerCase().split(' ').some(w => f.includes(w) && w.length > 3)) score++;
            if (score > bestScore) { bestScore = score; best = entry; }
        }
        return bestScore > 0 ? best : null;
    }

    return { init, getAll, getById, create, update, remove, search, findByFinding };
})();

window.Knowledge = Knowledge;
