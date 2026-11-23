"use client";

import { useEffect, useMemo, useState } from "react";
import DiagnosisStudio from "./DiagnosisStudio.jsx";

const chapters = [
  { id: "see", no: "01", title: "看懂美", desc: "识别氛围、整体关系与画面权重", color: "plum" },
  { id: "style", no: "02", title: "搭出美", desc: "管理领口、色彩、材质与场景", color: "ruby" },
  { id: "shoot", no: "03", title: "拍出美", desc: "用光影、张力与力流突出珠宝", color: "sapphire" },
  { id: "sell", no: "04", title: "用美卖货", desc: "用场景、教学与对比证明价值", color: "emerald" }
];

const necklineRows = [
  ["V领", "V形吊坠、细长项链", "延伸颈线，呼应领口"],
  ["圆领", "短项链、锁骨链", "在领口上方形成焦点"],
  ["高领", "长吊坠、叠戴长链", "打破大面积与臃肿感"],
  ["方领 / 露肩", "细链、珍珠、贴颈款", "突出肩颈与留白"],
  ["复杂印花", "极简细款、素圈", "降低信息竞争"],
  ["纯色基础款", "设计感珠宝", "补充层次与点睛"]
];

const scenes = [
  ["通勤", "低饱和 · 干净 · 利落", "细链、素圈、小耳钉"],
  ["约会", "暖调柔光 · 温柔道具", "珍珠、碎钻、圆润设计"],
  ["休闲", "自然光 · 松弛 · 生活化", "极简金属、小众设计"],
  ["正式", "稳定 · 精致 · 层次明确", "套饰、重工或主石款"],
  ["度假 / 探店", "明亮 · 场景感 · 可代入", "层次项链、上镜款"],
  ["送礼", "细节 · 寓意 · 仪式感", "有故事与包装表达的款式"]
];

const checks = [
  "本组图要解决什么场景痛点？", "珠宝是否最亮、最清晰？", "领口与珠宝线条是否呼应？",
  "是否控制在3个主色内？", "服装、金属、场景色温是否统一？", "光影是否正确表现珠宝材质？",
  "身体线条是否把视线引向珠宝？", "道具和背景是否抢戏？", "是否有细节、上身与场景图？",
  "是否能看出佩戴前后的提升？", "颜色、纹理、比例有没有失真？", "用户能否回答：我什么时候需要它？"
];

function Gem({ tone = "gold", size = "md" }) { return <span className={`gem gem-${tone} gem-${size}`} aria-hidden="true" />; }

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const [scene, setScene] = useState(0);
  const progress = Math.round((checked.length / checks.length) * 100);
  const progressText = useMemo(() => checked.length === checks.length ? "清单已勾选，请核对实物" : `还差 ${checks.length - checked.length} 项`, [checked]);

  useEffect(() => {
    const onScroll = () => document.documentElement.style.setProperty("--scroll", String(window.scrollY));
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const toggle = (i) => setChecked(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i]);

  return <>
    <header className="nav">
      <button className="brand" onClick={() => jump("top")} aria-label="返回首页"><Gem tone="gold" size="sm" />Jewelry AI Studio</button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="课程章节">
        {chapters.map(c => <button key={c.id} onClick={() => jump(c.id)}>{c.title}</button>)}
        <button onClick={() => jump("studio")}>AI 工作台</button>
        <button className="nav-cta" onClick={() => jump("checklist")}>发布检查</button>
      </nav>
      <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开导航">{menuOpen ? "×" : "☰"}</button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy reveal">
          <p className="eyebrow">JEWELRY · VISION · STRATEGY</p>
          <h1>珠宝视觉 AI</h1>
          <p className="hero-sub">先看懂产品，再生成可执行方案</p>
          <p className="hero-lead">上传产品图与销售目标，AI 把可见事实、未知信息和用户资料分开，再生成画面诊断、创意方向、镜头清单与内容方案。</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => jump("roadmap")}>开始学习</button>
            <button className="text-btn" onClick={() => jump("studio")}>进入 AI 工作台</button>
            <button className="text-btn" onClick={() => jump("checklist")}>直接使用检查清单 →</button>
          </div>
        </div>
        <div className="hero-visual reveal delay">
          <img src="/images/diamond-rings.png" alt="香槟金钻石单戒与排钻戒" />
          <div className="floating-note"><Gem tone="diamond" size="sm" /><span>主体高光<br/><b>视觉第一焦点</b></span></div>
        </div>
      </section>

      <section className="thesis dark-band">
        <div><p className="eyebrow light">商业珠宝美学的终点</p><h2>美感必须转化为<br/>用户能看见的价值</h2></div>
        <p className="equation">穿搭短板 <b>＋</b> 场景氛围缺失 <b>＋</b> 镜头平淡 <strong>＝ 珠宝的存在价值</strong></p>
      </section>

      <section id="roadmap" className="section roadmap">
        <div className="section-head"><p className="eyebrow">学习路径</p><h2>四步，把“感觉”变成方法</h2></div>
        <div className="roadmap-grid">
          {chapters.map(c => <button key={c.id} className={`road-card ${c.color}`} onClick={() => jump(c.id)}>
            <span className="road-no">{c.no}</span><Gem tone={c.color} /><h3>{c.title}</h3><p>{c.desc}</p><span className="arrow">↘</span>
          </button>)}
        </div>
      </section>

      <section id="see" className="chapter chapter-see">
        <div className="chapter-intro">
          <div><p className="eyebrow light">01 · 整体先于局部</p><h2>看懂美</h2><p>主体决定“是谁”，氛围决定“处于什么情绪环境”。</p></div>
          <img src="/images/gemstones-minerals.png" alt="彩色宝石切面与天然矿石" />
        </div>
        <div className="chapter-body">
          <div className="quote-block"><span>氛围不是滤镜</span><p>人物、景物、光影、色彩、虚实与构图融合之后，才产生整体情绪气场。</p></div>
          <div className="principles">
            {[ ["整体", "先看大形走势"], ["重量", "让珠宝成为最亮、最清晰处"], ["简化", "提炼骨架，删除冲突元素"], ["张力", "用倾斜、扭转与负空间制造“较劲”"], ["表现", "让形式本身传递情绪"], ["力流", "让视线最终停在珠宝上"] ].map((x,i)=><article key={x[0]}><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}
          </div>
          <div className="weight-panel">
            <div><p>普通人像</p><b>人物 55%</b><span>氛围 45%</span></div>
            <div><p>珠宝种草</p><b>产品 40%</b><span>人衣 25% · 景光 25% · 后期 10%</span></div>
          </div>
          <p className="footnote">* 权重是源资料中的教学判断尺，并非科学测量值。</p>
        </div>
      </section>

      <section id="style" className="chapter light-chapter">
        <div className="section split-head">
          <div><p className="eyebrow ruby-text">02 · 组合管理，不是单品堆砌</p><h2>搭出美</h2><p>先定主角，再管理体量、线条、颜色与风格。衣服是画布，珠宝是点睛。</p></div>
          <img src="/images/fashion-accessories.png" alt="丝巾、手袋、鞋履、腰带、墨镜与耳饰" />
        </div>
        <div className="section">
          <div className="formula-line"><span>整体协调度</span><b>＝ 风格统一 × 色彩克制 × 线条呼应 × 主次清楚</b></div>
          <div className="neckline-layout">
            <div className="table-wrap"><h3>领口决定项链的线条与长度</h3><table><thead><tr><th>领口 / 服装</th><th>搭配方向</th><th>解决的问题</th></tr></thead><tbody>{necklineRows.map(r=><tr key={r[0]}>{r.map((x,i)=><td key={i}>{x}</td>)}</tr>)}</tbody></table></div>
            <img src="/images/neckline-styling.png" alt="四种服装领口与珠宝搭配示意" />
          </div>
          <div className="color-rule">
            <div className="ratio-ring" aria-label="60、30、10配色比例"><i/><i/><i/><span>60<br/><b>30</b><br/><em>10</em></span></div>
            <div><p className="eyebrow ruby-text">稳定的配色骨架</p><h3>60% 背景 / 主服装<br/>30% 辅助色<br/>10% 珠宝与强调色</h3><p>三种主色以内最稳定。强色不是不能用，而是只保留一处聚焦。</p></div>
          </div>
          <div className="metal-grid">
            {[["黄金 / 古法金","暖调 · 大地色 · 米棕","温润 / 贵气 / 复古","gold"],["白金 / 铂金 / 银饰","冷调 · 蓝灰 · 黑白","清冷 / 干净 / 现代","sapphire"],["玫瑰金","柔暖 · 裸粉 · 豆沙","温柔 / 法式 / 亲和","ruby"],["珍珠","柔光 · 低对比 · 暖中性色","细腻 / 治愈 / 优雅","pearl"]].map(x=><article key={x[0]}><Gem tone={x[3]} /><h3>{x[0]}</h3><p>{x[1]}</p><span>{x[2]}</span></article>)}
          </div>
        </div>
      </section>

      <section id="shoot" className="chapter shoot-chapter">
        <div className="section-head section"><p className="eyebrow sapphire-text">03 · 把搭配转成镜头语言</p><h2>拍出美</h2><p>姿态不是装饰，而是产品导视。光影不是特效，而是材质语言。</p></div>
        <div className="section shoot-grid">
          <div className="workflow">
            {[["定场景","用户在什么时刻需要它"],["定色彩","主色、辅助色、强调色"],["搭人衣饰","领口、材质、金属色温统一"],["清环境","道具烘托，不抢主体"],["选光线","按材质选择柔光或侧硬光"],["设姿态","用身体与手势形成力流"],["覆盖景别","细节、上身、场景形成证据链"],["克制后期","校正色彩，保留纹理"],["缩略复盘","整体、重量、简化、张力、力流"]].map((x,i)=><div key={x[0]}><span>{String(i+1).padStart(2,"0")}</span><h3>{x[0]}</h3><p>{x[1]}</p></div>)}
          </div>
          <aside className="light-guide"><h3>材质 × 光线</h3><div><span>柔光</span><p>珍珠、黄金、哑光材质<br/>温润、干净、静谧</p></div><div><span>侧光 / 硬光</span><p>钻石、切割面、亮面金属<br/>闪度、工艺、立体</p></div><div><span>明暗分层</span><p>避免死白死黑<br/>让珠宝从扁平变立体</p></div></aside>
        </div>
        <div className="before-after section"><div><span>BEFORE</span><h3>平淡只是“戴了件珠宝”</h3><p>色彩杂乱 · 姿态立正 · 背景抢戏 · 光线扁平</p></div><div><span>AFTER</span><h3>精致是每个元素都在证明价值</h3><p>主体高光 · 三色以内 · 姿态形成力流 · 材质被正确表达</p></div></div>
      </section>

      <section id="sell" className="chapter sell-chapter">
        <div className="section"><p className="eyebrow emerald-text">04 · 让用户看见、相信、渴望</p><h2>用美卖货</h2><p className="lead">从“这件珠宝很好看”，转为“它能解决我的问题”。</p>
          <div className="conversion-formula">场景代入 <b>×</b> 前后差异 <b>×</b> 可复刻方法 <strong>＝ 购买理由</strong></div>
          <div className="selling-methods">
            <article><span>01</span><h3>对比种草</h3><p>无饰品 vs 佩戴后，直观呈现精致度、比例与风格变化。</p></article>
            <article><span>02</span><h3>教学种草</h3><p>不同领口怎么戴，复杂衣服怎么做减法，让用户得到审美能力。</p></article>
            <article><span>03</span><h3>场景种草</h3><p>通勤、约会、度假、送礼，让用户对号入座，激活场合刚需。</p></article>
          </div>
          <div className="scene-picker"><div><p className="eyebrow emerald-text">场景搭配快速判断</p><h3>{scenes[scene][0]}</h3><p>{scenes[scene][1]}</p><b>{scenes[scene][2]}</b></div><div className="scene-tabs">{scenes.map((s,i)=><button key={s[0]} className={scene===i?"active":""} onClick={()=>setScene(i)}>{s[0]}</button>)}</div></div>
        </div>
      </section>

      <DiagnosisStudio />
      <section id="checklist" className="checklist-section">
        <div className="section">
          <div className="check-head"><div><p className="eyebrow">发布前</p><h2>珠宝视觉与转化检查清单</h2><p>缩略图先过关，再放大看细节。点击每一项完成检查。</p></div><div className="progress"><span>{progress}%</span><div><i style={{width:`${progress}%`}}/></div><b>{progressText}</b></div></div>
          <div className="check-grid">{checks.map((x,i)=><button key={x} className={checked.includes(i)?"done":""} onClick={()=>toggle(i)}><span>{checked.includes(i)?"✓":""}</span><p><b>{["目标","主体","搭配","色彩","色温","光影","姿态","简化","证据","对比","真实","转化"][i]}：</b>{x}</p></button>)}</div>
          <div className="closing">看懂整体 <i>→</i> 搭对关系 <i>→</i> 拍清价值 <i>→</i> 用场景完成转化</div>
        </div>
      </section>
    </main>
    <footer><Gem tone="gold" size="sm"/><p>Jewelry AI Studio · 珠宝视觉策略工作台</p><button onClick={() => jump("top")}>回到顶部 ↑</button></footer>
  </>;
}
