# 📐 肌肉書僮 - 證交所/櫃買 OpenAPI 自動抓取與永豐金 T-1 籌碼風控規格書 (SPEC_YUNFENG_CHIP_MODULE.md)

> 本規格書依據 Matt Pocock Skills `/to-spec` 模板全新升級，整合 TWSE/TPEx 官方開放 API 自動化抓取與永豐金 T-1 券商分點籌碼算力。

---

## 🎯 Problem Statement (問題陳述)

1. **手動輸入負擔**：三大法人買賣超 (外資/投信/自營商) 與大戶持股比例 (400張/1000張) 為官方公開權威數據，手動填寫繁瑣且易出錯。
2. **時間差對齊 (T-1 時間軸)**：籌碼數據（大戶集保與券商分點）在台股盤後或次日才揭露（如今天是 7/23，能取得的最完整籌碼為 7/22 T-1 盤後數據）。過去系統缺乏交易日對應與永豐金 TOP15 分點買賣超轉換邏輯。

---

## 💡 Solution (解決方案)

1. **TWSE / TPEx 官方 OpenAPI 自動捕捉引擎 (`twseOpenApi.ts`)**:
   - 直連臺灣證券交易所 OpenAPI (`https://openapi.twse.com.tw/#/`) 與櫃買中心 OpenAPI (`https://www.tpex.org.tw/openapi/#/`)。
   - 點擊「🌐 一鍵自動抓取官方籌碼」，自動拉取最新三大法人買賣超張數與大戶持股比率，免去手動輸入。

2. **永豐金 T-1 券商分點 TOP15 集中度模組**:
   - 標註「籌碼基準日 (T-1 日: 如 2026-07-22)」，確保與 T 日 (2026-07-23) 即時股價精密對齊。
   - 提供永豐金 App 專用「TOP15 分點買超 / 賣超張數」輸入，自動試算主力集中度 (%)：
     $$\text{主力集中度 (\%)} = \frac{\sum \text{Top15 買超張數} - \sum \text{Top15 賣超張數}}{\text{當日總成交量}} \times 100$$

---

## 👤 User Stories (使用者故事)

1. **身為交易者**，我希望點擊「一鍵自動抓取官方籌碼」時，系統能自動從 TWSE/TPEx 官方 OpenAPI 抓取最新的外資、投信、自營商買賣超張數與大戶持股比率，省去手動輸入時間。
2. **身為交易者**，我希望能明確看到籌碼資料日期標記（如 T-1 日 2026-07-22），知道當前的風控決策是基於昨日盤後籌碼配合今日即時股價進行評估。
3. **身為永豐金 App 使用者**，我希望能根據永豐金「券商分點」頁面的 TOP15 買賣超數據輸入，由系統自動算出主力集中度 (%) 與買賣淨張數。
4. **身為交易者**，當 TWSE 官方 API 三大法人同步賣超且前一日主力分點集中度為負時，系統能自動觸發 1.25x ATR 的高防禦性停利保護。

---

## 🛠️ Implementation Decisions (實務實現決策)

* **官方 OpenAPI 模組 (`client/src/lib/twseOpenApi.ts`)**:
  - 調用 TWSE API 端點：三大法人買賣超日報 (`/v1/fund/T86`)、個股日成交 (`/v1/exchangeReport/STOCK_DAY`)。
  - 對於上市 (TW) / 上櫃 (TWO) 股票自動路由至 TWSE 或 TPEx OpenAPI。
* **永豐金 T-1 數據模型擴充 (`YunfengChipData`)**:
  - 新增 `chipDate`: 籌碼數據日期（如 '2026-07-22'）。
  - 新增 `top15BuyVolume` / `top15SellVolume`: 永豐金 TOP15 分點買賣超張數。
  - 新增 `isAutoFetched`: 標記數據是否來自官方 OpenAPI 自動抓取。
* **風控算力 (`calculations.ts`)**:
  - `evaluateYunfengChipRisk` 同時接收 T-1 籌碼日期與 TOP15 主力數據，在籌碼出現散戶接盤、主力大舉撤出時收緊防守價。

---

## 🧪 Testing Decisions (測試決策)

* **測試範疇 (`calculations.test.ts`)**:
  - 驗證 TWSE 官方 API 數據解析與備用降級邏輯。
  - 驗證 T-1 籌碼日期與即時價對齊時之 ATR 停利線計算。
  - 確保 `npx vitest run` 保持 100% 綠燈 (PASS)。

---

## 🚫 Out of Scope (非本階段範疇)

* 不繞過永豐金 App 的驗證碼直接爬取個人下單紀錄（維護資安與隱私）。
* 官方 API 若遇例假日或證交所維護，自動退回至前一交易日最新盤後公開數據。
