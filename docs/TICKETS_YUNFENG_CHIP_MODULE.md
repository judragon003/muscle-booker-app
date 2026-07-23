# 🎫 肌肉書僮 - 永豐金籌碼模組開發任務拆解清單 (TICKETS_YUNFENG_CHIP_MODULE.md)

> 本任務清單遵循 Matt Pocock Skills 之 `/to-tickets` 垂直切片 (Tracer-bullet vertical slices) 規範編寫，每一切片皆聲明其依賴阻擋項 (Blocked by) 與驗收標準 (Acceptance Criteria)。

---

## 📌 任務狀態與依賴樹總覽 (Task Dependency Tree)

```text
[TK-01] 型別與介面定義 (Blocked by: None)
   └── [TK-02] InputWizard 步驟 D 籌碼介面 (Blocked by: TK-01)
   └── [TK-03] 籌碼風控算法 evaluateYunfengChipRisk (Blocked by: TK-01)
          └── [TK-04] 單元測試 (14 Tests PASS) (Blocked by: TK-02, TK-03)
                 └── [TK-05] 線上建置與 CI/CD 推送 (Blocked by: TK-04)
```

---

## 📝 垂直切片任務詳情 (Tracer-Bullet Vertical Slices)

### 🔹 TK-01 — 定義 `YunfengChipData` 型別與全域整合
* **所要建置的內容 (What to build)**: 於 `types.ts` 定義永豐金籌碼資料型別介面，包含主力集中度 (%)、三大法人買賣超 (張) 與 400/1000張大戶持股比率 (%)。
* **前置阻擋 (Blocked by)**: None (可立即開始)
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] `YunfengChipData` 介面包含所有 8 項真實籌碼欄位。
  - [x] `MarketData` 與 `RiskIndicators` 已擴充 `yunfengChips` 屬性。
  - [x] TypeScript `npx tsc --noEmit` 編譯 0 錯誤。

---

### 🔹 TK-02 — 實作 `InputWizard.tsx` 「步驟 D 永豐金籌碼」 UI 卡片
* **所要建置的內容 (What to build)**: 在參數設定卡片中新增 Step D，提供主力集中度、法人買賣超、大戶比率輸入框，並提供「帶入範例數據」按鈕。
* **前置阻擋 (Blocked by)**: TK-01
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 導覽列改為四步驟（A 標的庫存 / B 即時數據 / C 摩擦成本 / D 永豐金籌碼）。
  - [x] 點擊「帶入範例數據」能填寫 12.8% 主力集中度與 3,200 張外資買賣超。
  - [x] 點擊「開始分析 (帶入永豐金籌碼)」能觸發 `onSubmit` 並收合視窗。

---

### 🔹 TK-03 — 實作 `evaluateYunfengChipRisk` 籌碼箱子風控算力
* **所要建置的內容 (What to build)**: 於 `calculations.ts` 撰寫籌碼評估算法。當主力集中度與法人賣超時，自動將 ATR 移動停利倍數縮緊至 1.25 倍。
* **前置阻擋 (Blocked by)**: TK-01
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 能正確評估偏空 (`bearish`)、偏多 (`bullish`) 與中性 (`neutral`) 籌碼情境。
  - [x] 偏空時回傳 `atrMultiplier: 1.25` 進行嚴格防守。

---

### 🔹 TK-04 — 撰寫單元測試並達成 100% 綠燈閉環
* **所要建置的內容 (What to build)**: 於 `calculations.test.ts` 撰寫 `evaluateYunfengChipRisk` 行為測試。
* **前置阻擋 (Blocked by)**: TK-02, TK-03
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 新增籌碼風險評估之 14 項測試全數呈現 `✓ passed` 綠燈。
  - [x] 執行 `npx vitest run` 在 2 秒內完美通過。

---

### 🔹 TK-05 — 推送 Commit 並觸發線上正式部署
* **所要建置的內容 (What to build)**: 將最新代碼與規格書 Commit 推送至 GitHub (`main` 分支)，觸發 Netlify/Vercel 自動部署。
* **前置阻擋 (Blocked by)**: TK-04
* **狀態 (Status)**: `ready-for-agent` `[COMPLETED]`
* **驗收標準 (Acceptance Criteria)**:
  - [x] 程式碼及 docs 文件成功推送到 GitHub 倉庫 (`judragon003/muscle-booker-app`)。
  - [x] 線上 Production 網站完成部署可正常運行。
