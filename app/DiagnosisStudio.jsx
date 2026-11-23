"use client";

import { useEffect, useState } from "react";
import { diagnose, presets } from "./diagnosis.mjs";

const empty = { name: "", category: "戒指", material: "", scene: "通勤", channel: "小红书", goal: "", issue: "" };
const rows = [["focus", "优先改什么"], ["styling", "场景与搭配"], ["shots", "拍摄景别"], ["light", "光线"], ["color", "色彩"], ["message", "内容表达"], ["deliverables", "建议交付"], ["truth", "事实核验"]];

export default function DiagnosisStudio() {
  const [form, setForm] = useState(empty);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [draft, setDraft] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const change = (key, value) => { setForm(current => ({ ...current, [key]: value })); setResult(null); };
  const selectPreset = (item) => { setForm(item); setResult(diagnose(item)); setDraft(""); setPreview(""); };
  const create = (event) => { event.preventDefault(); const next = diagnose(form); setResult(next); setDraft(""); };
  const report = result && [result.title, result.summary, ...rows.map(([key, label]) => `${label}：${result[key]}`), `补充修改：${draft || "无"}`, result.limitation].join("\n\n");
  const download = () => {
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "珠宝视觉诊断.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <section id="studio" className="studio-section">
    <div className="section">
      <div className="section-head"><p className="eyebrow ruby-text">单款视觉诊断 · 体验版</p><h2>让一件珠宝，得到一份具体方案</h2><p>填写产品事实、销售场景和现有画面问题。方案可补充修改并下载，适合用来准备一次拍摄或内容制作。</p></div>
      <div className="preset-row" aria-label="示例方案">{presets.map((item, i) => <button type="button" key={item.name} onClick={() => selectPreset(item)}>查看示例 {i + 1} · {item.name}</button>)}</div>
      <p className="studio-note">示例是演示用假设产品，不代表真实客户案例、实物参数或生成效果。</p>
      <div className="studio-grid">
        <form onSubmit={create} className="studio-form">
          <h3>01 / 产品与需求</h3>
          <label>产品名称 <input required maxLength={80} value={form.name} onChange={e => change("name", e.target.value)} placeholder="例如：红宝石戒指" /></label>
          <div className="field-pair"><label>品类 <select value={form.category} onChange={e => change("category", e.target.value)}>{["戒指", "项链", "耳饰", "手链", "其他"].map(x => <option key={x}>{x}</option>)}</select></label><label>销售场景 <select value={form.scene} onChange={e => change("scene", e.target.value)}>{["通勤", "送礼", "正式", "约会", "度假"].map(x => <option key={x}>{x}</option>)}</select></label></div>
          <label>已核实的材质（可留空）<input maxLength={100} value={form.material} onChange={e => change("material", e.target.value)} placeholder="例如：18K 金、天然红宝石；未知请留空" /></label>
          <label>发布渠道 <select value={form.channel} onChange={e => change("channel", e.target.value)}>{["小红书", "视频号", "朋友圈", "电商详情页", "线下销售"].map(x => <option key={x}>{x}</option>)}</select></label>
          <label>想让客户看见什么？<textarea maxLength={240} rows={2} value={form.goal} onChange={e => change("goal", e.target.value)} placeholder="例如：日常佩戴的精致感" /></label>
          <label>现有画面最大的问题 <textarea maxLength={240} rows={2} value={form.issue} onChange={e => change("issue", e.target.value)} placeholder="例如：背景抢戏、主石偏色" /></label>
          <label className="upload">参考图（仅在本机预览，不上传）<input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)); }} />{preview && <img src={preview} alt="所选珠宝参考图预览" />}</label>
          <button className="primary" type="submit">生成视觉诊断</button>
        </form>
        <div className="studio-result" aria-live="polite">
          {result ? <><span className="result-kicker">02 / 视觉方案</span><h3>{result.title}</h3><p className="result-summary">{result.summary}</p><div className="result-rows">{rows.map(([key, label]) => <div key={key}><strong>{label}</strong><p>{result[key]}</p></div>)}</div><label>补充或修改建议<textarea rows={3} value={draft} onChange={e => setDraft(e.target.value)} placeholder="加入具体的镜头、道具或交付备注" /></label><p className="studio-note">{result.limitation}</p><button className="primary" type="button" onClick={download}>下载文字方案</button></> : <div className="result-empty"><span>02 / 等待输入</span><h3>先从一件珠宝开始</h3><p>选择上方示例，或填写左侧产品信息。结果会在这里显示。</p></div>}
        </div>
      </div>
    </div>
  </section>;
}
