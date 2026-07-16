/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // 内覧会資料PDF: ブラウザ内表示させず確実にダウンロードさせる。
        // 保存時のファイル名は日本語（RFC 5987形式でエンコード済み）
        source: '/docs/:path*',
        headers: [
          {
            key: 'Content-Disposition',
            value:
              "attachment; filename*=UTF-8''%E4%B9%85%E5%96%9CLOGIC%E5%86%85%E8%A6%A7%E4%BC%9A%E8%B3%87%E6%96%99.pdf",
          },
          // MIMEスニッフィング防止
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // 資料差し替え時に古いキャッシュが残りすぎないよう1時間
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
};

export default nextConfig;
