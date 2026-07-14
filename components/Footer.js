export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand">アライアンスコミュニケーション株式会社</div>
            <div className="legal" style={{ marginTop: 14 }}>
              〒104-0061 東京都中央区銀座6-13-16 ヒューリック銀座ウォールビル7階
              <br />
              担当　溝口源一郎　TEL 080-3154-6483
            </div>
          </div>
          <div className="legal" style={{ textAlign: 'right' }}>
            宅地建物取引業　東京都知事免許(4)第85897号
            <br />
            第二種金融取引業及び投資助言・代理業　関東財務局長(金商)第1705号
          </div>
        </div>
        <div className="footer-bottom">
          ※資料の内容は概要となります。予告なく変更となる可能性があります。
          <br />
          © Alliance Communication. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
