import fs from "fs";

module.exports.run = async (sock, msg, from, text) => {
    const args = text.split(" ")[1];
    if (!from.endsWith("@g.us")) return;

    const data = JSON.parse(fs.readFileSync("./bot/txts/gp.json", "utf8"));

    if (args === "on") {
        data[from] = true;
        fs.writeFileSync("./bot/txts/gp.json", JSON.stringify(data));

        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Gp Status* 〕
│ ✅ Group activated,  I'll be able
│ to post here from now on!
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
    }

    if (args === "off") {
        delete data[from];
        fs.writeFileSync("./bot/txts/gp.json", JSON.stringify(data));

        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Gp Status* 〕
│ ❌ Oh no, I got left out of the 
│ party, what a drag...
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
    }
};