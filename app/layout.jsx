import "./styles.css";

export const metadata = {
  title: "珠宝视觉美学｜从看懂美到用美卖货",
  description: "珠宝、服装、色彩、人像摄影与种草转化的实用方法论。"
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
