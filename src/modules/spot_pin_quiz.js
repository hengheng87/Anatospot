/**
 * src/modules/spot_pin_quiz.js
 * 實拍大體/模型照片上傳與圖釘 (Pin) 跑台抽考模組
 */

function populateSpotEntitySelect() {
      const sel = document.getElementById('spot-pin-entity-select');
      sel.innerHTML = '<option value="">-- 選擇 Notebook 上肢詞庫構造或自行於下方輸入 --</option>';
      APP_STATE.entities.forEach(ent => {
        const opt = document.createElement('option');
        opt.value = ent.id;
        opt.textContent = `[${ent.category}] ${ent.nameEn} (${ent.nameZh})`;
        sel.appendChild(opt);
      });
    }

    function loadSchematicPracticeBoard() {
      APP_STATE.spotCanvasType = 'schematic';
      document.getElementById('spot-empty-placeholder').classList.add('hidden');
      document.getElementById('spot-user-image').classList.add('hidden');
      document.getElementById('spot-schematic-svg').classList.remove('hidden');

      APP_STATE.spotPins = [
        {
          id: 'pin_1',
          xPercent: 47.5,
          yPercent: 34,
          nameEn: 'Axillary a.',
          nameZh: '腋動脈',
          hint: '位於第一肋骨外緣與大圓肌下緣之間的主幹動脈（以胸小肌分三段 1/2/3）'
        },
        {
          id: 'pin_2',
          xPercent: 72.5,
          yPercent: 68,
          nameEn: 'Thoracodorsal n.',
          nameZh: '胸背神經',
          hint: '源自臂神經叢後索 (M64)，伴隨胸背動脈支配闊背肌'
        },
        {
          id: 'pin_3',
          xPercent: 47.5,
          yPercent: 63,
          nameEn: 'Brachial a.',
          nameZh: '肱動脈',
          hint: '跨過大圓肌下緣後的延續主幹，與 Median n. 伴行'
        },
        {
          id: 'pin_4',
          xPercent: 37.5,
          yPercent: 92,
          nameEn: 'Radial a.',
          nameZh: '橈動脈',
          hint: '肱動脈於肘窩分出的外側終末支，走在 Brachioradialis m. 下方'
        }
      ];
      APP_STATE.spotSelectedPinId = 'pin_1';
      syncPinFormWithSelected();
      renderSpotView();
    }

    function syncPinFormWithSelected() {
      const pin = APP_STATE.spotPins.find(p => p.id === APP_STATE.spotSelectedPinId);
      if (!pin) {
        document.getElementById('spot-editing-pin-label').textContent =
          '點擊左側圖片任意位置即可新增圖釘';
        return;
      }
      const idx = APP_STATE.spotPins.indexOf(pin) + 1;
      document.getElementById('spot-editing-pin-label').textContent =
        `正在編輯圖釘 #${idx} (座標 X:${pin.xPercent.toFixed(1)}%, Y:${pin.yPercent.toFixed(1)}%)`;
      document.getElementById('spot-pin-custom-en').value = pin.nameEn;
      document.getElementById('spot-pin-custom-zh').value = pin.nameZh;
      document.getElementById('spot-pin-hint').value = pin.hint || '';
    }

    function renderSpotView() {
      const isEdit = APP_STATE.spotMode === 'edit';
      document.getElementById('spot-mode-edit-btn').className = isEdit
        ? 'btn-3d btn-3d-selected px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold'
        : 'btn-3d btn-3d-neutral px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold';
      document.getElementById('spot-mode-quiz-btn').className = !isEdit
        ? 'btn-3d btn-3d-selected px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold'
        : 'btn-3d btn-3d-neutral px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold';

      document.getElementById('spot-editor-panel').classList.toggle('hidden', !isEdit);
      document.getElementById('spot-quiz-panel').classList.toggle('hidden', isEdit);
      document.getElementById('spot-pin-count-badge').textContent = `${APP_STATE.spotPins.length} 個圖釘`;

      const pinsLayer = document.getElementById('spot-pins-layer');
      pinsLayer.innerHTML = '';

      APP_STATE.spotPins.forEach((pin, idx) => {
        const isCurrentTarget = isEdit
          ? pin.id === APP_STATE.spotSelectedPinId
          : idx === APP_STATE.spotQuizIndex;

        const marker = document.createElement('button');
        marker.type = 'button';
        marker.style.left = `${pin.xPercent}%`;
        marker.style.top = `${pin.yPercent}%`;
        marker.className = `pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center shadow-lg border-2 border-white transition ${
          isCurrentTarget
            ? 'bg-rose-600 text-white scale-125 pin-active-pulse z-20'
            : 'bg-sky-600 text-white hover:scale-110 z-10'
        }`;
        marker.textContent = String(idx + 1);
        marker.title = isEdit ? `#${idx + 1} ${pin.nameEn}` : `跑台第 ${idx + 1} 站`;

        marker.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isEdit) {
            APP_STATE.spotSelectedPinId = pin.id;
            syncPinFormWithSelected();
            renderSpotView();
          } else {
            APP_STATE.spotQuizIndex = idx;
            startSpotStationTimer();
            renderSpotView();
          }
        });

        pinsLayer.appendChild(marker);
      });

      const listEl = document.getElementById('spot-pin-list');
      listEl.innerHTML = '';
      if (APP_STATE.spotPins.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-xs text-slate-400 italic py-4 text-center';
        empty.textContent = '目前尚無圖釘。請先上傳解剖照片或載入練習板，再點擊畫面新增圖釘。';
        listEl.appendChild(empty);
      } else {
        APP_STATE.spotPins.forEach((pin, idx) => {
          const row = document.createElement('div');
          const active = pin.id === APP_STATE.spotSelectedPinId;
          row.className = `p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer text-xs ${
            active ? 'bg-sky-50 border-sky-400' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`;
          row.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[11px]">${idx + 1}</span>
              <div>
                <span class="font-extrabold text-slate-800">${pin.nameEn}</span>
                <span class="text-slate-500 ml-1">(${pin.nameZh})</span>
              </div>
            </div>
          `;
          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'text-slate-400 hover:text-rose-600 font-bold px-1.5';
          delBtn.textContent = '刪除';
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            APP_STATE.spotPins.splice(idx, 1);
            if (APP_STATE.spotSelectedPinId === pin.id) {
              APP_STATE.spotSelectedPinId = APP_STATE.spotPins[0] ? APP_STATE.spotPins[0].id : null;
            }
            syncPinFormWithSelected();
            renderSpotView();
          });
          row.addEventListener('click', () => {
            APP_STATE.spotSelectedPinId = pin.id;
            syncPinFormWithSelected();
            renderSpotView();
          });
          row.appendChild(delBtn);
          listEl.appendChild(row);
        });
      }

      if (!isEdit) {
        renderSpotQuizStation();
      }
    }

    function startSpotStationTimer() {
      if (APP_STATE.spotTimerInterval) {
        clearInterval(APP_STATE.spotTimerInterval);
        APP_STATE.spotTimerInterval = null;
      }
      APP_STATE.spotTimerSeconds = 30;
      const badge = document.getElementById('spot-timer-badge');
      badge.textContent = `⏱️ ${APP_STATE.spotTimerSeconds}s`;

      APP_STATE.spotTimerInterval = setInterval(() => {
        if (APP_STATE.activeTab !== 'spot' || APP_STATE.spotMode !== 'quiz') {
          clearInterval(APP_STATE.spotTimerInterval);
          APP_STATE.spotTimerInterval = null;
          return;
        }
        if (APP_STATE.spotTimerSeconds > 0) {
          APP_STATE.spotTimerSeconds -= 1;
          badge.textContent = `⏱️ ${APP_STATE.spotTimerSeconds}s`;
        } else {
          badge.textContent = '⏰ 時間到';
          clearInterval(APP_STATE.spotTimerInterval);
          APP_STATE.spotTimerInterval = null;
        }
      }, 1000);
    }

    function renderSpotQuizStation() {
      if (APP_STATE.spotPins.length === 0) {
        document.getElementById('spot-quiz-station-title').textContent = '請先在編輯模式標記至少 1 個圖釘';
        document.getElementById('spot-quiz-choices').innerHTML = '';
        return;
      }
      const total = APP_STATE.spotPins.length;
      APP_STATE.spotQuizIndex = ((APP_STATE.spotQuizIndex % total) + total) % total;
      const activePin = APP_STATE.spotPins[APP_STATE.spotQuizIndex];

      document.getElementById('spot-quiz-station-title').textContent =
        `第 ${APP_STATE.spotQuizIndex + 1} / ${total} 站：請指認紅色閃爍圖釘 #${APP_STATE.spotQuizIndex + 1}`;
      document.getElementById('spot-quiz-hint-text').textContent =
        activePin.hint || '請觀察圖片中標號位置與鄰近構造關係';

      const choicesEl = document.getElementById('spot-quiz-choices');
      choicesEl.innerHTML = '';

      const poolNames = new Set([activePin.nameEn]);
      APP_STATE.spotPins.forEach(p => poolNames.add(p.nameEn));
      APP_STATE.entities.forEach(e => {
        if (poolNames.size < 4) poolNames.add(e.nameEn);
      });

      const opts = Array.from(poolNames);
      opts.forEach(optName => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-3d btn-3d-neutral px-3 py-2 rounded-xl text-xs font-extrabold text-left';
        btn.textContent = optName;
        btn.addEventListener('click', () => {
          document.getElementById('spot-quiz-input').value = optName;
          checkSpotQuizAnswer();
        });
        choicesEl.appendChild(btn);
      });
    }

    function checkSpotQuizAnswer() {
      if (APP_STATE.spotPins.length === 0) return;
      const activePin = APP_STATE.spotPins[APP_STATE.spotQuizIndex];
      const userVal = document.getElementById('spot-quiz-input').value.trim().toLowerCase();
      const fb = document.getElementById('spot-quiz-feedback');

      const targetEn = activePin.nameEn.toLowerCase();
      const targetZh = activePin.nameZh.toLowerCase();

      if (userVal && (targetEn.includes(userVal) || userVal.includes(targetEn.replace(' n.', '').replace(' a.', '').replace(' m.', '')) || userVal === targetZh)) {
        addXP(20, true);
        fb.className = 'p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-xs sm:text-sm font-bold text-emerald-900';
        fb.innerHTML = `✅ 跑台指認正確！圖釘 #${APP_STATE.spotQuizIndex + 1} 為 <strong>${activePin.nameEn} (${activePin.nameZh})</strong> (+20 XP)`;
      } else {
        APP_STATE.streak = 0;
        document.getElementById('stat-streak').textContent = '0 連勝';
        fb.className = 'p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs sm:text-sm font-bold text-rose-900';
        fb.innerHTML = `❌ 答案不符！圖釘 #${APP_STATE.spotQuizIndex + 1} 正確解答為：<strong>${activePin.nameEn} (${activePin.nameZh})</strong>`;
      }
    }

    /**
     * =========================================================================
     * 8. VIEW 3 — AI AGENT BACKEND CONNECTOR + STRUCTURED JSON SCHEMA ENGINE
     * =========================================================================
     * 💡 開發者說明：您可以直接在下方 AI_AGENT_CONFIG 填入預設 API Key 或後端 URL，
     * 或直接在網頁介面的「🔌 AI Agent 分析後端與 API 金鑰配置處」動態輸入。
     */
