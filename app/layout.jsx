import "./styles.css";

export const metadata = {
  title: "Jewelry AI Studio｜珠宝视觉策略工作台",
  description: "上传珠宝产品图，生成事实卡、视觉诊断、创意方向、拍摄清单与内容方案。"
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
