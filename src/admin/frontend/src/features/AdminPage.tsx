import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Avatar from "../assets/images/japanese_man.png";
import Header from "../components/Header";

// シミュレーションデータの型定義
interface Simulation {
  id: number;
  username: string;
  email: string;
  company_name: string;
  ai_advice:string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const navigate = useNavigate();
  const handleReviewNavigation = (id: number) => {
    navigate(`/review?id=${id}`);
  };
  const [openIds, setOpenIds] = useState<number[]>([]); // 開いている履歴のID

  useEffect(() => {
    const sampleSimulations: Simulation[] = [
      {
        id: 1,
        username: 'elizabethlopez',
        email: 'elopez@yahoo.com',
        company_name: '株式会社パソナ',
        created_at: '2024-09-21',
        ai_advice: 
          '【特徴】\n' +
          '積極的で目標志向が強く、過去の成果に自信を持っていますが、自己PRが控えめな傾向があります。\n' +
          '【サポート内容】\n' +
          '過去の経験と応募企業の求めるスキルをつなげ、自己PRを強化するための練習が必要です。具体的には、STARメソッドを活用して成功体験を整理し、短くわかりやすいストーリーとして伝えられるよう指導しましょう。また、面接での非言語的コミュニケーション（表情・ジェスチャー）も改善すると効果的です。',
      },
      {
        id: 2,
        username: 'mmartinez1997',
        email: 'mmartinez1997@gmail.com',
        company_name: '株式会社A',
        created_at: '2024-10-01',
        ai_advice: 
          '【特徴】\n' +
          '長期的な視野を持ちながらも、自分のキャリアの方向性に確信を持てていない様子があります。\n' +
          '【サポート内容】\n' +
          '応募企業のビジョンと自身のキャリアゴールを一致させるため、キャリアパスを見直す時間を設けましょう。企業文化や成長可能性についての調査を手伝い、面接での具体例として話せるよう準備を進めると良いです。また、モックインタビューを行い、企業とのカルチャーフィットをアピールする練習も有効です。',
      },
      {
        id: 3,
        username: 'elizabeth_hall_1998',
        email: 'elizabeth_hall_1998@gmail.com',
        company_name: '株式会社B',
        created_at: '2024-10-02',
        ai_advice: 
          '【特徴】\n' +
          '実務経験が豊富で市場価値が高いですが、給与交渉に自信がない様子があります。\n' +
          '【サポート内容】\n' +
          '市場の平均年収を調査し、説得力のある給与交渉を行うためのトレーニングを行いましょう。具体的な数値と成果を示し、企業の提示額に対する合理的な反論を準備することが重要です。シミュレーションを通じて自信をつけ、緊張しやすい場面でも冷静に交渉できるようにサポートします。',
      },
      {
        id: 4,
        username: 'maria_white',
        email: 'maria_white@hotmail.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-02',
        ai_advice: 
          '【特徴】\n' +
          '協調性が高く、チームでの成功体験が多い反面、自分の役割を強調するのが苦手です。\n' +
          '【サポート内容】\n' +
          '過去のチームワークでの成功体験を具体的に伝える練習が必要です。特に、自身の貢献がどのようにプロジェクトの成功につながったかを説明できるようにしましょう。面接での想定質問を用意し、回答に自信を持てるよう繰り返し練習することで、個人の役割を強調するスキルを磨きます。',
      },
      {
        id: 5,
        username: 'ewatson',
        email: 'ewatson@yahoo.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-03',
        ai_advice: 
          '【特徴】\n' +
          '自己分析がしっかりしており、目標を持っていますが、企業ビジョンとの整合性を効果的に伝えることが課題です。\n' +
          '【サポート内容】\n' +
          '応募企業のビジョンと自身のキャリアゴールがどのように一致するかを明確に伝えるサポートを行いましょう。企業のミッション・ビジョンに関連する経験や価値観を言語化する練習が有効です。また、面接で使えるエレベーターピッチを準備し、印象的に伝えられるようトレーニングを行います。',
      },
      {
        id: 6,
        username: 'eallen1998',
        email: 'eallen@gmail.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-02',
        ai_advice: 
          '【特徴】\n' +
          'キャリアチェンジを検討中で、これまでの経験と新しい分野の接続を見出すことに苦労しています。\n' +
          '【サポート内容】\n' +
          '自己紹介の一貫性を持たせるため、これまでの経験が新しい分野でも活かせることを伝える練習が必要です。職務経歴書やポートフォリオを整理し、面接官に明確なキャリアビジョンを示せるよう支援します。また、キャリアチェンジの成功例を紹介し、モチベーションを高めるサポートも行いましょう。',
      },
      {
        id: 7,
        username: 'calebjones',
        email: 'calebjones@gmail.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-02',
        ai_advice: 
          '【特徴】\n' +
          'コミュニケーション力が高く、対人関係を重視しますが、具体的なエピソードでそれを裏付けるのが苦手です。\n' +
          '【サポート内容】\n' +
          'シナリオベースの質問に取り組むことで、コミュニケーション力を具体的に伝える練習を行いましょう。例えば、顧客とのやり取りや同僚との協働における成功例を整理し、面接官に伝えられるようにサポートします。また、ロールプレイを通じて回答をブラッシュアップするのも効果的です。',
      },
    ];
  
    setSimulations(sampleSimulations);
  }, []);
  

// 指定されたIDの開閉をトグルする関数
const toggleOpen = (id: number) => {
  setOpenIds((prevOpenIds) =>
    prevOpenIds.includes(id)
      ? prevOpenIds.filter((openId) => openId !== id) // 既に開いている場合は閉じる
      : [...prevOpenIds, id] // 開いていない場合は追加する
  );
};

  return (
    <>
      <Header
        title="エージェントページ"
        breadcrumbs={[{ label: "エージェントトップ", link: "/admin" }]}
      />
      <div className="admin-page">
        <div className="admin-table-container main-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ユーザー名</th>
                  <th>メールアドレス</th>
                  <th>シミュレーション企業</th>
                  <th>実施時刻</th>
                  <th>結果</th>
                </tr>
              </thead>
              <tbody>
              {simulations.map((simulation) => (
                <React.Fragment key={simulation.id}>
                  <tr
                    className="clickable-row"
                    onClick={() => toggleOpen(simulation.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td data-label="ユーザー名">{simulation.username}</td>
                    <td data-label="メールアドレス">{simulation.email}</td>
                    <td data-label="シミュレーション企業">{simulation.company_name}</td>
                    <td data-label="実施時刻">{simulation.created_at}</td>
                    <td data-label="操作">
                    <button className="result-button"
                    onClick={() => handleReviewNavigation(simulation.id)}>
                詳細を見る
              </button>
                    </td>
                  </tr>
                  {openIds.includes(simulation.id) && (
                    <tr className="advice-row" onClick={() => toggleOpen(simulation.id)}>
                      <td colSpan={5}>
                        <div className="advice-container">
                          <div className="ai-bubble">
                              <img src={Avatar} alt="AI" className="ai-image" />
                              <p className="ai-message-bubble">{simulation.ai_advice}</p>
                            </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
