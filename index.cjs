const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;

            if (reason !== DisconnectReason.loggedOut) {
                console.log("Reconectando...");
                startBot();
            } else {
                console.log("La sesión se cerró. Escanea el QR de nuevo.");
            }
        }
        if (connection === "open") {
            console.log("Bot conectado correctamente.");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];

        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        let text = msg.message.conversation || "";

        console.log("MENSAJE RECIBIDO:", text);

        if (text.toLowerCase() === "hola") {
            await sock.sendMessage(from, { text: "Hola 👋, soy el auditor de Frutiva." });
        }
    });
}

startBot();


