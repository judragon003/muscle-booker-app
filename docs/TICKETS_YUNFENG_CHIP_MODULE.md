# 🎫 肌肉書僮 - 永豐金籌碼模組開發任務拆解清單 (TICKETS_YUNFENG_CHIP_MODULE.md)

---

## 📌 任務狀態總覽 (Task Overview)

| 任務 ID | 任務名稱 | 優先級 | 負責單元 | 狀態 |
| :--- | :--- | :---: | :--- | :---: |
| **TK-01** | 定義 `YunfengChipData` 介面與資料型別整合 | P0 | `types.ts` | `[COMPLETED]` |
| **TK-02** | 擴充 `InputWizard.tsx` 新增「步驟 D 永豐金籌碼」介面 | P0 | `InputWizard.tsx` | `[COMPLETED]` |
| **TK-03** | 實作 `evaluateYunfengChipRisk` 籌碼箱子風控演算法 | P0 | `calculations.ts` | `[COMPLETED]` |
| **TK-04** | 撰寫單元測試覆蓋（主力賣超與 ATR 防守倍數縮緊） | P0 | `calculations.test.ts` | `[COMPLETED]` |
| **TK-05** | 推送修復至 GitHub 並觸發 Netlify/Vercel 自動建置 | P0 | `Git / CI/CD` | `[IN_PROGRESS]` |

---

## 📝 任務詳細規格 (Detailed Task Breakdown)

### 🔹 [TK-01] 定義 `YunfengChipData` 介面
* **描述**：在 `client/src/lib/types.ts` 中建立 `YunfengChipData` 介面，涵蓋主力集中度 (%)、三大法人買賣超 (張)、千張與百張大戶持股比率 (%)。
* **交付物**：`client/src/lib/types.ts`

### 🔹 [TK-02] 擴充 `InputWizard.tsx` 「步驟 D 永豐金籌碼」
* **描述**：在參數設定卡片中新增 Step D，提供「主力集中度」、「法人買賣超」、「大戶持股 %」等欄位，並提供「帶入範例數據」快捷按鈕。
* **交付物**：`client/src/components/InputWizard.tsx`

### 🔹 [TK-03] 實作籌碼箱子風控演算法
* **描述**：在 `calculations.ts` 中新增 `evaluateYunfengChipRisk` 函數。當主力集中度與法人雙向賣超時，自動將 ATR 移動防守倍數由 2.0 縮緊至 1.25 倍。
* **交付物**：`client/src/lib/calculations.ts`

### 🔹 [TK-04] 單元測試閉環驗證
* **描述**：新增 `evaluateYunfengChipRisk` 測試案例，確保 14 個測試全數 PASS。
* **交付物**：`client/src/lib/calculations.test.ts`

### 🔹 [TK-05] 自動化部署
* **描述**：執行 Git Commit & Push，將所有規格書、任務清單與程式碼推送到 GitHub 觸發自動建置。
* **交付物**：GitHub / Netlify Production Deployment
