import fs from "fs";

module.exports.run = async (sock, msg) => {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant;
    const text = msg.message?.conversation || "";
    const data = JSON.parse(fs.readFileSync("./bot/txts/secstatus.json", "utf8"));

    if (!data[from] || !data[from].antitrava) return;

    const long = text.length > 5000;
    const unicode = /[\u{1F300}-\u{1FAFF}\u{2500}-\u{25FF}]/u.test(text);
    const repeat = /(.)\1{150,}/.test(text);

    if (!long && !unicode && !repeat) return;

    await sock.groupSettingUpdate(from, "announcement");

    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • Security* 〕
│ ⚠️ *ATTENTION:* Trava
│ detected, I proceed to secure 
│ the group...
╰━━━━━━━━━━━━━━━━━━━━╯`
    });

    try { await sock.sendMessage(from, { delete: msg.key }); } catch {}

    await sock.sendMessage(from, { text: "✦ Group chat locked" });
    await sock.sendMessage(from, { text: "✦ Trava deleted" });

    try { 
        await sock.groupParticipantsUpdate(from, [sender], "remove");
        await sock.sendMessage(from, { text: `✦ ${sender} removed` });
    } catch {
        await sock.sendMessage(from, { text: "✦ Failed to remove sender" });
    }

    try { 
        await sock.groupRevokeInvite(from);
        await sock.sendMessage(from, { text: "✦ Group link reset" });
    } catch {
        await sock.sendMessage(from, { text: "✦ Failed to reset link" });
    }

    await sock.sendMessage(from, { text: "✦ Protected group ✅, I'm proceeding to unlock the chat" });

    await sock.groupSettingUpdate(from, "not_announcement");
};