const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");

async function iniciar() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        version
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (msg) => {
        try {
            const m = msg.messages[0];
            if (!m.message) return;

            const from = m.key.remoteJid;
            const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

            console.log("MENSAJE RECIBIDO:", text);

            await sock.sendMessage(from, { text: "Hola 👋, soy el robot auditor de Frutiva." });

        } catch (e) {
            console.error("ERROR:", e);
        }
    });
}

iniciar();

