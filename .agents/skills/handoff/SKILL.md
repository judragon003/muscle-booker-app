---
name: 綠燈任務交接報告
description: 生成包含單元測試 PASS 證明、覆蓋率與 Commit 記錄的高質量交接報告。
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

> [!NOTE]
> 本技能為 **Matt Pocock Skills (Total TypeScript)** 之官方繁體中文化移植版，整合 Antigravity 防禦性開發規範。



Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS - not the current workspace.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
