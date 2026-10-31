/**
 * src/modules/layer3_regional.js
 * Layer 3：同區構造分層歸納 (4+1+3 / 6+5 / 腋窩間隙) 模組
 */

function renderLayer3() {
      const groupData = REGIONAL_GROUPS_DATA[APP_STATE.l3GroupKey];
      document.getElementById('l3-group-title').textContent = groupData.title;
      document.getElementById('l3-group-subtitle').textContent = groupData.subtitle;

      const groupBtnMap = {
        forearm_ant: 'l3-group-forearm-ant',
        forearm_post: 'l3-group-forearm-post',
        arm_scap: 'l3-group-arm-scap',
        hand: 'l3-group-hand',
        spaces: 'l3-group-spaces'
      };
      Object.entries(groupBtnMap).forEach(([gKey, btnId]) => {
        const el = document.getElementById(btnId);
        if (el) {
          el.className = APP_STATE.l3GroupKey === gKey
            ? 'btn-3d btn-3d-selected px-2.5 py-1 rounded-lg text-xs font-bold'
            : 'btn-3d btn-3d-neutral px-2.5 py-1 rounded-lg text-xs font-bold';
        }
      });

      const buckets = ['superficial', 'intermediate', 'deep'];
      const bucketMeta = groupData.buckets;

      document.getElementById('l3-active-target-indicator').textContent =
        `目前選中填入目標：${bucketMeta[APP_STATE.l3ActiveBucket].title}`;

      buckets.forEach(bKey => {
        const boxEl = document.getElementById(`l3-bucket-${bKey}`);
        const isTarget = APP_STATE.l3ActiveBucket === bKey;
        boxEl.className = isTarget
          ? 'rounded-2xl border-2 border-sky-500 bg-sky-50/50 p-4 flex flex-col justify-between transition cursor-pointer shadow-sm'
          : 'rounded-2xl border-2 border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between transition cursor-pointer hover:border-slate-300';

        // Update bucket header title and description dynamically
        const headerBadge = boxEl.querySelector('span.rounded-full');
        if (headerBadge) headerBadge.textContent = bucketMeta[bKey].title;
        const descP = boxEl.querySelector('p.text-xs.text-slate-500');
        if (descP) descP.textContent = bucketMeta[bKey].desc;

        const assignedMuscles = groupData.items.filter(m =>
          APP_STATE.l3ShowSolution ? m.layer === bKey : APP_STATE.l3Assignments[m.id] === bKey
        );

        document.getElementById(`l3-count-${bKey}`).textContent =
          `${assignedMuscles.length} / ${bucketMeta[bKey].max}`;

        const slotsEl = document.getElementById(`l3-slots-${bKey}`);
        slotsEl.innerHTML = '';

        if (assignedMuscles.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'text-xs text-slate-400 italic py-6 text-center border border-dashed border-slate-300 rounded-xl';
          empty.textContent = '尚無歸入構造';
          slotsEl.appendChild(empty);
        } else {
          assignedMuscles.forEach(m => {
            const card = document.createElement('div');
            card.className = 'p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-2';
            card.innerHTML = `
              <div>
                <div class="font-extrabold text-xs text-slate-800">${m.nameEn} (${m.nameZh})</div>
                <div class="text-[11px] text-emerald-700 font-semibold mt-0.5">⚡ ${m.nerve}</div>
                <div class="text-[11px] text-slate-500">${m.note}</div>
              </div>
            `;
            if (!APP_STATE.l3ShowSolution) {
              const removeBtn = document.createElement('button');
              removeBtn.type = 'button';
              removeBtn.className = 'text-xs text-slate-400 hover:text-rose-600 font-bold px-1';
              removeBtn.textContent = '✕';
              removeBtn.title = '移回候選區';
              removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                delete APP_STATE.l3Assignments[m.id];
                renderLayer3();
              });
              card.appendChild(removeBtn);
            }
            slotsEl.appendChild(card);
          });
        }
      });

      const totalItems = groupData.items.length;
      const totalAssigned = APP_STATE.l3ShowSolution
        ? totalItems
        : groupData.items.filter(m => APP_STATE.l3Assignments[m.id]).length;

      if (APP_STATE.quizLayer === 3) {
        const pct = Math.round((totalAssigned / totalItems) * 100);
        document.getElementById('quiz-progress-label').textContent = `Layer 3 進度 ${totalAssigned} / ${totalItems}`;
        document.getElementById('quiz-progress-bar').style.width = `${Math.max(12, pct)}%`;
      }

      const poolEl = document.getElementById('l3-muscle-pool');
      poolEl.innerHTML = '';

      const unassigned = groupData.items.filter(m =>
        !APP_STATE.l3ShowSolution && !APP_STATE.l3Assignments[m.id]
      );

      if (unassigned.length === 0) {
        const doneMsg = document.createElement('div');
        doneMsg.className = 'col-span-full py-4 text-center text-sm font-extrabold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200';
        doneMsg.textContent = `🎉 本區 (${groupData.title}) 共 ${totalItems} 項構造已全數歸位完成！可點擊上方按鈕切換其他上肢分區。`;
        poolEl.appendChild(doneMsg);
      } else {
        unassigned.forEach(m => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn-3d btn-3d-neutral p-3 rounded-xl text-left flex flex-col justify-between';
          btn.innerHTML = `
            <div class="font-extrabold text-xs sm:text-sm text-slate-800">${m.nameEn}</div>
            <div class="text-xs font-bold text-slate-500 mt-0.5">${m.nameZh}</div>
          `;
          btn.addEventListener('click', () => handleLayer3MuscleAssign(m));
          poolEl.appendChild(btn);
        });
      }
    }

    function handleLayer3MuscleAssign(muscle) {
      const groupData = REGIONAL_GROUPS_DATA[APP_STATE.l3GroupKey];
      const targetLayer = APP_STATE.l3ActiveBucket;
      const fbBar = document.getElementById('l3-feedback-bar');

      if (muscle.layer === targetLayer) {
        APP_STATE.l3Assignments[muscle.id] = targetLayer;
        addXP(10, true);
        fbBar.className = 'mt-4 p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-xs sm:text-sm font-bold text-emerald-900';
        fbBar.textContent = `✅ 分組正確！「${muscle.nameEn} (${muscle.nameZh})」屬於【${groupData.buckets[targetLayer].title}】— 支配/來源：${muscle.nerve}（${muscle.note}）`;
        renderLayer3();
      } else {
        APP_STATE.streak = 0;
        document.getElementById('stat-streak').textContent = '0 連勝';
        fbBar.className = 'mt-4 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs sm:text-sm font-bold text-rose-900';
        fbBar.textContent = `❌ 層次或分組不符：「${muscle.nameEn} (${muscle.nameZh})」不屬於目前選中的分區，跑台提示：${muscle.note}。`;
      }
    }

    /**
     * =========================================================================
     * 7. VIEW 2 — CUSTOM PHOTO PIN SPOT-TEST
     * =========================================================================
     */
