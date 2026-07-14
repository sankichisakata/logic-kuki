const IMAGES = [
  { num: '01', name: 'エントランス', src: '/assets/processed/p13_01_670x467_crop.webp', alt: 'エントランス 内観イメージ' },
  { num: '02', name: '1Fトイレ', src: '/assets/processed/p13_02_514x359_crop.webp', alt: '1Fトイレ 内観イメージ' },
  { num: '03', name: '2Fオフィス', src: '/assets/processed/p13_00_511x349_crop.webp', alt: '2Fオフィス 内観イメージ' },
];

export default function Gallery() {
  return (
    <section className="section-pad" id="interior">
      <div className="wrap">
        <div className="eyebrow">内観</div>
        <h2 className="section-title">内観イメージ</h2>
        <p className="section-intro">事務所棟のエントランスからオフィスまで、働く場としての快適性にもこだわりました。</p>
        <div className="gallery">
          {IMAGES.map((img) => (
            <div className="gal-card" key={img.num}>
              <img src={img.src} alt={img.alt} />
              <div className="gal-label">
                <div className="num">{img.num}</div>
                <div className="name">{img.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
