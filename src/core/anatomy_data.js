/**
 * [01_core_shared] src/core/anatomy_data.js
 * 核心解剖學資料庫與全域狀態 (APP_STATE)
 * 開源貢獻者只需在此檔案新增或修改構造資料，全站闖關與閃卡即自動同步更新。
 */

const INITIAL_ENTITIES = [
      // ==================== 一、上肢動脈 (Upper Limb Arteries) ====================
      {
        id: 'axillary_a',
        nameEn: 'Axillary a.',
        nameZh: '腋動脈',
        category: 'Artery',
        description: '鎖骨下動脈跨過第一肋骨外緣後的延續，以胸小肌 (Pectoralis minor m.) 為界分為三段（分別有 1、2、3 條分支），過大圓肌下緣改名肱動脈。',
        morphemes: [
          { part: 'Axill-', pos: 'adj.', meaning: '腋窩的 (Axilla)' },
          { part: '-ary', pos: 'adj.', meaning: '屬於…的' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Brachi-', pos: 'adj.', meaning: '上臂的' },
          { part: 'Sub-', pos: 'prefix', meaning: '在…下方' },
          { part: 'v.', pos: 'n.', meaning: '靜脈' }
        ],
        pathwaySummary: 'Subclavian a. -(1st rib)-→ Axillary a. (1/2/3段) -(Teres major inf. border)-→ Brachial a.',
        regionGroup: '腋窩血管主幹 (Axillary neurovascular bundle)',
        blocks: [
          { type: 'callout', text: '跑台分段重點：以 Pectoralis minor m. 分三段 — 第1段(內側)：Superior thoracic a.；第2段(後方)：Thoracoacromial a.、Lateral thoracic a.；第3段(外側)：Subscapular a.、Ant. & Post. circumflex humeral a.。' },
          { type: 'clinical', text: '歷屆考古提醒 (M64、M65)：注意伴行的 Axillary v. 位於腋窩內容物最表層（在動脈前內側）。' }
        ]
      },
      {
        id: 'superior_thoracic_a',
        nameEn: 'Superior thoracic a.',
        nameZh: '上胸動脈',
        category: 'Artery',
        description: '腋動脈第一段（胸小肌內側）唯一分支，進入並支配第一、二肋間隙。',
        morphemes: [
          { part: 'Superior', pos: 'adj.', meaning: '上方的 (Upper)' },
          { part: 'thoracic', pos: 'adj.', meaning: '胸廓的 (Thorax)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Lateral', pos: 'adj.', meaning: '外側的' },
          { part: 'pectoral', pos: 'adj.', meaning: '胸肌的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Axillary a. (1st part) → Superior thoracic a. → 1st intercostal space',
        regionGroup: '腋動脈第一段分支 (Medial to pectoralis minor)',
        blocks: [
          { type: 'callout', text: '跑台命名鐵律：血管多用 thoracic (如 Superior / Lateral / Internal thoracic a.)，神經多用 pectoral (Medial / Lateral pectoral n.)，唯獨長胸神經為 Long thoracic n.，混用不予計分！' }
        ]
      },
      {
        id: 'thoracoacromial_a',
        nameEn: 'Thoracoacromial a.',
        nameZh: '胸肩峰動脈',
        category: 'Artery',
        description: '腋動脈第二段（胸小肌覆蓋處）分支，穿出鎖胸筋膜後分為四個分支：Pectoral、Acromial、Clavicular、Deltoid branches。',
        morphemes: [
          { part: 'Thoraco-', pos: 'adj.', meaning: '胸的 (Thorax)' },
          { part: 'acromial', pos: 'adj.', meaning: '肩峰的 (Acromion)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'dorsal', pos: 'adj.', meaning: '背側的' },
          { part: 'scapular', pos: 'adj.', meaning: '肩胛的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Axillary a. (2nd part) → Thoracoacromial a. → Pectoral / Acromial / Clavicular / Deltoid br.',
        regionGroup: '腋動脈第二段與胸鎖三角 (Clavipectoral triangle)',
        blocks: [
          { type: 'callout', text: '跑台四大分支判讀：Pectoral br. 往胸大/小肌（常被掀開）；Acromial br. 往肩峰前外側；Clavicular br. 鑽向鎖骨下與胸鎖關節；Deltoid br. 常伴行 Cephalic v. 走在胸大肌與三角肌溝。' }
        ]
      },
      {
        id: 'lateral_thoracic_a',
        nameEn: 'Lateral thoracic a.',
        nameZh: '外胸動脈',
        category: 'Artery',
        description: '腋動脈第二段分支，沿胸小肌下緣走向外側胸壁（前鋸肌表面），與長胸神經 (Long thoracic n.) 走向一致，女性發出 Mammary br.。',
        morphemes: [
          { part: 'Lateral', pos: 'adj.', meaning: '外側的 (Side)' },
          { part: 'thoracic', pos: 'adj.', meaning: '胸壁的 (Thorax)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Medial', pos: 'adj.', meaning: '內側的' },
          { part: 'pectoral', pos: 'adj.', meaning: '胸肌的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Axillary a. (2nd part, 或變異自 Thoracodorsal a.) → Lateral thoracic a. → Serratus anterior m. & Mammary br.',
        regionGroup: '腋動脈第二段與外側胸壁 (Medial wall of axilla)',
        blocks: [
          { type: 'callout', text: '跑台變異提醒：Lateral thoracic a. 與 Long thoracic n. 皆支配 Serratus anterior m.（走向平行但未必緊貼），常變異改由 Thoracodorsal a. 發出！' }
        ]
      },
      {
        id: 'subscapular_a',
        nameEn: 'Subscapular a.',
        nameZh: '肩胛下動脈',
        category: 'Artery',
        description: '腋動脈第三段最大的分支，短幹隨即分為旋肩胛動脈 (Circumflex scapular a.) 與胸背動脈 (Thoracodorsal a.)。',
        morphemes: [
          { part: 'Sub-', pos: 'prefix', meaning: '在…下方 (Under)' },
          { part: 'scapular', pos: 'adj.', meaning: '肩胛骨的 (Scapula)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Supra-', pos: 'prefix', meaning: '在…上方' },
          { part: 'humeral', pos: 'adj.', meaning: '肱骨的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Axillary a. (3rd part) → Subscapular a. → Circumflex scapular a. + Thoracodorsal a.',
        regionGroup: '腋動脈第三段與肩胛下區 (Posterior wall of axilla)',
        blocks: [
          { type: 'callout', text: '跑台追源頭技巧：看到進入三邊孔 (Triangular space) 的 Circumflex scapular a. 與走向闊背肌的 Thoracodorsal a.，往近端追匯合處即為 Subscapular a.！' }
        ]
      },
      {
        id: 'circumflex_scapular_a',
        nameEn: 'Circumflex scapular a.',
        nameZh: '旋肩胛動脈',
        category: 'Artery',
        description: '肩胛下動脈的分支之一，由前往後穿過三邊孔 (Triangular space) 繞向肩胛骨背側棘下窩參與肩胛吻合網。',
        morphemes: [
          { part: 'Circumflex', pos: 'adj.', meaning: '迴旋環繞的 (Curving around)' },
          { part: 'scapular', pos: 'adj.', meaning: '肩胛骨的 (Scapula)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'humeral', pos: 'adj.', meaning: '肱骨的' },
          { part: 'dorsal', pos: 'adj.', meaning: '背側的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Subscapular a. → Circumflex scapular a. -(穿過 Triangular space)-→ Infraspinous fossa',
        regionGroup: '三邊孔穿過構造 (Triangular space)',
        blocks: [
          { type: 'callout', text: '跑台間隙必考 (M65、M66)：穿過 Triangular space（上界：肩胛下肌/小圓肌、下界：大圓肌、外界：肱三頭肌長頭）的唯一重要血管！' }
        ]
      },
      {
        id: 'thoracodorsal_a',
        nameEn: 'Thoracodorsal a.',
        nameZh: '胸背動脈',
        category: 'Artery',
        description: '肩胛下動脈的延續分支，與胸背神經 (Thoracodorsal n.) 伴行沿腋窩後壁下行，供應闊背肌 (Latissimus dorsi m.)。',
        morphemes: [
          { part: 'Thoraco-', pos: 'adj.', meaning: '胸廓的 (Thorax)' },
          { part: 'dorsal', pos: 'adj.', meaning: '背側的 (Dorsum)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'acromial', pos: 'adj.', meaning: '肩峰的' },
          { part: 'scapular', pos: 'adj.', meaning: '肩胛的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Axillary a. (3rd part) → Subscapular a. → Thoracodorsal a. → Latissimus dorsi m.',
        regionGroup: '腋窩後壁與闊背肌 (Posterior axillary wall)',
        blocks: [
          { type: 'callout', text: '跑台伴行標記：與 Thoracodorsal n. 緊密伴行進入闊背肌，無論從腋窩正面或背部翻開闊背肌皆可出題！' }
        ]
      },
      {
        id: 'posterior_circumflex_humeral_a',
        nameEn: 'Posterior circumflex humeral a.',
        nameZh: '後旋肱動脈',
        category: 'Artery',
        description: '腋動脈第三段分支（較前旋肱動脈粗大），與腋神經 (Axillary n.) 伴行穿過四邊孔 (Quadrangular space) 繞肱骨外科頸後方。',
        morphemes: [
          { part: 'Posterior', pos: 'adj.', meaning: '後方的 (Behind)' },
          { part: 'circumflex', pos: 'adj.', meaning: '迴旋的 (Bending around)' },
          { part: 'humeral', pos: 'adj.', meaning: '肱骨的 (Humerus)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Anterior', pos: 'adj.', meaning: '前方的' },
          { part: 'scapular', pos: 'adj.', meaning: '肩胛的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Axillary a. (3rd part) → Posterior circumflex humeral a. -(Quadrangular space, 伴行 Axillary n.)-→ Deltoid & surgical neck',
        regionGroup: '四邊孔穿過構造 (Quadrangular space)',
        blocks: [
          { type: 'callout', text: '跑台間隙對照：Anterior circumflex humeral a. 較細、無神經伴行且不進四邊孔；Posterior circumflex humeral a. 較粗，與 Axillary n. 一起穿過四邊孔！' }
        ]
      },
      {
        id: 'brachial_a',
        nameEn: 'Brachial a.',
        nameZh: '肱動脈',
        category: 'Artery',
        description: '腋動脈跨過大圓肌下緣後的延續，在上臂內側與正中神經 (Median n.) 伴行，發出肱深動脈與上、下尺側副動脈，至肘窩橈骨頸處分為橈動脈與尺動脈。',
        morphemes: [
          { part: 'Brachi-', pos: 'adj.', meaning: '上臂的 (Arm / Brachium)' },
          { part: '-al', pos: 'adj.', meaning: '屬於…的' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Axill-', pos: 'adj.', meaning: '腋窩的' },
          { part: 'Radi-', pos: 'adj.', meaning: '橈側的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Axillary a. -(Teres major inf. border)-→ Brachial a. -(Cubital fossa)-→ Radial a. + Ulnar a.',
        regionGroup: '上臂前內側神經血管束 (Anterior arm)',
        blocks: [
          { type: 'callout', text: '跑台重要分支順序（由近端至遠端）：1. Profunda brachii a. (伴行 Radial n.) → 2. Superior ulnar collateral a. (伴行 Ulnar n.) → 3. Inferior ulnar collateral a. (近肘窩內側發出)。' }
        ]
      },
      {
        id: 'profunda_brachii_a',
        nameEn: 'Profunda brachii a.',
        nameZh: '肱深動脈 (Deep brachial a.)',
        category: 'Artery',
        description: '肱動脈近端最大分支，與橈神經 (Radial n.) 伴行跨過闊背肌肌腱進入三邊間隙 (Triangular interval)，在肱三頭肌長頭與內側頭間分為橈側副動脈與中副動脈。',
        morphemes: [
          { part: 'Profunda', pos: 'adj.', meaning: '深層的 (Deep)' },
          { part: 'brachii', pos: 'adj.', meaning: '上臂的 (Of the arm)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Superficialis', pos: 'adj.', meaning: '淺層的' },
          { part: 'collateral', pos: 'adj.', meaning: '側副的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Brachial a. → Profunda brachii a. -(Triangular interval)-→ Radial collateral a. + Middle collateral a. (M65)',
        regionGroup: '三邊間隙與肱骨橈神經溝 (Triangular interval & Radial groove)',
        blocks: [
          { type: 'callout', text: '跑台記憶口訣「深肱求橈」：Deep brachial (Profunda brachii) a. 與 Radial n. 結伴穿入 Triangular interval（上界大圓肌、內界三頭肌長頭、外界肱骨）！' }
        ]
      },
      {
        id: 'radial_a',
        nameEn: 'Radial a.',
        nameZh: '橈動脈',
        category: 'Artery',
        description: '肱動脈在肘窩的外側終末支，走在肱橈肌 (Brachioradialis m.) 下方並與橈神經淺支伴行，遠端穿過解剖鼻煙壺進入手掌形成掌深弓主力。',
        morphemes: [
          { part: 'Radi-', pos: 'adj.', meaning: '橈骨/外側的 (Radius)' },
          { part: '-al', pos: 'adj.', meaning: '屬於…的' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Uln-', pos: 'adj.', meaning: '尺骨的' },
          { part: 'Brachi-', pos: 'adj.', meaning: '上臂的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Brachial a. → Radial a. (發出 Radial recurrent a.) → Snuff box → Deep palmar arch',
        regionGroup: '前臂橈側與解剖鼻煙壺 (Lateral forearm & Snuff box)',
        blocks: [
          { type: 'callout', text: '跑台方位判讀：手掌可翻轉，務必「看大拇指側即為橈側 (Radial)」，翻開 Brachioradialis m. 即可見 Radial a. 與 Superficial br. of radial n. 伴行！' }
        ]
      },
      {
        id: 'ulnar_a',
        nameEn: 'Ulnar a.',
        nameZh: '尺動脈',
        category: 'Artery',
        description: '肱動脈在肘窩較粗的內側終末支 (M65)，發出前/後尺側返動脈與骨間總動脈 (Common interosseous a.)，在前臂與尺神經伴行，進入手掌形成掌淺弓主力。',
        morphemes: [
          { part: 'Uln-', pos: 'adj.', meaning: '尺骨/內側的 (Ulna)' },
          { part: '-ar', pos: 'adj.', meaning: '屬於…的' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Radi-', pos: 'adj.', meaning: '橈骨的' },
          { part: 'Inter-', pos: 'prefix', meaning: '在…之間' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Brachial a. → Ulnar a. (發出 Common interosseous a.) → Superficial palmar arch',
        regionGroup: '前臂尺側與手掌淺弓 (Medial forearm & Palm)',
        blocks: [
          { type: 'callout', text: '跑台分支重點：Common interosseous a. 極短，立即分為 Anterior interosseous a. (M66 考點，與 AIN 伴行貼骨間膜前方) 與 Posterior interosseous a. (伴行 PIN)。' }
        ]
      },
      {
        id: 'anterior_interosseous_a',
        nameEn: 'Anterior interosseous a.',
        nameZh: '前骨間動脈',
        category: 'Artery',
        description: '源自尺動脈發出的骨間總動脈 (Common interosseous a.)，與前骨間神經 (AIN) 伴行走在屈指深肌與屈拇長肌之間的骨間膜前表面 (M66 考點)。',
        morphemes: [
          { part: 'Anterior', pos: 'adj.', meaning: '前方的 (Front)' },
          { part: 'inter-', pos: 'prefix', meaning: '在…之間 (Between)' },
          { part: 'osseous', pos: 'adj.', meaning: '骨頭的 (Bone / Os)' },
          { part: 'a.', pos: 'n.', meaning: '動脈 (Artery)' }
        ],
        distractors: [
          { part: 'Posterior', pos: 'adj.', meaning: '後方的' },
          { part: 'recurrent', pos: 'adj.', meaning: '迴返的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Ulnar a. → Common interosseous a. → Anterior interosseous a. (伴行 AIN)',
        regionGroup: '前臂前側深層骨間膜 (Deep anterior forearm)',
        blocks: [
          { type: 'callout', text: '跑台辨識技巧 (M66)：撥開前臂深層的 FDP 與 FPL，緊貼在兩根骨頭中間骨間膜上的血管與神經即為 Ant. interosseous a. & n.！' }
        ]
      },
      {
        id: 'superficial_palmar_arch',
        nameEn: 'Superficial palmar arch',
        nameZh: '掌淺弓',
        category: 'Artery',
        description: '主要由尺動脈 (Ulnar a.) 主幹與橈動脈淺掌支 (Superficial palmar br. of radial a.) 在掌腱膜深面吻合形成，向遠端發出指掌側總動脈。',
        morphemes: [
          { part: 'Superficial', pos: 'adj.', meaning: '淺層的 (Surface)' },
          { part: 'palmar', pos: 'adj.', meaning: '手掌的 (Palm)' },
          { part: 'arch', pos: 'n.', meaning: '動脈弓 (Arch)' }
        ],
        distractors: [
          { part: 'Deep', pos: 'adj.', meaning: '深層的' },
          { part: 'digital', pos: 'adj.', meaning: '手指的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Ulnar a. + Superficial palmar br. of radial a. → Superficial palmar arch → Common palmar digital a. → Proper palmar digital a.',
        regionGroup: '手掌部血管網 (Palmar arterial arches)',
        blocks: [
          { type: 'callout', text: '跑台拼字計分警告：往手指發出的分支依序為 Common palmar digital a. (掌指總動脈，指蹼前) 與 Proper palmar digital a. (固有掌指動脈，分叉進入手指兩側)，考試拼字須完整才給分！' }
        ]
      },

      // ==================== 二、上肢靜脈 (Upper Limb Veins) ====================
      {
        id: 'cephalic_v',
        nameEn: 'Cephalic v.',
        nameZh: '頭靜脈',
        category: 'Vein',
        description: '上肢外側（大拇指側）表淺靜脈，沿肱二頭肌外側上行，走在三角肌胸大肌溝（伴行胸肩峰動脈三角肌支），於胸鎖三角穿鎖胸筋膜注入腋靜脈。',
        morphemes: [
          { part: 'Cephal-', pos: 'adj.', meaning: '頭側/外側上行的 (Head)' },
          { part: '-ic', pos: 'adj.', meaning: '屬於…的' },
          { part: 'v.', pos: 'n.', meaning: '靜脈 (Vein)' }
        ],
        distractors: [
          { part: 'Basil-', pos: 'adj.', meaning: '貴要/內側基底的' },
          { part: 'cubital', pos: 'adj.', meaning: '肘部的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Dorsal venous network (Lateral/Thumb side) → Cephalic v. -(Deltopectoral groove / Clavipectoral triangle)-→ Axillary v.',
        regionGroup: '上肢表淺靜脈與胸鎖三角 (Superficial veins)',
        blocks: [
          { type: 'callout', text: '跑台方位口訣：「外頭內貴」— 外側（橈側/大拇指側）為頭靜脈 (Cephalic v.)，內側（尺側/小指側）為貴要靜脈 (Basilic v.)！' }
        ]
      },
      {
        id: 'basilic_v',
        nameEn: 'Basilic v.',
        nameZh: '貴要靜脈',
        category: 'Vein',
        description: '上肢內側（尺側）表淺靜脈，於上臂中段穿入深筋膜，跨過大圓肌下緣後與肱靜脈匯合改名為腋靜脈 (Axillary v.)。',
        morphemes: [
          { part: 'Basil-', pos: 'adj.', meaning: '重要的/內側主幹的 (Royal/Base)' },
          { part: '-ic', pos: 'adj.', meaning: '屬於…的' },
          { part: 'v.', pos: 'n.', meaning: '靜脈 (Vein)' }
        ],
        distractors: [
          { part: 'Cephal-', pos: 'adj.', meaning: '頭側/外側的' },
          { part: 'Median', pos: 'adj.', meaning: '正中的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Dorsal venous network (Medial/Ulnar side) → Basilic v. -(Inferior border of Teres major)-→ Axillary v.',
        regionGroup: '上肢內側靜脈回流 (Superficial & deep veins)',
        blocks: [
          { type: 'callout', text: '跑台延伸考點：肘窩處橫向連接 Cephalic v. 與 Basilic v. 的是肘正中靜脈 Median cubital v.（注意拼字是 Median 而非 Medial！）。' }
        ]
      },

      // ==================== 三、上肢神經 (Brachial Plexus & Upper Limb Nerves) ====================
      {
        id: 'dorsal_scapular_n',
        nameEn: 'Dorsal scapular n.',
        nameZh: '肩胛背神經',
        category: 'Nerve',
        description: '源自臂神經叢 C5 神經根 (Root)，穿出中斜角肌，與肩胛背動脈伴行沿肩胛骨內側緣下行，支配提肩胛肌與大、小菱形肌 (M64、M66 考點)。',
        morphemes: [
          { part: 'Dorsal', pos: 'adj.', meaning: '背側的 (Dorsum)' },
          { part: 'scapular', pos: 'adj.', meaning: '肩胛骨的 (Scapula)' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Supra-', pos: 'prefix', meaning: '在…上方' },
          { part: 'Sub-', pos: 'prefix', meaning: '在…下方' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'C5 Root (穿出 Middle scalene m.) → Dorsal scapular n. → Levator scapulae m. & Rhomboid major/minor m.',
        regionGroup: '臂神經叢根部與肩胛內側緣 (Root branches & Scapula)',
        blocks: [
          { type: 'callout', text: '跑台背部與肩胛必考 (M64、M66)：翻開 Rhomboid major/minor m. 深面，沿著肩胛骨內側緣與 Dorsal scapular a. 伴行的神經即為此條！' }
        ]
      },
      {
        id: 'long_thoracic_n',
        nameEn: 'Long thoracic n.',
        nameZh: '長胸神經',
        category: 'Nerve',
        description: '由 C5–C7 神經根直接發出，緊貼外側胸壁（前鋸肌表面）垂直下行，伴行外胸動脈，支配前鋸肌 (Serratus anterior m.)。',
        morphemes: [
          { part: 'Long', pos: 'adj.', meaning: '長行的 (Longus)' },
          { part: 'thoracic', pos: 'adj.', meaning: '胸壁的 (Thorax)' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Lateral', pos: 'adj.', meaning: '外側的' },
          { part: 'pectoral', pos: 'adj.', meaning: '胸肌的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'C5, C6, C7 Roots → Long thoracic n. → Serratus anterior m.',
        regionGroup: '臂神經叢根部與腋窩內側壁 (Medial wall of axilla)',
        blocks: [
          { type: 'callout', text: '跑台辨識與臨床：唯一一條叫 thoracic 而非 pectoral 的胸壁運動神經！貼在 Serratus anterior m. 表面，受損會造成翼狀肩胛 (Winged scapula)。' }
        ]
      },
      {
        id: 'suprascapular_n',
        nameEn: 'Suprascapular n.',
        nameZh: '肩胛上神經',
        category: 'Nerve',
        description: '源自臂神經叢上幹 (Superior trunk, C5–C6)，穿過肩胛上橫韌帶下方之肩胛上切跡，支配棘上肌與棘下肌 (M64 考點)。',
        morphemes: [
          { part: 'Supra-', pos: 'prefix', meaning: '在…上方 (Above)' },
          { part: 'scapular', pos: 'adj.', meaning: '肩胛骨的 (Scapula)' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Sub-', pos: 'prefix', meaning: '在…下方' },
          { part: 'dorsal', pos: 'adj.', meaning: '背側的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Superior trunk (C5–C6) → Suprascapular n. -(Suprascapular foramen)-→ Supraspinatus & Infraspinatus m.',
        regionGroup: '臂神經叢上幹與肩胛背側 (Superior trunk & Scapula)',
        blocks: [
          { type: 'callout', text: '跑台韌帶上下關係 (M64、M66)：翻開 Supraspinatus m. 可見 Superior transverse scapular ligament — 動脈 (Suprascapular a.) 走韌帶上方，神經 (Suprascapular n.) 鑽韌帶下方切跡！' }
        ]
      },
      {
        id: 'intercostobrachial_n',
        nameEn: 'Intercostobrachial n.',
        nameZh: '肋間臂神經',
        category: 'Nerve',
        description: '第二肋間神經 (T2) 的外側皮支，穿出第二肋間橫跨腋窩底並與臂內側皮神經會合，支配上臂內側皮膚。',
        morphemes: [
          { part: 'Inter-', pos: 'prefix', meaning: '在…之間 (Between)' },
          { part: 'costo-', pos: 'adj.', meaning: '肋骨的 (Costa / Rib)' },
          { part: 'brachial', pos: 'adj.', meaning: '上臂的 (Brachium)' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Thoraco-', pos: 'adj.', meaning: '胸廓的' },
          { part: 'cutaneous', pos: 'adj.', meaning: '皮膚的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: '2nd Intercostal n. (T2) → Intercostobrachial n. (合流 Medial cutaneous n. of arm) → Medial skin of arm',
        regionGroup: '腋窩橫跨皮支 (Axillary fossa)',
        blocks: [
          { type: 'callout', text: '跑台追源頭秒殺點：從第 2 肋間胸壁直接穿出、橫越腋窩走向手臂內側皮膚，不源自臂神經叢！' }
        ]
      },
      {
        id: 'musculocutaneous_n',
        nameEn: 'Musculocutaneous n.',
        nameZh: '肌皮神經',
        category: 'Nerve',
        description: '臂神經叢外側索 (Lateral cord, C5–C7) 終末支，穿過喙肱肌 (Coracobrachialis m.)，走於肱二頭肌與肱肌之間，穿出後改名為前臂外側皮神經。',
        morphemes: [
          { part: 'Musculo-', pos: 'adj.', meaning: '肌肉的 (Muscle)' },
          { part: 'cutaneous', pos: 'adj.', meaning: '皮膚的 (Cutis / Skin)' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Brachio-', pos: 'adj.', meaning: '上臂的' },
          { part: 'radialis', pos: 'adj.', meaning: '橈側的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Lateral cord → Musculocutaneous n. -(穿過 Coracobrachialis m.)-→ Lateral cutaneous n. of forearm',
        regionGroup: '臂神經叢外索與上臂前側 (Lateral cord & Anterior arm)',
        blocks: [
          { type: 'callout', text: '跑台必考夾層關係：「三塊肌肉夾兩條神經」— 上臂下外側由前往後依序為 Biceps brachii m. → Musculocutaneous n. (或 Lat. cutaneous n. of forearm) → Brachialis m. → Radial n. → Brachioradialis m.！' }
        ]
      },
      {
        id: 'median_n',
        nameEn: 'Median n.',
        nameZh: '正中神經',
        category: 'Nerve',
        description: '由外側索與內側索在腋動脈前方會合形成（麥當勞 M 字中央），在上臂與肱動脈伴行且無分支，穿過旋前圓肌兩頭間進入前臂，走在屈指淺肌與深肌之間。',
        morphemes: [
          { part: 'Medi-', pos: 'adj.', meaning: '正中位置的 (Middle)' },
          { part: '-an', pos: 'adj.', meaning: '屬於…的' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Medial', pos: 'adj.', meaning: '內側的' },
          { part: 'Ulnar', pos: 'adj.', meaning: '尺側的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Lateral & Medial cords → Median n. -(穿過 Pronator teres 兩頭間)-→ 發出 AIN → 穿過 Carpal tunnel → Recurrent br. & Common/Proper palmar digital br.',
        regionGroup: '上臂血管伴行與前臂正中幹 (Anterior forearm & Carpal tunnel)',
        blocks: [
          { type: 'callout', text: '跑台手掌分支命名提醒：進入腕隧道後發出支配大魚際肌的 Recurrent br. of median n.；分往第 1–4 指的指神經須寫明 Common / Proper palmar digital br. of median n.！' }
        ]
      },
      {
        id: 'ulnar_n',
        nameEn: 'Ulnar n.',
        nameZh: '尺神經',
        category: 'Nerve',
        description: '臂神經叢內側索 (Medial cord, C8–T1) 最大終末支 (M66)，上臂無分支（伴行上尺側副動脈），繞過肱骨內上髁後方進入前臂，走在尺側屈腕肌與屈指深淺肌之間。',
        morphemes: [
          { part: 'Uln-', pos: 'adj.', meaning: '尺骨/內側的 (Ulna)' },
          { part: '-ar', pos: 'adj.', meaning: '屬於…的' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Radi-', pos: 'adj.', meaning: '橈骨的' },
          { part: 'Medi-', pos: 'adj.', meaning: '正中的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Medial cord → Ulnar n. -(Behind medial epicondyle / FCU 兩頭間)-→ 伴行 Ulnar a. → 第 4、5 指 Common/Proper palmar digital br. of ulnar n.',
        regionGroup: '臂神經叢內索與前臂尺側 (Medial cord & Medial forearm)',
        blocks: [
          { type: 'callout', text: '跑台易混淆鑑別：前臂內側表淺的 Medial cutaneous n. of forearm 走在 Ulnar n. 淺層上方，務必往遠端追它是否進入皮膚，避免誤認為 Ulnar n.！' }
        ]
      },
      {
        id: 'thoracodorsal_n',
        nameEn: 'Thoracodorsal n.',
        nameZh: '胸背神經 (Middle subscapular n.)',
        category: 'Nerve',
        description: '源自臂神經叢後索 (Posterior cord, C6–C8)，夾在上、下肩胛下神經之間，與胸背動脈伴行支配闊背肌 (M64 考點)。',
        morphemes: [
          { part: 'Thoraco-', pos: 'adj.', meaning: '胸廓的 (Thorax)' },
          { part: 'dorsal', pos: 'adj.', meaning: '背側的 (Dorsum)' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Inter-', pos: 'prefix', meaning: '在…之間' },
          { part: 'brachial', pos: 'adj.', meaning: '上臂的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Posterior cord → Thoracodorsal n. (伴行 Thoracodorsal a.) → Latissimus dorsi m.',
        regionGroup: '臂神經叢後索與腋窩後壁 (Posterior cord)',
        blocks: [
          { type: 'callout', text: '跑台後索三分支定位法 (M64、M66)：先找走到闊背肌的 Thoracodorsal n. (Middle subscapular n.)，其近端短短只進肩胛下肌的是 Upper subscapular n.，遠端分兩叉進肩胛下肌與大圓肌的是 Lower subscapular n.！' }
        ]
      },
      {
        id: 'axillary_n',
        nameEn: 'Axillary n.',
        nameZh: '腋神經',
        category: 'Nerve',
        description: '臂神經叢後索終末支 (C5–C6)，不跨過闊背肌肌腱，直接與後旋肱動脈伴行穿入四邊孔 (Quadrangular space)，支配三角肌與小圓肌。',
        morphemes: [
          { part: 'Axill-', pos: 'adj.', meaning: '腋窩的 (Axilla)' },
          { part: '-ary', pos: 'adj.', meaning: '屬於…的' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Radi-', pos: 'adj.', meaning: '橈側的' },
          { part: 'Subscapular', pos: 'adj.', meaning: '肩胛下的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Posterior cord → Axillary n. -(Quadrangular space, 伴行 Post. circumflex humeral a.)-→ Deltoid m. & Teres minor m.',
        regionGroup: '臂神經叢後索與四邊孔 (Quadrangular space)',
        blocks: [
          { type: 'callout', text: '跑台與 Radial n. 快速區分：Axillary n. 沒跨過闊背肌肌腱就鑽入四邊孔；Radial n. 會跨過闊背肌肌腱上方再鑽入下方的三邊間隙 (Triangular interval)！' }
        ]
      },
      {
        id: 'radial_n',
        nameEn: 'Radial n.',
        nameZh: '橈神經',
        category: 'Nerve',
        description: '臂神經叢後索最大終末支 (C5–T1, M66)，跨過闊背肌肌腱後與肱深動脈伴行進入三邊間隙，沿肱骨背側橈神經溝下行至肘窩外側分為淺支與深支。',
        morphemes: [
          { part: 'Radi-', pos: 'adj.', meaning: '橈側/放射狀的 (Radius)' },
          { part: '-al', pos: 'adj.', meaning: '屬於…的' },
          { part: 'n.', pos: 'n.', meaning: '神經 (Nerve)' }
        ],
        distractors: [
          { part: 'Uln-', pos: 'adj.', meaning: '尺側的' },
          { part: 'Axill-', pos: 'adj.', meaning: '腋窩的' },
          { part: 'a.', pos: 'n.', meaning: '動脈' }
        ],
        pathwaySummary: 'Posterior cord → Radial n. -(Triangular interval & Radial groove)-→ Superficial br. (M64/M65) + Deep br. (穿過 Supinator m. 改名 Post. interosseous n.)',
        regionGroup: '上臂與前臂後側伸肌群支配 (Posterior compartment)',
        blocks: [
          { type: 'callout', text: '跑台深淺支分界 (M64、M65)：以旋後肌 (Supinator m.) 為界 — 走在 Brachioradialis m. 下方伴行 Radial a. 到 Snuff box 的是 Superficial br.；穿進 Supinator m. 到前臂後側伴行同名動脈的是 Deep br. (Post. interosseous n.)！' }
        ]
      },

      // ==================== 四、上肢核心肌肉與間隙 (Upper Limb Muscles & Spaces) ====================
      {
        id: 'coracobrachialis_m',
        nameEn: 'Coracobrachialis m.',
        nameZh: '喙肱肌',
        category: 'Muscle',
        description: '起自肩胛骨喙突 (Coracoid process)，止於肱骨內側中段 1/3，肌腹有肌皮神經 (Musculocutaneous n.) 直接穿過。',
        morphemes: [
          { part: 'Coraco-', pos: 'adj.', meaning: '喙突的 (Coracoid)' },
          { part: 'brachialis', pos: 'adj.', meaning: '上臂/肱骨的 (Brachium)' },
          { part: 'm.', pos: 'n.', meaning: '肌肉 (Muscle)' }
        ],
        distractors: [
          { part: 'Brachio-', pos: 'adj.', meaning: '肱骨的' },
          { part: 'radialis', pos: 'adj.', meaning: '橈骨的' },
          { part: 'n.', pos: 'n.', meaning: '神經' }
        ],
        pathwaySummary: 'Coracoid process of scapula → Medial surface of mid-humerus (Musculocutaneous n. 穿過)',
        regionGroup: '上臂前側肌群 (Anterior compartment of arm)',
        blocks: [
          { type: 'callout', text: '跑台附著點與口訣：喙突 (Coracoid process) 附著三條肌肉 — Pectoralis minor m.、Short head of biceps brachii m.（內短外長）、Coracobrachialis m.（有 Musculocutaneous n. 穿過）！' }
        ]
      },
      {
        id: 'brachioradialis_m',
        nameEn: 'Brachioradialis m.',
        nameZh: '肱橈肌',
        category: 'Muscle',
        description: '前臂伸肌側淺層 6 條中最外側（第1條），自肘窩以上肱骨外上髁上嵴發出，肌腱止於橈骨莖突，下方覆蓋橈動脈與橈神經淺支。',
        morphemes: [
          { part: 'Brachio-', pos: 'adj.', meaning: '上臂/肱骨的 (Brachium)' },
          { part: 'radialis', pos: 'adj.', meaning: '橈骨的 (Radius)' },
          { part: 'm.', pos: 'n.', meaning: '肌肉 (Muscle)' }
        ],
        distractors: [
          { part: 'Extensor', pos: 'n.', meaning: '伸肌' },
          { part: 'carpi', pos: 'adj.', meaning: '腕部的' },
          { part: 'ulnaris', pos: 'adj.', meaning: '尺側的' }
        ],
        pathwaySummary: 'Lateral supracondylar ridge of humerus → Styloid process of radius',
        regionGroup: '前臂後側伸肌群淺層 6 (Superficial posterior forearm)',
        blocks: [
          { type: 'callout', text: '跑台前臂後側淺層 6 順序（由外而內）：1. Brachioradialis → 2. ECRL (到第2掌骨) → 3. ECRB (到第3掌骨, M66考肌腱) → 4. Extensor digitorum → 5. Extensor digiti minimi → 6. ECU (到第5掌骨)。' }
        ]
      },
      {
        id: 'pronator_teres_m',
        nameEn: 'Pronator teres m.',
        nameZh: '旋前圓肌',
        category: 'Muscle',
        description: '前臂屈肌側淺層最外側（第1條），分為肱骨頭 (Humeral head) 與尺骨頭 (Ulnar head, M64)，正中神經 (Median n.) 從兩頭之間穿過。',
        morphemes: [
          { part: 'Pronator', pos: 'n.', meaning: '使旋前者 (Pronate)' },
          { part: 'teres', pos: 'adj.', meaning: '圓柱狀的 (Round)' },
          { part: 'm.', pos: 'n.', meaning: '肌肉 (Muscle)' }
        ],
        distractors: [
          { part: 'quadratus', pos: 'adj.', meaning: '方形的' },
          { part: 'Supinator', pos: 'n.', meaning: '旋後肌' },
          { part: 'Flexor', pos: 'n.', meaning: '屈肌' }
        ],
        pathwaySummary: 'Medial epicondyle (Humeral head) & Coronoid process (Ulnar head) → Lateral mid-shaft of radius',
        regionGroup: '前臂前側屈肌群淺層 4 (Superficial anterior forearm)',
        blocks: [
          { type: 'callout', text: '跑台細節提醒 (M64)：若題目要求 Be specific，需標明是 Humeral head 或深層的 Ulnar head of pronator teres m.，兩頭之間夾著 Median n.！' }
        ]
      },
      {
        id: 'extensor_indicis_m',
        nameEn: 'Extensor indicis m.',
        nameZh: '伸食指肌',
        category: 'Muscle',
        description: '前臂後側深層 5 條之一 (M64、M65 考 tendon)，肌腱在近手腕處走在第二、三指伸指肌肌腱中間，再鑽到第二指伸指肌肌腱下方。',
        morphemes: [
          { part: 'Extensor', pos: 'n.', meaning: '伸肌 (Extend)' },
          { part: 'indicis', pos: 'adj.', meaning: '食指的 (Index finger)' },
          { part: 'm.', pos: 'n.', meaning: '肌肉 (Muscle)' }
        ],
        distractors: [
          { part: 'pollicis', pos: 'adj.', meaning: '大拇指的' },
          { part: 'digiti minimi', pos: 'adj.', meaning: '小指的' },
          { part: 'Flexor', pos: 'n.', meaning: '屈肌' }
        ],
        pathwaySummary: 'Posterior surface of distal ulna & interosseous membrane → Extensor expansion of 2nd digit (Index finger)',
        regionGroup: '前臂後側伸肌群深層 5 (Deep posterior forearm)',
        blocks: [
          { type: 'callout', text: '跑台前臂後側深層 5 順序：前 3 條圍成 Snuff box（APL 到第1掌骨底、EPB 到拇指近端指節、EPL 到拇指遠端指節），第 4 條為 Extensor indicis m. (M64/M65)，第 5 條為近肘窩外側被 Deep br. of radial n. 穿過的 Supinator m. (M64)！' }
        ]
      }
    ];

    /**
     * Layer 2 Data: Continuous Anatomical Pathway Trees (涵蓋 Notebook 上肢動脈、後索、外內索、靜脈)
     */
    const PATHWAY_TREES = {
      artery: {
        id: 'upper_limb_artery_tree',
        title: '上肢動脈與掌弓連續分段樹 (Axillary 1/2/3段 → Brachial → Radial/Ulnar → Palmar Arches)',
        nodes: [
          {
            id: 'node_subclavian',
            label: 'Subclavian a. (鎖骨下動脈)',
            landmarkToNext: '跨過第一肋骨外緣 (Lateral border of 1st rib) 改名為腋動脈',
            isBlank: false
          },
          {
            id: 'node_axillary',
            label: 'Axillary a. (腋動脈 · 以胸小肌分為 1/2/3 段)',
            landmarkToNext: '跨過大圓肌下緣 (Inferior border of Teres major m.) 改名為肱動脈',
            isBlank: true,
            branches: [
              { id: 'br_sup_thoracic', label: 'Superior thoracic a. (第1段：支配第一肋間)', isBlank: false },
              { id: 'br_thoracoacromial', label: 'Thoracoacromial a. (第2段：分 Pectoral / Acromial / Clavicular / Deltoid 4支)', isBlank: false },
              { id: 'br_lat_thoracic', label: 'Lateral thoracic a. (第2段：伴行 Long thoracic n.，發出 Mammary br.)', isBlank: false },
              { id: 'br_subscapular', label: 'Subscapular a. (第3段最大分支)', isBlank: true, subBranch: '→ 分出 Circumflex scapular a. (進三邊孔) 與 Thoracodorsal a. (伴同名n.)' },
              { id: 'br_post_humeral', label: 'Posterior circumflex humeral a. (第3段：伴行 Axillary n. 進四邊孔)', isBlank: false }
            ]
          },
          {
            id: 'node_brachial',
            label: 'Brachial a. (肱動脈 · 與 Median n. 伴行)',
            landmarkToNext: '行經肘窩 (Cubital fossa) 分叉為橈動脈與尺動脈（拇指側為 R、小指側為 U）',
            isBlank: true,
            branches: [
              { id: 'br_profunda', label: 'Profunda brachii a. (肱深動脈 · 伴行 Radial n. 進三邊間隙)', isBlank: true, subBranch: '→ 分出 Radial collateral a. 與 Middle collateral a. (M65)' },
              { id: 'br_sup_ulnar_coll', label: 'Superior & Inferior ulnar collateral a. (上/下尺側副動脈 · 往內側走)', isBlank: false }
            ]
          },
          {
            id: 'node_radial',
            label: 'Radial a. (橈動脈 · 走 Brachioradialis 下方進 Snuff box)',
            landmarkToNext: '進入手掌與尺動脈深支、淺支吻合形成雙重掌動脈弓，發出 Common → Proper palmar digital a.',
            isBlank: true,
            siblingLabel: 'Ulnar a. (尺動脈 M65 → 發出 Common interosseous a. → Ant. [M66] & Post. interosseous a.)'
          }
        ],
        options: [
          'Axillary a. (腋動脈 · 以胸小肌分為 1/2/3 段)',
          'Subscapular a. (第3段最大分支)',
          'Brachial a. (肱動脈 · 與 Median n. 伴行)',
          'Profunda brachii a. (肱深動脈 · 伴行 Radial n. 進三邊間隙)',
          'Radial a. (橈動脈 · 走 Brachioradialis 下方進 Snuff box)',
          'Vertebral a. (椎動脈 · 干擾項)'
        ]
      },
      nerve: {
        id: 'posterior_cord_nerve_tree',
        title: '臂神經叢：上端分支與後索 (Posterior Cord) 連續變化樹 (M64/M65/M66)',
        nodes: [
          {
            id: 'node_post_divisions',
            label: 'Roots (C5–T1, 前中斜角肌間) & Superior Trunk (C5+C6, M65)',
            landmarkToNext: '發出根部與上幹分支後，三幹之後股匯合成後索 (Posterior cord)',
            isBlank: false,
            branches: [
              { id: 'br_dorsal_scap', label: 'Dorsal scapular n. (C5 穿出中斜角肌 → 提肩胛肌、菱形肌, M64/M66)', isBlank: false },
              { id: 'br_long_thoracic', label: 'Long thoracic n. (C5–C7 → 貼前鋸肌表面)', isBlank: false },
              { id: 'br_suprascap', label: 'Suprascapular n. (源自上幹 → 走肩胛上橫韌帶下方進棘上/棘下窩, M64)', isBlank: true }
            ]
          },
          {
            id: 'node_post_cord',
            label: 'Posterior cord (臂神經叢後索 · M66)',
            landmarkToNext: '發出 3 條肩胛下分支後，延續為 Axillary n. 與 Radial n. 兩大終末支',
            isBlank: false,
            branches: [
              { id: 'br_upper_subscap', label: 'Upper subscapular n. (近端短支 → 支配 Subscapularis m.)', isBlank: false },
              { id: 'br_thoracodorsal', label: 'Thoracodorsal n. (Middle subscapular n. M64 → 伴同名a.支配闊背肌)', isBlank: true },
              { id: 'br_lower_subscap', label: 'Lower subscapular n. (M64/M66 → 分兩叉支配肩胛下肌與大圓肌)', isBlank: false }
            ]
          },
          {
            id: 'node_axillary_n',
            label: 'Axillary n. (腋神經 · 不跨過闊背肌肌腱)',
            landmarkToNext: '伴隨 Posterior circumflex humeral a. 穿入四邊孔 (Quadrangular space) 支配三角肌與小圓肌',
            isBlank: true
          },
          {
            id: 'node_radial_n',
            label: 'Radial n. (橈神經 M66 · 跨過闊背肌肌腱進三邊間隙)',
            landmarkToNext: '沿肱骨橈神經溝至上臂下外側（走 Brachialis 與 Brachioradialis 間），於旋後肌處分深淺支',
            isBlank: true,
            branches: [
              { id: 'br_rad_sup', label: 'Superficial br. of radial n. (M64/M65 · 伴行 Radial a. 走 Brachioradialis 下方至 Snuff box)', isBlank: false },
              { id: 'br_rad_deep', label: 'Deep br. of radial n. → 穿過 Supinator m. 後改名 Posterior interosseous n. (PIN)', isBlank: false }
            ]
          }
        ],
        options: [
          'Suprascapular n. (源自上幹 → 走肩胛上橫韌帶下方進棘上/棘下窩, M64)',
          'Thoracodorsal n. (Middle subscapular n. M64 → 伴同名a.支配闊背肌)',
          'Axillary n. (腋神經 · 不跨過闊背肌肌腱)',
          'Radial n. (橈神經 M66 · 跨過闊背肌肌腱進三邊間隙)',
          'Accessory n. (CN XI · 干擾項)'
        ]
      },
      nerve_ant: {
        id: 'anterior_cords_nerve_tree',
        title: '臂神經叢：外側索 (Lateral Cord) 與內側索 (Medial Cord) 麥當勞 M 字終末支樹',
        nodes: [
          {
            id: 'node_lat_cord',
            label: 'Lateral cord (外側索 · M65)',
            landmarkToNext: '發出胸前壁分支後，分為外索終末支與正中神經外側根',
            isBlank: false,
            branches: [
              { id: 'br_lat_pec', label: 'Lateral pectoral n. (胸小肌內側發出 → 支配 Pectoralis major m.)', isBlank: false },
              { id: 'br_mc_n', label: 'Musculocutaneous n. (肌皮神經 · 穿過 Coracobrachialis m.)', isBlank: true, subBranch: '→ 走 Biceps 與 Brachialis 間 → 穿出改名 Lat. cutaneous n. of forearm' }
            ]
          },
          {
            id: 'node_med_cord',
            label: 'Medial cord (內側索 · 發出 3 分支與 2 終末支)',
            landmarkToNext: '內側根與外側根於腋動脈前方會合成 Median n.；主幹延續為 Ulnar n.',
            isBlank: false,
            branches: [
              { id: 'br_med_pec', label: 'Medial pectoral n. (穿過 Pectoralis minor m. 至 Pectoralis major m.)', isBlank: false },
              { id: 'br_med_cut_arm', label: 'Medial cutaneous n. of arm (與 T2 Intercostobrachial n. 會合)', isBlank: false },
              { id: 'br_med_cut_forearm', label: 'Medial cutaneous n. of forearm (走在 Ulnar n. 淺層上方，勿誤認為尺神經)', isBlank: false }
            ]
          },
          {
            id: 'node_median_n',
            label: 'Median n. (正中神經 · 上臂與 Brachial a. 伴行無分支)',
            landmarkToNext: '穿過 Pronator teres m. 兩頭之間進入前臂（走 FDS 與 FDP 之間），穿過 Carpal tunnel 入掌',
            isBlank: true,
            branches: [
              { id: 'br_ain', label: 'Anterior interosseous n. (AIN · 伴同名a.走 FDP 與 FPL 間骨間膜)', isBlank: true },
              { id: 'br_rec_median', label: 'Recurrent br. (支配大魚際肌) & Common/Proper palmar digital br. of median n. (1–4指)', isBlank: false }
            ]
          },
          {
            id: 'node_ulnar_n',
            label: 'Ulnar n. (尺神經 M66 · 繞內上髁後方進前臂)',
            landmarkToNext: '在前臂與 Ulnar a. 伴行（走 FCU 與 FDP/FDS 間），入掌發出第 4–5 指 Common/Proper palmar digital br. of ulnar n.',
            isBlank: true
          }
        ],
        options: [
          'Musculocutaneous n. (肌皮神經 · 穿過 Coracobrachialis m.)',
          'Median n. (正中神經 · 上臂與 Brachial a. 伴行無分支)',
          'Anterior interosseous n. (AIN · 伴同名a.走 FDP 與 FPL 間骨間膜)',
          'Ulnar n. (尺神經 M66 · 繞內上髁後方進前臂)',
          'Posterior interosseous n. (後骨間神經 · 干擾項)'
        ]
      },
      vein: {
        id: 'upper_limb_vein_tree',
        title: '上肢靜脈回流樹 (Dorsal Venous Network → Cephalic / Basilic / Median Cubital → Axillary v.)',
        nodes: [
          {
            id: 'node_hand_vein',
            label: 'Dorsal venous network of hand (手背靜脈網起源 → 轉向腹面回流)',
            landmarkToNext: '分由橈側（外側/拇指側）與尺側（內側/小指側）兩條主要表淺靜脈上行',
            isBlank: false
          },
          {
            id: 'node_cephalic_v',
            label: 'Cephalic v. (頭靜脈 · 上臂外側表層)',
            landmarkToNext: '於肘窩藉由橫向靜脈與內側連結；上行進入胸鎖三角 (Deltopectoral / Clavipectoral triangle) 伴行 Thoracoacromial a. (Deltoid br.) 注入腋靜脈',
            isBlank: true,
            branches: [
              { id: 'br_median_cubital', label: 'Median cubital v. (肘正中靜脈 · 肘窩橫向連結頭靜脈與貴要靜脈，切勿拼成 Medial)', isBlank: true }
            ]
          },
          {
            id: 'node_basilic_v',
            label: 'Basilic v. (貴要靜脈 · 上臂內側)',
            landmarkToNext: '行至大圓肌下緣 (Inferior border of Teres major m.) 與成對肱靜脈匯合改名為腋靜脈',
            isBlank: true
          },
          {
            id: 'node_axillary_v',
            label: 'Axillary v. (腋靜脈 · M64/M65 考點，位於腋窩內容物最表層)',
            landmarkToNext: '跨過第一肋骨外緣延續為 Subclavian v.（走 Anterior scalene m. 前方）',
            isBlank: true
          }
        ],
        options: [
          'Cephalic v. (頭靜脈 · 上臂外側表層)',
          'Median cubital v. (肘正中靜脈 · 肘窩橫向連結頭靜脈與貴要靜脈，切勿拼成 Medial)',
          'Basilic v. (貴要靜脈 · 上臂內側)',
          'Axillary v. (腋靜脈 · M64/M65 考點，位於腋窩內容物最表層)',
          'Internal jugular v. (內頸靜脈 · 干擾項)'
        ]
      }
    };

    /**
     * Layer 3 Data: Multi-Region Muscle & Space Groupings from Notebook
     */
    const REGIONAL_GROUPS_DATA = {
      forearm_ant: {
        title: '前臂屈肌側 (前側)：4 + 1 + 3 分層挑戰',
        subtitle: '跑台口訣：pass-fail-pass-fail — fail — pass*3。淺層 4 條（除 ulnar head 外皆源自肱骨內上髁）、中層 1 條、深層 3 條。',
        buckets: {
          superficial: { title: '第一層：淺層 (Superficial · 4 條)', desc: '由外(橈)而內(尺)排列，源自 Medial epicondyle of humerus', max: 4 },
          intermediate: { title: '第二層：中間層 (Intermediate · 1 條)', desc: '肌腱在手指處開叉讓深肌肌腱穿過，正中神經貼其深面', max: 1 },
          deep: { title: '第三層：深層 (Deep · 3 條)', desc: '貼近尺骨、橈骨與骨間膜，上方的血管神經為 AIN / AIA 與 Median n.', max: 3 }
        },
        items: [
          { id: 'pt', nameEn: 'Pronator teres m.', nameZh: '旋前圓肌 (含 Humeral & Ulnar head [M64])', layer: 'superficial', nerve: 'Median n. 穿過兩頭之間', note: '淺層最外側(第1條)' },
          { id: 'fcr', nameEn: 'Flexor carpi radialis m.', nameZh: '橈側屈腕肌 (M65)', layer: 'superficial', nerve: 'Median n.', note: '淺層第2條，肌腱外側為 Radial a.' },
          { id: 'pl', nameEn: 'Palmaris longus m.', nameZh: '掌長肌', layer: 'superficial', nerve: 'Median n.', note: '淺層第3條，肌腱細長延伸為掌腱膜 (Palmar aponeurosis)' },
          { id: 'fcu', nameEn: 'Flexor carpi ulnaris m.', nameZh: '尺側屈腕肌', layer: 'superficial', nerve: 'Ulnar n. (尺神經伴 Ulnar a. 走其深面)', note: '淺層最內側(第4條)，止於豆狀骨' },
          { id: 'fds', nameEn: 'Flexor digitorum superficialis m.', nameZh: '屈指淺肌', layer: 'intermediate', nerve: 'Median n.', note: '中層唯一肌肉，常被剪開以觀察深層結構' },
          { id: 'fdp', nameEn: 'Flexor digitorum profundus m.', nameZh: '屈指深肌 (M66 考 tendon)', layer: 'deep', nerve: 'AIN (Median n.) & Ulnar n.', note: '深層靠尺側(內側)，上面有 Median n. 走過' },
          { id: 'fpl', nameEn: 'Flexor pollicis longus m.', nameZh: '屈拇長肌', layer: 'deep', nerve: 'Anterior interosseous n. (AIN)', note: '深層靠橈側(外側)，單羽狀肌' },
          { id: 'pq', nameEn: 'Pronator quadratus m.', nameZh: '旋前方肌', layer: 'deep', nerve: 'Anterior interosseous n. (AIN)', note: '深層近手腕處，撥開 FDP 與 FPL 可見的橫向肌肉' }
        ]
      },
      forearm_post: {
        title: '前臂伸肌側 (後側)：6 + 5 分層與鼻煙壺 (Snuff box) 挑戰',
        subtitle: '跑台判讀核心：強烈建議往遠端追肌腱跑到哪根掌骨或指節！深層前 3 條組成 Snuff box 且在腕部穿出至淺層表面。',
        buckets: {
          superficial: { title: '淺層 6 條 (Superficial · 6 條)', desc: '由外(橈)而內(尺)排列，前 3 條遠端肌腱會被 APL 與 EPB 跨過蓋住', max: 6 },
          intermediate: { title: '深層：Snuff box 拇指肌群 (3 條)', desc: '深層前 3 條（由外而內），在手腕處比淺層肌腱更靠表面並圍成解剖鼻煙壺', max: 3 },
          deep: { title: '深層：食指與旋後肌群 (2 條)', desc: '深層後 2 條（Extensor indicis 與近肘窩外側的 Supinator）', max: 2 }
        },
        items: [
          { id: 'br', nameEn: 'Brachioradialis m.', nameZh: '肱橈肌', layer: 'superficial', nerve: 'Radial n.', note: '淺層第1條，肘窩以上發出，止於橈骨莖突，下方藏 Radial a. & Superficial br. of radial n.' },
          { id: 'ecrl', nameEn: 'Extensor carpi radialis longus m.', nameZh: '橈側伸腕長肌', layer: 'superficial', nerve: 'Radial n.', note: '淺層第2條，外上髁上方發出，肌腱止於第 2 掌骨底' },
          { id: 'ecrb', nameEn: 'Extensor carpi radialis brevis m.', nameZh: '橈側伸腕短肌 (M66 考 tendon)', layer: 'superficial', nerve: 'Deep br. of radial n.', note: '淺層第3條，肌腱止於第 3 掌骨底' },
          { id: 'ed', nameEn: 'Extensor digitorum m.', nameZh: '伸指肌', layer: 'superficial', nerve: 'Posterior interosseous n. (PIN)', note: '淺層第4條，肌腱到第 2–5 指遠端指節（無深淺之分）' },
          { id: 'edm', nameEn: 'Extensor digiti minimi m.', nameZh: '伸小指肌', layer: 'superficial', nerve: 'Posterior interosseous n. (PIN)', note: '淺層第5條，肌腱到小指遠端（Rocker 手勢肌）' },
          { id: 'ecu', nameEn: 'Extensor carpi ulnaris m.', nameZh: '尺側伸腕肌', layer: 'superficial', nerve: 'Posterior interosseous n. (PIN)', note: '淺層第6條（最內側），肌腱止於第 5 掌骨內側' },
          { id: 'apl', nameEn: 'Abductor pollicis longus m.', nameZh: '外展拇長肌', layer: 'intermediate', nerve: 'Posterior interosseous n. (PIN)', note: '深層第1條（Snuff box 前外界），止於第 1 掌骨底部' },
          { id: 'epb', nameEn: 'Extensor pollicis brevis m.', nameZh: '伸拇短肌', layer: 'intermediate', nerve: 'Posterior interosseous n. (PIN)', note: '深層第2條（Snuff box 前外界），止於大拇指近端指節' },
          { id: 'epl', nameEn: 'Extensor pollicis longus m.', nameZh: '伸拇長肌', layer: 'intermediate', nerve: 'Posterior interosseous n. (PIN)', note: '深層第3條（Snuff box 後內界），止於大拇指遠端指節' },
          { id: 'ei', nameEn: 'Extensor indicis m.', nameZh: '伸食指肌 (M64/M65 考 tendon)', layer: 'deep', nerve: 'Posterior interosseous n. (PIN)', note: '深層第4條，近手腕處走在 2、3 指伸肌腱間，再鑽入第 2 指伸肌腱下方' },
          { id: 'sup', nameEn: 'Supinator m.', nameZh: '旋後肌 (M64)', layer: 'deep', nerve: 'Deep br. of radial n.', note: '深層近肘窩外側，Deep br. of radial n. 穿過此肌後改名 PIN' }
        ]
      },
      arm_scap: {
        title: '上臂前/後側與肩胛胸壁肌群分組',
        subtitle: '跑台重點：看到 Be specific 時肱二頭肌須分長短頭（內短外長）、肱三頭肌須分長頭/外側頭/內側頭（M66 考 lat. head）。',
        buckets: {
          superficial: { title: '上臂前側與前胸壁 (5 條)', desc: '受肌皮神經或內/外胸神經支配，注意喙突附著肌與穿過神經', max: 5 },
          intermediate: { title: '上臂後側伸肌群 (2 條)', desc: '受橈神經支配，長頭/外側頭與內側頭之間可見 Radial n. 與 Profunda brachii a.', max: 2 },
          deep: { title: '肩胛骨區與胸壁肌群 (6 條)', desc: '旋轉肌袖 (SITS)、大圓肌與前鋸肌（注意 Subscapularis 正面看 vs Serratus anterior 背面壓在肩胛下）', max: 6 }
        },
        items: [
          { id: 'biceps', nameEn: 'Long / Short head of Biceps brachii m.', nameZh: '肱二頭肌長頭(外)/短頭(內)', layer: 'superficial', nerve: 'Musculocutaneous n.', note: '短頭起自喙突、長頭起自盂上結節走結節間溝，止於橈骨粗隆' },
          { id: 'coraco', nameEn: 'Coracobrachialis m.', nameZh: '喙肱肌', layer: 'superficial', nerve: 'Musculocutaneous n. (直接穿過肌腹)', note: '起自喙突，止於肱骨內側 1/3' },
          { id: 'brachialis', nameEn: 'Brachialis m.', nameZh: '肱肌', layer: 'superficial', nerve: 'Musculocutaneous n.', note: '位於肱二頭肌深層下方，夾在肌皮神經與橈神經之間' },
          { id: 'pec_maj', nameEn: 'Pectoralis major m.', nameZh: '胸大肌', layer: 'superficial', nerve: 'Lateral & Medial pectoral n.', note: '止於肱骨結節間溝外側唇 (Lateral lip)，常被掀開觀察胸肩峰動脈胸肌支' },
          { id: 'pec_min', nameEn: 'Pectoralis minor m.', nameZh: '胸小肌', layer: 'superficial', nerve: 'Medial pectoral n. (穿出此肌)', note: '附著於喙突，作為腋動脈 1、2、3 段的分界標記' },
          { id: 'triceps', nameEn: 'Long / Lat. / Med. head of Triceps brachii m.', nameZh: '肱三頭肌長頭/外側頭(M66)/內側頭', layer: 'intermediate', nerve: 'Radial n.', note: '表層為長頭(靠內)與外側頭，深層為內側頭；肌間溝有橈神經與肱深動脈' },
          { id: 'anconeus', nameEn: 'Anconeus m.', nameZh: '肘肌', layer: 'intermediate', nerve: 'Radial n.', note: '靠近肘窩後方，連於肱骨外上髁與尺骨鷹嘴之間' },
          { id: 'subscap', nameEn: 'Subscapularis m.', nameZh: '肩胛下肌', layer: 'deep', nerve: 'Upper & Lower subscapular n.', note: '止於肱骨小結節 (Lesser tubercle)，手外展時在臂神經叢正後方（正面易見）' },
          { id: 'supraspin', nameEn: 'Supraspinatus m.', nameZh: '棘上肌', layer: 'deep', nerve: 'Suprascapular n. (M64/M66)', note: '位於棘上窩，止於肱骨大結節，翻開可見肩胛上橫韌帶與神經血管' },
          { id: 'infraspin', nameEn: 'Infraspinatus m.', nameZh: '棘下肌', layer: 'deep', nerve: 'Suprascapular n.', note: '位於棘下窩，止於肱骨大結節' },
          { id: 'teres_min', nameEn: 'Teres minor m.', nameZh: '小圓肌', layer: 'deep', nerve: 'Axillary n.', note: '在大圓肌上方，蓋住三頭肌長頭近端，止於肱骨大結節' },
          { id: 'teres_maj', nameEn: 'Teres major m.', nameZh: '大圓肌 (M65)', layer: 'deep', nerve: 'Lower subscapular n.', note: '止於肱骨結節間溝內側唇，下緣為腋動脈/靜脈改名肱動/靜脈之分界' },
          { id: 'serratus_ant', nameEn: 'Serratus anterior m.', nameZh: '前鋸肌', layer: 'deep', nerve: 'Long thoracic n. (伴 Lat. thoracic a.)', note: '起於 1–8 肋附著於肩胛骨內側緣前方，從背面看像被壓在肩胛骨下方' }
        ]
      },
      hand: {
        title: '手掌部肌群分組 (大魚際 / 小魚際 / 掌心與骨間肌)',
        subtitle: '跑台重點：大魚際與小魚際皆為「淺 2 深 1（Opponens 在深層）」，注意 Abductor digiti minimi m. 沒有 brevis！',
        buckets: {
          superficial: { title: '大魚際肌群 (Thenar · 3 條)', desc: '大拇指側，主要由 Recurrent br. of median n. 支配（淺層外/內 + 深層對掌）', max: 3 },
          intermediate: { title: '小魚際肌群 (Hypothenar · 3 條)', desc: '小指側，由 Deep br. of ulnar n. 支配（注意外展小指肌無 brevis）', max: 3 },
          deep: { title: '掌側其他與骨間肌群 (5 條)', desc: '含掌短肌、內收拇肌(橫頭/斜頭)、蚓狀肌、掌側單羽與背側雙羽骨間肌', max: 5 }
        },
        items: [
          { id: 'apb', nameEn: 'Abductor pollicis brevis m.', nameZh: '外展拇短肌', layer: 'superficial', nerve: 'Recurrent br. of median n.', note: '大魚際表層外側' },
          { id: 'fpb', nameEn: 'Flexor pollicis brevis m.', nameZh: '屈拇短肌', layer: 'superficial', nerve: 'Recurrent br. of median n.', note: '大魚際表層靠掌心側' },
          { id: 'op', nameEn: 'Opponens pollicis m.', nameZh: '對掌拇肌', layer: 'superficial', nerve: 'Recurrent br. of median n.', note: '位於外展拇短肌與屈拇短肌深層' },
          { id: 'adm', nameEn: 'Abductor digiti minimi m.', nameZh: '外展小指肌', layer: 'intermediate', nerve: 'Deep br. of ulnar n.', note: '小魚際表層內側 — 跑台拼字必考：千萬沒有 brevis！' },
          { id: 'fdmb', nameEn: 'Flexor digiti minimi brevis m.', nameZh: '屈小指短肌', layer: 'intermediate', nerve: 'Deep br. of ulnar n.', note: '小魚際表層靠掌心側（有 brevis）' },
          { id: 'odm', nameEn: 'Opponens digiti minimi m.', nameZh: '對掌小指肌', layer: 'intermediate', nerve: 'Deep br. of ulnar n.', note: '位於上述兩塊小魚際肌的深層' },
          { id: 'pb', nameEn: 'Palmaris brevis m.', nameZh: '掌短肌', layer: 'deep', nerve: 'Superficial br. of ulnar n.', note: '小指側靠近手腕皮下的淺層橫向肌束' },
          { id: 'add_p', nameEn: 'Adductor pollicis m. (Transverse & Oblique head)', nameZh: '內收拇肌 (橫頭與斜頭)', layer: 'deep', nerve: 'Deep br. of ulnar n.', note: '大拇指側深層，考試須區分橫頭 (Transverse) 與斜頭 (Oblique)' },
          { id: 'lumbrical', nameEn: 'Lumbrical m. (1–4)', nameZh: '蚓狀肌', layer: 'deep', nerve: '1–2: Median n. / 3–4: Deep br. of ulnar n.', note: '位於屈指肌腱間，直接以屈指深肌 (FDP) 肌腱作為起點 (Origin)' },
          { id: 'palmar_inter', nameEn: 'Palmar interosseous m. (1–3)', nameZh: '掌側骨間肌', layer: 'deep', nerve: 'Deep br. of ulnar n.', note: '單羽狀肌 (Unipennate)，比蚓狀肌深層，負責手指內收 (PAD)' },
          { id: 'dorsal_inter', nameEn: 'Dorsal interosseous m. (1–4)', nameZh: '背側骨間肌', layer: 'deep', nerve: 'Deep br. of ulnar n.', note: '雙羽狀肌 (Bipennate)，從手背與浸液標本皆好觀察，負責手指外展 (DAB)' }
        ]
      },
      spaces: {
        title: '腋窩三間隙邊界與穿過構造挑戰 (Quadrangular / Triangular)',
        subtitle: '跑台高頻考點 (M64/M65/M66)：可能直接插針或圈出間隙考名稱，或考穿過其中的血管神經（前面觀上界為 Subscapularis，後面觀變成 Teres minor）。',
        buckets: {
          superficial: { title: '四邊孔 (Quadrangular space · M64)', desc: '上：肩胛下肌(前)/小圓肌(後)、下：大圓肌、內：三頭肌長頭、外：肱骨外科頸', max: 2 },
          intermediate: { title: '三邊孔 (Triangular space · M65/M66)', desc: '上：肩胛下肌(前)/小圓肌(後)、下：大圓肌、外：三頭肌長頭', max: 1 },
          deep: { title: '三邊間隙 (Triangular interval)', desc: '上：大圓肌、內：三頭肌長頭、外：肱骨幹（位於大圓肌肌腱下方）', max: 2 }
        },
        items: [
          { id: 'qs_n', nameEn: 'Axillary n.', nameZh: '腋神經 (穿過四邊孔)', layer: 'superficial', nerve: '源自臂神經叢後索', note: '不跨過闊背肌肌腱，穿入四邊孔支配三角肌與小圓肌' },
          { id: 'qs_a', nameEn: 'Posterior circumflex humeral a. / v.', nameZh: '後旋肱動靜脈 (穿過四邊孔)', layer: 'superficial', nerve: '源自腋動脈第 3 段', note: '與腋神經伴行由前穿到後繞肱骨外科頸' },
          { id: 'ts_a', nameEn: 'Circumflex scapular a.', nameZh: '旋肩胛動脈 (穿過三邊孔)', layer: 'intermediate', nerve: '源自肩胛下動脈 (Subscapular a.)', note: '由前往後穿過三邊孔進入肩胛骨背側棘下窩' },
          { id: 'ti_n', nameEn: 'Radial n.', nameZh: '橈神經 (穿過三邊間隙)', layer: 'deep', nerve: '源自臂神經叢後索 (M66)', note: '跨過闊背肌肌腱上方後，進入三邊間隙走向肱骨背側橈神經溝' },
          { id: 'ti_a', nameEn: 'Profunda brachii (Deep brachial) a.', nameZh: '肱深動脈 (穿過三邊間隙)', layer: 'deep', nerve: '源自肱動脈近端', note: '「深肱求橈」：與橈神經伴行穿過三邊間隙至上臂後側' }
        ]
      }
    };

    const FOREARM_413_MUSCLES = REGIONAL_GROUPS_DATA.forearm_ant.items;

    /**
     * Preset AI Dictionary for realistic instant parsing in browser MVP
     */
    const AI_AGENT_KNOWLEDGE_PRESETS = {
      'suprascapular n.': {
        nameEn: 'Suprascapular n.',
        nameZh: '肩胛上神經',
        category: 'Nerve',
        morphemesStr: 'Supra-|prefix|在…上方 (Above) + scapular|adj.|肩胛骨的 (Scapula) + n.|n.|神經 (Nerve)',
        pathway: 'Superior trunk of brachial plexus (C5–C6) → 穿過肩胛上橫韌帶下方切跡 → Supraspinatus & Infraspinatus m.',
        region: '肩胛後區肌群支配 (Posterior scapular region)',
        callout: '跑台經典口訣：Suprascapular Artery 走韌帶上方，Nerve 走韌帶下方切跡！'
      },
      'profunda brachii a.': {
        nameEn: 'Profunda brachii a.',
        nameZh: '肱深動脈',
        category: 'Artery',
        morphemesStr: 'Profunda|adj.|深層的 (Deep) + brachii|adj.|上臂的 (Of the arm) + a.|n.|動脈 (Artery)',
        pathway: 'Brachial a. 近端最大分支 → 穿過三邊間隙 (Triangular interval) → 分為 Radial collateral a. 與 Middle collateral a.',
        region: '上臂後側與橈神經溝 (Radial groove of humerus)',
        callout: '跑台必考伴行：在肱骨後側橈神經溝內，與 Radial n. 緊密伴行！'
      },
      'subclavius m.': {
        nameEn: 'Subclavius m.',
        nameZh: '鎖骨下肌',
        category: 'Muscle',
        morphemesStr: 'Sub-|prefix|在…下方 (Under) + clavius|adj.|鎖骨的 (Clavicle) + m.|n.|肌肉 (Muscle)',
        pathway: '1st rib & costal cartilage → Inferior surface of middle third of clavicle',
        region: '胸前壁與鎖骨胸筋膜 (Clavipectoral fascia)',
        callout: '由 Nerve to subclavius (C5–C6，源自上幹) 支配，鋸開鎖骨即可觀察。'
      }
    };

    /**
     * =========================================================================
     * 2. CENTRALIZED APPLICATION STATE
     * =========================================================================
     */
    const APP_STATE = {
      activeTab: 'quiz',
      streak: 3,
      xp: 120,

      quizLayer: 1,
      entities: JSON.parse(JSON.stringify(INITIAL_ENTITIES)),
      l1CategoryFilter: 'ALL',

      // Layer 1 (Morpheme Builder)
      l1Index: 0,
      l1SelectedBlocks: [],
      l1PoolBlocks: [],
      l1Answered: false,

      // Layer 2 (Pathway Tree)
      l2TreeKey: 'artery', // 'artery' | 'nerve' | 'nerve_ant' | 'vein'
      l2ActiveBlankId: 'node_axillary',
      l2FilledAnswers: {},

      // Layer 3 (Multi-Region Matrix)
      l3GroupKey: 'forearm_ant', // 'forearm_ant' | 'forearm_post' | 'arm_scap' | 'hand' | 'spaces'
      l3ActiveBucket: 'superficial',
      l3Assignments: {},
      l3ShowSolution: false,

      // View 2: Custom Photo Pin Spot-Test State
      spotMode: 'edit',
      spotCanvasType: 'empty',
      spotPins: [],
      spotSelectedPinId: null,
      spotQuizIndex: 0,
      spotTimerSeconds: 30,
      spotTimerInterval: null,

      // View 3: Knowledge Base
      kbSelectedIndex: 0,
      kbCardFlipped: false
    };

    function getFilteredL1Entities() {
      if (APP_STATE.l1CategoryFilter === 'ALL') return APP_STATE.entities;
      const list = APP_STATE.entities.filter(e => e.category === APP_STATE.l1CategoryFilter);
      return list.length > 0 ? list : APP_STATE.entities;
    }

    function addXP(amount, incrementStreak) {
      APP_STATE.xp += amount;
      if (incrementStreak) {
        APP_STATE.streak += 1;
      }
      document.getElementById('stat-xp').textContent = `${APP_STATE.xp} XP`;
      document.getElementById('stat-streak').textContent = `${APP_STATE.streak} 連勝`;
    }

    function getPosBadgeStyle(pos) {
      if (pos === 'prefix') return 'bg-purple-100 text-purple-800 border-purple-300';
      if (pos === 'adj.') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }

    /**
     * =========================================================================
     * 4. VIEW 1 — LAYER 1: MORPHEME WORD BUILDER
     * =========================================================================
     */
