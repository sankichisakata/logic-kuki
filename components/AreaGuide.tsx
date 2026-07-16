import type { CSSProperties } from 'react';

type AreaPoint = { n: string; title: string; desc: string };

const POINTS: AreaPoint[] = [
  {
    n: '何がある',
    title: '物流・製造業の会社、元香取神社',
    desc: '商業施設は少ない、静かなエリアです。',
  },
  {
    n: 'どのくらい',
    title: '加須IC 3.9km／栗橋駅 2.2km',
    desc: '駐車場は乗用車約40台分。',
  },
  {
    n: 'どんな場所',
    title: '市街化調整区域',
    desc: '工業地と農地が混在する、落ち着いた環境。',
  },
];

/** 周辺エリアガイド。地域の特性を3つの視点から表示する。 */
export default function AreaGuide() {
  return (
    <section className="section-pad area" id="area">
      <div className="wrap">
        <div className="eyebrow" data-reveal>周辺エリア</div>
        <h2 className="section-title" data-reveal>はたらく人の目線で見る、立地条件</h2>
        <p className="section-intro" data-reveal>通勤のしやすさと、周辺環境をひと目で。</p>
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
              <div className="area-point" key={p.n} data-reveal style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}>
                <div className="pn">{p.n}</div>
                <div className="pt">{p.title}</div>
                <div className="pd">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
