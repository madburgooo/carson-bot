import fs from "fs";

module.exports.run = async (sock, msg, from) => {
    const isGroup = from.endsWith("@g.us");

    if (isGroup) {
        const data = JSON.parse(fs.readFileSync("./bot/txt/gp.json", "utf8"));
        if (!data[from]) return;
    }

    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • $Bot Menus* 〕
│l〔 🗒️ • *Utility* 〕
│ ✦ .ping
│ ✦ .gp [on/off]
│ ✦ .groups
│l〔 💣 • *Attack* 〕
│ ✦ .nuke [name] | [last message]
│ | [linkgp]
│ ✦ .crash [1/500]
│ | [linkgp/number]
│l〔 🛡️ • *Security* 〕
│ ✦ .secstatus
│ ✦ .antitrava [on/off]
│ ✦ .antinuke [on/off]
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
};