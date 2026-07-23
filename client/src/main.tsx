import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker } from "./lib/pwa";

// 註冊 Service Worker
registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
