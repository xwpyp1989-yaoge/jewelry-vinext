import fs from "node:fs/promises";

await fs.mkdir("dist/.openai", { recursive: true });
await fs.copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
console.log("Copied Sites metadata into dist/.openai/hosting.json");
