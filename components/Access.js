const ACCESS_ITEMS = [
  { name: '東北自動車道「加須IC」', note: 'ICから最短ルート', dist: '3.9km' },
  { name: '東北自動車道「久喜IC」', note: '圏央道方面からのアクセス', dist: '6.9km' },
  { name: 'JR東北本線「栗橋駅」', note: '宇都宮線・徒歩圏の最寄駅', dist: '2.2km' },
];

export default function Access() {
  return (
    <section className="section-pad access" id="access">
      <div className="wrap">
        <div className="eyebrow">アクセス</div>
        <h2 className="section-title">首都圏と東北を結ぶ立地</h2>
        <div className="access-grid">
          <div>
            <p className="section-intro" style={{ maxWidth: '100%' }}>
              久喜市は埼玉県北東部、首都圏に近い立地と豊かな自然環境を併せ持つ地域です。東北自動車道や圏央道のインターチェンジが近接し、鉄道による都内・東北方面へのアクセスも良好。広域的な物流ネットワークを構築しやすい、配送・流通拠点として高い利便性を持つ土地です。
            </p>
            <div className="access-list">
              {ACCESS_ITEMS.map((a) => (
                <div className="access-item" key={a.name}>
                  <div className="name">
                    {a.name}
                    <small>{a.note}</small>
                  </div>
                  <div className="dist">{a.dist}</div>
                </div>
              ))}
            </div>
            <div className="viewing-note" style={{ marginTop: 26 }}>
              所在地：埼玉県久喜市高柳2927番1他 ／ 敷地は国道125号（2車線道路）に接道
            </div>
          </div>
          <div className="access-photo">
            <img src="/assets/processed/access_ic.webp" alt="東北自動車道インターチェンジ 上空俯瞰" />
            <div className="cap">東北自動車道 インターチェンジ付近</div>
          </div>
        </div>
      </div>
    </section>
  );
}
