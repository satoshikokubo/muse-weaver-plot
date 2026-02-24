# ☽ Muse Weaver Plot

**MPC-10 — Shape your story's backbone with 10 questions.**

A guided plot creation tool for novel writers, built as an [Obsidian](https://obsidian.md) plugin.

Answer 10 carefully designed questions about your protagonist, goals, obstacles, twists, and theme — and Muse Weaver Plot will help you build a solid story framework, complete with genre-specific guidance, AI-powered hints, and a comprehensive plot diagnosis.

## Features

### 🎯 10-Question Plot Framework (MPC-10)

Walk through 10 essential story questions:

1. **Protagonist** — Strength, weakness, and what they lack
2. **Goal** — Short-term and ultimate objectives
3. **Inciting Incident** — The moment everything changes
4. **Obstacles** — External and internal barriers
5. **Antagonist** — Who opposes them, and why they're justified
6. **Strategy** — Concrete steps toward the goal
7. **Midpoint Twist** — The revelation that changes everything
8. **Rock Bottom** — The greatest failure and its cost
9. **Decision & Climax** — What they sacrifice, what they choose
10. **Afterglow & Theme** — How they changed, in one line

Each question includes genre-tailored prompts, sub-questions for structured input, and concrete examples.

### 🎭 5 Built-in Genre Flavors

Each genre provides tailored questions, labels, and examples for all 10 questions:

- **Base** — Any genre
- **Isekai Fantasy** — Transported to another world
- **Romantic Comedy** — Modern-day love stories
- **Mystery** — Whodunit and everyday puzzles
- **Horror** — Japanese gothic and ghost stories

Additional genre packs are available as optional add-ons (see [Genre Packs](#genre-packs)).

### 🔄 Reweave — Edit Existing Plots

Already saved a plot? Load it back for editing with the **Reweave** feature:

- Select from saved plots via a searchable file picker
- Navigate freely between questions to revise any answer
- Save over the original or create a new version

### 🤖 AI-Powered Assistance (Optional)

When paired with **[Muse Weaver AI Bridge](https://github.com/satoshikokubo/muse-weaver-ai-bridge)**, the plugin offers:

- **💡 Hints** — Stuck on a question? Your guide suggests a concrete idea
- **💬 Follow-up Questions** — Deepen your story with curious, never-pushy questions
- **✨ Approval Comments** — Your guide reacts to your answers with genuine empathy
- **📝 Plot Diagnosis** — Upon completion, receive a synopsis, identified weak spots, and new directions to explore

AI features work with **OpenAI**, **Anthropic**, **Google Gemini**, and local models via **Ollama**.

> **Tip:** Google Gemini's free tier is a great starting point. For best results in English, cloud APIs are recommended over local models.

### ☽ Choose Your Guide

Select from 5 built-in guide personas, each with a distinct voice and personality — configured through the AI Bridge:

| Guide | Icon | Style |
|-------|:----:|-------|
| **Muse** | ☽ | Gentle moon goddess — warm, curious, encouraging |
| **Sol** | ☀ | Energetic sun god — casual, hype, pushes you forward |
| **Stella** | ★ | Tsundere star goddess — sharp but secretly supportive |
| **Minerva** | ⚖ | Wise goddess — scholarly, formal, analytically precise |
| **Athena** | ⚔ | Strategic goddess — tough, Socratic, never settles for easy |

You can also create a fully custom persona with your own name, tone, and speech style.

### 📄 Markdown Export

Save your completed plot as a structured Markdown file with YAML frontmatter — ready to use as a reference while writing. Includes overwrite confirmation for existing files.

### 💾 Auto-Save & Session Recovery

Your progress is automatically saved. If Obsidian closes unexpectedly, you can pick up right where you left off.

### 🌐 Bilingual (Japanese / English)

Full Japanese and English support. The language is automatically detected from your Obsidian settings.

## Installation

### From Obsidian Community Plugins

1. Open **Settings** → **Community plugins** → **Browse**
2. Search for **Muse Weaver Plot**
3. Click **Install**, then **Enable**

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/satoshikokubo/muse-weaver-plot/releases)
2. Create `.obsidian/plugins/muse-weaver-plot/` and place the files inside
3. Enable in **Settings** → **Community plugins**

## AI Setup (Optional)

AI features are entirely optional. The plugin works perfectly without them.

To enable AI:

1. Install the **[Muse Weaver AI Bridge](https://github.com/satoshikokubo/muse-weaver-ai-bridge)** plugin
2. Configure your preferred AI provider in the AI Bridge settings
3. AI features will automatically appear in Muse Weaver Plot

## Genre Packs

### Built-in (Free)

Base, Isekai Fantasy, Romantic Comedy, Mystery, Horror

### Pack A (Add-on)

School/Sports, Suspense/Crime, Lite SF, Historical

### Pack B (Add-on)

Dark Fantasy, Human Drama, Noir, BL/GL

Genre packs are available on [Booth](https://kokubox.booth.pm/). Place the downloaded JSON file in `.obsidian/plugins/muse-weaver-plot/packs/` and reload the plugin from settings.

## Support

If you find this plugin useful, consider supporting development:

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/kokubox) — Donations & support
- 🏪 [Booth](https://kokubox.booth.pm/) — Genre packs

## License

[MIT](LICENSE)

---

# ☽ Muse Weaver Plot（日本語）

**MPC-10 — 10の問いで物語の骨格を作る**

小説執筆者のためのプロット作成支援ツールです。[Obsidian](https://obsidian.md) プラグインとして動作します。

主人公、目標、障害、転換点、テーマなど、物語に必要な10の要素を問いかけ形式で整理します。ジャンルに合わせた質問・例文・AIヒント・プロット診断で、あなたの物語づくりをサポートします。

## 主な機能

### 🎯 10問のプロットフレームワーク（MPC-10）

主人公の強み・弱み・欠落から始まり、ゴール、事件、障害、敵対者、戦略、転換点、どん底、決断、そしてテーマまで——10の問いに答えるだけで物語の骨格が完成します。各問にはジャンル別の質問文・ラベル・サブ設問・具体例が用意されています。

### 🎭 5つの組み込みジャンル

- **ベース**（ジャンル不問）
- **異世界ファンタジー**
- **ラブコメ**（現代）
- **ミステリ**（本格/日常の謎）
- **ホラー**（和風/怪談）

### 🔄 物語を編み直す（Reweave）

保存済みのプロットを読み込んで再編集できます。どの質問にも自由に移動でき、上書き保存も別名保存もOKです。

### 🤖 AI機能（オプション）

**[Muse Weaver AI Bridge](https://github.com/satoshikokubo/muse-weaver-ai-bridge)** を導入すると：

- **💡 ヒント** — 書けない時に具体的なアイデアを提案
- **💬 深掘り質問** — 回答に基づいた掘り下げの問いかけ
- **✨ 承認コメント** — あなたの回答に共感して反応
- **📝 プロット診断** — 完了後にあらすじ・弱点・提案を提示

OpenAI、Anthropic、Google Gemini、Ollama（ローカル）に対応。

> **おすすめ:** Google Gemini の無料枠から気軽に試せます。

### ☽ ガイド神格を選ぶ

AI Bridgeで5種類のガイドから選べます。それぞれ異なる口調と個性を持っています：

| ガイド | 口調 |
|--------|------|
| **Muse**（月の女神） | 穏やか・知的・「聞かせてください」 |
| **Sol**（太陽の神） | カジュアル・情熱的・「いいじゃん！」 |
| **Stella**（星の女神） | ツンデレ・「別に……」 |
| **Minerva**（知恵の女神） | 丁寧・「お見事でございます」 |
| **Athena**（戦略の女神） | 厳しめ・「悪くない。だが、もう一歩」 |

自分だけのオリジナルペルソナも作成できます。

### 📄 Markdown出力

完成したプロットをYAMLフロントマター付きのMarkdownファイルとして保存。既存ファイルへの上書き確認にも対応しています。

### 💾 自動保存・セッション復帰

進行状況は自動保存されます。Obsidianが予期せず終了しても、続きから再開できます。

## インストール

### コミュニティプラグインから

1. **設定** → **コミュニティプラグイン** → **閲覧**
2. 「**Muse Weaver Plot**」で検索
3. **インストール** → **有効化**

### 手動インストール

1. [GitHub Releases](https://github.com/satoshikokubo/muse-weaver-plot/releases) から `main.js`、`manifest.json`、`styles.css` をダウンロード
2. `.obsidian/plugins/muse-weaver-plot/` に配置
3. **設定** → **コミュニティプラグイン** で有効化

## ジャンルパック

追加ジャンルパックは [Booth](https://kokubox.booth.pm/) で購入できます。JSONファイルを `.obsidian/plugins/muse-weaver-plot/packs/` に配置し、設定タブから再読み込みしてください。

| パック | ジャンル |
|--------|---------|
| **Pack A** | 学園/スポーツ、サスペンス/犯罪、ライトSF、歴史 |
| **Pack B** | ダークファンタジー、ヒューマンドラマ、ノワール、BL/GL |

## ライセンス

[MIT](LICENSE)
