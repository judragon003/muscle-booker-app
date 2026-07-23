# 📌 Issue Tracker 設定：GitHub Issues

本專案使用 GitHub Issues (`judragon003/muscle-booker-app`) 作為官方任務與議題追蹤工具。

---

## ⚙️ Agent 操作指令規範

1. **讀取與檢索 Issues**:
   - 使用 CLI 工具 `gh issue list` 或 `gh issue view <number>`。
2. **建立與更新 Issues**:
   - 使用 `gh issue create --title "<標題>" --body "<內容>"`。
3. **標籤管理**:
   - 使用 `gh issue edit <number> --add-label "<label>"`。

---

## 📁 備用 Local Markdown 模式 (Fallback)

若無聯網權限或處理本機臨時草稿，可以寫入 `.scratch/<feature>/` 檔案作為本機任務草稿。
