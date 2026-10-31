/**
 * src/modules/layer1_morpheme.js
 * Layer 1：單一構造字根詞源及前後綴拆解模組
 */

function initLayer1Question(index) {
      const list = getFilteredL1Entities();
      const total = list.length;
      APP_STATE.l1Index = ((index % total) + total) % total;
      APP_STATE.l1SelectedBlocks = [];
      APP_STATE.l1Answered = false;

      const entity = list[APP_STATE.l1Index];
      const combined = [
        ...entity.morphemes.map((m, i) => ({ ...m, uid: `correct_${i}`, isCorrectPart: true })),
        ...(entity.distractors || []).map((d, i) => ({ ...d, uid: `dist_${i}`, isCorrectPart: false }))
      ];

      for (let i = combined.length - 1; i > 0; i--) {
        const j = (i * 3 + APP_STATE.l1Index) % (i + 1);
        const temp = combined[i];
        combined[i] = combined[j];
        combined[j] = temp;
      }
      APP_STATE.l1PoolBlocks = combined;
      renderLayer1();
    }

    function renderLayer1() {
      const list = getFilteredL1Entities();
      const total = list.length;
      if (APP_STATE.l1Index >= total) APP_STATE.l1Index = 0;
      const entity = list[APP_STATE.l1Index];

      if (APP_STATE.quizLayer === 1) {
        const pct = Math.round(((APP_STATE.l1Index + 1) / total) * 100);
        document.getElementById('quiz-progress-label').textContent = `Layer 1 進度 ${APP_STATE.l1Index + 1} / ${total}`;
        document.getElementById('quiz-progress-bar').style.width = `${pct}%`;
      }

      document.getElementById('l1-category-badge').textContent = `${entity.category} · ${entity.regionGroup}`;
      document.getElementById('l1-target-title').textContent = `${entity.nameZh} (${entity.nameEn})`;
      document.getElementById('l1-target-desc').textContent = entity.description;
      document.getElementById('l1-target-formula').textContent =
        '目標詞性結構：' + entity.morphemes.map(m => m.pos).join(' + ');

      const dotsEl = document.getElementById('l1-question-dots');
      dotsEl.innerHTML = '';
      list.forEach((ent, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `w-6 h-6 rounded-full text-[11px] font-bold transition ${
          idx === APP_STATE.l1Index
            ? 'bg-sky-600 text-white'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }`;
        btn.textContent = String(idx + 1);
        btn.title = `${ent.nameEn} (${ent.nameZh})`;
        btn.addEventListener('click', () => initLayer1Question(idx));
        dotsEl.appendChild(btn);
      });

      const trayEl = document.getElementById('l1-answer-tray');
      trayEl.innerHTML = '';
      if (APP_STATE.l1SelectedBlocks.length === 0) {
        const emptyHint = document.createElement('span');
        emptyHint.className = 'text-xs text-slate-400 font-medium select-none';
        emptyHint.textContent = '請從下方字根銀行依序點選前後綴、字根與詞性縮寫...';
        trayEl.appendChild(emptyHint);
      } else {
        APP_STATE.l1SelectedBlocks.forEach((blk, idx) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'btn-3d btn-3d-neutral px-3.5 py-2 rounded-xl flex items-center gap-2 text-sm font-extrabold';
          chip.innerHTML = `
            <span>${blk.part}</span>
            <span class="text-[11px] font-bold px-1.5 py-0.5 rounded border ${getPosBadgeStyle(blk.pos)}">${blk.pos}</span>
          `;
          chip.addEventListener('click', () => {
            if (APP_STATE.l1Answered) return;
            APP_STATE.l1SelectedBlocks.splice(idx, 1);
            renderLayer1();
          });
          trayEl.appendChild(chip);

          if (idx < APP_STATE.l1SelectedBlocks.length - 1) {
            const plus = document.createElement('span');
            plus.className = 'text-slate-400 font-black text-sm';
            plus.textContent = '+';
            trayEl.appendChild(plus);
          }
        });
      }

      const bankEl = document.getElementById('l1-word-bank');
      bankEl.innerHTML = '';
      const selectedIds = new Set(APP_STATE.l1SelectedBlocks.map(b => b.uid));

      APP_STATE.l1PoolBlocks.forEach(blk => {
        const used = selectedIds.has(blk.uid);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.disabled = used || APP_STATE.l1Answered;
        btn.className = used
          ? 'px-4 py-2.5 rounded-xl bg-slate-200 border-2 border-slate-300 text-transparent select-none cursor-default'
          : 'btn-3d btn-3d-neutral px-4 py-2.5 rounded-xl flex flex-col items-center gap-0.5';

        btn.innerHTML = used
          ? `<span class="text-sm font-bold">${blk.part}</span><span class="text-[10px]">${blk.pos}</span>`
          : `
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-extrabold text-slate-800">${blk.part}</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded border ${getPosBadgeStyle(blk.pos)}">${blk.pos}</span>
            </div>
            <span class="text-[11px] text-slate-500 font-medium">${blk.meaning}</span>
          `;
        btn.addEventListener('click', () => {
          if (used || APP_STATE.l1Answered) return;
          APP_STATE.l1SelectedBlocks.push(blk);
          renderLayer1();
        });
        bankEl.appendChild(btn);
      });

      if (!APP_STATE.l1Answered) {
        const fbArea = document.getElementById('l1-feedback-area');
        fbArea.className = 'mt-6 pt-5 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4';
        document.getElementById('l1-feedback-message').innerHTML =
          '💡 點擊下方帶有詞性標籤的字根積木，拼出完整的解剖學拉丁/英文詞源結構。';
        document.getElementById('l1-btn-check').classList.remove('hidden');
        document.getElementById('l1-btn-next').classList.add('hidden');
      }
    }

    function checkLayer1Answer() {
      const list = getFilteredL1Entities();
      const entity = list[APP_STATE.l1Index];
      const expected = entity.morphemes.map(m => `${m.part}|${m.pos}`).join('__');
      const actual = APP_STATE.l1SelectedBlocks.map(m => `${m.part}|${m.pos}`).join('__');

      const fbArea = document.getElementById('l1-feedback-area');
      const fbMsg = document.getElementById('l1-feedback-message');

      if (expected === actual) {
        APP_STATE.l1Answered = true;
        addXP(15, true);
        const breakdownStr = entity.morphemes
          .map(m => `<strong>${m.part}</strong> (${m.pos}：${m.meaning})`)
          .join(' ＋ ');
        const spotTip = entity.blocks && entity.blocks[0] ? entity.blocks[0].text : '';
        fbArea.className = 'mt-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4';
        fbMsg.innerHTML = `
          <div class="text-emerald-900 space-y-1">
            <div class="font-extrabold text-base">✅ 完全正確！字根與詞性拆解無誤 (+15 XP)</div>
            <div class="text-xs">${breakdownStr}</div>
            ${spotTip ? `<div class="text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg mt-1">📌 ${spotTip}</div>` : ''}
          </div>
        `;
        document.getElementById('l1-btn-check').classList.add('hidden');
        document.getElementById('l1-btn-next').classList.remove('hidden');
      } else {
        APP_STATE.streak = 0;
        document.getElementById('stat-streak').textContent = '0 連勝';
        const hintOrder = entity.morphemes.map(m => `${m.part} (${m.pos})`).join(' + ');
        fbArea.className = 'mt-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row items-center justify-between gap-4';
        fbMsg.innerHTML = `
          <div class="text-rose-900">
            <div class="font-extrabold text-sm">❌ 順序或字根尚未完全配對，請再試一次！</div>
            <div class="text-xs mt-1">正確拆解提示：<strong>${hintOrder}</strong></div>
          </div>
        `;
      }
    }

    /**
     * =========================================================================
     * 5. VIEW 1 — LAYER 2: CONTINUOUS PATHWAY TREE (4 Trees)
     * =========================================================================
     */
