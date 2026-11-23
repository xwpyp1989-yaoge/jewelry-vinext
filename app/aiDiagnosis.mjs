export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 6 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 12 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const requiredStrings = ["productName", "category", "scene", "channel"];

export function validateFields(fields) {
  for (const key of requiredStrings) {
    if (!String(fields[key] || "").trim()) return `${key} 不能为空`;
  }
  return null;
}

export function validateImages(files) {
  if (!files.length) return "请上传至少一张产品图";
  if (files.length > MAX_FILES) return `最多上传 ${MAX_FILES} 张图片`;
  let total = 0;
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) return "仅支持 JPG、PNG 或 WebP 图片";
    if (file.size > MAX_FILE_BYTES) return "单张图片不能超过 6MB";
    total += file.size;
  }
  if (total > MAX_TOTAL_BYTES) return "图片总大小不能超过 12MB";
  return null;
}

export const diagnosisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "executiveSummary", "truthCard", "visualDiagnosis", "creativeDirection", "shotList", "contentAngles", "deliverables", "humanReview"],
  properties: {
    title: { type: "string" },
    executiveSummary: { type: "string" },
    truthCard: {
      type: "object", additionalProperties: false,
      required: ["providedFacts", "visibleFacts", "unknowns"],
      properties: {
        providedFacts: { type: "array", items: { type: "string" } },
        visibleFacts: { type: "array", items: { type: "string" } },
        unknowns: { type: "array", items: { type: "string" } }
      }
    },
    visualDiagnosis: {
      type: "object", additionalProperties: false,
      required: ["strengths", "problems", "priorityAction"],
      properties: {
        strengths: { type: "array", items: { type: "string" } },
        problems: { type: "array", items: { type: "string" } },
        priorityAction: { type: "string" }
      }
    },
    creativeDirection: {
      type: "object", additionalProperties: false,
      required: ["concept", "palette", "styling", "lighting", "background"],
      properties: {
        concept: { type: "string" }, palette: { type: "string" }, styling: { type: "string" }, lighting: { type: "string" }, background: { type: "string" }
      }
    },
    shotList: {
      type: "array", minItems: 4, maxItems: 8,
      items: {
        type: "object", additionalProperties: false,
        required: ["shot", "purpose", "composition", "light"],
        properties: { shot: { type: "string" }, purpose: { type: "string" }, composition: { type: "string" }, light: { type: "string" } }
      }
    },
    contentAngles: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } },
    deliverables: { type: "array", minItems: 4, maxItems: 8, items: { type: "string" } },
    humanReview: { type: "array", items: { type: "string" } }
  }
};

export function buildPrompt(fields) {
  return `你是一名珠宝视觉策略师和商业摄影导演。请根据图片与用户提供的信息，输出可执行的中文方案。

用户资料：
- 产品名：${fields.productName}
- 品类：${fields.category}
- 已核实材质：${fields.material || "未填写"}
- 目标场景：${fields.scene}
- 发布渠道：${fields.channel}
- 核心目标：${fields.goal || "未填写"}
- 当前问题：${fields.issue || "未填写"}
- 目标客群：${fields.audience || "未填写"}

硬性规则：
1. 把用户填写的事实、图片可见事实和未知信息严格分开。
2. 不从图片判断宝石真伪、天然或合成、具体材质、克重、尺寸、证书、品牌或价格。
3. 图片看不清的内容写入 unknowns，不得补造。
4. 视觉建议必须对应这件产品、目标场景与渠道，避免空泛形容词。
5. 背景饱和度应低于主体；解释主体、服装、场景、光线之间的关系。
6. 给出 4–8 个有明确商业用途的镜头，并列出必须由人工复核的事项。`;
}

export function extractOutputText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text) return payload.output_text;
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  throw new Error("模型没有返回可解析的诊断结果");
}
