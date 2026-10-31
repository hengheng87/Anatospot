/**
 * src/modules/app_init.js
 * 導覽列切換、全域事件綁定與系統啟動入口
 */

function updateSchemaInspector() {
      const exportPayload = {
        schemaVersion: '1.1.0-notebook-upper-limb-imported',
        sourceNotebook: '解剖跑台第一次 (115-1 第一次跑考摘要 / M66第一次跑考摘要 / 解剖摘要 - 上肢非骨學完整整理)',
        entitiesCount: APP_STATE.entities.length,
        entities: APP_STATE.entities,
        pathwayTrees: PATHWAY_TREES,
        regionalGroups: REGIONAL_GROUPS_DATA,
        customPhotoPins: APP_STATE.spotPins
      };
      document.getElementById('schema-json-viewer').textContent = JSON.stringify(exportPayload, null, 2);
    }

    function switchMainTab(tabName) {
      APP_STATE.activeTab = tabName;
      const tabs = ['quiz', 'spot', 'kb', 'schema'];
      tabs.forEach(t => {
        const btn = document.getElementById(`nav-tab-${t}`);
        const view = document.getElementById(`view-${t}`);
        if (t === tabName) {
          btn.className = 'px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 bg-white text-emerald-700 shadow-sm';
          view.classList.remove('hidden');
        } else {
          btn.className = 'px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 text-slate-600 hover:text-slate-900';
          view.classList.add('hidden');
        }
      });

      if (tabName === 'spot') renderSpotView();
      if (tabName === 'kb') renderKBView();
      if (tabName === 'schema') updateSchemaInspector();
    }

    function switchQuizLayer(layerNum) {
      APP_STATE.quizLayer = layerNum;
      [1, 2, 3].forEach(num => {
        const btn = document.getElementById(`layer-btn-${num}`);
        const stage = document.getElementById(`stage-layer-${num}`);
        if (num === layerNum) {
          btn.className = 'btn-3d btn-3d-selected px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2';
          stage.classList.remove('hidden');
        } else {
          btn.className = 'btn-3d btn-3d-neutral px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2';
          stage.classList.add('hidden');
        }
      });

      if (layerNum === 1) renderLayer1();
      if (layerNum === 2) renderLayer2();
      if (layerNum === 3) renderLayer3();
    }

window.addEventListener('DOMContentLoaded', () => {
  // Main Navigation Tabs
  document.getElementById('nav-tab-quiz').addEventListener('click', () => switchMainTab('quiz'));
  document.getElementById('nav-tab-spot').addEventListener('click', () => switchMainTab('spot'));
  document.getElementById('nav-tab-kb').addEventListener('click', () => switchMainTab('kb'));
  document.getElementById('nav-tab-schema').addEventListener('click', () => switchMainTab('schema'));

  // Quiz Sub-Layer Buttons
  document.getElementById('layer-btn-1').addEventListener('click', () => switchQuizLayer(1));
  document.getElementById('layer-btn-2').addEventListener('click', () => switchQuizLayer(2));
  document.getElementById('layer-btn-3').addEventListener('click', () => switchQuizLayer(3));

  document.getElementById('btn-reset-current-layer').addEventListener('click', () => {
    if (APP_STATE.quizLayer === 1) initLayer1Question(APP_STATE.l1Index);
    if (APP_STATE.quizLayer === 2) {
      APP_STATE.l2FilledAnswers = {};
      renderLayer2();
    }
    if (APP_STATE.quizLayer === 3) {
      APP_STATE.l3Assignments = {};
      APP_STATE.l3ShowSolution = false;
      renderLayer3();
    }
  });

  // Layer 1 Controls
  const l1CatFilterEl = document.getElementById('l1-cat-filter');
  if (l1CatFilterEl) {
    l1CatFilterEl.addEventListener('change', (e) => {
      APP_STATE.l1CategoryFilter = e.target.value;
      initLayer1Question(0);
    });
  }
  document.getElementById('l1-clear-tray').addEventListener('click', () => {
    if (APP_STATE.l1Answered) return;
    APP_STATE.l1SelectedBlocks = [];
    renderLayer1();
  });
  document.getElementById('l1-btn-check').addEventListener('click', checkLayer1Answer);
  document.getElementById('l1-btn-next').addEventListener('click', () => {
    initLayer1Question(APP_STATE.l1Index + 1);
  });

  // Layer 2 Controls
  document.getElementById('l2-switch-artery').addEventListener('click', () => { APP_STATE.l2TreeKey = 'artery'; renderLayer2(); });
  document.getElementById('l2-switch-nerve-ant').addEventListener('click', () => { APP_STATE.l2TreeKey = 'nerve_ant'; renderLayer2(); });
  document.getElementById('l2-switch-vein').addEventListener('click', () => { APP_STATE.l2TreeKey = 'vein'; renderLayer2(); });
  document.getElementById('l2-switch-nerve').addEventListener('click', () => { APP_STATE.l2TreeKey = 'nerve'; renderLayer2(); });
  document.getElementById('l2-reset-tree').addEventListener('click', () => { APP_STATE.l2FilledAnswers = {}; renderLayer2(); });

  // Layer 3 Controls
  const groupSwitchMap = {
    'l3-group-forearm-ant': 'forearm_ant',
    'l3-group-forearm-post': 'forearm_post',
    'l3-group-arm-scap': 'arm_scap',
    'l3-group-hand': 'hand',
    'l3-group-spaces': 'spaces'
  };
  Object.entries(groupSwitchMap).forEach(([btnId, gKey]) => {
    const btnEl = document.getElementById(btnId);
    if (btnEl) {
      btnEl.addEventListener('click', () => {
        APP_STATE.l3GroupKey = gKey;
        APP_STATE.l3ActiveBucket = 'superficial';
        APP_STATE.l3Assignments = {};
        APP_STATE.l3ShowSolution = false;
        renderLayer3();
      });
    }
  });
  ['superficial', 'intermediate', 'deep'].forEach(bKey => {
    document.getElementById(`l3-bucket-${bKey}`).addEventListener('click', () => {
      APP_STATE.l3ActiveBucket = bKey;
      renderLayer3();
    });
  });
  document.getElementById('l3-btn-auto-demo').addEventListener('click', () => {
    APP_STATE.l3ShowSolution = !APP_STATE.l3ShowSolution;
    renderLayer3();
  });
  document.getElementById('l3-btn-reset').addEventListener('click', () => {
    APP_STATE.l3ShowSolution = false;
    APP_STATE.l3Assignments = {};
    renderLayer3();
  });

  // View 2: Photo Upload & Pin Spot-Test Controls
  populateSpotEntitySelect();
  document.getElementById('spot-use-schematic-btn').addEventListener('click', loadSchematicPracticeBoard);
  document.getElementById('spot-empty-load-schematic').addEventListener('click', loadSchematicPracticeBoard);

  document.getElementById('spot-image-upload').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgEl = document.getElementById('spot-user-image');
      imgEl.src = ev.target.result;
      imgEl.classList.remove('hidden');
      document.getElementById('spot-empty-placeholder').classList.add('hidden');
      document.getElementById('spot-schematic-svg').classList.add('hidden');
      APP_STATE.spotCanvasType = 'user_image';
      APP_STATE.spotPins = [];
      APP_STATE.spotSelectedPinId = null;
      renderSpotView();
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('spot-canvas-wrapper').addEventListener('click', (e) => {
    if (APP_STATE.spotMode !== 'edit' || APP_STATE.spotCanvasType === 'empty') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = Math.max(3, Math.min(97, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(3, Math.min(97, ((e.clientY - rect.top) / rect.height) * 100));
    const newId = `pin_${Date.now()}`;
    const nextNum = APP_STATE.spotPins.length + 1;
    APP_STATE.spotPins.push({
      id: newId,
      xPercent,
      yPercent,
      nameEn: `Structure #${nextNum}`,
      nameZh: `待命名構造 #${nextNum}`,
      hint: '點擊右側儲存按鈕更新此跑台圖釘名稱與提示'
    });
    APP_STATE.spotSelectedPinId = newId;
    syncPinFormWithSelected();
    renderSpotView();
  });

  document.getElementById('spot-pin-entity-select').addEventListener('change', (e) => {
    const ent = APP_STATE.entities.find(item => item.id === e.target.value);
    if (ent) {
      document.getElementById('spot-pin-custom-en').value = ent.nameEn;
      document.getElementById('spot-pin-custom-zh').value = ent.nameZh;
      document.getElementById('spot-pin-hint').value = ent.description;
    }
  });

  document.getElementById('spot-save-pin-btn').addEventListener('click', () => {
    const pin = APP_STATE.spotPins.find(p => p.id === APP_STATE.spotSelectedPinId);
    if (!pin) return;
    pin.nameEn = document.getElementById('spot-pin-custom-en').value.trim() || pin.nameEn;
    pin.nameZh = document.getElementById('spot-pin-custom-zh').value.trim() || pin.nameZh;
    pin.hint = document.getElementById('spot-pin-hint').value.trim();
    renderSpotView();
    updateSchemaInspector();
  });

  document.getElementById('spot-clear-pins-btn').addEventListener('click', () => {
    APP_STATE.spotPins = [];
    APP_STATE.spotSelectedPinId = null;
    renderSpotView();
  });

  document.getElementById('spot-mode-edit-btn').addEventListener('click', () => {
    APP_STATE.spotMode = 'edit';
    renderSpotView();
  });

  const enterSpotQuiz = () => {
    if (APP_STATE.spotCanvasType === 'empty') loadSchematicPracticeBoard();
    APP_STATE.spotMode = 'quiz';
    APP_STATE.spotQuizIndex = 0;
    startSpotStationTimer();
    renderSpotView();
  };
  document.getElementById('spot-mode-quiz-btn').addEventListener('click', enterSpotQuiz);
  document.getElementById('spot-start-quiz-cta').addEventListener('click', enterSpotQuiz);

  document.getElementById('spot-quiz-check-btn').addEventListener('click', checkSpotQuizAnswer);
  document.getElementById('spot-quiz-next-btn').addEventListener('click', () => {
    APP_STATE.spotQuizIndex += 1;
    document.getElementById('spot-quiz-input').value = '';
    document.getElementById('spot-quiz-feedback').className =
      'p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-600';
    document.getElementById('spot-quiz-feedback').textContent = '請觀察新目標圖釘位置並作答。';
    startSpotStationTimer();
    renderSpotView();
  });

  // View 3: AI Agent + Quizlet + Notion Controls
  loadSavedAIConfig();
  document.getElementById('ai-toggle-config-btn').addEventListener('click', () => {
    document.getElementById('ai-config-body').classList.toggle('hidden');
  });
  document.getElementById('ai-provider-select').addEventListener('change', (e) => {
    const val = e.target.value;
    const modInput = document.getElementById('ai-model-input');
    if (val === 'gemini_direct') modInput.value = 'gemini-2.5-flash';
    if (val === 'custom_backend') modInput.value = 'http://localhost:8000/api/analyze-anatomy';
    if (val === 'openai_compat') modInput.value = 'gpt-4o-mini';
    saveAIConfigFromUI();
  });
  document.getElementById('ai-toggle-key-vis').addEventListener('click', () => {
    const kInput = document.getElementById('ai-api-key-input');
    kInput.type = kInput.type === 'password' ? 'text' : 'password';
  });
  document.getElementById('ai-save-config-btn').addEventListener('click', saveAIConfigFromUI);
  document.getElementById('ai-clear-config-btn').addEventListener('click', () => {
    document.getElementById('ai-api-key-input').value = '';
    saveAIConfigFromUI();
  });
  document.getElementById('ai-show-log-btn').addEventListener('click', () => {
    document.getElementById('ai-debug-payload-box').classList.toggle('hidden');
  });
  document.querySelectorAll('.ai-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('ai-term-input').value = chip.getAttribute('data-preset');
      runAIAgentAnalysis();
    });
  });
  document.getElementById('ai-analyze-btn').addEventListener('click', runAIAgentAnalysis);
  document.getElementById('kb-manual-new-btn').addEventListener('click', () => {
    document.getElementById('ai-field-en').value = '';
    document.getElementById('ai-field-zh').value = '';
    document.getElementById('ai-field-morphemes').value = '';
    document.getElementById('ai-field-pathway').value = '';
    document.getElementById('ai-field-region').value = '';
    document.getElementById('ai-field-callout').value = '';
    document.getElementById('ai-field-clinical').value = '';
    document.getElementById('ai-review-drawer').classList.remove('hidden');
    renderAIVisualPreview();
  });
  document.getElementById('ai-close-drawer-btn').addEventListener('click', () => {
    document.getElementById('ai-review-drawer').classList.add('hidden');
  });
  document.getElementById('ai-save-to-kb-btn').addEventListener('click', saveAIAgentTermToKB);

  const toggleFlip = () => {
    APP_STATE.kbCardFlipped = !APP_STATE.kbCardFlipped;
    renderKBView();
  };
  document.getElementById('kb-flashcard-box').addEventListener('click', toggleFlip);
  document.getElementById('kb-flip-card-btn').addEventListener('click', toggleFlip);
  document.getElementById('kb-prev-card').addEventListener('click', () => {
    APP_STATE.kbSelectedIndex -= 1;
    APP_STATE.kbCardFlipped = false;
    renderKBView();
  });
  document.getElementById('kb-next-card').addEventListener('click', () => {
    APP_STATE.kbSelectedIndex += 1;
    APP_STATE.kbCardFlipped = false;
    renderKBView();
  });

  document.getElementById('notion-add-block-btn').addEventListener('click', () => {
    const textInput = document.getElementById('notion-new-block-text');
    const bType = document.getElementById('notion-new-block-type').value;
    const val = textInput.value.trim();
    if (!val) return;
    const current = APP_STATE.entities[APP_STATE.kbSelectedIndex];
    current.blocks.push({ type: bType, text: val });
    textInput.value = '';
    renderKBView();
    updateSchemaInspector();
  });

  document.getElementById('notion-block-image-input').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const current = APP_STATE.entities[APP_STATE.kbSelectedIndex];
      current.blocks.push({ type: 'image', dataUrl: ev.target.result });
      renderKBView();
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('schema-copy-json-btn').addEventListener('click', () => {
    const jsonText = document.getElementById('schema-json-viewer').textContent;
    const ta = document.createElement('textarea');
    ta.value = jsonText;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      const toast = document.getElementById('schema-copy-toast');
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    } catch (err) {}
    document.body.removeChild(ta);
  });

  ['ai-field-en', 'ai-field-zh', 'ai-field-cat', 'ai-field-morphemes', 'ai-field-pathway', 'ai-field-region', 'ai-field-callout', 'ai-field-clinical'].forEach(fId => {
    const el = document.getElementById(fId);
    if (el) {
      el.addEventListener('input', renderAIVisualPreview);
      el.addEventListener('change', renderAIVisualPreview);
    }
  });

  document.getElementById('ai-term-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runAIAgentAnalysis();
    }
  });

  initLayer1Question(0);
  runAIAgentAnalysis();
  renderLayer2();
  renderLayer3();
  renderKBView();
  updateSchemaInspector();
});

