# 📖 肌肉書僮 (Muscle Booker) - 專案領域上下文與專有名詞表 (CONTEXT.md)

> 本文件遵循 Matt Pocock Skills 之 `CONTEXT.md` 規範，建立團隊與 AI 代理人（Agent）共用的領域語言（Ubiquitous Language），避免對話冗長與語意歧義。

---

## 🏛️ 核心領域名詞 (Domain Terms)

| 領域名詞 (Domain Term) | 精確定義與意義 | 代碼/模組對應 |
| :--- | :--- | :--- |
| **肌肉書僮 (Muscle Booker)** | 本台股波段與籌碼風控決策系統之名稱。 | `App.tsx`, `Home.tsx` |
| **箱子戰術 (Box Strategy)** | 連續三日不創高確立箱頂，連續三日不創低確立箱底之動能突破/防守策略。 | `calculations.ts` |
| **ATR 動態停利 (ATR Trailing Stop)** | 依據平均真實波幅 (ATR) 設定之移動防守線，收盤跌破即落袋。 | `calculateTrailingStopPrice` |
| **永豐金籌碼 (Yunfeng Chips)** | 指包含主力分點集中度 (%)、三大法人買賣超與 400/1000 張大戶持股比率之真實籌碼資料。 | `YunfengChipData`, `stockApi.ts` |
| **摩擦成本 (Friction Cost)** | 包含 0.0855% 手續費（6折）、NT$20 低消門檻、ETF 0.1% / 個股 0.3% 證交稅。 | `FRICTION_CONSTANTS` |
| **五欄位 Brief (5-Field Brief)** | 🎯目標、🏢背景、📁素材、🧱邊界、🏁完成定義。 | `docs/` |

---

## ⚙️ 專案慣例設定 (Project Conventions)

* **文檔輸出路徑**: `docs/`
* **單元測試框架**: Vitest (`npx vitest run`)
* **型別檢查指令**: TypeScript (`npx tsc --noEmit`)
* **預設 issue/task 檔案**: `docs/TICKETS_YUNFENG_CHIP_MODULE.md`
