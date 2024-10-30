// src/client/frontend/src/features/TopPage.tsx
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar3 from "../assets/images/gal.png";
import Avatar1 from "../assets/images/japanese_man.png";
import Avatar2 from "../assets/images/japanese_woman.png";
import Avatar4 from "../assets/images/old_man.png";
import Header from "../components/Header";
import { API_V1_PATH, HOST } from "../config";

// 型定義
interface Company {
  id: number;
  name: string;
  description: string;
}

interface Avatar {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

// CompanyCard コンポーネント
interface CompanyCardProps extends Company {
  selectedCompanyId: number | null;
  setSelectedCompanyId: (id: number) => void;
}

const CompanyCard: FC<CompanyCardProps> = ({
  id,
  name,
  description,
  selectedCompanyId,
  setSelectedCompanyId,
}) => {
  const isSelected = selectedCompanyId === id;

  return (
    <div
      className={`company-card ${isSelected ? "selected" : ""}`}
      onClick={() => setSelectedCompanyId(id)}
    >
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};

// AvatarCard コンポーネント
interface AvatarCardProps extends Avatar {
  selectedAvatarId: number | null;
  setSelectedAvatarId: (id: number) => void;
}

const AvatarCard: FC<AvatarCardProps> = ({
  id,
  name,
  imageUrl,
  description,
  selectedAvatarId,
  setSelectedAvatarId,
}) => {
  const isSelected = selectedAvatarId === id;

  return (
    <div
      className={`avatar-card ${isSelected ? "selected" : ""}`}
      onClick={() => setSelectedAvatarId(id)}
    >
      <img src={imageUrl} alt={name} className="avatar-image" />
      <div className="avatar-detail">
      <p>{name}</p>
      <p>{description}</p>
      </div>
    </div>
  );
};

const TopPage: FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [avatars] = useState<Avatar[]>([
    { id: 1, name: "男性アバター", imageUrl: Avatar1, description: "男性面接官のアバターです。ロジカルに面接のアドバイスを行なってくれます。" },
    { id: 2, name: "女性アバター", imageUrl: Avatar2, description: "女性面接官のアバターです。ロジカルに面接のアドバイスを行なってくれます。" },
    { id: 3, name: "ギャルアバター", imageUrl: Avatar3, description: "ギャル面接官のアバターです。軽いリアクションやノリの良い言葉使いが特徴ですが、時々鋭い質問もしてくれます。" },
    { id: 4, name: "おじいちゃんアバター", imageUrl: Avatar4, description: "おじいちゃん面接官のアバターです。天然でユーモアあるアドバイスをしてくれます。"}
  ]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const navigate = useNavigate();

  // 企業データを取得する関数
  const fetchCompanies = async () => {
    const response = await fetch(`${HOST}${API_V1_PATH}companies`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setCompanies(data.companies);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleStartSimulation = () => {
    const selectedCompany = companies.find(
      (company) => company.id === selectedCompanyId
    );
    const selectedAvatar = avatars.find((avatar) => avatar.id === selectedAvatarId);

    if (selectedCompany && selectedAvatar) {
      navigate(`/simulation`, {
        state: {
          company_id: selectedCompanyId,
          company_name: selectedCompany.name,
          company_description: selectedCompany.description,
          avatar_id: selectedAvatarId,
        },
      });
    }
  };

  return (
    <>
      <Header
        title="トップページ"
        breadcrumbs={[{ label: "トップ", link: "/" }]}
      />
      <div className="top-page main-container">
        <h2>企業を選択してください</h2>
        <div className="company-list">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              {...company}
              selectedCompanyId={selectedCompanyId}
              setSelectedCompanyId={setSelectedCompanyId}
            />
          ))}
        </div>

        <h2>アバターを選択してください</h2>
        <div className="avatar-list">
          {avatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              {...avatar}
              selectedAvatarId={selectedAvatarId}
              setSelectedAvatarId={setSelectedAvatarId}
            />
          ))}
        </div>

        <div className="simulation-button-container">
        <button
          className="simulation-button"
          onClick={handleStartSimulation}
          disabled={selectedCompanyId === null || selectedAvatarId === null}
        >
          シミュレーション開始
        </button>
        </div>
      </div>
    </>
  );
};

export default TopPage;
