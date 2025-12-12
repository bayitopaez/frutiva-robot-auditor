import makeWASocket, {
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import qrcode from "qrcode";

async function iniciarBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
    });

    // Guardar credenciales
    sock.ev.on("creds.update", saveCreds);

    // ESCUCHAR EVENTOS DE CONEXIÓN
    sock.ev.on("connection.update", async (update) => {
        const { qr, connection } = update;

        if (qr) {
            console.log("🔥 QR GENERADO — COPIA ESTA URL Y ÁBRELA EN TU NAVEGADOR PARA ESCANEAR:");
            const qrImageURL = await qrcode.toDataURL(qr);
            console.log(qrImageURL);
        }

        if (connection === "open") {
            console.log("✅ Bot conectado correctamente a WhatsApp.");
        }

        if (connection === "close") {
            console.log("❌ Conexión cerrada. Intentando reconectar...");
            iniciarBot();
        }
    });

    // Mantener vivo el proceso en Railway
    setInterval(() => {
        console.log("⏳ Bot activo en Railway...");
    }, 10000);
}

iniciarBot();


