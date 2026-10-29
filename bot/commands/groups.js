import fs from "fs";

module.exports.run = async (sock, msg, from) => {
    const data = JSON.parse(fs.readFileSync("./bot/txt/gp.json", "utf8"));
    const all = await sock.groupFetchAllParticipating();
    const ids = Object.keys(all);

    if (ids.length === 0) {
        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Groups* 〕
│ The bot is active in these 
│ groups ⤵️
│ ❌ • No groups found
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
        return;
    }

    let list = "";
    for (const id of ids) {
        const name = all[id].subject;
        const active = data[id] ? "✅" : "❌";
        list += `│ ${active} • ${name}\n`;
    }

    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • Groups* 〕
│ The bot is active in these 
│ groups ⤵️
${list}╰━━━━━━━━━━━━━━━━━━━━╯`
    });
};