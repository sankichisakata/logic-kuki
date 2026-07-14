const DATES = [
  { dow: '木曜日', md: '7月22日', time: '10:00 - 17:00' },
  { dow: '水曜日', md: '8月5日', time: '10:00 - 17:00' },
  { dow: '火曜日', md: '8月18日', time: '10:00 - 17:00' },
];

export default function Viewing() {
  return (
    <section className="section-pad viewing" id="viewing">
      <div className="wrap">
        <div className="eyebrow" data-reveal>竣工前内覧会</div>
        <h2 className="section-title" data-reveal>竣工前内覧会 開催</h2>
        <p className="section-intro" data-reveal>竣工前の今だから見られる、無柱空間を体感。日程外もご相談ください。</p>

        <div className="dates-grid">
          {DATES.map((d, i) => (
            <div className="date-card" key={d.md} data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
              <div className="dow">{d.dow}</div>
              <div className="md">{d.md}</div>
              <div className="time">{d.time}</div>
            </div>
          ))}
        </div>
        <div className="viewing-note" data-reveal>※ 上記以外の日程もご希望に合わせて内覧可能です。</div>

        <div className="apply-panel" data-reveal>
          <div>
            <h3>お申込み方法</h3>
            <p className="steps">前日までに、会社名・参加人数・希望時間をメールまたはお電話でご連絡ください。</p>
          </div>
          <div className="contact-box">
            <div className="who">担当</div>
            <div className="person">溝口 源一郎（みぞぐち げんいちろう）</div>
            <div className="contact-links">
              <a className="primary" href="tel:08031546483">
                TEL：080-3154-6483
              </a>
              <a href="mailto:gen@all-com.jp">MAIL：gen@all-com.jp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
