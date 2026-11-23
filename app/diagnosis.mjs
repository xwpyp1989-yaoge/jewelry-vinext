export const presets = [
  { name: "红宝石戒指", category: "戒指", material: "红宝石 / 黄金", scene: "通勤", channel: "小红书", goal: "突出主石颜色与日常佩戴感", issue: "背景颜色太强，主石不突出" },
  { name: "黄宝石吊坠", category: "项链", material: "黄宝石 / 黄金", scene: "送礼", channel: "朋友圈", goal: "呈现赠礼的仪式感", issue: "缺少佩戴图和包装细节" },
  { name: "绿宝石耳饰", category: "耳饰", material: "绿宝石 / 黄金", scene: "正式", channel: "小红书", goal: "体现耳饰的脸部修饰效果", issue: "模特和背景抢走了注意力" }
];

const sceneAdvice = {
  通勤: "用低饱和服装与简洁背景，补一张自然姿态的日常佩戴图。",
  送礼: "补拍包装开启、手持与赠礼场景，交代礼物交到谁手中。",
  正式: "用克制的深色服装和清晰轮廓光，突出佩戴时的整体气场。",
  约会: "用柔和暖光与近距离情境，表现佩戴后的亲近感。",
  度假: "用自然光与有空间感的环境，保持首饰细节仍然清晰。"
};

const categoryAdvice = {
  戒指: "拍正面主石、侧面镶口和手部佩戴，核对戒臂比例。",
  项链: "拍吊坠正面、链长与领口关系，以及佩戴全貌。",
  耳饰: "拍单只细节、侧脸佩戴和双耳整体比例。",
  手链: "拍正面结构、扣头与手腕佩戴，核对活动范围。",
  其他: "拍正面、侧面、佩戴与尺寸参照，保证结构完整。"
};

export function diagnose(input) {
  const name = String(input.name || "这件珠宝").trim().slice(0, 80);
  const category = categoryAdvice[input.category] ? input.category : "其他";
  const scene = sceneAdvice[input.scene] ? input.scene : "通勤";
  const material = String(input.material || "").trim().slice(0, 100);
  const goal = String(input.goal || "").trim().slice(0, 240);
  const issue = String(input.issue || "").trim().slice(0, 240);
  const gemstone = /宝石|钻石|彩宝|祖母绿|翡翠|珍珠/.test(material);
  return {
    title: `${name} · ${scene}视觉方案`,
    summary: `面向${scene}场景的${category}，先让产品在缩略图中成为清晰焦点，再用细节和佩戴证据解释价值。`,
    focus: issue ? `针对当前问题“${issue}”，先拍一张背景更简洁、主体更清晰的对照图。` : "先检查现有素材：主体是否清楚，背景是否抢戏，是否缺少佩戴与细节图。",
    styling: sceneAdvice[scene],
    shots: categoryAdvice[category],
    light: gemstone ? "用受控侧光表现切面和金属结构，检查高光不过曝、宝石颜色不偏移。" : "用柔和主光表现材质纹理，辅以轻微侧光保持边缘与结构层次。",
    color: "背景饱和度低于主体，服装与场景控制在三种主色以内；以实物颜色为校色依据。",
    message: goal ? `内容主张：${goal}。用场景图引入，再以细节和佩戴图证明。` : "内容主张：这件首饰适合什么场合，以及佩戴后带来什么具体变化。",
    deliverables: `建议交付：1 张主视觉、1 张细节、1 张佩戴、1 张场景图；按${input.channel || "发布渠道"}需要调整裁切与文案。`,
    truth: material ? `已填写材质：${material}。材质、克重、尺寸、证书及工艺仍需以实物和资料核验。` : "材质、克重、尺寸、证书及工艺未知；请核验后再写进销售文案。",
    limitation: "这是根据你填写的信息生成的规则建议；页面不会识别上传图片，也不会自动生成图片。"
  };
}
