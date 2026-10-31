# AnatoSpot — 開源大體解剖學跑台漸進式學習系統

專為醫學生打造的開源大體解剖學跑台（Spot Test）複習平台，結合 **Duolingo 式三層次漸進闖關（字根拆解、連續構造樹狀圖、同區肌群分層）**、**實拍照片圖釘（Pin）跑台抽考** 以及 **AI Agent + Quizlet + Notion 混合知識庫**。

## 一、 專案目錄結構（前、後端與核心資料完全解耦）

```text
anatospot_github_repo/
├── index.html                        # 網站主入口（僅含乾淨 HTML 骨架，透過 <script src> 載入下方模組）
├── assets/
│   └── shared_styles.css             # [原 01_core_shared] 3D 按鈕與卡片樣式表
├── src/
│   ├── core/                         # [原 01_core_shared] 核心共用層
│   │   ├── anatomy_data.js           # 解剖學題庫與資料結構（改這個檔案即可擴充全站題庫！）
│   │   └── ai_agent_service.js       # AI Agent 結構化解析與 API 串接設定（AI_AGENT_CONFIG）
│   └── modules/                      # 五大獨立前端模組
│       ├── layer1_morpheme.js        # Layer 1：單一構造字根詞源及前後綴拆解
│       ├── layer2_pathway.js         # Layer 2：連續構造血管與神經分段樹狀圖
│       ├── layer3_regional.js        # Layer 3：同區構造 4+1+3 / 6+5 / 腋窩間隙分層歸納
│       ├── spot_pin_quiz.js          # 跑台實戰：本機照片上傳與圖釘 (Pin) 30秒倒數抽考
│       ├── kb_notion.js              # 知識庫：Quizlet 閃卡 + Notion 區塊筆記編輯器
│       └── app_init.js               # 導覽列路由與初始化綁定
├── backend/                          # [原 03_backend_api] Python FastAPI 後端伺服器
│   ├── server.py                     # FastAPI 主程式 (/api/analyze-anatomy, /api/batch-analyze)
│   ├── schema.json                   # 強制 AI 輸出字根、脈絡與跑台口訣的 JSON Schema
│   ├── requirements.txt              # Python 依賴套件清單
│   └── .env.example                  # 環境變數範本
└── render.yaml                       # Render.com 一鍵部署後端設定檔
```

## 二、 如何在 GitHub 部署前端（GitHub Pages）？

1. 在 GitHub 建立一個新的公開 Repository（例如 `anatospot`）。
2. 將本資料夾所有檔案上傳（或 `git push`）至 `main` 分支。
3. 進入 GitHub Repo 的 **Settings → Pages**，在 **Build and deployment** 選擇 `Deploy from a branch` → `main` 分支 `/ (root)` → 點擊 **Save**。
4. 等待約 1 分鐘，你的開源網站就會發佈在 `https://<你的帳號>.github.io/anatospot/`！
   - 因為 GitHub Pages 是標準靜態網頁伺服器，`index.html` 底部的 `<script src="./src/core/anatomy_data.js"></script>` 會自動載入核心共用層，未來任何同學發 Pull Request 更新 `src/core/anatomy_data.js`，全站就會自動更新。

## 三、 如何部署 `backend/`（Python FastAPI AI 後端）並與 GitHub Pages 串接？

### 方案 1：免部署後端（使用者自備 API Key）
不需啟動 `backend/`，使用者直接在網頁上的「🔌 AI Agent 分析後端與 API 金鑰配置處」選擇 **Google Gemini API 直連** 並貼上自己的免費 Gemini API Key（僅保存在該使用者的瀏覽器 `localStorage`），即可直接呼叫 AI。

### 方案 2：部署公開 AI 後端（保護你的 API Key，讓全體醫學生免填 Key 直接用）
1. 註冊免費雲端平台 [Render.com](https://render.com/) 或 Zeabur。
2. 在 Render 點擊 **New + → Web Service**，連結你剛剛建立的 GitHub Repository：
   - **Root Directory**：填寫 `backend`
   - **Build Command**：`pip install -r requirements.txt`
   - **Start Command**：`uvicorn server:app --host 0.0.0.0 --port $PORT`
   - 在 **Environment Variables** 新增 `GEMINI_API_KEY`，填入你的金鑰。
3. 部署完成後會獲得後端網址（例如 `https://anatospot-ai-backend.onrender.com`）。
4. 打開 `src/core/ai_agent_service.js` 第 7 行，將 `AI_AGENT_CONFIG` 改為你的後端網址並 Push 回 GitHub：
   ```javascript
   const AI_AGENT_CONFIG = {
     provider: 'custom_backend',
     modelOrEndpoint: 'https://anatospot-ai-backend.onrender.com/api/analyze-anatomy',
     apiKey: '',
     extraPrompt: '請依台灣醫學院大體解剖跑台考試習慣...'
   };
   ```
