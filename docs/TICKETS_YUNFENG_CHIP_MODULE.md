# 🎫 肌肉書僮 - 官方全資料自動捕捉與永豐金籌碼開發任務拆解單 (TICKETS_YUNFENG_CHIP_MODULE.md)

> 本任務清單遵循 Matt Pocock Skills `/to-tickets` 垂直切片 (Tracer-bullet vertical slices) 規範編寫，聲明每項 Ticket 之前置阻擋條件 (Blocked by) 與驗收標準 (Acceptance Criteria)。

---

## 📌 任務狀態與依賴樹總覽 (Task Dependency Tree)

```text
[TK-01] 型別與介面定義 (YunfengChipData & FullFetchResult) (Blocked by: None) [COMPLETED]
   ├── [TK-02] InputWizard 步驟 D 永豐金籌碼與官方 API 按鈕 UI (Blocked by: TK-01) [COMPLETED]
   ├── [TK-03] TWSE/TPEx OpenAPI 官方全資料捕捉模組 twseOpenApi.ts (Blocked by: TK-01) [COMPLETED]
   └── [TK-04] 風控算法 evaluateYunfengChipRisk 與 ATR 縮緊連動 (Blocked by: TK-01) [COMPLETED]
          └── [TK-05] 16 項單元測試綠燈 (calculations.test.ts) (Blocked by: TK-02~TK-04) [COMPLETED]
                 └── [TK-06] 線上 Build 打包與 GitHub CI/CD 推送 (Blocked by: TK-05) [COMPLETED]
```

---

## 📝 垂直切片任務詳情 (Tracer-Bullet Vertical Slices)

### 🔹 TK-01 — 定義 `YunfengChipData` 與 `OfficialFullFetchResult` 型別
* **所要建置的內容 (What to build)**: 於 `types.ts` 定義 `YunfengChipData` 與 `twseOpenApi.ts` 之 `OfficialFullFetchResult` 型別，支援 T-1 日期標籤、TOP15 分點與官方自動拉取標記。
* **前置阻擋 (Blocked by)**: None (可立即開始)
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 介面涵蓋行情、融資餘額、三大法人買賣超與集保大戶比率。
  - [x] TypeScript `npx tsc --noEmit` 編譯 0 錯誤。

---

### 🔹 TK-02 — 實作 `InputWizard.tsx` 「🌐 抓取 TWSE 官方全套資料」 UI 按鈕
* **所要建置的內容 (What to build)**: 在步驟 D 新增一鍵抓取按鈕，點擊後調用官方 OpenAPI 填入即時價、高低價、成交量、法人買賣超與大戶比率。
* **前置阻擋 (Blocked by)**: TK-01
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 按鈕呈現在 Step D 頂部，一鍵填入官方全套市場與籌碼數據。
  - [x] 顯示 `籌碼基準日: YYYY-MM-DD (T-1)` 標籤。

---

### 🔹 TK-03 — 建立 TWSE / TPEx 官方 OpenAPI 直連模組 `twseOpenApi.ts`
* **所要建置的內容 (What to build)**: 封裝免費免 Key 的證交所 API (STOCK_DAY_ALL / T86 / MI_MARGIN)，自動解析即時價量、法人買賣超與信用交易。
* **前置阻擋 (Blocked by)**: TK-01
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 成功解析 TWSE 官方 JSON 數據。
  - [x] 提供網路受阻時之安全備用降級帶入，確保 100% 不崩潰。

---

### 🔹 TK-04 — 整合 `evaluateYunfengChipRisk` 與 ATR 移動停利線連動
* **所要建置的內容 (What to build)**: 於 `calculations.ts` 與 `sampleData.ts` 中將籌碼結果傳回 `atrMultiplier`（1.25x 縮緊 / 2.5x 放寬），並在 `IndicatorCards.tsx` 中顯示「永豐金籌碼風控」卡片。
* **前置阻擋 (Blocked by)**: TK-01
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 主力賣超自動觸發 1.25x ATR 移動停利線。
  - [x] 風控燈號卡片精確展示評價與防守倍數。

---

### 🔹 TK-05 — 撰寫 16 項全域單元測試並達成綠燈閉環
* **所要建置的內容 (What to build)**: 於 `calculations.test.ts` 撰寫籌碼與指標行為測試。
* **前置阻擋 (Blocked by)**: TK-02, TK-03, TK-04
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] **16 / 16 項 Vitest 測試全數 [PASS] 綠燈通過**。

---

### 🔹 TK-06 — 全專案 Production Build 打包與 CI/CD 部署
* **所要建置的內容 (What to build)**: 執行 `npm run build` 打包 `dist/public/` 並推送至 GitHub 主分支。
* **前置阻擋 (Blocked by)**: TK-05
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 生成 `index-Ds8YlkfX.js` 打包檔。
  - [x] 成功推送到 GitHub 倉庫 (`judragon003/muscle-booker-app`)，觸發 Netlify 自動上線。
