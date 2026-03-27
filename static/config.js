// ============================================================
//  FORENSIC AUTOPSY ASSISTANT – Configuration
// ============================================================
//  Modifica este archivo para cambiar las credenciales del dueño
//  o el nombre de la institución.
// ============================================================

const APP_CONFIG = {
    // Credenciales fijas del dueño (Owner)
    owner: {
        username: "owner",
        password: "owner2024",
        name: "Administrador",
        role: "owner",
        id: "owner-001",
    },

    // Nombre de la institución mostrado en la app
    institution: "Instituto de Medicina Legal y Ciencias Forenses",

    // Clave de localStorage para usuarios registrados
    storageKeys: {
        users: "fa_users",
        currentUser: "fa_current_user",
        knowledgeBase: "fa_knowledge_base",
        notebooks: "fa_notebooks",
    },
};

// Exponer globalmente
window.APP_CONFIG = APP_CONFIG;
