# 🤖 肌肉書僮 (Muscle Booker) - Agent 指導原則與技能配置

本文件為 Agent 代理人於本專案（`muscle-booker-app`）執行任務時之行為準則與工具設定。

---

## 🛠️ Agent skills

### Issue tracker

本專案使用 **GitHub Issues** 作為官方任務與 Issue 追蹤系統。詳細規範請參閱 [docs/agents/issue-tracker.md](file:///d:/APP/muscle-booker-app/docs/agents/issue-tracker.md)。

### Triage labels

本專案使用標準 5 大 Triage 標籤角色（`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`）。詳細規範請參閱 [docs/agents/triage-labels.md](file:///d:/APP/muscle-booker-app/docs/agents/triage-labels.md)。

### Domain docs

本專案採用 **單一上下文 (Single-context)** 架構。專案名詞表維護於根目錄 [CONTEXT.md](file:///d:/APP/muscle-booker-app/CONTEXT.md)，架構決策維護於 `docs/adr/`。詳細規範請參閱 [docs/agents/domain.md](file:///d:/APP/muscle-booker-app/docs/agents/domain.md)。

---

## 🛡️ 核心防禦性開發準則

1. **事實為本與無幻覺**：禁止憑空捏造未定義之 API 參數或資料庫欄位。
2. **綠燈閉環驗證**：任何程式碼改動後，必須主動呼叫 `npx vitest run` 與 `npx tsc --noEmit` 確保 100% 測試 PASS。
3. **台灣繁體中文溝通**：所有文件、註解與訊息一律使用繁體中文。
