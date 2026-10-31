/**
 * src/modules/kb_notion.js
 * Quizlet 雙面閃卡與 Notion 區塊筆記庫渲染模組
 */

function renderKBView() {
      const total = APP_STATE.entities.length;
      APP_STATE.kbSelectedIndex = ((APP_STATE.kbSelectedIndex % total) + total) % total;
      const current = APP_STATE.entities[APP_STATE.kbSelectedIndex];

      document.getElementById('kb-total-count').textContent = `${total} 筆上肢核心構造`;
      document.getElementById('kb-card-index-label').textContent = `${APP_STATE.kbSelectedIndex + 1} / ${total}`;

      const cardBox = document.getElementById('kb-flashcard-box');
      if (!APP_STATE.kbCardFlipped) {
        const morphBadges = current.morphemes
          .map(m => `<span class="px-2.5 py-1 rounded-lg bg-slate-700/90 border border-slate-600 text-xs font-mono-code">${m.part} <em class="text-sky-300 not-italic">(${m.pos})</em></span>`)
          .join(' <span class="text-slate-400">+</span> ');
        cardBox.innerHTML = `
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>【正面 · 英文構造與字源結構】</span>
            <span class="px-2 py-0.5 rounded bg-slate-700 text-sky-300 font-bold">${current.category}</span>
          </div>
          <div class="my-4">
            <h4 class="text-2xl font-black tracking-tight text-white">${current.nameEn}</h4>
            <div class="mt-3 flex flex-wrap items-center gap-1.5">${morphBadges}</div>
          </div>
          <div class="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/80 pt-2">
            <span>點擊翻至背面查看中文、連續脈絡與跑台重點</span>
            <span>Flip ➔</span>
          </div>
        `;
      } else {
        cardBox.innerHTML = `
          <div class="flex items-center justify-between text-xs text-emerald-300">
            <span>【背面 · 中文譯名與跑台脈絡】</span>
            <span class="font-bold">${current.nameEn}</span>
          </div>
          <div class="my-3 space-y-2">
            <h4 class="text-xl font-black text-white">${current.nameZh}</h4>
            <p class="text-xs text-slate-200 leading-relaxed">${current.description}</p>
            <div class="text-xs text-amber-300 font-semibold">🌿 脈絡：${current.pathwaySummary}</div>
          </div>
          <div class="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/80 pt-2">
            <span>點擊翻回正面</span>
            <span>↺ Front</span>
          </div>
        `;
      }

      const listEl = document.getElementById('kb-entity-list');
      listEl.innerHTML = '';
      APP_STATE.entities.forEach((ent, idx) => {
        const active = idx === APP_STATE.kbSelectedIndex;
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
          active
            ? 'bg-sky-50 border-sky-400 shadow-sm'
            : 'bg-white border-slate-200 hover:bg-slate-50'
        }`;
        item.innerHTML = `
          <div>
            <div class="font-extrabold text-xs sm:text-sm text-slate-800">${ent.nameEn}</div>
            <div class="text-xs text-slate-500">${ent.nameZh} · ${ent.regionGroup}</div>
          </div>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">${ent.category}</span>
        `;
        item.addEventListener('click', () => {
          APP_STATE.kbSelectedIndex = idx;
          APP_STATE.kbCardFlipped = false;
          renderKBView();
        });
        listEl.appendChild(item);
      });

      document.getElementById('notion-page-cat').textContent = current.category;
      document.getElementById('notion-page-id').textContent = `ID: ${current.id}`;
      document.getElementById('notion-page-title').textContent = `${current.nameEn} (${current.nameZh})`;

      const morphProp = document.getElementById('notion-prop-morphemes');
      morphProp.innerHTML = '';
      current.morphemes.forEach(m => {
        const span = document.createElement('span');
        span.className = `px-2 py-0.5 rounded border text-xs font-bold ${getPosBadgeStyle(m.pos)}`;
        span.textContent = `${m.part} (${m.pos}: ${m.meaning})`;
        morphProp.appendChild(span);
      });

      document.getElementById('notion-prop-pathway').textContent = current.pathwaySummary;
      document.getElementById('notion-prop-region').textContent = current.regionGroup;

      const blocksContainer = document.getElementById('notion-blocks-container');
      blocksContainer.innerHTML = '';

      current.blocks.forEach((blk, bIdx) => {
        const bEl = document.createElement('div');
        if (blk.type === 'callout') {
          bEl.className = 'p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start justify-between gap-3';
          bEl.innerHTML = `<div class="leading-relaxed">💡 <strong>跑台判讀重點：</strong>${blk.text}</div>`;
        } else if (blk.type === 'media') {
          bEl.className = 'p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm text-purple-950 flex items-start justify-between gap-3';
          bEl.innerHTML = `<div class="leading-relaxed">🎬 <strong>影音/共筆連結註記：</strong>${blk.text}</div>`;
        } else if (blk.type === 'image') {
          bEl.className = 'p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2';
          bEl.innerHTML = `
            <div class="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>🖼️ 使用者附加之本地標本/手繪圖筆記</span>
            </div>
            <img src="${blk.dataUrl}" alt="筆記附加圖片" class="max-h-56 rounded-xl border border-slate-300 object-contain" />
          `;
        } else {
          bEl.className = 'p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start justify-between gap-3';
          bEl.innerHTML = `<div class="leading-relaxed">🩺 <strong>考古與臨床補充：</strong>${blk.text}</div>`;
        }

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'text-xs text-slate-400 hover:text-rose-600 font-bold shrink-0';
        delBtn.textContent = '刪除';
        delBtn.addEventListener('click', () => {
          current.blocks.splice(bIdx, 1);
          renderKBView();
          updateSchemaInspector();
        });
        bEl.appendChild(delBtn);
        blocksContainer.appendChild(bEl);
      });
    }

    /**
     * =========================================================================
     * 9. VIEW 4 — LIVE JSON SCHEMA INSPECTOR
     * =========================================================================
     */
