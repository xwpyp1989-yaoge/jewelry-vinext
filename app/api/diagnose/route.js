import { buildPrompt, diagnosisSchema, extractOutputText, validateFields, validateImages } from "../../aiDiagnosis.mjs";

const json = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: "AI 服务尚未配置", code: "AI_NOT_CONFIGURED" }, 503);

  try {
    const form = await request.formData();
    const fields = Object.fromEntries(["productName", "category", "material", "scene", "channel", "goal", "issue", "audience"].map(key => [key, String(form.get(key) || "").trim().slice(0, 400)]));
    const files = form.getAll("images").filter(value => value && typeof value.arrayBuffer === "function");
    const fieldError = validateFields(fields);
    const imageError = validateImages(files);
    if (fieldError || imageError) return json({ error: fieldError || imageError, code: "INVALID_INPUT" }, 400);

    const images = await Promise.all(files.map(async file => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = "";
      for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
      return { type: "input_image", image_url: `data:${file.type};base64,${btoa(binary)}`, detail: "high" };
    }));

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || "gpt-6.1-terra",
        store: false,
        max_output_tokens: 2600,
        input: [{ role: "user", content: [{ type: "input_text", text: buildPrompt(fields) }, ...images] }],
        text: { format: { type: "json_schema", name: "jewelry_visual_diagnosis", strict: true, schema: diagnosisSchema } }
      })
    });

    const payload = await upstream.json();
    if (!upstream.ok) {
      console.error("OpenAI Responses API error", upstream.status, payload?.error?.code || "unknown");
      return json({ error: "AI 分析暂时失败，请稍后重试", code: "AI_UPSTREAM_ERROR" }, 502);
    }
    const result = JSON.parse(extractOutputText(payload));
    return json({ result, meta: { mode: "ai", model: payload.model || process.env.OPENAI_VISION_MODEL || "gpt-6.1-terra", responseId: payload.id || null } });
  } catch (error) {
    console.error("Jewelry AI diagnosis failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "系统未能完成分析，请检查图片后重试", code: "DIAGNOSIS_FAILED" }, 500);
  }
}
