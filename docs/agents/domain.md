# 📖 Domain Docs 導覽規範 (Single-context)

本專案採用 **單一上下文 (Single-context)** 領域模型佈局：

```text
muscle-booker-app/
├── CONTEXT.md                ← 專案共用名詞字典
├── docs/adr/                 ← 系統架構決策紀錄 (ADRs)
│   └── 0001-xxxx.md
└── client/src/               ← 前端與算力邏輯原始碼
```

---

## 🔍 Agent 檢索順序

1. **優先閱讀 `CONTEXT.md`**：釐清業務邏輯專有名詞（如肌肉書僮、箱子戰術、ATR動態停利）。
2. **閱讀 `docs/adr/`**：避免產出與既有架構決策衝突之代碼。
