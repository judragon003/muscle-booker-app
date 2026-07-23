# 📐 肌肉書僮 - TWSE/TPEx 官方全資料自動捕捉風控技術規格書 (SPEC_YUNFENG_CHIP_MODULE.md)

> 本規格書依據 Matt Pocock Skills `/to-spec` 模板升級，定義從臺灣證券交易所 (TWSE) 與櫃買中心 (TPEx) 官方 OpenAPI 全自動拉取必要市場與籌碼資料之技術架構。

---

## 🎯 Problem Statement (問題陳述)

過去使用者在設定股票參數時，需要手動填寫或查詢許多官方公開數據（如即時/收盤價、融資餘額、融資變化張數、三大法人買賣超、大戶持股比率）。手動查詢不僅耗時，且容易填錯，無法達成「一鍵開箱即用」的極致體驗。

---

## 💡 Solution (解決方案)

擴充 **TWSE / TPEx 官方全資料自動捕捉引擎 (`twseOpenApi.ts`)**:
直連 TWSE OpenAPI (`https://openapi.twse.com.tw/#/`) 與 TPEx OpenAPI (`https://www.tpex.org.tw/openapi/#/`)，自動抓取以下 4 大類官方必要資料：

1. **行情資料 (Market Quotes)**: 收盤價、最高價、最低價、成交量 (張)、週轉率 (%)。
2. **信用交易 (Margin Trading)**: 融資餘額 (張)、融資今日增減變化 (張)。
3. **三大法人買賣超 (Institutional Trading)**: 外資買賣超 (張)、投信買賣超 (張)、自營商買賣超 (張)。
4. **集保大戶分級 (TDCC Large Holders)**: 400 張與 1000 張大戶持股比率 (%)。

在「參數設定」模組提供 **「🌐 一鍵自動抓取官方全套資料」** 按鈕，自動解鎖全自動化風控試算！

---

## 👤 User Stories (使用者故事)

1. **身為交易者**，我希望輸入股票代號（如 `0050` 或 `2330`）後點擊「一鍵自動抓取」，系統能自動從證交所 API 填入最新收盤價、高低價與成交量，無需手動查詢。
2. **身為交易者**，我希望系統能自動從 TWSE 信用交易 API 填入融資餘額與融資變化張數，直接帶入融資過熱警示評估。
3. **身為交易者**，我希望系統能自動拉取三大法人買賣超與集保大戶比率，自動生成「肌肉書僮箱子戰術」之 1.25x / 2.5x ATR 移動防守線。

---

## 🛠️ Implementation Decisions (實務實現決策)

* **官方 API 端點封裝 (`twseOpenApi.ts`)**:
  - `STOCK_DAY_ALL`: 抓取個股收盤價、最高價、最低價、成交張數。
  - `MI_MARGIN`: 抓取融資買進、融資賣出、融資餘額與增減。
  - `T86`: 抓取三大法人買賣超。
* **介面 UI 整合 (`InputWizard.tsx`)**:
  - 於「步驟 B 即時數據」與「步驟 D 籌碼」均提供一鍵自動同步按鈕，一鍵寫入 `WizardData`。
* **風控算力整合 (`calculations.ts`)**:
  - 融資餘額與三大法人數據自動進入 `evaluateFinancingRisk` 與 `evaluateYunfengChipRisk` 進行雙重檢驗。

---

## 🧪 Testing Decisions (測試決策)

* 驗證 TWSE 官方全資料 Parsing 函數之正確性與邊界降級。
* 保持 `npx vitest run` 16/16 測試全數 [PASS] 綠燈通過。
