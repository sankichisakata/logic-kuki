import type { CSSProperties } from 'react';

type AccessItem = { name: string; note: string; dist: string };

const ACCESS_ITEMS: AccessItem[] = [
  { name: '東北自動車道「加須IC」', note: 'ICから最短ルート', dist: '3.9km' },
  { name: '東北自動車道「久喜IC」', note: '圏央道方面からのアクセス', dist: '6.9km' },
  { name: 'JR東北本線「栗橋駅」', note: '宇都宮線・徒歩圏の最寄駅', dist: '2.2km' },
];

/** アクセスセクション。ICと駅への距離を一覧表示する。 */
export default function Access() {
  return (
    <section className="section-pad access" id="access">
      <div className="wrap">
        <div className="eyebrow" data-reveal>アクセス</div>
        <h2 className="section-title" data-reveal>首都圏と東北を結ぶ立地</h2>
        <div className="access-grid">
          <div>
            <p className="section-intro" style={{ maxWidth: '100%' }} data-reveal>
              東北自動車道・圏央道に近接。広域配送に強い立地です。
            </p>
            <div className="access-list">
              {ACCESS_ITEMS.map((a, i) => (
                <div className="access-item" key={a.name} data-reveal style={{ '--reveal-delay': `${i * 70}ms` } as CSSProperties}>
                  <div className="name">
                    {a.name}
                    <small>{a.note}</small>
                  </div>
                  <div className="dist">{a.dist}</div>
                </div>
              ))}
            </div>
            <div className="viewing-note" style={{ marginTop: 26 }} data-reveal>
              所在地：埼玉県久喜市高柳2927番1他 ／ 敷地は国道125号（2車線道路）に接道
            </div>
          </div>
          <div className="access-photo" data-reveal>
            <img src="/assets/processed/access_ic.webp" alt="東北自動車道インターチェンジ 上空俯瞰" />
            <div className="cap">東北自動車道 インターチェンジ付近</div>
          </div>
        </div>
      </div>
    </section>
  );
}
