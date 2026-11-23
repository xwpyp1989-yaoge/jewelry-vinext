"use client";

import { useEffect, useMemo, useState } from "react";
import { diagnose, presets } from "./diagnosis.mjs";

const empty = { productName: "", category: "戒指", material: "", scene: "通勤", channel: "小红书", goal: "", issue: "", audience: "" };

function toRuleInput(form) {
  return { name: form.productName, category: form.category, material: form.material, scene: form.scene, channel: form.channel, goal: form.goal, issue: form.issue };
}

function aiReport(result, note) {
  const lines = [`# ${result.title}`, result.executiveSummary, "## 产品事实卡", "### 用户已提供", ...result.truthCard.providedFacts.map(x => `- ${x}`), "### 图片可见", ...result.truthCard.visibleFacts.map(x => `- ${x}`), "### 仍需核实", ...result.truthCard.unknowns.map(x => `- ${x}`), "## 视觉诊断", "### 优点", ...result.visualDiagnosis.strengths.map(x => `- ${x}`), "### 问题", ...result.visualDiagnosis.problems.map(x => `- ${x}`), `### 第一优先级\n${result.visualDiagnosis.priorityAction}`, "## 创意方向", `- 概念：${result.creativeDirection.concept}`, `- 配色：${result.creativeDirection.palette}`, `- 搭配：${result.creativeDirection.styling}`, `- 光线：${result.creativeDirection.lighting}`, `- 背景：${result.creativeDirection.background}`, "## 镜头清单", ...result.shotList.map((x, i) => `${i + 1}. **${x.shot}**｜${x.purpose}\n   - 构图：${x.composition}\n   - 光线：${x.light}`), "## 内容角度", ...result.contentAngles.map(x => `- ${x}`), "## 建议交付", ...result.deliverables.map(x => `- ${x}`), "## 人工复核", ...result.humanReview.map(x => `- ${x}`), `## 补充备注\n${note || "无"}`];
  return lines.join("\n\n");
}

function RuleResult({ result }) {
  const rows = [["focus", "优先改什么"], ["styling", "场景与搭配"], ["shots", "拍摄景别"], ["light", "光线"], ["color", "色彩"], ["message", "内容表达"], ["deliverables", "建议交付"], ["truth", "事实核验"]];
  return <><span className="result-kicker">规则预览</span><h3>{result.title}</h3><p className="result-summary">{result.summary}</p><div className="result-rows">{rows.map(([key, label]) => <div key={key}><strong>{label}</strong><p>{result[key]}</p></div>)}</div><p className="studio-note">{result.limitation}</p></>;
}

function AIResult({ result }) {
  const truth = [["用户已提供", result.truthCard.providedFacts], ["图片可见", result.truthCard.visibleFacts], ["仍需核实", result.truthCard.unknowns]];
  return <>
    <span className="result-kicker ai-badge">AI 图像分析</span><h3>{result.title}</h3><p className="result-summary">{result.executiveSummary}</p>
    <section className="ai-block"><h4>产品事实卡</h4><div className="truth-grid">{truth.map(([label, values]) => <div key={label}><strong>{label}</strong><ul>{values.map((x, i) => <li key={i}>{x}</li>)}</ul></div>)}</div></section>
    <section className="ai-block"><h4>视觉诊断</h4><div className="diagnosis-columns"><div><strong>有效之处</strong><ul>{result.visualDiagnosis.strengths.map((x, i) => <li key={i}>{x}</li>)}</ul></div><div><strong>关键问题</strong><ul>{result.visualDiagnosis.problems.map((x, i) => <li key={i}>{x}</li>)}</ul></div></div><div className="priority-card"><span>第一优先级</span>{result.visualDiagnosis.priorityAction}</div></section>
    <section className="ai-block"><h4>创意方向</h4><dl className="creative-list"><div><dt>概念</dt><dd>{result.creativeDirection.concept}</dd></div><div><dt>配色</dt><dd>{result.creativeDirection.palette}</dd></div><div><dt>搭配</dt><dd>{result.creativeDirection.styling}</dd></div><div><dt>光线</dt><dd>{result.creativeDirection.lighting}</dd></div><div><dt>背景</dt><dd>{result.creativeDirection.background}</dd></div></dl></section>
    <section className="ai-block"><h4>拍摄执行单</h4><div className="shot-cards">{result.shotList.map((x, i) => <article key={i}><span>{String(i + 1).padStart(2, "0")}</span><h5>{x.shot}</h5><p>{x.purpose}</p><small>构图｜{x.composition}</small><small>光线｜{x.light}</small></article>)}</div></section>
    <section className="ai-block compact-lists"><div><h4>内容角度</h4><ul>{result.contentAngles.map((x, i) => <li key={i}>{x}</li>)}</ul></div><div><h4>建议交付</h4><ul>{result.deliverables.map((x, i) => <li key={i}>{x}</li>)}</ul></div><div><h4>人工复核</h4><ul>{result.humanReview.map((x, i) => <li key={i}>{x}</li>)}</ul></div></section>
  </>;
}

export default function DiagnosisStudio() {
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);
  const change = (key, value) => { setForm(current => ({ ...current, [key]: value })); setResult(null); setMessage(""); };
  const chooseImages = list => {
    previews.forEach(URL.revokeObjectURL);
    const next = Array.from(list).slice(0, 3); setFiles(next); setPreviews(next.map(URL.createObjectURL)); setResult(null); setMessage("");
  };
  const selectPreset = item => {
    const next = { ...empty, ...item, productName: item.name }; delete next.name;
    setForm(next); setResult(diagnose(item)); setMode("rule"); setDraft(""); setMessage("已载入演示资料。上传真实产品图后，可运行 AI 图像分析。");
  };
  const create = async event => {
    event.preventDefault(); setMessage(""); setDraft("");
    if (!files.length) { setResult(diagnose(toRuleInput(form))); setMode("rule"); setMessage("尚未上传产品图，当前显示规则预览。上传图片后可运行 AI 分析。"); return; }
    setStatus("loading");
    try {
      const body = new FormData(); Object.entries(form).forEach(([key, value]) => body.append(key, value)); files.forEach(file => body.append("images", file));
      const response = await fetch("/api/diagnose", { method: "POST", body });
      const payload = await response.json();
      if (!response.ok) {
        if (payload.code === "AI_NOT_CONFIGURED") { setResult(diagnose(toRuleInput(form))); setMode("rule"); setMessage("AI 服务尚未配置，已显示规则预览。配置服务器密钥后即可读取产品图。"); return; }
        throw new Error(payload.error || "分析失败");
      }
      setResult(payload.result); setMode("ai"); setMessage(`AI 已读取 ${files.length} 张产品图，并把可见事实与待核实信息分开。`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "分析失败，请重试"); }
    finally { setStatus("idle"); }
  };

  const report = useMemo(() => {
    if (!result) return "";
    if (mode === "ai") return aiReport(result, draft);
    return [result.title, result.summary, result.focus, result.styling, result.shots, result.light, result.color, result.message, result.deliverables, result.truth, `补充备注：${draft || "无"}`].join("\n\n");
  }, [result, mode, draft]);
  const download = () => {
    const url = URL.createObjectURL(new Blob([report], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${form.productName || "珠宝"}-视觉方案.md`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <section id="studio" className="studio-section"><div className="section">
    <div className="section-head"><p className="eyebrow ruby-text">Jewelry AI Studio · MVP</p><h2>上传产品图，生成一套可执行的视觉方案</h2><p>AI 先建立产品事实卡，再完成画面诊断、创意方向、镜头清单、内容角度和交付建议。真实性与工艺信息仍由人复核。</p></div>
    <div className="studio-flow" aria-label="AI 工作流程"><span>产品图与资料</span><i>→</i><span>事实卡</span><i>→</i><span>视觉诊断</span><i>→</i><span>拍摄与内容方案</span></div>
    <div className="preset-row" aria-label="示例资料">{presets.map((item, i) => <button type="button" key={item.name} onClick={() => selectPreset(item)}>载入示例 {i + 1} · {item.name}</button>)}</div>
    <p className="studio-note">示例是演示用假设产品。AI 不判断宝石真伪、天然或合成、证书、价格和克重。</p>
    <div className="studio-grid">
      <form onSubmit={create} className="studio-form">
        <h3>01 / 产品输入</h3>
        <label>产品名称 <input required maxLength={80} value={form.productName} onChange={e => change("productName", e.target.value)} placeholder="例如：红宝石戒指" /></label>
        <div className="field-pair"><label>品类 <select value={form.category} onChange={e => change("category", e.target.value)}>{["戒指", "项链", "耳饰", "手链", "胸针", "其他"].map(x => <option key={x}>{x}</option>)}</select></label><label>销售场景 <select value={form.scene} onChange={e => change("scene", e.target.value)}>{["通勤", "送礼", "正式", "约会", "度假"].map(x => <option key={x}>{x}</option>)}</select></label></div>
        <label>已核实的材质（可留空）<input maxLength={100} value={form.material} onChange={e => change("material", e.target.value)} placeholder="例如：18K 金、天然红宝石；未知请留空" /></label>
        <div className="field-pair"><label>发布渠道 <select value={form.channel} onChange={e => change("channel", e.target.value)}>{["小红书", "视频号", "朋友圈", "电商详情页", "线下销售"].map(x => <option key={x}>{x}</option>)}</select></label><label>目标客群 <input maxLength={100} value={form.audience} onChange={e => change("audience", e.target.value)} placeholder="例如：企业女高管" /></label></div>
        <label>想让客户看见什么？<textarea maxLength={240} rows={2} value={form.goal} onChange={e => change("goal", e.target.value)} placeholder="例如：日常佩戴的精致感" /></label>
        <label>现有画面最大的问题 <textarea maxLength={240} rows={2} value={form.issue} onChange={e => change("issue", e.target.value)} placeholder="例如：背景抢戏、主石偏色" /></label>
        <label className="upload">产品图（1–3 张，JPG / PNG / WebP）<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => chooseImages(e.target.files)} /><span>建议上传正面、侧面与佩戴图。单张不超过 6MB，总计不超过 12MB。</span>{previews.length > 0 && <div className="preview-grid">{previews.map((src, i) => <img key={src} src={src} alt={`产品参考图 ${i + 1}`} />)}</div>}</label>
        <button className="primary" type="submit" disabled={status === "loading"}>{status === "loading" ? "AI 正在分析图片…" : files.length ? "运行 AI 图像分析" : "生成规则预览"}</button>
        {message && <p className={`status-message ${mode}`}>{message}</p>}
      </form>
      <div className="studio-result" aria-live="polite">
        {result ? <>{mode === "ai" ? <AIResult result={result} /> : <RuleResult result={result} />}<label>补充或修改建议<textarea rows={3} value={draft} onChange={e => setDraft(e.target.value)} placeholder="加入具体镜头、道具或交付备注" /></label><button className="primary" type="button" onClick={download}>下载 Markdown 方案</button></> : <div className="result-empty"><span>02 / 等待产品</span><h3>先把事实与图片交给系统</h3><p>没有图片时生成规则预览；上传图片后，AI 会读取可见造型、构图、光线与场景关系。</p></div>}
      </div>
    </div>
  </div></section>;
}
