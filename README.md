<!--
---
id: day104
slug: stegogrid-explorer

title: "StegoGrid Explorer"

subtitle_ja: "縦・横・斜め・逆方向から隠し単語を探索するグリッド解析ツール"
subtitle_en: "Explore hidden words in text grids from all directions"

description_ja: "複数行テキストを文字グリッドとして扱い、縦・横・斜め・逆方向の全8方向から英単語を探索・可視化するステガノグラフィー解析支援ツール。"
description_en: "A grid-based word exploration tool that scans text in all eight directions to uncover hidden words, designed for steganography and cipher analysis."

category_ja:
  - ワードパズル
  - ステガノグラフィー
category_en:
  - Word Puzzle
  - steganography

difficulty: 1

tags:
  - steganography
  - word-search
  - cipher
  - grid
  - visualization

repo_url: "https://github.com/ipusiron/stegogrid-explorer"
demo_url: "https://ipusiron.github.io/stegogrid-explorer/"

hub: true
---
!-->

# StegoGrid Explorer - 文字グリッド単語探索ツール

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/stegogrid-explorer?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/stegogrid-explorer?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/stegogrid-explorer)
![GitHub license](https://img.shields.io/github/license/ipusiron/stegogrid-explorer)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/stegogrid-explorer/)

**Day104 - 生成AIで作るセキュリティツール200**

StegoGrid Explorerは、複数行テキストを文字グリッドとして扱い、縦・横・斜め・逆方向を含む全8方向からASCII英単語を探索・可視化するWebツールです。文字列の配置と座標を確認するための学習・調査補助に使えます。

---

## 🌐 デモページ

👉 **[https://ipusiron.github.io/stegogrid-explorer/](https://ipusiron.github.io/stegogrid-explorer/)**

ブラウザーで直接お試しいただけます。

---

## 📸 スクリーンショット

> ![StegoGrid Explorerで斜め方向の単語を探索](assets/screenshot.png)
> *固定プリセットから斜め方向の単語と座標を確認*

---

## ✨ できること

- 複数行テキストを文字グリッドとして解析
- 以下8方向すべてから英単語を探索
  - 横方向：右（→）、左（←）
  - 縦方向：下（↓）、上（↑）
  - 斜め方向：右下（↘）、左上（↖）、右上（↗）、左下（↙）
- 50語の代表的な英単語（3文字以上）を検索
- ユーザーが指定した任意の単語リストにも対応
- 見つかった単語を以下の形式で可視化
  - グリッド上でのハイライト表示
  - 単語・方向・開始位置・終了位置の一覧表示
  - 複数の単語が見つかった場合は色分けして表示
- 空白や記号をまたいだ一致を防止（非ASCII英字は探索ブロック扱い）
- 大文字への正規化をOFFにした場合は大小文字を区別
- 3種類の再現可能な教材プリセット

---

## 🎯 ユースケース

### このツールならではの使い方

- **8方向の読み筋を比較する**：`CODE`を右向きと右上向きに置き、方向・開始座標・終了座標がどう変わるか確認する。
- **大小文字の扱いを実験する**：正規化OFFで`Code`と`CODE`を別の文字列として比較し、検索条件が結果へ与える影響を学ぶ。
- **偶然一致を観察する**：代表50語をON／OFFにして、3文字の短い語が意図せず見つかりやすいことを確認する。
- **ブロック境界を確かめる**：英字の間へ空白・記号・絵文字を置き、単語が非英字をまたがないことと座標の変化を確認する。

### 一般的な使い方

- ステガノグラフィーやワードグリッドの入門学習
- 縦読み・斜め読み・逆読みの配置確認
- CTFやパズルで、候補語が指定経路に存在するかを調べる補助
- 単語探し教材の作成と答え合わせ

---

## 🧩 処理規則

- 非英字（空白・記号など）をブロック扱い
- 単語は3〜100文字のASCII英字だけを対象とする
- 行長が不揃いなテキストでも解析可能
- 絵文字や結合文字を含む非ASCII文字は、UTF-16コード単位ではなくコードポイント単位で1ブロックとして数える
- 空白除去では行境界を維持し、タブ・半角スペース・全角スペースなどの横方向の空白を除去
- 同じ回文が同じセル列で逆方向にも一致する場合は1件にまとめる
- 外部ライブラリ不使用のシンプル構成

---

## 📖 使い方

1. テキストエリアに複数行の文字列を貼り付ける
2. 必要に応じて探索単語や方向を設定
3. 「解析」をクリック、またはCtrl+Enterを押す
4. グリッドと結果一覧を確認

プリセットを選ぶと代表50語はOFF、指定単語はONになり、説明に記載した教材語だけを探索します。結果行はクリックのほか、Tabで移動してEnterまたはSpaceでも選択できます。

---

## ⚙️ 処理上限

ブラウザーの長時間占有を避けるため、次のハード上限を設けています。超過時は描画・探索を開始しません。

| 項目 | 上限 |
|---|---:|
| グリッド | 20,000セル |
| 行数 | 500行 |
| 列数 | 500列 |
| 指定単語 | 500語 |
| 1語の長さ | 100文字 |
| 表示結果 | 5,000件 |

---

## ⚠️ 結果の限界

一致結果は、選択した条件で文字列がその経路に存在することだけを示します。隠しメッセージ、作者の意図、ステガノグラフィーの存在を証明するものではありません。特に3文字程度の短い一般語は偶然一致しやすいため、周辺の文脈や別の根拠と合わせて判断してください。

---

## 📚 代表50語リスト

「代表50語を使用」オプションを有効にすると、以下の英単語が自動的に検索対象となります。

| 3文字 | | | | | | | | | |
|-------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| THE | AND | FOR | ARE | BUT | NOT | YOU | ALL | CAN | HAD |
| HER | WAS | ONE | OUR | OUT | DAY | GET | HAS | HIM | HIS |
| HOW | MAN | NEW | NOW | OLD | SEE | WAY | WHO | BOY | DID |
| ITS | LET | PUT | SAY | SHE | TOO | USE | KEY | | |

| 4文字 | | | | | | | | | |
|-------|------|------|------|------|------|------|------|------|------|
| CODE | WORD | FIND | HIDE | TEXT | GRID | LINE | OPEN | READ | SEEK |
| TRUE | DATA | | | | | | | | |

---

## 🔧 技術仕様

- HTML / CSS / JavaScriptのみで実装
- クライアントサイド完結（外部通信なし）
- GitHub Pagesで動作
- ユーザー入力は`textContent`で描画し、CSPを設定
- HTTPと`file://`の両方で利用可能

---

## 📁 ディレクトリー構造

```
stegogrid-explorer/
├── index.html          # メインHTMLファイル
├── script.js           # UI・日英切り替え・描画処理
├── stegogrid-core.js   # DOMに依存しないグリッド探索コア
├── style.css           # スタイルシート
├── README.md           # 本ドキュメント
├── README.en.md        # 英語版ドキュメント
├── package.json        # テスト実行設定
├── test/               # Node標準テスト
│   └── core.test.js
├── .github/workflows/  # GitHub Actions
│   └── test.yml
├── LICENSE             # ライセンスファイル
├── CLAUDE.md           # Claude Code用プロジェクト情報
├── .gitignore          # Git除外設定
└── assets/             # 画像リソース
    ├── screenshot.png  # 日本語画面のスクリーンショット
    └── en/
        └── screenshot.png # 英語画面のスクリーンショット
```

---

## 📄 ライセンス

- ソースコードのライセンスは `LICENSE` ファイルを参照してください。

---

## 🛠️ このツールについて

本ツールは、「生成AIで作るセキュリティツール200」プロジェクトの一環として開発されました。
このプロジェクトでは、AIの支援を活用しながら、セキュリティに関連するさまざまなツールを100日間にわたり制作・公開していく取り組みを行っています。

プロジェクトの詳細や他のツールについては、以下のページをご覧ください。

🔗 [https://akademeia.info/?page_id=44607](https://akademeia.info/?page_id=44607)
