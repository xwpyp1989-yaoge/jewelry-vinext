import fs from "node:fs/promises";

try {
  await fs.access(".openai/hosting.json");
  await fs.mkdir("dist/.openai", { recursive: true });
  await fs.copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
  console.log("Copied Sites metadata into dist/.openai/hosting.json");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("No Sites hosting manifest found; skipping metadata copy.");
}
