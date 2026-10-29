import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

function extractCode(link) {
    const base = link.split("chat.whatsapp.com/")[1];
    return base.split("?")[0];
}

module.exports.run = async (sock, msg, from, text) => {
    const args = text.split(" ");
    const newName = args[1] || "";
    const lastMsg = args[2] || "";
    const linkgp = args[3] || "";

    let targetGroup = from.endsWith("@g.us") ? from : null;

    try {
        const { state, saveCreds } = await useMultiFileAuthState("node/auth");
        const nuker = makeWASocket({ auth: state, printQRInTerminal: false });
        nuker.ev.on("creds.update", saveCreds);

        if (!targetGroup) {
            const code = extractCode(linkgp);
            const join = await nuker.groupAcceptInvite(code);
            targetGroup = join.gid;
        }

        if (newName !== "") await nuker.groupUpdateSubject(targetGroup, newName);

        try { await nuker.groupRevokeInvite(targetGroup); } catch {}

        if (lastMsg !== "") await nuker.sendMessage(targetGroup, { text: lastMsg });

        const metadata = await nuker.groupMetadata(targetGroup);
        const members = metadata.participants.map(p => p.id);

        await nuker.query({
            tag: "iq",
            attrs: { type: "set", xmlns: "w:g2", to: targetGroup },
            content: [
                {
                    tag: "remove",
                    attrs: {},
                    content: members
                        .filter(jid => jid !== nuker.user.id)
                        .map(jid => ({ tag: "participant", attrs: { jid } }))
                }
            ]
        });

        try { await nuker.groupParticipantsUpdate(targetGroup, [nuker.user.id], "remove"); } catch {}

        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Nuke* 〕
│ ✅ Nuke launched 
│ successfully...
╰━━━━━━━━━━━━━━━━━━━━╯`
        });

    } catch {
        await sock.sendMessage(from, {
            text:
`╭━━━〔 *カーソン • Nuke* 〕
│ ❌ Something went wrong 
│ during the Nuke!
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
    }
};