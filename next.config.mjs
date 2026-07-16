/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // 内覧会資料PDF: ブラウザ内表示させず確実にダウンロードさせる。
        // 保存時のファイル名は日本語（RFC 5987形式でエンコード済み）＋
        // filename*非対応の古い環境向けASCIIフォールバックを併記（RFC 6266）
        source: '/docs/kuki-logic-viewing-guide.pdf',
        headers: [
          {
            key: 'Content-Disposition',
            value:
              'attachment; filename="kuki-logic-viewing-guide.pdf"; filename*=UTF-8\'\'%E4%B9%85%E5%96%9CLOGIC%E5%86%85%E8%A6%A7%E4%BC%9A%E8%B3%87%E6%96%99.pdf',
          },
        ],
      },
      {
        // docs配下共通: MIMEスニッフィング防止と、資料差し替え時に
        // 古いキャッシュが残りすぎないための1時間キャッシュ
        source: '/docs/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
};

export default nextConfig;
