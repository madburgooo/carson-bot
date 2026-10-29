import fs from "fs";

module.exports.run = async (sock, msg, from, text) => {
    const args = text.split(" ");
    const amount = parseInt(args[1]);
    const linkgp = args[2] || "";
    const target = from.endsWith("@g.us") ? from : linkgp;

    try {
        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Crash* 〕
│ ✅ Send crash successfully 
│ initiated...
╰━━━━━━━━━━━━━━━━━━━━╯`
        });

        const files = fs.readdirSync("./bot/txts/crash").map(f => "./bot/txts/crash/" + f);

        for (let i = 0; i < amount; i++) {
            for (const file of files) {
                const txt = fs.readFileSync(file, "utf8");
                await sock.sendMessage(target, { text: txt });
            }
        }

    } catch {
        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Crash* 〕
│ ❌ Something went wrong
│ while sending the trava!
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
    }
};