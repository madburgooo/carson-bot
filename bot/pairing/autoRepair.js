import fs from "fs";

export async function autoRepair(reason, restart) {
    if (reason === 401) {
        await fs.promises.rm("./bot/auth", { recursive: true, force: true });
        restart();
    }
}