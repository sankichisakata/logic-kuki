import type { CSSProperties } from 'react';

type SpecItem = { icon: string; value: string; unit: string; desc: string };

const SPECS: SpecItem[] = [
  { icon: '梁下有効高', value: '5.5', unit: 'm以上', desc: '大型車両・高積み保管に対応。' },
  { icon: '床荷重', value: '1.5', unit: 't/㎡', desc: '重量物の保管に余裕。' },
  { icon: 'トラックバース', value: '12', unit: '台', desc: '同時荷役に対応。' },
  { icon: '駐車場', value: '約40', unit: '台', desc: '乗用車約40台分を確保。' },
  { icon: '構造・規模', value: 'S造', unit: '地上2階', desc: '市街化調整区域（都計法34条12号）。' },
  { icon: 'エレベーター', value: 'EV', unit: '両面開き', desc: '1・2階の搬送をスムーズに。' },
];

/** 倉庫施設のスペック一覧。容量、寸法、設備などを表示する。 */
export default function Spec() {
  return (
    <section className="section-pad" id="spec">
      <div className="wrap">
        <div className="eyebrow" data-reveal>施設スペック</div>
        <h2 className="section-title" data-reveal>倉庫スペック</h2>
        <p className="section-intro" data-reveal>無柱空間を活かした、稼働を止めない設備。</p>
        <div className="spec-grid">
          {SPECS.map((s, i) => (
            <div className="spec-card" key={s.icon} data-reveal style={{ '--reveal-delay': `${i * 60}ms` } as CSSProperties}>
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
