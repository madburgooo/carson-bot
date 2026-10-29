import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import fs from "fs";
import path from "path";

const COMMANDS_DIR = "./bot/commands";
const MENU_DIR = "./bot/menu";
const PAIRING_DIR = "./bot/pairing";

function loadCommands() {
    const commands = {};
    const files = fs.readdirSync(COMMANDS_DIR);
    for (const file of files) {
        if (file.endsWith(".js")) {
            const name = file.replace(".js", "");
            commands[name] = require(path.join("../", COMMANDS_DIR, file));
        }
    }
    return commands;
}

function loadMenu() {
    return require(path.join("../", MENU_DIR, "menu.js"));
}

function loadPairing(sock) {
    require(path.join("../", PAIRING_DIR, "pairing.js")).init(sock);
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./bot/auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ["CarsonBot", "Chrome", "1.0"],
        generateHighQualityLinkPreview: true
    });

    sock.ev.on("creds.update", saveCreds);

    const commands = loadCommands();
    const menu = loadMenu();
    loadPairing(sock);

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            "";

        if (commands["antitrava"]) {
            try { await commands["antitrava"].run(sock, msg); } catch {}
        }

        if (!text.startsWith(".")) return;

        const cmdName = text.split(" ")[0].replace(".", "");

        if (cmdName === "menu") {
            return menu.run(sock, msg, from);
        }

        if (commands[cmdName]) {
            return commands[cmdName].run(sock, msg, from, text);
        }
    });

    sock.ev.on("group-participants.update", async (update) => {
        if (commands["antinuke"]) {
            try { await commands["antinuke"].runParticipants(sock, update); } catch {}
        }
    });

    sock.ev.on("groups.update", async (update) => {
        if (commands["antinuke"]) {
            try { await commands["antinuke"].runGroupUpdate(sock, update); } catch {}
        }
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason === 401) {
                await fs.promises.rm("./bot/auth", { recursive: true, force: true });
                startBot();
            }
        }
    });
}

startBot();