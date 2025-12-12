
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode");

async function iniciarBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        // OJO: ya NO usamos printQRInTerminal
    });

    sock.ev.on("creds.update", saveCreds);

    // NUEVO SISTEMA DE QR
    sock.ev.on("connection.update", async (update) => {
        const { qr, connection } = update;

        if (qr) {
            console.log("📌 Se generó un nuevo QR. Conviértelo en imagen aquí:");
            const qrImageUrl = await qrcode.toDataURL(qr);
            console.log(qrImageUrl);
        }

        if (connection === "open") {
            console.log("✅ Bot conectado correctamente a WhatsApp.");
        }

        if (connection === "close") {
            console.log("❌ Conexión cerrada. Intentando reconectar...");
        }
    });

    // Evento de mensajes
    sock.ev.on("messages.upsert", ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;
        console.log("📩 Mensaje recibido:", m);
    });
}

iniciarBot();

