import type { CSSProperties } from 'react';

type Zone = { name: string; tag: string; rows: [string, string][]; rent: string };

const ZONES: Zone[] = [
  {
    name: '倉庫棟　西区画（A・C）',
    tag: '西区画',
    rows: [
      ['倉庫1階', '468.80坪'],
      ['倉庫2階', '468.80坪'],
      ['バース', '131.56坪'],
      ['合計', '1,069.16坪'],
    ],
    rent: '3,590',
  },
  {
    name: '倉庫棟　東区画（B・D）',
    tag: '東区画',
    rows: [
      ['倉庫1階', '454.41坪'],
      ['倉庫2階', '454.41坪'],
      ['バース', '131.56坪'],
      ['合計', '974.02坪'],
    ],
    rent: '3,590',
  },
  {
    name: '事務所棟',
    tag: '事務所',
    rows: [
      ['事務所1階', '49.06坪'],
      ['事務所2階', '49.06坪'],
      ['合計', '98.12坪'],
      [' ', ' '],
    ],
    rent: '6,700',
  },
];

/** 区画プラン。倉庫と事務所の面積と賃料を表示する。 */
export default function Zoning() {
  return (
    <section className="section-pad" id="zoning">
      <div className="wrap">
        <div className="eyebrow" data-reveal>区画と賃料</div>
        <h2 className="section-title" data-reveal>区画プラン</h2>
        <p className="section-intro" data-reveal>倉庫棟2区画と事務所棟。面積は用途に合わせて選べます（賃料・共益費は別途消費税）。</p>
        <div className="zoning-grid">
          {ZONES.map((z, i) => (
            <div className="zone-card" key={z.name} data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}>
              <div className="zone-head">
                <span className="zone-name">{z.name}</span>
                <span className="zone-tag">{z.tag}</span>
              </div>
              {z.rows.map(([label, val]) => (
                <div className="zone-row" key={label}>
                  <span>{label}</span>
                  <b>{val}</b>
                </div>
              ))}
              <div className="zone-rent">
                <span className="label">賃料</span>
                <span className="price">
                  {z.rent}
                  <small>円 / 坪・共益費応相談</small>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
