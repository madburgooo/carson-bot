import fs from "fs";

let recentRemovals = {};

module.exports.runParticipants = async (sock, update) => {
    const from = update.id;
    const data = JSON.parse(fs.readFileSync("./bot/txts/secstatus.json", "utf8"));
    if (!data[from] || !data[from].antinuke) return;

    const bot = sock.user.id;
    const metadata = await sock.groupMetadata(from);
    const owner = metadata.owner;

    const action = update.action;
    const nuker = update.actor;
    const target = update.participants[0];

    if (!nuker) return;
    if (nuker === bot) return;
    if (nuker === owner) return;

    if (!recentRemovals[from]) recentRemovals[from] = [];
    if (action === "remove" || action === "demote") {
        recentRemovals[from].push(Date.now());
        recentRemovals[from] = recentRemovals[from].filter(t => Date.now() - t < 1500);
    }

    if (recentRemovals[from].length < 1) return;
    if (recentRemovals[from].length < 3 && action !== "demote") return;

    await sock.groupSettingUpdate(from, "announcement");

    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • Security* 〕
│ ⚠️ *ATTENTION:* Attempted 
│ nuke detected, I proceed to 
│ secure the group...
╰━━━━━━━━━━━━━━━━━━━━╯`
    });

    try {
        await sock.groupParticipantsUpdate(from, [nuker], "remove");
        await sock.sendMessage(from, { text: `✦ ${nuker} removed` });
    } catch {
        await sock.sendMessage(from, { text: "✦ Failed to remove nuker" });
    }

    try {
        await sock.groupRevokeInvite(from);
        await sock.sendMessage(from, { text: "✦ Group link reset" });
    } catch {
        await sock.sendMessage(from, { text: "✦ Failed to reset link" });
    }

    await sock.sendMessage(from, { text: "✦ Group chat locked" });
    await sock.sendMessage(from, { text: "✦ Protected group ✅, I'm proceeding to unlock the chat" });

    await sock.groupSettingUpdate(from, "not_announcement");

    recentRemovals[from] = [];
};

module.exports.runGroupUpdate = async (sock, update) => {
    const from = update.id;
    const data = JSON.parse(fs.readFileSync("./bot/txts/secstatus.json", "utf8"));
    if (!data[from] || !data[from].antinuke) return;

    const bot = sock.user.id;
    const metadata = await sock.groupMetadata(from);
    const owner = metadata.owner;

    const subjectChanged = !!update.subject;
    const announceChanged = typeof update.announce !== "undefined";

    if (!subjectChanged && !announceChanged) return;

    await sock.groupSettingUpdate(from, "announcement");

    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • Security* 〕
│ ⚠️ *ATTENTION:* Attempted 
│ nuke detected, I proceed to 
│ secure the group...
╰━━━━━━━━━━━━━━━━━━━━╯`
    });

    try {
        await sock.groupRevokeInvite(from);
        await sock.sendMessage(from, { text: "✦ Group link reset" });
    } catch {
        await sock.sendMessage(from, { text: "✦ Failed to reset link" });
    }

    await sock.sendMessage(from, { text: "✦ Group chat locked" });
    await sock.sendMessage(from, { text: "✦ Protected group ✅, I'm proceeding to unlock the chat" });

    await sock.groupSettingUpdate(from, "not_announcement");
};