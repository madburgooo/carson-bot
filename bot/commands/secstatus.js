import fs from "fs";

module.exports.run = async (sock, msg, from, text) => {
    const args = text.split(" ");
    const cmd = args[0].replace(".", "");
    const state = args[1] === "on";
    const isSecurityCmd = cmd === "antitrava" || cmd === "antinuke";

    const path = "./bot/txts/secstatus.json";
    const data = JSON.parse(fs.readFileSync(path, "utf8"));

    if (!data[from]) data[from] = { antitrava: false, antinuke: false };

    if (isSecurityCmd) {
        data[from][cmd] = state;
        fs.writeFileSync(path, JSON.stringify(data));

        const icon = state ? "✓" : "✗";

        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Security* 〕
│ ${icon} • *${cmd}* is now 
│ active and ready to protect the 
│ group!
╰━━━━━━━━━━━━━━━━━━━━╯`
        });

        return;
    }

    const sec = data[from] || { antitrava: false, antinuke: false };
    const t = sec.antitrava ? "✓" : "✗";
    const n = sec.antinuke ? "✓" : "✗";

    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • Sec Status* 〕
│ ${t} • Antitrava
│ ${n} • Antinuke
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
};