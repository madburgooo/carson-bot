module.exports.run = async (sock, msg, from) => {
    const start = Date.now();
    await sock.sendMessage(from, { text: "Pinging..." });
    const latency = Date.now() - start;

    const ram = process.memoryUsage().rss;
    const uptime = process.uptime();

    await sock.sendMessage(from, {
        text:
`╭━━━〔 *カーソン • Ping* 〕
│ ✅ *Pong, I'm online!*
│ ⚡ Latency: ${latency}ms
│ 🧠 RAM Usage: ${Math.round(ram / 1024 / 1024)}MB
│ ⏱️ Uptime: ${Math.floor(uptime)}s
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
};