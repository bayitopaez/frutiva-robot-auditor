sock.ev.on("connection.update", async (update) => {
    const { qr, connection } = update;

    if (qr) {
        console.log("🔥 Se generó un nuevo QR. Conviértelo en imagen aquí:");
        const qrImageUrl = await qrcode.toDataURL(qr);
        console.log(qrImageUrl);
    }

    if (connection === "open") {
        console.log("✅ Bot conectado correctamente a WhatsApp.");
    }

    if (connection === "close") {
        console.log("❌ Conexión cerrada. Intentando reconectar...");
        iniciarBot();
    }
});

// Mantener el proceso vivo en Railway
setInterval(() => {
    console.log("⏳ Bot activo...");
}, 10000);

