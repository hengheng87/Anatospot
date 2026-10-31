/**
 * [01_core_shared] src/core/ai_agent_service.js
 * AI Agent 結構化拆解服務層 (支援連線至 backend/server.py 或直連 Gemini / OpenAI API)
 */

const AI_AGENT_CONFIG = {
      provider: 'gemini_direct', // 'gemini_direct' | 'custom_backend' | 'openai_compat'
      modelOrEndpoint: 'gemini-2.5-flash', // 若為 custom_backend 可填 'http://localhost:8000/api/analyze-anatomy'
      apiKey: '', // 👈 可直接在此填入預設 API Key，或由網頁介面輸入後自動保存於 localStorage
      extraPrompt: '請依台灣醫學院大體解剖跑台考試習慣，將字根拆分為 prefix / adj. / n.，並標註重要伴行血管神經與深淺分層。'
    };

    const ANATOMY_ENTITY_JSON_SCHEMA = {
      type: 'OBJECT',
      properties: {
        nameEn: { type: 'STRING', description: '英文標準解剖名稱與縮寫，如 Thoracodorsal n.' },
        nameZh: { type: 'STRING', description: '台灣醫學院常用繁體中文解剖名稱，如 胸背神經' },
        category: { type: 'STRING', enum: ['Artery', 'Vein', 'Nerve', 'Muscle', 'Space'] },
        description: { type: 'STRING', description: '包含起源、走向、伴行與支配區域的精簡描述' },
        morphemes: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              part: { type: 'STRING' },
              pos: { type: 'STRING', enum: ['prefix', 'adj.', 'n.'] },
              meaning: { type: 'STRING' }
            },
            required: ['part', 'pos', 'meaning']
          }
        },
        distractors: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              part: { type: 'STRING' },
              pos: { type: 'STRING', enum: ['prefix', 'adj.', 'n.'] },
              meaning: { type: 'STRING' }
            },
            required: ['part', 'pos', 'meaning']
          }
        },
        pathwaySummary: { type: 'STRING', description: '上游源頭 → 分界標記 → 本構造 → 下游分支或支配目標' },
        regionGroup: { type: 'STRING', description: '所屬解剖分區與深淺層次（如前臂屈肌側淺層 4）' },
        callout: { type: 'STRING', description: '跑台大體實習最關鍵的辨識口訣與伴行關係' },
        clinical: { type: 'STRING', description: '臨床關聯或歷屆跑考常見拼字/結構陷阱' }
      },
      required: ['nameEn', 'nameZh', 'category', 'description', 'morphemes', 'distractors', 'pathwaySummary', 'regionGroup', 'callout', 'clinical']
    };

    const AI_SYSTEM_INSTRUCTION = `你是一位專精於台灣醫學院大體解剖學跑台考試（Gross Anatomy Spot Test）的 AI 助教與詞源學專家。
請將使用者輸入的解剖學構造拆解為嚴格符合 JSON Schema 的結構化資料：
1. morphemes：將拉丁/英文詞彙拆解為 prefix (前綴)、adj. (形容詞性字根) 與 n. (名詞或分類縮寫 n./a./v./m.)，例如：
   - Thoracodorsal n. -> [{"part":"Thoraco-","pos":"adj.","meaning":"胸廓的 (Thorax)"},{"part":"dorsal","pos":"adj.","meaning":"背側的 (Dorsum)"},{"part":"n.","pos":"n.","meaning":"神經 (Nerve)"}]
   - Intercostobrachial n. -> [{"part":"Inter-","pos":"prefix","meaning":"在…之間"},{"part":"costo-","pos":"adj.","meaning":"肋骨的"},{"part":"brachial","pos":"adj.","meaning":"上臂的"},{"part":"n.","pos":"n.","meaning":"神經"}]
2. pathwaySummary：標明「上游源頭 → 解剖分界標記 → 本構造 → 下游分支或支配肌肉」。
3. callout：提供在大體老師或模型上秒殺指認的關鍵特徵（伴行血管神經、穿過哪塊肌肉或間隙）。`;

    function loadSavedAIConfig() {
      try {
        const raw = localStorage.getItem('anatospot_ai_config');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.provider) AI_AGENT_CONFIG.provider = parsed.provider;
          if (parsed.modelOrEndpoint) AI_AGENT_CONFIG.modelOrEndpoint = parsed.modelOrEndpoint;
          if (typeof parsed.apiKey === 'string') AI_AGENT_CONFIG.apiKey = parsed.apiKey;
          if (parsed.extraPrompt) AI_AGENT_CONFIG.extraPrompt = parsed.extraPrompt;
        }
      } catch (e) {
        // ignore storage restrictions in sandboxed iframe
      }
      syncAIConfigUI();
    }

    function saveAIConfigFromUI() {
      AI_AGENT_CONFIG.provider = document.getElementById('ai-provider-select').value;
      AI_AGENT_CONFIG.modelOrEndpoint = document.getElementById('ai-model-input').value.trim() || 'gemini-2.5-flash';
      AI_AGENT_CONFIG.apiKey = document.getElementById('ai-api-key-input').value.trim();
      AI_AGENT_CONFIG.extraPrompt = document.getElementById('ai-extra-prompt-input').value.trim();

      try {
        localStorage.setItem('anatospot_ai_config', JSON.stringify(AI_AGENT_CONFIG));
      } catch (e) {
        // ignore storage restrictions
      }
      syncAIConfigUI();
    }

    function syncAIConfigUI() {
      const provEl = document.getElementById('ai-provider-select');
      const modEl = document.getElementById('ai-model-input');
      const keyEl = document.getElementById('ai-api-key-input');
      const extEl = document.getElementById('ai-extra-prompt-input');
      const badgeEl = document.getElementById('ai-api-status-badge');

      if (!provEl) return;
      provEl.value = AI_AGENT_CONFIG.provider;
      modEl.value = AI_AGENT_CONFIG.modelOrEndpoint;
      keyEl.value = AI_AGENT_CONFIG.apiKey;
      extEl.value = AI_AGENT_CONFIG.extraPrompt;

      if (AI_AGENT_CONFIG.provider === 'custom_backend') {
        badgeEl.className = 'px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold';
        badgeEl.textContent = `🟢 已設定自架後端代理 (${AI_AGENT_CONFIG.modelOrEndpoint})`;
      } else if (AI_AGENT_CONFIG.apiKey) {
        badgeEl.className = 'px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold';
        badgeEl.textContent = `🟢 已連線至 ${AI_AGENT_CONFIG.provider === 'gemini_direct' ? 'Gemini API' : 'OpenAI API'} (${AI_AGENT_CONFIG.modelOrEndpoint})`;
      } else {
        badgeEl.className = 'px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold';
        badgeEl.textContent = '⚡ 預設：離線學術字典 + 規則引擎 (填入 API Key 即啟用真實 LLM)';
      }

      // Render sample request payload in debug inspector
      const debugPre = document.getElementById('ai-debug-json-pre');
      if (debugPre && !debugPre.textContent) {
        debugPre.textContent = JSON.stringify({
          endpoint: AI_AGENT_CONFIG.provider === 'custom_backend'
            ? AI_AGENT_CONFIG.modelOrEndpoint
            : `https://generativelanguage.googleapis.com/v1beta/models/${AI_AGENT_CONFIG.modelOrEndpoint}:generateContent`,
          responseMimeType: 'application/json',
          responseSchema: ANATOMY_ENTITY_JSON_SCHEMA
        }, null, 2);
      }
    }

    async function callRemoteAIAgent(term) {
      saveAIConfigFromUI();
      const { provider, modelOrEndpoint, apiKey, extraPrompt } = AI_AGENT_CONFIG;
      const startTime = performance.now();

      // Mode 1: Custom Python FastAPI Backend Proxy (POST /api/analyze-anatomy)
      if (provider === 'custom_backend') {
        const endpointUrl = modelOrEndpoint.startsWith('http')
          ? modelOrEndpoint
          : 'http://localhost:8000/api/analyze-anatomy';
        const reqBody = {
          term,
          extra_context: extraPrompt,
          model: 'gemini-2.5-flash',
          api_key: apiKey || undefined
        };
        const resp = await fetch(endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody)
        });
        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`後端回應錯誤 (${resp.status}): ${errText}`);
        }
        const json = await resp.json();
        const elapsed = Math.round(performance.now() - startTime);
        updateDebugInspector({ provider, endpointUrl, request: reqBody, response: json }, `${elapsed} ms`);
        return json.data || json;
      }

      // Mode 2: Google Gemini REST API Direct (with responseSchema)
      if (provider === 'gemini_direct') {
        if (!apiKey) {
          throw new Error('NO_API_KEY');
        }
        const modelName = modelOrEndpoint || 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const payload = {
          systemInstruction: { parts: [{ text: AI_SYSTEM_INSTRUCTION }] },
          contents: [
            {
              role: 'user',
              parts: [{ text: `請解析解剖構造：「${term}」
補充要求：${extraPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: ANATOMY_ENTITY_JSON_SCHEMA
          }
        };
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`Gemini API 錯誤 (${resp.status}): ${errText}`);
        }
        const data = await resp.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(rawText);
        const elapsed = Math.round(performance.now() - startTime);
        updateDebugInspector({ provider, model: modelName, response: parsed }, `${elapsed} ms`);
        return parsed;
      }

      // Mode 3: OpenAI / OpenRouter Compatible Endpoint
      if (provider === 'openai_compat') {
        if (!apiKey) {
          throw new Error('NO_API_KEY');
        }
        const isUrl = modelOrEndpoint.startsWith('http');
        const endpointUrl = isUrl ? modelOrEndpoint : 'https://api.openai.com/v1/chat/completions';
        const modelName = isUrl ? 'gpt-4o-mini' : (modelOrEndpoint || 'gpt-4o-mini');
        const payload = {
          model: modelName,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: AI_SYSTEM_INSTRUCTION + '\n請務必回傳包含 nameEn, nameZh, category, description, morphemes (陣列含 part, pos, meaning), distractors, pathwaySummary, regionGroup, callout, clinical 欄位的 JSON 物件。'
            },
            {
              role: 'user',
              content: `請解析解剖構造：「${term}」
補充要求：${extraPrompt}`
            }
          ]
        };
        const resp = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`OpenAI API 錯誤 (${resp.status}): ${errText}`);
        }
        const data = await resp.json();
        const rawText = data.choices?.[0]?.message?.content || '{}';
        const parsed = JSON.parse(rawText);
        const elapsed = Math.round(performance.now() - startTime);
        updateDebugInspector({ provider, endpointUrl, response: parsed }, `${elapsed} ms`);
        return parsed;
      }
    }

    const ANATOMICAL_MORPHEME_LEXICON = {
      'flexor': { part: 'Flexor', pos: 'n.', meaning: '屈肌 (Flex / Bend)' },
      'extensor': { part: 'Extensor', pos: 'n.', meaning: '伸肌 (Extend)' },
      'abductor': { part: 'Abductor', pos: 'n.', meaning: '外展肌 (Abduct)' },
      'adductor': { part: 'Adductor', pos: 'n.', meaning: '內收肌 (Adduct)' },
      'opponens': { part: 'Opponens', pos: 'n.', meaning: '對掌肌 (Oppose)' },
      'pronator': { part: 'Pronator', pos: 'n.', meaning: '旋前肌 (Pronate)' },
      'supinator': { part: 'Supinator', pos: 'n.', meaning: '旋後肌 (Supinate)' },
      'levator': { part: 'Levator', pos: 'n.', meaning: '提肌 (Elevate)' },
      'carpi': { part: 'carpi', pos: 'adj.', meaning: '腕部的 (Of the wrist / Carpus)' },
      'radialis': { part: 'radialis', pos: 'adj.', meaning: '橈側的 (Radial)' },
      'ulnaris': { part: 'ulnaris', pos: 'adj.', meaning: '尺側的 (Ulnar)' },
      'digitorum': { part: 'digitorum', pos: 'adj.', meaning: '手指的 (Of the digits)' },
      'digiti': { part: 'digiti', pos: 'adj.', meaning: '單指的 (Of a digit)' },
      'minimi': { part: 'minimi', pos: 'adj.', meaning: '最小的/小指的 (Smallest)' },
      'pollicis': { part: 'pollicis', pos: 'adj.', meaning: '大拇指的 (Of the thumb / Pollex)' },
      'indicis': { part: 'indicis', pos: 'adj.', meaning: '食指的 (Of the index finger)' },
      'longus': { part: 'longus', pos: 'adj.', meaning: '長的 (Long)' },
      'brevis': { part: 'brevis', pos: 'adj.', meaning: '短的 (Short)' },
      'superficialis': { part: 'superficialis', pos: 'adj.', meaning: '淺層的 (Superficial)' },
      'profundus': { part: 'profundus', pos: 'adj.', meaning: '深層的 (Deep)' },
      'profunda': { part: 'Profunda', pos: 'adj.', meaning: '深層的 (Deep)' },
      'teres': { part: 'teres', pos: 'adj.', meaning: '圓柱狀的 (Round)' },
      'quadratus': { part: 'quadratus', pos: 'adj.', meaning: '方形的 (Square)' },
      'major': { part: 'major', pos: 'adj.', meaning: '大的 (Greater)' },
      'minor': { part: 'minor', pos: 'adj.', meaning: '小的 (Lesser)' },
      'biceps': { part: 'Biceps', pos: 'adj.', meaning: '雙頭的 (Two-headed)' },
      'triceps': { part: 'Triceps', pos: 'adj.', meaning: '三頭的 (Three-headed)' },
      'brachii': { part: 'brachii', pos: 'adj.', meaning: '上臂的 (Of the arm)' },
      'brachialis': { part: 'brachialis', pos: 'adj.', meaning: '肱骨/上臂的 (Brachial)' },
      'brachial': { part: 'brachial', pos: 'adj.', meaning: '上臂的 (Arm)' },
      'coracobrachialis': { part: 'Coraco- + brachialis', pos: 'adj.', meaning: '喙突與上臂的' },
      'brachioradialis': { part: 'Brachio- + radialis', pos: 'adj.', meaning: '肱骨與橈骨的' },
      'deltoid': { part: 'Deltoid', pos: 'adj.', meaning: '三角狀的 (Delta-shaped)' },
      'pectoralis': { part: 'Pectoralis', pos: 'adj.', meaning: '胸部的 (Pectus)' },
      'pectoral': { part: 'pectoral', pos: 'adj.', meaning: '胸肌的 (Pectus)' },
      'serratus': { part: 'Serratus', pos: 'adj.', meaning: '鋸齒狀的 (Saw-toothed)' },
      'anterior': { part: 'anterior', pos: 'adj.', meaning: '前方的 (Front)' },
      'posterior': { part: 'posterior', pos: 'adj.', meaning: '後方的 (Back)' },
      'superior': { part: 'superior', pos: 'adj.', meaning: '上方的 (Upper)' },
      'inferior': { part: 'inferior', pos: 'adj.', meaning: '下方的 (Lower)' },
      'lateral': { part: 'lateral', pos: 'adj.', meaning: '外側的 (Side)' },
      'medial': { part: 'medial', pos: 'adj.', meaning: '內側的 (Middle side)' },
      'median': { part: 'Median', pos: 'adj.', meaning: '正中位置的 (Midline)' },
      'palmaris': { part: 'Palmaris', pos: 'adj.', meaning: '手掌的 (Palm)' },
      'palmar': { part: 'palmar', pos: 'adj.', meaning: '手掌的 (Palm)' },
      'dorsal': { part: 'dorsal', pos: 'adj.', meaning: '背側的 (Dorsum)' },
      'lumbrical': { part: 'Lumbrical', pos: 'adj.', meaning: '蚯蚓狀的 (Earthworm-like)' },
      'interosseous': { part: 'inter- (prefix) + osseous', pos: 'adj.', meaning: '骨間的 (Between bones)' },
      'subscapularis': { part: 'Sub- (prefix) + scapularis', pos: 'adj.', meaning: '肩胛骨下方的' },
      'supraspinatus': { part: 'Supra- (prefix) + spinatus', pos: 'adj.', meaning: '肩胛岡上方的' },
      'infraspinatus': { part: 'Infra- (prefix) + spinatus', pos: 'adj.', meaning: '肩胛岡下方的' },
      'anconeus': { part: 'Anconeus', pos: 'adj.', meaning: '肘部的 (Elbow)' },
      'collateral': { part: 'collateral', pos: 'adj.', meaning: '側副的 (Side-by-side)' },
      'recurrent': { part: 'recurrent', pos: 'adj.', meaning: '迴返的 (Turning back)' },
      'circumflex': { part: 'circumflex', pos: 'adj.', meaning: '迴旋環繞的 (Curving around)' },
      'humeral': { part: 'humeral', pos: 'adj.', meaning: '肱骨的 (Humerus)' },
      'scapular': { part: 'scapular', pos: 'adj.', meaning: '肩胛的 (Scapula)' },
      'thoracic': { part: 'thoracic', pos: 'adj.', meaning: '胸廓的 (Thorax)' },
      'cubital': { part: 'cubital', pos: 'adj.', meaning: '肘窩的 (Elbow)' },
      'digital': { part: 'digital', pos: 'adj.', meaning: '手指的 (Digit)' },
      'common': { part: 'Common', pos: 'adj.', meaning: '共同/總的 (Shared)' },
      'proper': { part: 'Proper', pos: 'adj.', meaning: '固有的 (Specific)' }
    };

    function decomposeLatinMorphemes(termEn, category) {
      const cleaned = termEn.replace(/\s*\(.*?\)\s*/g, ' ').trim();
      const tokens = cleaned.split(/\s+/);
      const result = [];

      tokens.forEach(tok => {
        const low = tok.toLowerCase().replace(/[^a-z.]/g, '');
        if (['n.', 'a.', 'v.', 'm.', 'br.', 'arch', 'space', 'interval'].includes(low)) {
          const mapMeaning = {
            'n.': '神經 (Nerve)',
            'a.': '動脈 (Artery)',
            'v.': '靜脈 (Vein)',
            'm.': '肌肉 (Muscle)',
            'br.': '分支 (Branch)',
            'arch': '動脈弓 (Arch)',
            'space': '解剖孔隙 (Space)',
            'interval': '解剖間隙 (Interval)'
          };
          result.push({ part: tok, pos: 'n.', meaning: mapMeaning[low] || '分類名詞' });
          return;
        }
        if (ANATOMICAL_MORPHEME_LEXICON[low]) {
          const lex = ANATOMICAL_MORPHEME_LEXICON[low];
          if (low === 'interosseous') {
            result.push({ part: 'inter-', pos: 'prefix', meaning: '在…之間 (Between)' });
            result.push({ part: 'osseous', pos: 'adj.', meaning: '骨頭的 (Bone)' });
          } else if (low === 'subscapularis') {
            result.push({ part: 'Sub-', pos: 'prefix', meaning: '在…下方 (Under)' });
            result.push({ part: 'scapularis', pos: 'adj.', meaning: '肩胛骨的 (Scapula)' });
          } else if (low === 'supraspinatus') {
            result.push({ part: 'Supra-', pos: 'prefix', meaning: '在…上方 (Above)' });
            result.push({ part: 'spinatus', pos: 'adj.', meaning: '肩胛岡的 (Spine)' });
          } else if (low === 'infraspinatus') {
            result.push({ part: 'Infra-', pos: 'prefix', meaning: '在…下方 (Below)' });
            result.push({ part: 'spinatus', pos: 'adj.', meaning: '肩胛岡的 (Spine)' });
          } else {
            result.push({ part: tok, pos: lex.pos, meaning: lex.meaning });
          }
          return;
        }
        // Prefix check
        const prefixes = [
          { pre: 'Supra', meaning: '在…上方 (Above)' },
          { pre: 'Infra', meaning: '在…下方 (Below)' },
          { pre: 'Sub', meaning: '在…下方 (Under)' },
          { pre: 'Inter', meaning: '在…之間 (Between)' },
          { pre: 'Thoraco', meaning: '胸廓的 (Thorax)' },
          { pre: 'Coraco', meaning: '喙突的 (Coracoid)' },
          { pre: 'Brachio', meaning: '上臂的 (Brachium)' },
          { pre: 'Musculo', meaning: '肌肉的 (Muscle)' }
        ];
        for (const pRule of prefixes) {
          if (tok.toLowerCase().startsWith(pRule.pre.toLowerCase()) && tok.length > pRule.pre.length + 2) {
            const remainder = tok.slice(pRule.pre.length);
            result.push({
              part: `${pRule.pre}-`,
              pos: ['Thoraco', 'Coraco', 'Brachio', 'Musculo'].includes(pRule.pre) ? 'adj.' : 'prefix',
              meaning: pRule.meaning
            });
            result.push({
              part: remainder,
              pos: 'adj.',
              meaning: ANATOMICAL_MORPHEME_LEXICON[remainder.toLowerCase()]?.meaning || `字根 (${remainder})`
            });
            return;
          }
        }
        result.push({ part: tok, pos: 'adj.', meaning: `解剖字根 (${tok})` });
      });

      if (result.length === 0) {
        result.push({ part: termEn, pos: 'n.', meaning: category });
      }
      return result;
    }

    function setPipelineStepStatus(stepNum, state, labelText) {
      const el = document.getElementById(`ai-step-${stepNum}`);
      if (!el) return;
      if (state === 'running') {
        el.className = 'p-2 rounded-xl bg-purple-900/50 border border-purple-400 text-purple-200 font-bold flex items-center gap-1.5 animate-pulse';
        el.innerHTML = `<span>⏳ ${stepNum}. ${labelText}</span>`;
      } else if (state === 'done') {
        el.className = 'p-2 rounded-xl bg-slate-800 border border-emerald-500/60 text-emerald-300 font-bold flex items-center gap-1.5';
        el.innerHTML = `<span>✅ ${stepNum}. ${labelText}</span>`;
      } else {
        el.className = 'p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-bold flex items-center gap-1.5';
        el.innerHTML = `<span>⏺️ ${stepNum}. ${labelText}</span>`;
      }
    }

    function appendAILiveLog(message, highlightColor = 'text-slate-300') {
      const logList = document.getElementById('ai-live-log-list');
      if (!logList) return;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const line = document.createElement('div');
      line.className = `${highlightColor}`;
      line.textContent = `[${timeStr}] ${message}`;
      logList.appendChild(line);
      logList.scrollTop = logList.scrollHeight;
    }

    function updateDebugInspector(payloadObj, latencyText) {
      const pre = document.getElementById('ai-debug-json-pre');
      const lat = document.getElementById('ai-latency-label');
      if (pre) pre.textContent = JSON.stringify(payloadObj, null, 2);
      if (lat) lat.textContent = latencyText;
    }

    function buildLocalFallbackAnalysis(rawTerm) {
      const key = rawTerm.toLowerCase().trim();

      // 1. Search INITIAL_ENTITIES & APP_STATE.entities
      const existing = APP_STATE.entities.find(
        e =>
          e.nameEn.toLowerCase() === key ||
          e.nameZh.toLowerCase() === key ||
          e.nameEn.toLowerCase().includes(key) ||
          key.includes(e.nameEn.toLowerCase().replace(/\s+(n\.|a\.|m\.|v\.)$/, ''))
      );
      if (existing) {
        return {
          sourceType: 'Notebook 核心實體庫 (APP_STATE.entities)',
          nameEn: existing.nameEn,
          nameZh: existing.nameZh,
          category: existing.category,
          morphemesStr: existing.morphemes.map(m => `${m.part}|${m.pos}|${m.meaning}`).join(' + '),
          pathway: existing.pathwaySummary,
          region: existing.regionGroup,
          callout: existing.blocks?.[0]?.text || existing.description,
          clinical: existing.blocks?.[1]?.text || `歷屆跑考重點：${existing.description}`
        };
      }

      // 2. Search AI_AGENT_KNOWLEDGE_PRESETS
      if (AI_AGENT_KNOWLEDGE_PRESETS[key]) {
        const p = AI_AGENT_KNOWLEDGE_PRESETS[key];
        return {
          sourceType: 'Notebook 預設跑考字典 (Presets)',
          ...p,
          clinical: '歷屆跑考提醒：注意翻開表層肌肉後的伴行關係与韌帶相對位置。'
        };
      }

      // 3. Search all 5 Regional Groups from Notebook (42 muscles & spaces)
      for (const [gKey, gObj] of Object.entries(REGIONAL_GROUPS_DATA)) {
        for (const item of gObj.items) {
          const itemLow = item.nameEn.toLowerCase();
          const baseName = itemLow.replace(/\s*\(.*?\)\s*/g, '').replace(/\s+(m\.|n\.|a\.)$/, '');
          if (itemLow === key || item.nameZh.includes(rawTerm) || key.includes(baseName) || baseName.includes(key.replace(/\s+(m\.|n\.|a\.)$/, ''))) {
            const cat = item.nameEn.includes('a.') ? 'Artery' : item.nameEn.includes('n.') ? 'Nerve' : 'Muscle';
            const morphs = decomposeLatinMorphemes(item.nameEn, cat);
            const bucketTitle = gObj.buckets[item.layer]?.title || gObj.title;
            return {
              sourceType: `Notebook 區域分層題庫 (${gObj.title})`,
              nameEn: item.nameEn,
              nameZh: item.nameZh,
              category: cat,
              morphemesStr: morphs.map(m => `${m.part}|${m.pos}|${m.meaning}`).join(' + '),
              pathway: `支配/來源：${item.nerve} → ${item.nameEn}`,
              region: `${gObj.title} · ${bucketTitle}`,
              callout: `跑台辨識口訣：${item.note}（支配/伴行：${item.nerve}）`,
              clinical: `${gObj.subtitle}`
            };
          }
        }
      }

      // 4. Smart Latin/Greek Morpheme Engine for any new anatomical term
      const inferredCat = rawTerm.endsWith('a.')
        ? 'Artery'
        : rawTerm.endsWith('m.')
        ? 'Muscle'
        : rawTerm.endsWith('v.')
        ? 'Vein'
        : 'Nerve';
      const morphs = decomposeLatinMorphemes(rawTerm, inferredCat);
      const zhMeaningGuess = morphs
        .filter(m => m.pos !== 'n.')
        .map(m => m.meaning.split('(')[0].replace(/的/g, '').trim())
        .join('');
      const catZh = inferredCat === 'Artery' ? '動脈' : inferredCat === 'Muscle' ? '肌' : inferredCat === 'Vein' ? '靜脈' : '神經';

      return {
        sourceType: '解剖學拉丁字根規則引擎 (Morpheme Parser)',
        nameEn: rawTerm,
        nameZh: zhMeaningGuess ? `${zhMeaningGuess}${catZh}` : `${rawTerm} (${catZh})`,
        category: inferredCat === 'Vein' ? 'Artery' : inferredCat,
        morphemesStr: morphs.map(m => `${m.part}|${m.pos}|${m.meaning}`).join(' + '),
        pathway: `上游主幹 → ${rawTerm} → 下游支配目標`,
        region: `上肢解剖分區 (${catZh})`,
        callout: `跑台判讀重點：依據字根「${morphs.map(m => m.part).join(' + ')}」確認其起止點、走向與伴行構造。`,
        clinical: '若需 LLM 深度生成更多臨床細節，可於上方填入 Gemini / OpenAI API Key。'
      };
    }

    function renderAIVisualPreview() {
      const nameEn = document.getElementById('ai-field-en').value.trim();
      const nameZh = document.getElementById('ai-field-zh').value.trim();
      const morphRaw = document.getElementById('ai-field-morphemes').value.trim();
      const pathway = document.getElementById('ai-field-pathway').value.trim();
      const region = document.getElementById('ai-field-region').value.trim();
      const callout = document.getElementById('ai-field-callout').value.trim();
      const clinical = document.getElementById('ai-field-clinical').value.trim();

      const morphContainer = document.getElementById('ai-visual-morpheme-preview');
      const notesContainer = document.getElementById('ai-visual-notes-preview');
      if (!morphContainer || !notesContainer) return;

      morphContainer.innerHTML = '';
      const titleBadge = document.createElement('span');
      titleBadge.className = 'font-black text-sm text-slate-900 mr-2';
      titleBadge.textContent = `${nameEn || '未命名'} (${nameZh || '未填中文'}) ＝`;
      morphContainer.appendChild(titleBadge);

      const segments = morphRaw.split('+').map(s => s.trim()).filter(Boolean);
      segments.forEach((seg, idx) => {
        const [part, pos, meaning] = seg.split('|').map(s => s.trim());
        const chip = document.createElement('span');
        chip.className = `px-2.5 py-1 rounded-lg border text-xs font-extrabold flex items-center gap-1 ${getPosBadgeStyle(pos || 'adj.')}`;
        chip.innerHTML = `<span>${part || seg}</span><span class="opacity-75">[${pos || 'adj.'}: ${meaning || ''}]</span>`;
        morphContainer.appendChild(chip);

        if (idx < segments.length - 1) {
          const plus = document.createElement('span');
          plus.className = 'text-slate-400 font-black text-xs';
          plus.textContent = '+';
          morphContainer.appendChild(plus);
        }
      });

      notesContainer.innerHTML = `
        <div class="p-2.5 rounded-xl bg-white border border-purple-200 text-slate-700">
          <span class="font-extrabold text-purple-800">🌿 連續脈絡與分區：</span>${pathway || '未填'} ｜ <span class="font-bold text-slate-600">${region || '未填'}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
          <span class="font-extrabold">💡 跑台辨識口訣：</span>${callout || '未填'}
        </div>
        ${clinical ? `<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"><span class="font-extrabold">🩺 臨床與考古補充：</span>${clinical}</div>` : ''}
      `;
    }

    async function runAIAgentAnalysis() {
      const rawTerm = document.getElementById('ai-term-input').value.trim();
      if (!rawTerm) return;

      const btn = document.getElementById('ai-analyze-btn');
      const origBtnText = btn.textContent;
      const logList = document.getElementById('ai-live-log-list');
      const summaryEl = document.getElementById('ai-live-step-summary');
      const sourceBadge = document.getElementById('ai-live-source-badge');
      const dotEl = document.getElementById('ai-live-dot');
      const saveMsg = document.getElementById('ai-save-feedback-msg');
      if (saveMsg) saveMsg.textContent = '';

      btn.disabled = true;
      btn.textContent = '⏳ AI Agent 正在解析並填入欄位...';
      if (logList) logList.innerHTML = '';
      if (dotEl) dotEl.className = 'w-3 h-3 rounded-full bg-amber-400 animate-ping';

      setPipelineStepStatus(1, 'running', '詞彙正規化');
      setPipelineStepStatus(2, 'idle', '字根與詞性拆解');
      setPipelineStepStatus(3, 'idle', '檢索連續脈絡與分區');
      setPipelineStepStatus(4, 'idle', '填入跑台重點預覽');
      appendAILiveLog(`收到目標解剖詞彙：「${rawTerm}」，啟動 AI Agent 解析管線...`, 'text-sky-300');

      document.getElementById('ai-review-drawer').classList.remove('hidden');

      try {
        setPipelineStepStatus(1, 'done', '詞彙正規化');
        setPipelineStepStatus(2, 'running', '呼叫遠端 LLM API');
        const apiResult = await callRemoteAIAgent(rawTerm);

        setPipelineStepStatus(2, 'done', '字根與詞性拆解');
        setPipelineStepStatus(3, 'done', '檢索連續脈絡與分區');

        document.getElementById('ai-field-en').value = apiResult.nameEn || rawTerm;
        document.getElementById('ai-field-zh').value = apiResult.nameZh || '';
        document.getElementById('ai-field-cat').value =
          ['Artery', 'Nerve', 'Muscle'].includes(apiResult.category) ? apiResult.category : 'Nerve';
        const morphArr = Array.isArray(apiResult.morphemes) ? apiResult.morphemes : [];
        document.getElementById('ai-field-morphemes').value = morphArr
          .map(m => `${m.part}|${m.pos}|${m.meaning}`)
          .join(' + ');
        document.getElementById('ai-field-pathway').value = apiResult.pathwaySummary || '';
        document.getElementById('ai-field-region').value = apiResult.regionGroup || '';
        document.getElementById('ai-field-callout').value = apiResult.callout || apiResult.description || '';
        document.getElementById('ai-field-clinical').value = apiResult.clinical || '';

        setPipelineStepStatus(4, 'done', '填入跑台重點預覽');
        if (dotEl) dotEl.className = 'w-3 h-3 rounded-full bg-emerald-400';
        if (sourceBadge) {
          sourceBadge.className = 'px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold';
          sourceBadge.textContent = `🟢 遠端 API 即時回傳 (${AI_AGENT_CONFIG.provider})`;
        }
        if (summaryEl) summaryEl.textContent = `✅ 已由遠端 AI API 完成「${rawTerm}」解析並自動填入下方 8 個欄位！`;
        appendAILiveLog(`成功接收結構化 JSON，已自動填入字根、連續脈絡與跑台口訣欄位！`, 'text-emerald-300 font-bold');
      } catch (err) {
        // Fallback to local Notebook DB + Morpheme Engine
        setPipelineStepStatus(1, 'done', '詞彙正規化');
        setPipelineStepStatus(2, 'done', '字根與詞性拆解');
        setPipelineStepStatus(3, 'done', '檢索連續脈絡與分區');

        const fallback = buildLocalFallbackAnalysis(rawTerm);
        document.getElementById('ai-field-en').value = fallback.nameEn;
        document.getElementById('ai-field-zh').value = fallback.nameZh;
        document.getElementById('ai-field-cat').value =
          ['Artery', 'Nerve', 'Muscle'].includes(fallback.category) ? fallback.category : 'Nerve';
        document.getElementById('ai-field-morphemes').value = fallback.morphemesStr;
        document.getElementById('ai-field-pathway').value = fallback.pathway;
        document.getElementById('ai-field-region').value = fallback.region;
        document.getElementById('ai-field-callout').value = fallback.callout;
        document.getElementById('ai-field-clinical').value = fallback.clinical;

        setPipelineStepStatus(4, 'done', '填入跑台重點預覽');
        if (dotEl) dotEl.className = 'w-3 h-3 rounded-full bg-emerald-400';
        if (sourceBadge) {
          sourceBadge.className = 'px-2 py-0.5 rounded bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[11px] font-bold';
          sourceBadge.textContent = `⚡ 內建引擎：${fallback.sourceType}`;
        }
        if (summaryEl) summaryEl.textContent = `✅ 已透過【${fallback.sourceType}】完成「${fallback.nameEn}」解析並自動填入下方欄位！`;

        appendAILiveLog(
          err.message === 'NO_API_KEY'
            ? `未偵測到外部 API Key，自動切換至【${fallback.sourceType}】進行結構化解析。`
            : `外部 API 連線失敗 (${err.message})，已自動切換至【${fallback.sourceType}】。`,
          'text-amber-300'
        );
        appendAILiveLog(`字根拆解結果：${fallback.morphemesStr}`, 'text-slate-200');
        appendAILiveLog(`跑台重點已自動填入：${fallback.callout}`, 'text-emerald-300 font-bold');

        updateDebugInspector(
          {
            status: 'SUCCESS_LOCAL_ENGINE',
            engineSource: fallback.sourceType,
            note: err.message === 'NO_API_KEY' ? '尚未填入外部 API Key，已由內建 Notebook 知識庫與拉丁字根引擎自動填入所有欄位' : err.message,
            autoFilledData: fallback
          },
          'Local <1 ms'
        );
      } finally {
        btn.disabled = false;
        btn.textContent = origBtnText;
        renderAIVisualPreview();
      }
    }

    function saveAIAgentTermToKB() {
      const nameEn = document.getElementById('ai-field-en').value.trim();
      const nameZh = document.getElementById('ai-field-zh').value.trim();
      const category = document.getElementById('ai-field-cat').value;
      const morphRaw = document.getElementById('ai-field-morphemes').value.trim();
      const pathwaySummary = document.getElementById('ai-field-pathway').value.trim();
      const regionGroup = document.getElementById('ai-field-region').value.trim();
      const calloutText = document.getElementById('ai-field-callout').value.trim();
      const clinicalText = document.getElementById('ai-field-clinical').value.trim();

      if (!nameEn || !nameZh) return;

      const parsedMorphemes = morphRaw
        .split('+')
        .map(seg => seg.trim())
        .filter(Boolean)
        .map(seg => {
          const parts = seg.split('|').map(s => s.trim());
          return {
            part: parts[0] || seg,
            pos: parts[1] || 'adj.',
            meaning: parts[2] || '字根意義'
          };
        });

      const blocks = [];
      if (calloutText) {
        blocks.push({ type: 'callout', text: calloutText });
      } else {
        blocks.push({ type: 'callout', text: `AI Agent 自動歸納重點：${pathwaySummary}` });
      }
      if (clinicalText) {
        blocks.push({ type: 'clinical', text: clinicalText });
      }

      const targetId = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const existingIdx = APP_STATE.entities.findIndex(e => e.id === targetId || e.nameEn.toLowerCase() === nameEn.toLowerCase());

      const newEntity = {
        id: targetId,
        nameEn,
        nameZh,
        category,
        description: calloutText || `${pathwaySummary}（所屬分區：${regionGroup}）`,
        morphemes: parsedMorphemes.length > 0 ? parsedMorphemes : [{ part: nameEn, pos: 'n.', meaning: nameZh }],
        distractors: [
          { part: 'Inter-', pos: 'prefix', meaning: '在…之間' },
          { part: 'dorsal', pos: 'adj.', meaning: '背側的' },
          { part: 'brachial', pos: 'adj.', meaning: '上臂的' }
        ],
        pathwaySummary,
        regionGroup,
        blocks
      };

      if (existingIdx >= 0) {
        APP_STATE.entities[existingIdx] = newEntity;
        APP_STATE.kbSelectedIndex = existingIdx;
      } else {
        APP_STATE.entities.push(newEntity);
        APP_STATE.kbSelectedIndex = APP_STATE.entities.length - 1;
      }
      APP_STATE.kbCardFlipped = false;

      const saveMsg = document.getElementById('ai-save-feedback-msg');
      if (saveMsg) {
        saveMsg.textContent = `🎉 已成功將「${nameEn} (${nameZh})」寫入下方 Quizlet 單字卡、右側 Notion 筆記與 Layer 1 測驗題庫！`;
      }
      appendAILiveLog(`已將「${nameEn} (${nameZh})」正式寫入知識庫 (共 ${APP_STATE.entities.length} 筆構造)。`, 'text-emerald-400 font-bold');

      populateSpotEntitySelect();
      renderKBView();
      renderLayer1();
      updateSchemaInspector();
    }
