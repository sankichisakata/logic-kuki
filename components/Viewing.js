const DATES = [
  { dow: '木曜日', md: '7月22日', time: '10:00 - 17:00' },
  { dow: '水曜日', md: '8月5日', time: '10:00 - 17:00' },
  { dow: '火曜日', md: '8月18日', time: '10:00 - 17:00' },
];

export default function Viewing() {
  return (
    <section className="section-pad viewing" id="viewing">
      <div className="wrap">
        <div className="eyebrow">竣工前内覧会</div>
        <h2 className="section-title">竣工前内覧会 開催</h2>
        <p className="section-intro">現地の無柱空間・梁下有効高を、竣工前の今だからこそ体感いただけます。下記日程のほか、ご希望に合わせて内覧可能です。</p>

        <div className="dates-grid">
          {DATES.map((d) => (
            <div className="date-card" key={d.md}>
              <div className="dow">{d.dow}</div>
              <div className="md">{d.md}</div>
              <div className="time">{d.time}</div>
            </div>
          ))}
        </div>
        <div className="viewing-note">※ 上記以外の日程もご希望に合わせて内覧可能です。</div>

        <div className="apply-panel">
          <div>
            <h3>お申込み方法</h3>
            <p className="steps">
              前日までに、貴社名・参加者名・人数・希望時間を、メールまたはお電話にて弊社担当者へお知らせください。竣工前のため、現場の状況により内覧時間を調整させていただく場合がございます。
            </p>
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
