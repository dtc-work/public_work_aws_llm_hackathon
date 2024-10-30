// src/admin/frontend/src/components/EvaluationResult.tsx
import React from "react";

// 型定義
interface EvaluationPoint {
  title: string;
  score: number;
  comment: string;
}

interface EvaluationData {
  overallScore: number;
  summary: string;
  evaluationPoints: EvaluationPoint[];
  improvementSuggestions: string[];
}

interface EvaluationResultProps {
  data: EvaluationData;
}

const EvaluationResult: React.FC<EvaluationResultProps> = ({ data }) => {
  return (
    <div className="evaluation-section">
      <h2>面接評価結果</h2>
      <p>お疲れ様でした！以下は今回のシミュレーションに基づく評価結果です。</p>
      <h3>総合評価: {data.overallScore}/100</h3>
      <p>{data.summary}</p>
      <h3>評価ポイント:</h3>
      <ul>
        {data.evaluationPoints.map((point, index) => (
          <li key={index}>
            {point.title} ({point.score}/100): {point.comment}
          </li>
        ))}
      </ul>
      <h3>改善提案:</h3>
      <ul>
        {data.improvementSuggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

export default EvaluationResult;
