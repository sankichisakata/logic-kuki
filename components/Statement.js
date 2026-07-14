const STATS = [
  { num: '5,846.82', unit: '㎡', label: '敷地面積（1,768.66坪）' },
  { num: '7,078.67', unit: '㎡', label: '延床面積（2,141.30坪）' },
  { num: '5.5', unit: 'm以上', label: '梁下有効高' },
  { num: '12', unit: '台', label: 'トラックバース' },
  { num: '約40', unit: '台', label: '駐車場（乗用車相当）' },
];

export default function Statement() {
  return (
    <section className="statement">
      <div className="wrap">
        <p data-reveal>
          東北自動車道「加須IC」まで<span className="accent">3.9km</span>。
          <br />
          国道125号に面し、荷の流れを止めない立地に、
          <br />
          無柱空間と大型バースを備えた倉庫を建てました。
        </p>
        <div className="stat-row">
          {STATS.map((s, i) => (
            <div className="stat" key={s.label} data-reveal style={{ '--reveal-delay': `${i * 70}ms` }}>
              <div className="num">
                {s.num}
                <span>{s.unit}</span>
              </div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
