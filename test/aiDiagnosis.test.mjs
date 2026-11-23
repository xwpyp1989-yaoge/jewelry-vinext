import test from "node:test";
import assert from "node:assert/strict";
import { buildPrompt, extractOutputText, validateFields, validateImages } from "../app/aiDiagnosis.mjs";

const fields = { productName: "红宝石戒指", category: "戒指", scene: "通勤", channel: "小红书", material: "", goal: "", issue: "", audience: "" };

test("requires product fields and at least one image", () => {
  assert.equal(validateFields(fields), null);
  assert.match(validateFields({ ...fields, productName: "" }), /productName/);
  assert.match(validateImages([]), /至少一张/);
});

test("rejects unsupported or oversized images", () => {
  assert.match(validateImages([{ type: "image/gif", size: 100 }]), /JPG/);
  assert.match(validateImages([{ type: "image/jpeg", size: 7 * 1024 * 1024 }]), /6MB/);
  assert.equal(validateImages([{ type: "image/webp", size: 1024 }]), null);
});

test("prompt establishes jewelry truth boundaries", () => {
  const prompt = buildPrompt(fields);
  assert.match(prompt, /用户填写的事实、图片可见事实和未知信息严格分开/);
  assert.match(prompt, /不从图片判断宝石真伪/);
});

test("extracts text from Responses API payload", () => {
  assert.equal(extractOutputText({ output_text: "{}" }), "{}");
  assert.equal(extractOutputText({ output: [{ content: [{ type: "output_text", text: "{\"ok\":true}" }] }] }), "{\"ok\":true}");
});

test("API reports missing server configuration without exposing details", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const { POST } = await import("../app/api/diagnose/route.js");
  const response = await POST(new Request("http://localhost/api/diagnose", { method: "POST" }));
  const payload = await response.json();
  assert.equal(response.status, 503);
  assert.equal(payload.code, "AI_NOT_CONFIGURED");
  if (previous) process.env.OPENAI_API_KEY = previous;
});
