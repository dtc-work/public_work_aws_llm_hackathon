// src/admin/frontend/src/components/Header.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Pasona_Logo.svg"; // 画像をインポート

// 型定義
interface Breadcrumb {
  label: string;
  link: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
}

const Header: React.FC<HeaderProps> = memo(({ breadcrumbs }) => {
  const navigate = useNavigate(); // useNavigateフックを使ったページ遷移

  return (
    <header className="header">
      <div className="header-top">
      <img
          src={Logo} // インポートした画像を使用
          alt="Pasona_Logo"
          className="logo"
        />
        <p className="header-text">AI面接エージェント</p>
      </div>
      <div className="header-line">
        <nav className="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="breadcrumb-item">
              {index === breadcrumbs.length - 1 ? (
                <span>{crumb.label}</span>
              ) : (
                <span
                  className="breadcrumb-link"
                  onClick={() => navigate(crumb.link)}
                  style={{ cursor: "pointer" }}
                >
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && " > "}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
});

export default Header;
