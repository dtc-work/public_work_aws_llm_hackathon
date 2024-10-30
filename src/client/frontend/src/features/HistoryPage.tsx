import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";

// シミュレーションデータの型定義
interface Simulation {
  id: number;
  username: string;
  email: string;
  company_name: string;
  created_at: string;
}

const HistoryPage: React.FC = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const navigate = useNavigate();
  const handleReviewNavigation = (id: number) => {
    navigate(`/review?id=${id}`);
  };

 // サンプルデータを useEffect 内で設定
 useEffect(() => {
    const sampleSimulations: Simulation[] = [
      {
        id: 1,
        username: 'elizabethlopez',
        email: 'elopez@yahoo.com',
        company_name: '株式会社パソナ',
        created_at: '2024-09-21',
      },
      {
        id: 2,
        username: 'mmartinez1997',
        email: 'mmartinez1997@gmail.com',
        company_name: '株式会社A',
        created_at: '2024-10-01',
      },
      {
        id: 3,
        username: 'elizabeth_hall_1998',
        email: 'elizabeth_hall_1998@gmail.com',
        company_name: '株式会社B',
        created_at: '2024-10-02',
      },
      {
        id: 4,
        username: 'maria_white',
        email: 'maria_white@hotmail.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-02',
      },
      {
        id: 5,
        username: 'ewatson',
        email: 'ewatson@yahoo.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-03',
      },
      {
        id: 6,
        username: 'eallen1998',
        email: 'eallen@gmail.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-02',
      },
      {
        id: 7,
        username: 'calebjones',
        email: 'calebjones@gmail.com',
        company_name: '株式会社パソナ',
        created_at: '2024-10-02',
      },
    ];

    // シミュレーションデータを設定
    setSimulations(sampleSimulations);
  }, []); // 初回レンダリング時にのみ実行

  return (
    <>
      <Header
        title="シミュレーション履歴ページ"
        breadcrumbs={[{ label: "トップ", link: "/" },{ label: "面接履歴", link: "/history" }]}
      />
      <div className="history-page">
        <div className="history-table-container main-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>シミュレーション企業</th>
                  <th>実施時刻</th>
                  <th>結果</th>
                </tr>
              </thead>
              <tbody>
                {simulations.map((simulation) => (
                  <tr key={simulation.id}>
                    <td data-label="シミュレーション企業">{simulation.company_name}</td>
                    <td data-label="実施時刻">{simulation.created_at}</td>
                    <td data-label="結果">
                    <button className="link-button"
                    onClick={() => handleReviewNavigation(simulation.id)}>
                結果を見る
              </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;