// ============================================================
//  FORENSIC AUTOPSY ASSISTANT – Authentication Module
// ============================================================

const Auth = (() => {
    const KEYS = () => window.APP_CONFIG.storageKeys;

    // ── Helpers ─────────────────────────────────────────────
    function getUsers() {
        return JSON.parse(localStorage.getItem(KEYS().users) || "[]");
    }

    function saveUsers(users) {
        localStorage.setItem(KEYS().users, JSON.stringify(users));
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem(KEYS().currentUser) || "null");
    }

    function setCurrentUser(user) {
        localStorage.setItem(KEYS().currentUser, JSON.stringify(user));
    }

    // ── Registration ─────────────────────────────────────────
    async function register({ name, username, password, role }) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, password, role })
            });
            if (!response.ok) {
                const err = await response.json();
                return { ok: false, error: err.detail || "Error en el registro" };
            }
            const user = await response.json();
            return { ok: true, user };
        } catch (e) {
            return { ok: false, error: "Error de conexión" };
        }
    }

    // ── Login ────────────────────────────────────────────────
    async function login(username, password) {
        const cfg = window.APP_CONFIG;
        // Check owner
        if (
            username === cfg.owner.username &&
            password === cfg.owner.password
        ) {
            setCurrentUser({ ...cfg.owner });
            return { ok: true, user: cfg.owner };
        }
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                const err = await response.json();
                return { ok: false, error: err.detail || "Usuario o contraseña incorrectos" };
            }
            const user = await response.json();
            setCurrentUser(user);
            return { ok: true, user };
        } catch (e) {
            return { ok: false, error: "Error de conexión" };
        }
    }

    // ── Logout ───────────────────────────────────────────────
    function logout() {
        localStorage.removeItem(KEYS().currentUser);
        window.location.href = "/";
    }

    // ── Permission helpers ───────────────────────────────────
    function canWrite(user) {
        if (!user) return false;
        if (user.role === "owner") return true;
        if (user.role === "professional" && user.writeApproved) return true;
        return false;
    }

    function isOwner(user) {
        return user && user.role === "owner";
    }

    // ── Admin: approve / revoke ──────────────────────────────
    async function setWriteApproval(userId, approved) {
        try {
            await fetch('/api/auth/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, approved })
            });
        } catch (e) { console.error(e); }
    }

    async function getAllUsers() {
        try {
            const response = await fetch('/api/auth/users');
            return await response.json();
        } catch (e) { return []; }
    }

    // ── Guard: redirect if not logged in ────────────────────
    function requireAuth() {
        const user = getCurrentUser();
        if (!user) window.location.href = "/";
        return user;
    }

    return {
        register,
        login,
        logout,
        getCurrentUser,
        canWrite,
        isOwner,
        setWriteApproval,
        getAllUsers,
        requireAuth,
    };
})();

window.Auth = Auth;
