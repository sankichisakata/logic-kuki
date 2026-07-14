const POINTS = [
  {
    n: '01',
    title: 'マイカー通勤も無理がない',
    desc: '敷地内に約40台（乗用車相当）の駐車場を確保。国道125号に直接面しているため、車での出勤ルートが分かりやすく、渋滞の少ない幹線道路からそのまま敷地に入れます。',
  },
  {
    n: '02',
    title: '最寄り駅からもアクセス可能',
    desc: 'JR東北本線（宇都宮線）「栗橋駅」まで約2.2km。電車通勤のスタッフとマイカー通勤のスタッフ、どちらの働き方にも対応できる立地です。',
  },
  {
    n: '03',
    title: '物流・製造業が集まるエリア',
    desc: '周辺には丸山運輸倉庫（株）、KOMINE工業（株）佐間工場、セイコー産業（株）mic埼玉事業所など、同業種・関連業種の事業所が集積。荷主・協力会社との連携が取りやすいエリアです。',
  },
  {
    n: '04',
    title: '静かで落ち着いた環境',
    desc: '敷地南には元香取神社。市街化調整区域に位置し、周囲は農地と工業地が混在する落ち着いたエリアで、休憩時間も静かに過ごせます。',
  },
];

export default function AreaGuide() {
  return (
    <section className="section-pad area" id="area">
      <div className="wrap">
        <div className="eyebrow" data-reveal>周辺エリア</div>
        <h2 className="section-title" data-reveal>はたらく人の目線で見る、立地条件</h2>
        <p className="section-intro" data-reveal>毎日通う場所だからこそ、通勤のしやすさや周辺の環境も大切な条件です。地図で位置関係を確認いただけます。</p>
        <div className="area-grid">
          <div className="area-map" data-reveal>
            <iframe
              src="https://www.google.com/maps?q=%E5%9F%BC%E7%8E%89%E7%9C%8C%E4%B9%85%E5%96%9C%E5%B8%82%E9%AB%98%E6%9F%B32927&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="久喜LOGIC 所在地マップ"
            />
            <div className="cap">埼玉県久喜市高柳2927番1他</div>
          </div>
          <div className="area-points">
            {POINTS.map((p, i) => (
              <div className="area-point" key={p.n} data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
                <div className="pn">{p.n}</div>
                <div>
                  <div className="pt">{p.title}</div>
                  <div className="pd">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
