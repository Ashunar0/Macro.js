[English](README.md) | [日本語](README.ja.md)

# create-macro

Google Apps Script (GAS) プロジェクトを素早くセットアップするCLIツール。

## インストール

```bash
npm create macro
```

または

```bash
npx create-macro
```

## 使い方

### インタラクティブモード

```bash
npm create macro
```

プロンプトに従ってプロジェクトを設定:

1. プロジェクト名
2. 言語 (TypeScript / JavaScript)
3. GASプロジェクトを自動作成するか
4. プロジェクトタイプ (standalone, sheets, docs, forms, slides, webapp)

### 非インタラクティブモード

```bash
npm create macro my-project -- --yes
```

デフォルト値でプロジェクトを作成:
- 言語: TypeScript
- GASプロジェクト作成: はい
- プロジェクトタイプ: standalone

## オプション

| オプション | 短縮形 | 説明 |
|-----------|--------|------|
| `--yes` | `-y` | デフォルト値で全ての質問をスキップ |
| `--help` | `-h` | ヘルプを表示 |
| `--version` | `-v` | バージョンを表示 |

## 生成されるファイル構成

```
my-project/
├── src/
│   ├── main.ts (or main.js)
│   └── appsscript.json
├── dist/           (ビルド後に生成)
├── .clasp.json
├── .gitignore
├── package.json
└── tsconfig.json   (TypeScriptのみ)
```

## ワークフロー

```bash
# プロジェクト作成
npm create macro my-project

# ディレクトリ移動
cd my-project

# ビルド
npm run build

# GASにプッシュ
npm run push

# (オプション) ブラウザで開く
npm run open
```

## 前提条件

- Node.js >= 18
- Googleアカウント
- Google Apps Script APIが有効 (下記参照)

## GAS API の有効化

GASプロジェクトを自動作成する場合、Google Apps Script APIを有効にする必要があります:

1. https://script.google.com/home/usersettings にアクセス
2. 「Google Apps Script API」をオンにする

## ライセンス

MIT
