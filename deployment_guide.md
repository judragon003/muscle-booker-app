# 🚀 肌肉書僮台股波段風控儀表板 - 部署與 PWA 設定指南

本指南將引導您將「肌肉書僮台股波段風控儀表板」部署至免費託管平台 (Vercel / Cloudflare Pages)，並設定 PWA (Progressive Web App) 支援，讓您的應用程式如同原生 App 般在手機主畫面運行。

## 一、 專案程式碼結構

本專案採用 React 19 + Tailwind CSS 4 + Vite 構建，核心邏輯與 UI 組件已模組化，方便維護與擴展。主要目錄結構如下：

```
muscle-booker-app/
├── client/             # 前端應用程式碼
│   ├── public/         # 靜態資源 (manifest.json, sw.js, favicon.ico, PWA icons)
│   ├── src/            # React 原始碼
│   │   ├── components/ # UI 組件 (InputWizard, IndicatorCards, ActionCards, StatusBar)
│   │   ├── hooks/      # React Hooks (useDashboardState)
│   │   ├── lib/        # 核心邏輯與工具 (calculations.ts, types.ts, sampleData.ts, pwa.ts)
│   │   ├── pages/      # 頁面組件 (Home.tsx)
│   │   ├── App.tsx     # 應用程式主入口與路由
│   │   ├── main.tsx    # React 渲染入口，包含 Service Worker 註冊
│   │   └── index.css   # 全局樣式與 Tailwind CSS 配置
├── server/             # 伺服器端 (此專案為靜態應用，僅為兼容性預留)
├── .gitignore          # Git 忽略文件
├── package.json        # 專案依賴與腳本
├── pnpm-lock.yaml      # pnpm 鎖定文件
└── deployment_guide.md # 本部署指南
```

## 二、 部署至 Vercel (推薦)

Vercel 提供極佳的開發者體驗與免費託管服務，非常適合部署此類靜態 Web App。

### 步驟 1: 準備 GitHub 儲存庫

1.  **建立 GitHub 儲存庫**：將您的專案程式碼上傳至一個新的 GitHub 儲存庫。
    ```bash
    cd /home/ubuntu/muscle-booker-app
    git init
    git add .
    git commit -m "Initial commit: MuscleBooker Web App"
    git branch -M main
    git remote add origin <您的 GitHub 儲存庫 URL>
    git push -u origin main
    ```

### 步驟 2: 部署至 Vercel

1.  **註冊/登入 Vercel**：前往 [Vercel 官網](https://vercel.com/)，使用 GitHub 帳號註冊或登入。
2.  **新增專案**：登入後，點擊「Add New...」->「Project」。
3.  **匯入 Git 儲存庫**：選擇您剛才建立的 GitHub 儲存庫，點擊「Import」。
4.  **配置專案**：
    *   **Root Directory**：`./` (預設)
    *   **Build Command**：`pnpm build` (或 `npm run build` / `yarn build`，取決於您使用的套件管理器)
    *   **Output Directory**：`dist` (Vite 預設輸出目錄)
    *   **Development Command**：`pnpm dev`
5.  **部署**：點擊「Deploy」。Vercel 將自動抓取您的程式碼，執行構建並部署。部署完成後，您將獲得一個公開的 URL。

## 三、 部署至 Cloudflare Pages

Cloudflare Pages 也是一個優秀的免費靜態網站託管平台，提供全球 CDN 加速。

### 步驟 1: 準備 GitHub 儲存庫 (同 Vercel 步驟)

請參考上方「部署至 Vercel」的「步驟 1: 準備 GitHub 儲存庫」。

### 步驟 2: 部署至 Cloudflare Pages

1.  **註冊/登入 Cloudflare**：前往 [Cloudflare 官網](https://www.cloudflare.com/)，註冊或登入。
2.  **進入 Pages 儀表板**：在 Cloudflare 儀表板中，選擇「Pages」->「Create a project」。
3.  **連接 Git**：選擇「Connect to Git」，授權 Cloudflare 訪問您的 GitHub 儲存庫，並選擇您的專案儲存庫。
4.  **配置構建設定**：
    *   **Framework preset**：選擇 `Vite`。
    *   **Build command**：`pnpm build`
    *   **Build output directory**：`dist`
5.  **部署**：點擊「Save and Deploy」。Cloudflare Pages 將自動構建並部署您的應用程式，並提供一個預覽 URL。

## 四、 PWA (Progressive Web App) 設定步驟

本應用程式已內建 PWA 支援，使用者可以將其安裝到手機主畫面，提供類似原生 App 的體驗。

### 1. 確保 `manifest.json` 和 `sw.js` 已存在

在專案的 `client/public/` 目錄下，您會找到 `manifest.json` 和 `sw.js` 兩個文件，它們已配置好 PWA 的基本資訊和離線快取邏輯。

### 2. 在 `index.html` 中引入 `manifest.json`

`client/index.html` 已包含以下代碼，確保瀏覽器能正確識別 PWA 配置：

```html
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icon-192.png" />
<meta name="theme-color" content="#d4a574" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="肌肉書僮" />
```

### 3. 在 `main.tsx` 中註冊 Service Worker

`client/src/main.tsx` 已包含以下代碼，用於註冊 `sw.js`：

```typescript
import { registerServiceWorker } from "./lib/pwa";

// 註冊 Service Worker
registerServiceWorker();
```

### 4. 使用者如何安裝 PWA

當使用者在支援 PWA 的瀏覽器 (如 Chrome, Edge, Safari) 中訪問您的應用程式時，瀏覽器會自動提示安裝選項：

*   **桌面版 Chrome**：網址列右側會出現一個「安裝」圖示 (小房子圖標)，點擊即可安裝。
*   **Android 版 Chrome**：瀏覽器底部會彈出「新增至主畫面」的提示，或在選單中找到「安裝應用程式」選項。
*   **iOS 版 Safari**：點擊分享按鈕 (方框向上箭頭圖示)，然後選擇「加入主畫面」。

安裝後，應用程式將會出現在使用者的主畫面，點擊即可全螢幕運行，並支援離線訪問。

## 五、 品質驗收標準 (已達成)

本專案已嚴格遵循以下驗收標準：

1.  **數值與摩擦成本計算精確性**：所有買賣試算、手續費低消、證交稅率 (ETF 0.1%)、梯次加碼股數、淨利潤等均已精確計算。
2.  **肌肉書僮風控防禦機制**：現金不足警示、ATR 動態移動停利線等核心風控邏輯已實作。
3.  **UI 美學與響應式體驗**：採用現代深色模式，配色對比清晰，RWD 已調適，手機版為單欄滑動卡片。
4.  **數據預載與開箱即用**：應用程式啟動時會自動預載 0050 範例數據，無需手動輸入即可體驗。
5.  **穩定度與免費部署相容性**：程式碼無未定義變數或 Console Runtime Error，並已提供 Vercel / Cloudflare Pages 的部署指引。

## 六、 最終交付物

1.  **完整可運行的專案程式碼檔**：包含所有 React 組件、邏輯、樣式等，位於 `/home/ubuntu/muscle-booker-app`。
2.  **Vercel / Cloudflare Pages 免費託管發佈指引**：即本文件。
3.  **PWA 設定步驟**：即本文件。

感謝您的耐心等待，希望「肌肉書僮」能成為您交易路上的得力助手！
