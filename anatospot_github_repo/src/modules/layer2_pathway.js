/**
 * src/modules/layer2_pathway.js
 * Layer 2：連續構造血管與神經分段樹狀圖模組
 */

function renderLayer2() {
      const tree = PATHWAY_TREES[APP_STATE.l2TreeKey];
      document.getElementById('l2-pathway-title').textContent = tree.title;

      const btnMap = {
        artery: 'l2-switch-artery',
        nerve: 'l2-switch-nerve',
        nerve_ant: 'l2-switch-nerve-ant',
        vein: 'l2-switch-vein'
      };
      Object.entries(btnMap).forEach(([k, bId]) => {
        const el = document.getElementById(bId);
        if (el) {
          el.className = APP_STATE.l2TreeKey === k
            ? 'btn-3d btn-3d-selected px-3 py-1.5 rounded-xl text-xs font-bold'
            : 'btn-3d btn-3d-neutral px-3 py-1.5 rounded-xl text-xs font-bold';
        }
      });

      const blankIds = [];
      tree.nodes.forEach(n => {
        if (n.isBlank) blankIds.push({ id: n.id, expected: n.label });
        (n.branches || []).forEach(b => {
          if (b.isBlank) blankIds.push({ id: b.id, expected: b.label });
        });
      });

      if (!blankIds.some(b => b.id === APP_STATE.l2ActiveBlankId)) {
        const firstUnfilled = blankIds.find(b => !APP_STATE.l2FilledAnswers[b.id]);
        APP_STATE.l2ActiveBlankId = firstUnfilled ? firstUnfilled.id : blankIds[0].id;
      }

      let correctCount = 0;
      blankIds.forEach(b => {
        if (APP_STATE.l2FilledAnswers[b.id] === b.expected) correctCount++;
      });
      document.getElementById('l2-score-badge').textContent = `已完成 ${correctCount} / ${blankIds.length}`;

      if (APP_STATE.quizLayer === 2) {
        const pct = Math.round((correctCount / blankIds.length) * 100);
        document.getElementById('quiz-progress-label').textContent = `Layer 2 進度 ${correctCount} / ${blankIds.length}`;
        document.getElementById('quiz-progress-bar').style.width = `${Math.max(15, pct)}%`;
      }

      const container = document.getElementById('l2-tree-container');
      container.innerHTML = '';

      const treeWrap = document.createElement('div');
      treeWrap.className = 'space-y-3 min-w-[540px]';

      tree.nodes.forEach((node, idx) => {
        const nodeBlock = document.createElement('div');
        nodeBlock.className = 'relative';

        const mainRow = document.createElement('div');
        mainRow.className = 'flex flex-wrap items-start gap-3';

        const trunkCard = createTreeNodeButton(node.id, node.label, node.isBlank, true);
        mainRow.appendChild(trunkCard);

        if (node.siblingLabel) {
          const sib = document.createElement('div');
          sib.className = 'px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-xs font-bold text-slate-700';
          sib.textContent = `🌿 平行終末支：${node.siblingLabel}`;
          mainRow.appendChild(sib);
        }

        nodeBlock.appendChild(mainRow);

        if (node.branches && node.branches.length > 0) {
          const branchList = document.createElement('div');
          branchList.className = 'ml-8 mt-2 pl-4 border-l-2 border-dashed border-rose-300 space-y-2';
          node.branches.forEach(br => {
            const brWrap = document.createElement('div');
            brWrap.className = 'flex flex-wrap items-center gap-2';
            const brBtn = createTreeNodeButton(br.id, br.label, br.isBlank, false);
            brWrap.appendChild(brBtn);
            if (br.subBranch) {
              const subSpan = document.createElement('span');
              subSpan.className = 'text-xs font-semibold text-slate-500';
              subSpan.textContent = br.subBranch;
              brWrap.appendChild(subSpan);
            }
            branchList.appendChild(brWrap);
          });
          nodeBlock.appendChild(branchList);
        }

        if (idx < tree.nodes.length - 1 && node.landmarkToNext) {
          const landmarkRow = document.createElement('div');
          landmarkRow.className = 'ml-6 my-2 pl-4 border-l-4 border-slate-300 py-1 flex items-center gap-2';
          landmarkRow.innerHTML = `
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">⬇ 解剖分界標記 (Landmark)</span>
            <span class="text-xs font-medium text-slate-600">${node.landmarkToNext}</span>
          `;
          nodeBlock.appendChild(landmarkRow);
        }

        treeWrap.appendChild(nodeBlock);
      });

      container.appendChild(treeWrap);

      const optBank = document.getElementById('l2-option-bank');
      optBank.innerHTML = '';
      const usedValues = new Set(Object.values(APP_STATE.l2FilledAnswers));

      tree.options.forEach(optText => {
        const isUsed = usedValues.has(optText);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.disabled = isUsed;
        btn.className = isUsed
          ? 'px-3.5 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-default'
          : 'btn-3d btn-3d-neutral px-3.5 py-2 rounded-xl text-xs font-extrabold';
        btn.textContent = optText;
        btn.addEventListener('click', () => handleLayer2OptionSelect(optText));
        optBank.appendChild(btn);
      });
    }

    function createTreeNodeButton(nodeId, expectedLabel, isBlank, isMainTrunk) {
      const el = document.createElement('button');
      el.type = 'button';

      if (!isBlank) {
        el.disabled = true;
        el.className = isMainTrunk
          ? 'px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs sm:text-sm font-extrabold cursor-default text-left'
          : 'px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-default text-left';
        el.textContent = isMainTrunk ? `🔹 主幹：${expectedLabel}` : `↳ 分支：${expectedLabel}`;
        return el;
      }

      const filledVal = APP_STATE.l2FilledAnswers[nodeId];
      const isSelected = APP_STATE.l2ActiveBlankId === nodeId;

      if (filledVal === expectedLabel) {
        el.className = 'px-4 py-2.5 rounded-xl bg-emerald-500 text-white border-b-4 border-emerald-700 text-xs sm:text-sm font-extrabold text-left';
        el.textContent = `✅ ${filledVal}`;
      } else if (isSelected) {
        el.className = 'px-4 py-2.5 rounded-xl bg-sky-100 border-2 border-sky-500 text-sky-900 text-xs sm:text-sm font-extrabold animate-pulse text-left';
        el.textContent = '🎯 [ ？ 點擊下方選項填入此構造 ]';
      } else {
        el.className = 'px-4 py-2.5 rounded-xl bg-amber-50 border-2 border-dashed border-amber-400 text-amber-900 text-xs sm:text-sm font-bold hover:bg-amber-100 text-left';
        el.textContent = '❓ [ 待填入構造節點 (點擊選取) ]';
      }

      el.addEventListener('click', () => {
        APP_STATE.l2ActiveBlankId = nodeId;
        renderLayer2();
      });
      return el;
    }

    function handleLayer2OptionSelect(chosenOption) {
      const tree = PATHWAY_TREES[APP_STATE.l2TreeKey];
      const targetId = APP_STATE.l2ActiveBlankId;
      if (!targetId) return;

      let expected = null;
      tree.nodes.forEach(n => {
        if (n.id === targetId) expected = n.label;
        (n.branches || []).forEach(b => {
          if (b.id === targetId) expected = b.label;
        });
      });

      const fbBanner = document.getElementById('l2-feedback-banner');
      const fbText = document.getElementById('l2-feedback-text');

      if (chosenOption === expected) {
        APP_STATE.l2FilledAnswers[targetId] = chosenOption;
        addXP(15, true);
        fbBanner.className = 'mt-5 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-sm text-emerald-900 flex items-center justify-between';
        fbText.innerHTML = `<strong>✅ 脈絡串聯正確！</strong> 已填入「${chosenOption}」 (+15 XP)`;

        const allBlankIds = [];
        tree.nodes.forEach(n => {
          if (n.isBlank) allBlankIds.push(n.id);
          (n.branches || []).forEach(b => {
            if (b.isBlank) allBlankIds.push(b.id);
          });
        });
        const nextBlank = allBlankIds.find(id => !APP_STATE.l2FilledAnswers[id]);
        if (nextBlank) APP_STATE.l2ActiveBlankId = nextBlank;
      } else {
        APP_STATE.streak = 0;
        document.getElementById('stat-streak').textContent = '0 連勝';
        fbBanner.className = 'mt-5 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-sm text-rose-900 flex items-center justify-between';
        fbText.innerHTML = `<strong>❌ 分段位置不符：</strong>「${chosenOption}」不在此解剖分界點，請對照上下游標記再試一次！`;
      }

      renderLayer2();
    }

    /**
     * =========================================================================
     * 6. VIEW 1 — LAYER 3: REGIONAL GROUPING (5 Regional Modules from Notebook)
     * =========================================================================
     */
