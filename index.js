const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

async function iniciarBot() {

    // Carga/crea la carpeta de sesión donde se guarda el login
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    // Obtiene la versión recomendada de WhatsApp Web
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        printQRInTerminal: true, // Muestra el QR en la terminal
        auth: state
    });

    // Guarda credenciales cada vez que cambien
    sock.ev.on("creds.update", saveCreds);

    // Evento básico de mensajes
    sock.ev.on("messages.upsert", ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;
        console.log("📩 Mensaje recibido:", m);
    });

}

iniciarBot();
