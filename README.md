# 前略プロフィール (Zenryaku Profile) - Nostr Client

Nostr前略プロフィールは、2000年代初頭の人気日本語プロフィールサービス「前略プロフィール」のデザインと機能を再現したNostrクライアントです。

![サンプル画像](https://blossom.westernbtc.com/07211c33e4bdecab4aadb03d0731e77c1eb72ee6ab6bb03b5b6631ed1c4fcbe0.png)

## 機能

### Nostrプロトコル統合
- **プロフィール表示 (Kind 0)**: ユーザー名、画像、バナー、自己紹介文、認証状態などを表示
- **ノートタイムライン (Kind 1)**: ユーザーの最近の投稿を表示
- **コンタクトリスト (Kind 3)**: 相互フォロー検出機能付きの友達リストを表示
- **カスタムリスト (Kind 30000/30001)**: お気に入りの構造化リストを表示

### クラシックWebデザイン
- 2007年の前略プロフィールデザインを忠実に再現
- オリジナルに合わせたテーブルベースのレイアウトとスタイリング
- オリジナルのタイトル画像とスタイリングを使用

### 機能性
- NPUBによる検索（オリジナルのプロフィールID検索の代わり）
- タブベースのプロフィールセクションナビゲーション
- プロフィールの「自己紹介」セクションでのMarkdownサポート
- NIP-05認証表示
- Lightning address（Zap）サポート

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/tami1A84/zenryasku.git
cd zenryasku

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## 使用方法

1. ブラウザでアプリケーションを開く（デフォルト: http://localhost:5173/）
2. 検索フィールドにNostr NPUBを入力
3. 「検索」をクリックしてプロフィールを表示
4. タブを切り替えて異なるセクションを表示:
   - プロフィール: 基本的なプロフィール情報
   - 友達リスト: Kind 3イベントからのコンタクト
   - お気に入り: Kind 30000/30001イベントからのカスタムリスト

## 技術詳細

- React、TypeScript、Viteで構築
- Nostrプロトコル連携にnostr-toolsを使用
- Tailwind CSSとカスタムCSSでスタイリング
- 複数の公開Nostrリレーからデータを取得:
  - wss://relay.damus.io
  - wss://nos.lol
  - wss://relay.snort.social
  - wss://relay.nostr.band

## 外部リンク

- 「新規登録！」は https://nstart.me/ja にリンク
- 「管理人室」は https://metadata.nostr.com/ にリンク
- サンプルプロフィール「jack」はJack DorseyのNostrプロフィールにリンク

## 参考資料

- [Nostrプロトコル](https://github.com/nostr-protocol/nostr)
- [Nostr実装の可能性（NIPs）](https://github.com/nostr-protocol/nips)
- [オリジナル前略プロフィール（アーカイブ）](https://web.archive.org/web/20070909053300/http://pr.cgiboy.com/)

## ライセンス

MIT
