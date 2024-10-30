// src/client/frontend/src/features/ReviewPage.tsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ChatMessages from "../components/ChatMessages";
import Avatar1 from "../assets/images/japanese_man.png";
import { useNavigate } from "react-router-dom";

// 型定義
interface ChatMessage{
    id: number;
    type: "user" | "server";
    content: string;
    avatar_type: string;
  }

const ReviewPage: React.FC = () => {
  const navigate = useNavigate(); // ページ遷移用のフック
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const backtop = () => {
    navigate("/");
  };

   // サンプルの面接履歴を useEffect 内で設定
   useEffect(() => {
    const conversations: ChatMessage[] = [
      { id: 1, type: 'server', content: '自己紹介をお願いします。', avatar_type: Avatar1},
      { id: 2, type: 'user', content: '私は情報工学を専攻しており、主にAIとデータ分析に興味を持っています。', avatar_type: Avatar1 },
      { id: 3, type: 'server', content: 'なぜ当社に応募しようと思ったのですか？', avatar_type: Avatar1 },
      { id: 4, type: 'user', content: '御社がAIの活用に積極的で、成長機会が豊富だと感じたからです。', avatar_type: Avatar1 },
      { id: 5, type: 'server', content: 'これまでの経験で最も困難だったプロジェクトについて教えてください。', avatar_type: Avatar1 },
      { id: 6, type: 'user', content: '大学での卒業研究で、複雑なデータモデルの構築に苦労しましたが、最終的には成果を出せました。', avatar_type: Avatar1 },
      { id: 7, type: 'server', content: '5年後のキャリアプランを教えてください。', avatar_type: Avatar1 },
      { id: 8, type: 'user', content: 'エンジニアとしてスキルを伸ばし、将来的にはプロジェクトリーダーを目指しています。' , avatar_type: Avatar1},
      { id: 9, type: 'server', content: 'チームで仕事をする際に大切にしていることは何ですか？', avatar_type: Avatar1 },
      { id: 10, type: 'user', content: 'コミュニケーションを密に取り、お互いの意見を尊重することを心がけています。' , avatar_type: Avatar1},
      { id: 11, type: 'server', content: '最後に、何か質問はありますか？', avatar_type: Avatar1 },
      { id: 12, type: 'user', content: '御社では、新入社員向けの研修はどのように行われていますか？', avatar_type: Avatar1 },
      { id: 13, type: 'server', content: 'ご質問ありがとうございます。本日は以上です。面接は以上となります。' , avatar_type: Avatar1},
      { id: 14, type: 'user', content: '本日はありがとうございました。', avatar_type: Avatar1 },
    ];

    setChatHistory(conversations); // 履歴を設定
  }, []);

  return (
    <>
      <Header
        title="トップ > シミュレーション"
        breadcrumbs={[
          { label: "トップ", link: "/" },
          { label: "レビュー", link: "/review" },
        ]}
      />
      <div className="review-page main-container">
        <ChatMessages messages={chatHistory} />
        <button className="back-to-top-button" onClick={backtop}>
          Topに戻る
        </button>
      </div>
    </>
  );
};

export default ReviewPage;
