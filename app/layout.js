import './globals.css';

export const metadata = {
  title: '久喜LOGIC | 埼玉県久喜市 竣工前内覧会受付中',
  description: '梁下5.5m、無柱の倉庫棟3,590坪。首都圏と東北をつなぐ新しい物流拠点、久喜LOGICの竣工前内覧会受付中。',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@500;700;900&family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
