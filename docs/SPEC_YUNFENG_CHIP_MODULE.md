# 📐 肌肉書僮 - 永豐金籌碼照片/分點數據風控技術規格書 (SPEC_YUNFENG_CHIP_MODULE.md)

> 本規格書嚴格遵循 Matt Pocock Skills 之 `/to-spec` 規範產出，並結合 `CONTEXT.md` 領域語言與 `AGENTS.md` 防禦性開發原則。

---

## 🎯 Problem Statement (問題陳述)

身為台股波段交易者（肌肉書僮使用者），在進行風控與位階試算時，由於券商 App（如永豐金大戶投）個人帳務及分點籌碼無公開 API 可直接聯網抓取，過去僅能使用大盤或隨機資料，無法將手邊真實的永豐金主力分點集中度、三大法人買賣超與大戶持股比率即時融入「肌肉書僮箱子戰術」防守體系，導致風控決策與真實籌碼脫節。

---

## 💡 Solution (解決方案)

在「參數設定」模組 (`InputWizard.tsx`) 中，新增獨立的 **「步驟 D：永豐金籌碼數據與截圖」** 頁籤。
允許使用者手動填寫或上傳永豐金 App 籌碼頁面數據（主力集中度%、法人買賣超張數、400/1000張大戶持股比率），系統自動校驗格式並帶入 `evaluateYunfengChipRisk` 核心算力引擎。
當籌碼顯示主力與法人雙向賣超時，自動觸發高防禦性保護（將 ATR 動態停利線倍數由 2.0 縮緊至 1.25 倍）；當籌碼顯示千張大戶加碼且主力集中度強勢時，開啟箱頂突破加碼策略。

---

## 👤 User Stories (使用者故事)

1. **身為台股交易者**，我希望能在參數設定卡片第四步輸入永豐金主力集中度 (%)，以便系統評估主力控盤意圖。
2. **身為台股交易者**，我希望能在介面中輸入外資、投信、自營商三大法人買賣超張數，以便精確掌握籌碼流向。
3. **身為台股交易者**，我希望能填入 400 張與 1000 張大戶持股比率 (%)，以便系統分辨籌碼是在沉澱還是渙散。
4. **身為台股交易者**，我希望點擊「帶入範例數據」時能一鍵載入真實波段籌碼範例，方便快速測試箱子戰術。
5. **身為台股交易者**，當籌碼顯示主力與法人同步大賣時，我希望系統能自動縮緊 ATR 移動停利線（至 1.25 倍），協助我提早落袋防守。

---

## 🛠️ Implementation Decisions (實務實現決策)

* **數據型別定義 (`YunfengChipData`)**:
  包含 `majorBrokerConcentration`, `majorBrokerNetVolume`, `foreignNetBuy`, `investmentTrustNetBuy`, `dealerNetBuy`, `largeHolder400Ratio`, `largeHolder1000Ratio`。
* **元件分層與 UI 佈局 (`InputWizard.tsx`)**:
  採四步驟 Tabs 設計（A 標的庫存 -> B 即時數據 -> C 摩擦成本 -> D 永豐金籌碼），在步驟 D 提交時觸發 `onSubmit(data)`。
* **風控算力整合 (`calculations.ts`)**:
  由 `evaluateYunfengChipRisk` 評估籌碼分數，當分數偏空時調整 `atrMultiplier` 為 1.25；偏多時調整為 2.5。
* **狀態重算與自動更新 (`useDashboardState.ts`)**:
  當參數提交或點擊「刷新」時，以 `updateFromWizard` 或 `fetchRealStockData` 即時重新計算全套 Dashboard 狀態。

---

## 🧪 Testing Decisions (測試決策)

* **測試範疇 (`calculations.test.ts`)**:
  單元測試聚焦於外部行為而非內部實作，驗證：
  1. 輸入籌碼偏空（集中度 < 0 且 法人賣超）時，`evaluateYunfengChipRisk` 回傳 `level: 'bearish'` 且 `atrMultiplier: 1.25`。
  2. 集中度 > 10% 且大戶持股 > 50% 時，回傳 `level: 'bullish'` 且 `atrMultiplier: 2.5`。
  3. 未輸入籌碼時，預設回傳 `level: 'neutral'` 且 `atrMultiplier: 2.0`。
* **驗證目標**:
  執行 `npx vitest run` 與 `npx tsc --noEmit`，必須保持 **100% PASS (零 Error)**。

---

## 🚫 Out of Scope (非本階段範疇)

* 自動對外連結永豐金證券伺服器抓取個人私密帳戶庫存（基於資安與無 API 授權限制）。
* 本階段不包含複雜的 OCR 圖片自動解析文字庫（採用輕量化填寫與模擬載入，保持高效載入速度與 PWA 順暢度）。

---

## 📝 Further Notes (補充說明)

* 本規格書符合 Matt Pocock Skills `/to-spec` 之標準模板，產出後直接寫入專案 `docs/SPEC_YUNFENG_CHIP_MODULE.md` 保存。
