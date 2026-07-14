const SPECS = [
  { icon: '梁下有効高', value: '5.5', unit: 'm以上', desc: '梁下有効高。大型車両・高積み保管に対応。' },
  { icon: '床荷重', value: '1.5', unit: 't/㎡', desc: '床荷重。重量物の保管にも余裕を持たせています。' },
  { icon: 'トラックバース', value: '12', unit: '台', desc: '同時荷役が可能なトラックバースを配置。' },
  { icon: '駐車場', value: '約40', unit: '台', desc: '乗用車約40台相当、約240坪の駐車場を確保。' },
  { icon: '構造・規模', value: 'S造', unit: '地上2階', desc: '用途地域：市街化調整区域（都計法34条12号指定）。' },
  { icon: 'エレベーター', value: 'EV', unit: '両面開き', desc: '1階・2階間の搬送動線をスムーズに。' },
];

export default function Spec() {
  return (
    <section className="section-pad" id="spec">
      <div className="wrap">
        <div className="eyebrow">施設スペック</div>
        <h2 className="section-title">倉庫スペック</h2>
        <p className="section-intro">
          S造・地上2階、無柱空間を活かした保管・配送拠点。床荷重1.5t/㎡、EV両面開きなど、稼働を止めない設備を備えています。
        </p>
        <div className="spec-grid">
          {SPECS.map((s) => (
            <div className="spec-card" key={s.icon}>
              <div className="icon">{s.icon}</div>
              <div className="value">
                {s.value}
                <small>{s.unit}</small>
              </div>
              <div className="desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
