"""
AnatoSpot AI Agent Backend Server (FastAPI)
===========================================
提供解剖學跑台詞彙之結構化 AI 解析 API：
1. POST /api/analyze-anatomy  — 單一詞彙字根拆解、連續脈絡與跑台辨識重點生成
2. POST /api/batch-analyze    — 批次詞彙清單結構化建檔
3. GET  /api/health           — 檢查後端與 API 金鑰狀態

啟動方式：
  export GEMINI_API_KEY="your_api_key_here"
  uvicorn server:app --reload --port 8000
"""

import json
import os
import urllib.request
import urllib.error
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AnatoSpot AI Agent API",
    description="大體解剖學跑台詞源拆解、連續構造拓撲與區域分組 AI 解析後端",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open(os.path.join(os.path.dirname(__file__), "schema.json"), "r", encoding="utf-8") as f:
    ANATOMY_RESPONSE_SCHEMA = json.load(f)

SYSTEM_PROMPT = """你是一位專精於台灣醫學院大體解剖學跑台考試（Gross Anatomy Spot Test）的 AI 助教與詞源學專家。
當使用者輸入一個解剖構造名稱時，請嚴格依據 Terminologia Anatomica 與大體解剖實習跑台判讀重點，輸出符合 JSON Schema 的結構化資料：
1. 字根拆解 (morphemes)：將拉丁/英文名稱拆分為前綴 (prefix)、形容詞性字根 (adj.) 與分類縮寫 (n.，如 n./a./v./m.)，例如：
   - Thoracodorsal n. -> Thoraco- (adj.) + dorsal (adj.) + n. (n.)
   - Intercostobrachial n. -> Inter- (prefix) + costo- (adj.) + brachial (adj.) + n. (n.)
2. 連續構造脈絡 (pathwaySummary)：標明「上游源頭 -> 解剖分界標記 (Landmark) -> 本構造 -> 下游分支或支配肌肉」。
3. 同區構造分組 (regionGroup)：標明所屬解剖分區與深淺層次（例如前臂前側 4+1+3、後側 6+5、腋窩三間隙等）。
4. 跑台判讀口訣 (callout)：提供在大體老師或標本上最關鍵的辨識特徵（如伴行關係、穿過哪塊肌肉或間隙、深淺相對位置）。
"""


class AnalyzeRequest(BaseModel):
    term: str
    extra_context: Optional[str] = ""
    model: Optional[str] = "gemini-2.5-flash"
    api_key: Optional[str] = None


class BatchAnalyzeRequest(BaseModel):
    terms: List[str]
    extra_context: Optional[str] = ""
    model: Optional[str] = "gemini-2.5-flash"
    api_key: Optional[str] = None


def call_gemini_structured(term: str, extra_context: str, model: str, api_key: str) -> dict:
    key = api_key or os.environ.get("GEMINI_API_KEY", "")
    if not key:
        raise HTTPException(
            status_code=400,
            detail="Missing GEMINI_API_KEY. Please set GEMINI_API_KEY in environment or pass api_key in request body.",
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    user_prompt = f"請解析以下解剖學構造並建立跑台學習卡：{term}"
    if extra_context:
        user_prompt += f"\n補充背景或跑考共筆重點：{extra_context}"

    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
            "responseSchema": ANATOMY_RESPONSE_SCHEMA,
        },
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(raw_text)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=e.code, detail=f"Gemini API error: {err_body}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
def health_check():
    has_env_key = bool(os.environ.get("GEMINI_API_KEY"))
    return {"status": "ok", "has_env_gemini_key": has_env_key}


@app.post("/api/analyze-anatomy")
def analyze_anatomy(req: AnalyzeRequest):
    result = call_gemini_structured(
        term=req.term,
        extra_context=req.extra_context or "",
        model=req.model or "gemini-2.5-flash",
        api_key=req.api_key or "",
    )
    return {"status": "success", "data": result}


@app.post("/api/batch-analyze")
def batch_analyze(req: BatchAnalyzeRequest):
    results = []
    for t in req.terms:
        if t.strip():
            item = call_gemini_structured(
                term=t.strip(),
                extra_context=req.extra_context or "",
                model=req.model or "gemini-2.5-flash",
                api_key=req.api_key or "",
            )
            results.append(item)
    return {"status": "success", "count": len(results), "data": results}
