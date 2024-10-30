# work_aws_llm_hackathon

## 目次

- [外部ドキュメント一覧](#外部ドキュメント一覧)
- [システム構成の概要](#システム構成の概要)
- [使用技術](#使用技術)
- [環境構築の手順](#環境構築の手順)
- [ディレクトリ構造](#ディレクトリ構造)
- [Git 運用ルール](#git運用ルール)
- [参考記事](#参考記事)

## 外部ドキュメント一覧

- [backlog [Team] プロダクト開発チーム](https://dtc-work.backlog.jp/projects/TEAM_PROJECT_DEV)
  - [wiki / 生成 AI / 環境構築手順](https://dtc-work.backlog.jp/alias/wiki/1075748417)

## システム構成の概要

### TODO:システム構成図

![system.drawio.svg](./docs/system.drawio.svg)

## 使用技術

### bff

- Python 3.12
- FastAPI 0.109.\*

### frontend

- React ^18.2.0
- TypeScript ^5.3.3
- TailwindCSS ^3.4.1

## 環境構築の手順

### 動作環境

- os
  - mac
- software
  - docker / docker-compose
  - node
    - `src/client/frontend/.node-version` で指定されているバージョンの node が必要となる

### 初期構築

#### 1. frontend(フロントエンド)

```
# 必要なパッケージのインストール
% make frontend_install
```

- node のバージョンに関するエラーが出たらエラーメッセージに従ってインストールする
- 実行後、src/frontend/直下に `node_modules/` ディレクトリができていたら成功

#### 2. bff(サーバサイド)

- `example.env` を元に、リポジトリ直下に `.env` ファイルを作成する
  - 下記を参考に、不明な場合はメンバーに確認してください
  - LLM_API_BASE: llm のエンドポイント URL
  - LLM_API_KEY: llm のキー 1 またはキー 2
  - LLM_API_VERSION: [llm Service REST API reference](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference)の Supported versions より適切なものを選ぶ(基本は最新の安定版)
  - LLM_DEPLOYMENT_NAME: llm のモデルデプロイのデプロイ名

```
# どちらかを実行
## フォアグラウンドで起動したい場合
% make buildup

## バックグラウンドで起動したい場合
% make buildupd

# コンテナ起動後、リンター・フォーマッターのインストール
% make build_dev
```

### 初期構築以降

#### コマンド(frontend)

- `make frontend_dev` : 開発環境構築
- `make frontend_check`: タイプチェック実行
- `make frontend_fmt` : フォーマット実行&修正
- `make frontend_build` : ビルド
- `make frontend_build_local` : ローカル環境用ビルド

#### コマンド(bff)

- `make fmt` : フォーマット実行
- `make lint` : リント実行
- `make lintf` : リント実行&修正
- `make up` : フォアグラウンド構築起動
- `make upd` : バックグラウンド構築起動
- `make start` : サービス起動
- `make stop` : サービス停止
- `make restart` : サービス再起動
- `make rm` : プロジェクト内のサービス停止してコンテナ削除
- `make rmi` : プロジェクト内のイメージ、コンテナ、ネットワークを削除
- `make logsf` : サービスからのログ出力を表示&フォロー(表示し続ける)
- `make logs` : サービスからのログ出力を表示

## ディレクトリ構造

```
.
├── .github/
│   └── workflows/                  # 自動デプロイの設定(基本いじらない)
├── docker_images/                  # コンテナ周りの設定(基本いじらない)
│   └── app/
├── docs/                           # ドキュメントを格納
├── infra/                          # インフラの設定(基本いじらない)
├── shells/                         # shellの設定(基本いじらない)
└── src/
    ├── bff/                        # サーバサイドのルート
    │   ├── api/
    │   │   └── api_v1/
    │   │       └── endpoints/      # APIの処理を記述
    │   ├── core/                   # サーバサイドの基本設定・定数の管理
    │   ├── public/                 # フロントエンドのビルド結果が格納される(基本いじらない)
    │   ├── schemas/                # APIのリクエスト・レスポンスの型定義
    │   ├── utils/                  # Azureサービスの操作・汎用的な処理など
    │   └── main.py                 # サーバサイドで最初に呼び出される(基本いじらない)
    └── frontend/                   # フロントエンドのルート
        └── src/
            ├── assets/             # 画像、フォントなどのすべての静的ファイルを含むことができるアセットフォルダ
            ├── components/         # アプリケーション全体で使用される共有コンポーネント
            ├── config/             # グローバル設定・環境変数などの設定のエクスポート
            ├── features/           # 機能ベースのモジュール
            ├── hooks/              # アプリケーション全体で使用される共有フック
            ├── lib/                # アプリケーションに事前設定されたさまざまなライブラリを再エクスポート
            ├── providers/          # アプリケーションのすべてのプロバイダ
            ├── routes/             # ルートの設定
            ├── stores/             # グローバルステートストア
            ├── test/               # テストユーティリティとモックサーバ
            ├── types/              # アプリケーション全体で使用される基本的な型の定義
            └── utils/              # 共通のユーティリティ関数

```

## Git 運用ルール

### ブランチについて

- `main` ブランチ: 本番環境相当、公開するものを置く
- `feature/*` ブランチ: 機能開発時に使う
  - 作業開始時に `main` ブランチから派生させる
  - `*` 部分には基本的に backlog の課題キーを設定する(ex. `feature/TEAM_PROJECT_DEV-1`)
  - 作業完了後、チーム内でコードレビューをした後、レビュアーがマージする

### TODO: WIP 開発について

## 参考記事

- [bulletproof-react / Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [React ベストプラクティスの宝庫！「bulletproof-react」が勉強になりすぎる件](https://zenn.dev/manalink_dev/articles/bulletproof-react-is-best-architecture)
- [本気で考える React のベストプラクティス！bulletproof-react2022](https://zenn.dev/t_keshi/articles/bulletproof-react-2022)
