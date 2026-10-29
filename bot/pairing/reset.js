import fs from "fs";

export async function reset() {
    await fs.promises.rm("./bot/auth", { recursive: true, force: true });
}