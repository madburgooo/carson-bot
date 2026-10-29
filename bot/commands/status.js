import fs from "fs";

module.exports.checkAdmin = async (sock, msg, from) => {
    const metadata = await sock.groupMetadata(from);
    const bot = sock.user.id;
    const isBotAdmin = metadata.participants.some(p => p.id === bot && p.admin);

    if (!isBotAdmin) {
        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Adm Required* 〕
│ 😭 Oh no, I'm not an admin 
│ in this group!
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
        return false;
    }

    return true;
};

module.exports.promotion = async (sock, update) => {
    const from = update.id;
    const bot = sock.user.id;

    if (update.action === "promote" && update.participants.includes(bot)) {
        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Promotion* 〕
│ 🔥 Yessirrr, I'm now a group 
│ admin!
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
    }
};

module.exports.commandError = async (sock, msg, from, text) => {
    if (!text.startsWith(".")) return;

    const parts = text.trim().split(" ");
    const cmd = parts[0].replace(".", "");

    if (cmd.length < 2 || /[^a-zA-Z]/.test(cmd)) {
        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Error* 〕
│ ⛔ It looks like you typed the 
│ command incorrectly, 
│ try again!
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
        return true;
    }

    return false;
};

module.exports.fatal = async (sock, from, error) => {
    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • Error* 〕
│ ⛔ *FATAL ERROR:* ${error}
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
};