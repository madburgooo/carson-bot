import fs from "fs";

export function init(sock) {
    sock.ev.on("connection.update", async (update) => {
        const code = update.pairingCode;
        if (code) console.log("PAIRING CODE:", code);

        const conn = update.connection;
        const disc = update.lastDisconnect;

        if (conn === "close") {
            const reason = disc?.error?.output?.statusCode;
            if (reason === 401) {
                await fs.promises.rm("./bot/auth", { recursive: true, force: true });
            }
        }
    });
}