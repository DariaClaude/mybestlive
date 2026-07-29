// ═══════════════════════════════════════════════════════════════════════
// РМ Групп — War Room: данные по неделям
// Источник: Google Sheets Авито + VK/Юла (download_file_content + openpyxl)
// Новая неделя = новый объект в конце массива weeks.
// Статусы проектов, KPI-тренды и «Системные тренды» считает код —
// руками их писать не нужно.
// ═══════════════════════════════════════════════════════════════════════
const WAR_ROOM_DATA = {
  "weeks": [
    {
      "label": "11–17 мая",
      "avito": {
        "leads": 2260,
        "plan": 2014,
        "planNote": null,
        "cpl": 81,
        "budget": 184023
      },
      "vk": 23,
      "yula": 11,
      "extraKpi": {
        "label": "Урбан Дикси конверсия",
        "value": "8,2%",
        "sub": "адаптировано: 10",
        "notes": []
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 68,
          "fact": 259,
          "cpl": 50,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 145,
          "fact": 349,
          "cpl": 48,
          "hidden": false
        },
        {
          "name": "ПЯТЕРОЧКА КЗН",
          "plan": 22,
          "fact": 64,
          "cpl": 70,
          "hidden": false
        },
        {
          "name": "ТАБЫШ КЗН",
          "plan": 13,
          "fact": 67,
          "cpl": 68,
          "hidden": false
        },
        {
          "name": "МАГНИТ КЗН",
          "plan": 40,
          "fact": 4,
          "cpl": 173,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 190,
          "fact": 180,
          "cpl": 99,
          "hidden": false
        },
        {
          "name": "ЛЕНТА СПБ",
          "plan": 404,
          "fact": 156,
          "cpl": 161,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 126,
          "fact": 55,
          "cpl": 93,
          "hidden": false
        },
        {
          "name": "ВВ МСК",
          "plan": 200,
          "fact": 187,
          "cpl": 46,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 175,
          "fact": 226,
          "cpl": 60,
          "hidden": false
        },
        {
          "name": "Ростикс члб",
          "plan": 151,
          "fact": 150,
          "cpl": 133,
          "hidden": false
        },
        {
          "name": "ТАБЫШ ЧЛБ",
          "plan": 17,
          "fact": 97,
          "cpl": 30,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 585,
          "fact": 279,
          "cpl": 79,
          "hidden": false
        },
        {
          "name": "ОБИ МСК",
          "plan": 35,
          "fact": 57,
          "cpl": 132,
          "hidden": false
        },
        {
          "name": "Лукойл",
          "plan": 68,
          "fact": 126,
          "cpl": 199,
          "hidden": false
        },
        {
          "name": "Командор",
          "plan": 10,
          "fact": 4,
          "cpl": 607,
          "hidden": false
        }
      ],
      "urban": null,
      "chlbkzn": null,
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 080 → 1 081 +1"
            },
            {
              "label": "Охват",
              "value": "1 000"
            },
            {
              "label": "Показы",
              "value": "1 600"
            },
            {
              "label": "Вовлечённость",
              "value": "6"
            },
            {
              "label": "Лиды ВК",
              "value": "19"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "274 → 269 −5"
            },
            {
              "label": "Охват",
              "value": "85"
            },
            {
              "label": "Статус",
              "value": "⚠ отток"
            },
            {
              "label": "Лиды Юла",
              "value": "8"
            }
          ]
        },
        {
          "name": "🛒 Закуп TG",
          "platform": "Юла/площадки",
          "stats": [
            {
              "label": "Юла лидов",
              "value": "8"
            },
            {
              "label": "ВК+Юла итого",
              "value": "27"
            },
            {
              "label": "Статус",
              "value": "активен"
            }
          ]
        }
      ],
      "tg": null,
      "alerts": [
        {
          "type": "critical",
          "title": "🛑 МАГНИТ КЗН — 5% плана",
          "text": "Срочно разобрать причины. CPL 173 ₽, только 4 лида из 83 плановых."
        },
        {
          "type": "critical",
          "title": "🛑 ЛЕНТА СПБ — 39% плана",
          "text": "CPL 161 ₽ — дорого. Докрыть срочно. 156/404 лидов."
        },
        {
          "type": "warning",
          "title": "⚠ TG: отток −5 подписчиков",
          "text": "Контентная активация. Проверить расписание публикаций."
        },
        {
          "type": "warning",
          "title": "⚠ ЛЕНТА ЧЛБ — 48% плана",
          "text": "Отстаёт. Хотя CPL хороший (79 ₽) — увеличить объём."
        },
        {
          "type": "success",
          "title": "✔ 8 проектов выполнили план",
          "text": "CPL улучшился до 81 ₽. Лучшие: ТАБЫШ ЧЛБ (30 ₽), ЛЕНТА КРД (48 ₽)."
        }
      ]
    },
    {
      "label": "18–24 мая",
      "avito": {
        "leads": 3869,
        "plan": 2249,
        "planNote": null,
        "cpl": 101,
        "budget": 390740
      },
      "vk": 20,
      "yula": 9,
      "extraKpi": {
        "label": "Урбан Дикси конверсия",
        "value": "12,24%",
        "sub": "адаптировано: 24",
        "notes": [
          "↑ +4 п.п."
        ]
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 68,
          "fact": 537,
          "cpl": 65,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 145,
          "fact": 705,
          "cpl": 76,
          "hidden": false
        },
        {
          "name": "ПЯТЕРОЧКА КЗН",
          "plan": 22,
          "fact": 63,
          "cpl": 131,
          "hidden": false
        },
        {
          "name": "ТАБЫШ КЗН",
          "plan": 13,
          "fact": 125,
          "cpl": 69,
          "hidden": false
        },
        {
          "name": "МАГНИТ КЗН",
          "plan": 40,
          "fact": 50,
          "cpl": 121,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 190,
          "fact": 319,
          "cpl": 105,
          "hidden": false
        },
        {
          "name": "ЛЕНТА СПБ",
          "plan": 404,
          "fact": 257,
          "cpl": 178,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 126,
          "fact": 54,
          "cpl": 96,
          "hidden": false
        },
        {
          "name": "ВВ МСК",
          "plan": 200,
          "fact": 180,
          "cpl": 84,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 175,
          "fact": 394,
          "cpl": 94,
          "hidden": false
        },
        {
          "name": "Ростикс члб",
          "plan": 151,
          "fact": 140,
          "cpl": 137,
          "hidden": false
        },
        {
          "name": "ТАБЫШ ЧЛБ",
          "plan": 17,
          "fact": 197,
          "cpl": 58,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 585,
          "fact": 646,
          "cpl": 87,
          "hidden": false
        },
        {
          "name": "ОБИ МСК",
          "plan": 35,
          "fact": 30,
          "cpl": 121,
          "hidden": false
        },
        {
          "name": "Лукойл",
          "plan": 68,
          "fact": 160,
          "cpl": 66,
          "hidden": false
        },
        {
          "name": "Командор",
          "plan": 10,
          "fact": 12,
          "cpl": 187,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 196,
        "cpl": 169,
        "spend": 33119,
        "adapted": 24,
        "conversion": 12.24
      },
      "chlbkzn": null,
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 081 → 1 081 +0"
            },
            {
              "label": "Охват",
              "value": "1 200 ↑ +200 (+20%)"
            },
            {
              "label": "Показы",
              "value": "2 300 ↑ +700 (+44%)"
            },
            {
              "label": "Вовлечённость",
              "value": "10 ↑ +4 (+67%)"
            },
            {
              "label": "Лиды ВК",
              "value": "23 ↑ +4 (+21%)"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "268 → 276 +8"
            },
            {
              "label": "Охват",
              "value": "85 = как пред."
            },
            {
              "label": "Статус",
              "value": "✓ рост"
            },
            {
              "label": "Лиды Юла",
              "value": "18 ↑ +10 (+125%)"
            }
          ]
        },
        {
          "name": "🛒 Закуп TG",
          "platform": "площадки",
          "stats": [
            {
              "label": "Юла лидов",
              "value": "18"
            },
            {
              "label": "ВК+Юла итого",
              "value": "41"
            },
            {
              "label": "Статус",
              "value": "активен ↑"
            }
          ]
        }
      ],
      "tg": null,
      "alerts": [
        {
          "type": "critical",
          "title": "🛑 Ростикс МСК — 43% плана",
          "text": "CPL 96 ₽. Увеличить объём трафика. 54/126 лидов."
        },
        {
          "type": "warning",
          "title": "⚠ CPL вырос 81 → 101 ₽ (+24%)",
          "text": "Проверить качество трафика. Возможно, выросли ставки конкурентов."
        },
        {
          "type": "warning",
          "title": "⚠ ЛЕНТА СПБ — 64% плана",
          "text": "CPL 178 ₽ — дорого. Усилить трафик. 257/404 лидов."
        },
        {
          "type": "success",
          "title": "✔ 11 проектов выполнили план",
          "text": "Рекорд МАГНИТ КРД x7 перевыполнения! Лукойл CPL 66 ₽ (снижение в 3 раза)."
        },
        {
          "type": "success",
          "title": "✔ TG вырос +8 подписчиков",
          "text": "Положительная динамика. Охват стабилен — 85."
        }
      ]
    },
    {
      "label": "25–31 мая",
      "avito": {
        "leads": 3526,
        "plan": 2214,
        "planNote": null,
        "cpl": 103,
        "budget": 361845
      },
      "vk": 4,
      "yula": 11,
      "extraKpi": {
        "label": "Урбан Дикси конверсия",
        "value": "10,67%",
        "sub": "адаптировано: 40",
        "notes": [
          "↑ рекорд 40 адапт."
        ]
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 68,
          "fact": 465,
          "cpl": 68,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 145,
          "fact": 633,
          "cpl": 74,
          "hidden": false
        },
        {
          "name": "ПЯТЕРОЧКА КЗН",
          "plan": 22,
          "fact": 76,
          "cpl": 133,
          "hidden": false
        },
        {
          "name": "ТАБЫШ КЗН",
          "plan": 13,
          "fact": 138,
          "cpl": 72,
          "hidden": false
        },
        {
          "name": "МАГНИТ КЗН",
          "plan": 40,
          "fact": 63,
          "cpl": 120,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 190,
          "fact": 333,
          "cpl": 107,
          "hidden": false
        },
        {
          "name": "ЛЕНТА СПБ",
          "plan": 404,
          "fact": 204,
          "cpl": 165,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 126,
          "fact": 73,
          "cpl": 98,
          "hidden": false
        },
        {
          "name": "ВВ МСК",
          "plan": 200,
          "fact": 236,
          "cpl": 85,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 175,
          "fact": 413,
          "cpl": 108,
          "hidden": false
        },
        {
          "name": "Ростикс члб",
          "plan": 151,
          "fact": 154,
          "cpl": 130,
          "hidden": false
        },
        {
          "name": "ТАБЫШ ЧЛБ",
          "plan": 17,
          "fact": 136,
          "cpl": 62,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 585,
          "fact": 424,
          "cpl": 80,
          "hidden": false
        },
        {
          "name": "Лукойл",
          "plan": 68,
          "fact": 165,
          "cpl": 70,
          "hidden": false
        },
        {
          "name": "Командор",
          "plan": 10,
          "fact": 13,
          "cpl": 185,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 375,
        "cpl": 135,
        "spend": 55893,
        "adapted": 40,
        "conversion": 10.67
      },
      "chlbkzn": null,
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 081 → 1 080 −1"
            },
            {
              "label": "Охват",
              "value": "4 900 ↑↑"
            },
            {
              "label": "Показы",
              "value": "7 600 ↑ +5300 (+230%)"
            },
            {
              "label": "Вовлечённость",
              "value": "25 ↑ +15 (+150%)"
            },
            {
              "label": "Лиды ВК",
              "value": "9 ↓"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "275 → 277 +2"
            },
            {
              "label": "Охват",
              "value": "87 ↑ +2 (+2%)"
            },
            {
              "label": "Статус",
              "value": "✓ рост"
            },
            {
              "label": "Лиды Юла",
              "value": "16 ↓ −2 (−11%)"
            }
          ]
        },
        {
          "name": "💬 Закуп TG-каналов",
          "platform": "3 канала",
          "stats": [
            {
              "label": "personalhoreca_chat",
              "value": "9 лидов"
            },
            {
              "label": "obshepitrabota",
              "value": "13 лидов"
            },
            {
              "label": "rabota_moskval",
              "value": "5 лидов"
            },
            {
              "label": "Итого закуп",
              "value": "27 лидов"
            }
          ]
        }
      ],
      "tg": {
        "value": "27",
        "sub": "каналы: 3",
        "details": [
          "personalhoreca_chat — 9 лидов",
          "obshepitrabota — 13 лидов",
          "rabota_moskval — 5 лидов"
        ]
      },
      "alerts": [
        {
          "type": "critical",
          "title": "🛑 ЛЕНТА СПБ — 50% плана, СИСТЕМНАЯ (3 периода)",
          "text": "CPL 165 ₽. Пересмотреть стратегию. 204/404 лидов. Проблема не разовая."
        },
        {
          "type": "critical",
          "title": "🛑 Ростикс МСК — 58% плана, СИСТЕМНАЯ (3 периода)",
          "text": "CPL 98 ₽. Добавить бюджет, объём низкий. 73/126 лидов."
        },
        {
          "type": "warning",
          "title": "⚠ ВК+Юла 26 лидов (−37%)",
          "text": "Проверить аккаунты. Возобновить таргет. ВК упал с 23 до 9 лидов."
        },
        {
          "type": "success",
          "title": "✔ 12 проектов выполнили план",
          "text": "ТАБЫШ КЗН x10 перевыполнения! Личный рекорд проекта."
        },
        {
          "type": "success",
          "title": "✔ ВК охват x4 (Казань-закуп)",
          "text": "4 900 показов благодаря закупу в Казани. Урбан Дикси CPL снизился 169 → 135 ₽."
        }
      ]
    },
    {
      "label": "1–7 июня",
      "avito": {
        "leads": 1582,
        "plan": 268,
        "planNote": "часть плана",
        "cpl": 102,
        "budget": 161999
      },
      "vk": 11,
      "yula": 8,
      "extraKpi": {
        "label": "Урбан Дикси — конверсия",
        "value": "10,1%",
        "sub": "адаптировано: 21 из 207",
        "notes": [
          "↓ CPL 135 → 122 ₽"
        ]
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 50,
          "fact": 350,
          "cpl": 65,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 50,
          "fact": 130,
          "cpl": 70,
          "hidden": false
        },
        {
          "name": "ПЯТЕРОЧКА КЗН",
          "plan": null,
          "fact": 20,
          "cpl": 127,
          "hidden": false
        },
        {
          "name": "ТАБЫШ КЗН",
          "plan": 2,
          "fact": 34,
          "cpl": 70,
          "hidden": false
        },
        {
          "name": "МАГНИТ КЗН",
          "plan": 3,
          "fact": 15,
          "cpl": 125,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 55,
          "fact": 275,
          "cpl": 103,
          "hidden": false
        },
        {
          "name": "ЛЕНТА СПБ",
          "plan": null,
          "fact": 96,
          "cpl": 173,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 60,
          "fact": 27,
          "cpl": 105,
          "hidden": false
        },
        {
          "name": "ВВ МСК",
          "plan": null,
          "fact": 56,
          "cpl": 80,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": null,
          "fact": 220,
          "cpl": 101,
          "hidden": false
        },
        {
          "name": "Ростикс члб",
          "plan": null,
          "fact": 10,
          "cpl": 132,
          "hidden": false
        },
        {
          "name": "ТАБЫШ ЧЛБ",
          "plan": 3,
          "fact": 36,
          "cpl": 63,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 10,
          "fact": 247,
          "cpl": 87,
          "hidden": false
        },
        {
          "name": "Лукойл",
          "plan": 35,
          "fact": 65,
          "cpl": 72,
          "hidden": false
        },
        {
          "name": "Командор",
          "plan": 3,
          "fact": 1,
          "cpl": 170,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 207,
        "cpl": 122,
        "spend": 25519,
        "adapted": 21,
        "conversion": 10.1
      },
      "chlbkzn": null,
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 080 → 1 080 0"
            },
            {
              "label": "Охват",
              "value": "570 ↓↓"
            },
            {
              "label": "Показы",
              "value": "1 000 ↓ −6600 (−87%)"
            },
            {
              "label": "Вовлечённость",
              "value": "8 ↓ −17 (−68%)"
            },
            {
              "label": "Лиды ВК",
              "value": "10 ↑ (+1 vs прошл.)"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "273 → 281 +8 ⭐"
            },
            {
              "label": "Охват",
              "value": "91 ↑ +4 (+5%)"
            },
            {
              "label": "Статус",
              "value": "✓ лучший прирост за 4 нед."
            },
            {
              "label": "Лиды Юла",
              "value": "8 ↓ −8 (−50%)"
            }
          ]
        },
        {
          "name": "💬 Закуп TG-каналов",
          "platform": "пакеты",
          "stats": [
            {
              "label": "HoReCa TG-пакет",
              "value": "8 каналов — ждём"
            },
            {
              "label": "TG пакет 3 100 ₽",
              "value": "5 лидов"
            },
            {
              "label": "TG пакет 2 170 ₽",
              "value": "5 лидов"
            },
            {
              "label": "Итого закуп",
              "value": "~10 лидов"
            }
          ]
        }
      ],
      "tg": {
        "value": "~10",
        "sub": "отслеживаемые",
        "details": [
          "HoReCa TG-пакет (8 каналов) — ждём результаты",
          "TG пакет 3 100 ₽ — 5 лидов",
          "TG пакет 2 170 ₽ — 5 лидов",
          "rusvacant — 06.06 (2 237 ₽, 1 310 просм.)"
        ]
      },
      "alerts": [
        {
          "type": "critical",
          "title": "🛑 ЛЕНТА СПБ — CPL 173 ₽ (красная зона)",
          "text": "Объём упал: 204 → 96 лидов (−53%). CPL выше нормы. Системная проблема 4 периода подряд."
        },
        {
          "type": "critical",
          "title": "🛑 Ростикс ЧЛБ — 10 лидов (резкое падение)",
          "text": "Было 154, стало 10. Снижение в 15x. Требует немедленной диагностики."
        },
        {
          "type": "warning",
          "title": "⚠ Ростикс МСК — 27 лидов (объём низкий)",
          "text": "CPL 105 ₽ — норма. Проблема не в цене, а в объёме трафика. Был 73, стал 27."
        },
        {
          "type": "warning",
          "title": "⚠ ВК охват упал 4 900 → 570 (в 8x)",
          "text": "Нет платных VK-размещений в Казани. Возобновить для восстановления охватов."
        },
        {
          "type": "success",
          "title": "✔ Telegram +8 подписчиков — лучшая неделя",
          "text": "Лучший прирост за 4 недели (273→281). Охват 91 — слабый рост."
        },
        {
          "type": "success",
          "title": "✔ Урбан Дикси CPL 122 ₽ — улучшение",
          "text": "CPL снизился: 135 (май) → 122 (июнь). Динамика положительная."
        }
      ]
    },
    {
      "label": "8–14 июня",
      "avito": {
        "leads": 2104,
        "plan": 991,
        "planNote": null,
        "cpl": 82,
        "budget": 173458
      },
      "vk": 8,
      "yula": 1,
      "extraKpi": {
        "label": "Урбан Дикси",
        "value": "153 ₽",
        "sub": "CPL 8–14 июня, 197 лидов",
        "notes": [
          "↑ CPL 122 → 153 ₽ (+25%)"
        ]
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 50,
          "fact": 103,
          "cpl": 63,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 50,
          "fact": 86,
          "cpl": 73,
          "hidden": false
        },
        {
          "name": "ТАБЫШ КЗН",
          "plan": 2,
          "fact": 2,
          "cpl": 82,
          "hidden": false
        },
        {
          "name": "МАГНИТ КЗН",
          "plan": 3,
          "fact": 3,
          "cpl": 138,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 55,
          "fact": 70,
          "cpl": 110,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 60,
          "fact": 151,
          "cpl": 136,
          "hidden": false
        },
        {
          "name": "ТАБЫШ ЧЛБ",
          "plan": 3,
          "fact": 5,
          "cpl": 78,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 10,
          "fact": 120,
          "cpl": 88,
          "hidden": false
        },
        {
          "name": "Лукойл",
          "plan": 35,
          "fact": 74,
          "cpl": 88,
          "hidden": false
        },
        {
          "name": "Командор",
          "plan": 3,
          "fact": 3,
          "cpl": 175,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 150,
          "fact": 339,
          "cpl": 170,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 570,
          "fact": 1148,
          "cpl": 73,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 197,
        "cpl": 153,
        "spend": 30296,
        "adapted": 38,
        "conversion": 19.29
      },
      "chlbkzn": null,
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 080 → 1 090 +10 ⭐"
            },
            {
              "label": "Охват",
              "value": "1 200 ↑"
            },
            {
              "label": "Показы",
              "value": "3 800 ↑ +2800 (+280%)"
            },
            {
              "label": "Лиды ВК",
              "value": "17 ↑ +70%"
            },
            {
              "label": "CPL ВК",
              "value": "242 ₽"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "281 → 293 +12 ⭐"
            },
            {
              "label": "Охват",
              "value": "104 ↑ +13 (+14%)"
            },
            {
              "label": "Статус",
              "value": "✓ стабильный рост"
            },
            {
              "label": "Лиды Юла",
              "value": "11 ↑ +38%"
            }
          ]
        },
        {
          "name": "💬 Закуп TG-каналов",
          "platform": "пакеты",
          "stats": [
            {
              "label": "HoReCa TG-пакет",
              "value": "8 каналов — итог"
            },
            {
              "label": "rabota_moskval",
              "value": "8 лидов"
            },
            {
              "label": "obshepitrabota",
              "value": "10 лидов"
            },
            {
              "label": "Итого закуп",
              "value": "~18 лидов"
            }
          ]
        }
      ],
      "tg": {
        "value": "~18",
        "sub": "HoReCa + rabota",
        "details": [
          "HoReCa TG-пакет (8 каналов) — итог получен",
          "rabota_moskval — 8 лидов",
          "obshepitrabota — 10 лидов"
        ]
      }
    },
    {
      "label": "15–21 июня",
      "avito": {
        "leads": 3105,
        "plan": 986,
        "planNote": null,
        "cpl": 88,
        "budget": 274218
      },
      "vk": 9,
      "yula": 2,
      "extraKpi": {
        "label": "Урбан Дикси",
        "value": "78 ₽",
        "sub": "169 лидов • 13 183 ₽",
        "notes": [
          "↓ CPL 153 → 78 ₽ (−49%) ⭐"
        ]
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 50,
          "fact": 475,
          "cpl": 68,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 50,
          "fact": 244,
          "cpl": 82,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 55,
          "fact": 120,
          "cpl": 75,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 60,
          "fact": 128,
          "cpl": 140,
          "hidden": false
        },
        {
          "name": "ТАБЫШ ЧЛБ",
          "plan": 3,
          "fact": 3,
          "cpl": 80,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 10,
          "fact": 120,
          "cpl": 88,
          "hidden": false
        },
        {
          "name": "Лукойл",
          "plan": 35,
          "fact": 68,
          "cpl": 86,
          "hidden": false
        },
        {
          "name": "Командор",
          "plan": 3,
          "fact": 4,
          "cpl": 158,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 150,
          "fact": 611,
          "cpl": 101,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 570,
          "fact": 1332,
          "cpl": 71,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 169,
        "cpl": 78,
        "spend": 13183,
        "adapted": 11,
        "conversion": 6.51
      },
      "chlbkzn": {
        "leads": 157,
        "cpl": 167,
        "spend": 27976,
        "adapted": 13,
        "conversion": 8.28
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 090 → 1 117 +27"
            },
            {
              "label": "Стоимость подписчика",
              "value": "112 ₽"
            },
            {
              "label": "Охват",
              "value": "1 284 ↑"
            },
            {
              "label": "Показы",
              "value": "3 471 ↑ +280%"
            },
            {
              "label": "Лиды ВК (15–24 июня)",
              "value": "21"
            },
            {
              "label": "Стоимость лида ВК",
              "value": "272 ₽"
            },
            {
              "label": "Лиды Юла (15–24 июня)",
              "value": "11"
            },
            {
              "label": "Стоимость лида Юла",
              "value": "108 ₽"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "293 → 319 ↑ +26 (+8,9%)"
            },
            {
              "label": "Стоимость подписчика",
              "value": "115 ₽"
            }
          ]
        },
        {
          "name": "💬 Закуп TG-каналов",
          "platform": "пакеты",
          "stats": [
            {
              "label": "Статус",
              "value": "закуп с 29 июня"
            },
            {
              "label": "Яндекс Директ",
              "value": "запущен новый тип — привлечение подписчиков"
            }
          ]
        }
      ],
      "tg": {
        "value": null,
        "sub": "закуп возобновится с 29 июня",
        "details": []
      }
    },
    {
      "label": "22–28 июня",
      "avito": {
        "leads": 2802,
        "plan": 980,
        "planNote": null,
        "cpl": 82,
        "budget": 229284
      },
      "vk": 6,
      "yula": 2,
      "extraKpi": {
        "label": "Урбан Дикси",
        "value": "83 ₽",
        "sub": "176 лидов • 14 710 ₽",
        "notes": [
          "↑ CPL 78 → 83 ₽ (+5 ₽)"
        ]
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 50,
          "fact": 182,
          "cpl": 79,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 50,
          "fact": 378,
          "cpl": 104,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 55,
          "fact": 256,
          "cpl": 78,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 60,
          "fact": 137,
          "cpl": 135,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 10,
          "fact": 78,
          "cpl": 92,
          "hidden": false
        },
        {
          "name": "Лукойл",
          "plan": 35,
          "fact": 56,
          "cpl": 87,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 150,
          "fact": 407,
          "cpl": 73,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 570,
          "fact": 1308,
          "cpl": 74,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 176,
        "cpl": 83,
        "spend": 14710,
        "adapted": 9,
        "conversion": 5.11
      },
      "chlbkzn": {
        "leads": 174,
        "cpl": 106,
        "spend": 22725,
        "adapted": null,
        "conversion": 40.46
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 116 → 1 156 +40"
            },
            {
              "label": "Охват",
              "value": "1 200"
            },
            {
              "label": "Показы",
              "value": "2 700"
            },
            {
              "label": "Просмотры видео",
              "value": "2 000"
            },
            {
              "label": "Лиды ВК / Юла",
              "value": "30 (ВК 17 + Юла 13)"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "312 → 319 ↑ +7"
            },
            {
              "label": "Охват",
              "value": "119"
            },
            {
              "label": "ER",
              "value": "37,3%"
            },
            {
              "label": "Закуп TG",
              "value": "✅ запущен с 29 июня"
            }
          ]
        },
        {
          "name": "💬 Яндекс Директ TG",
          "platform": "новый формат",
          "stats": [
            {
              "label": "Тип",
              "value": "привлечение подписчиков"
            },
            {
              "label": "Статус",
              "value": "✅ продолжаем с 30 июня"
            },
            {
              "label": "Примечание",
              "value": "было прерывание — пополнение кабинета"
            }
          ]
        }
      ],
      "tg": {
        "value": null,
        "sub": "✅ закуп запущен с 29 июня",
        "details": []
      }
    },
    {
      "label": "29 июня–5 июля",
      "avito": {
        "leads": 4114,
        "plan": 1930,
        "planNote": null,
        "cpl": 91,
        "budget": 373810
      },
      "vk": 22,
      "yula": 2,
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "766",
        "sub": "Урбан 177 • ЧЛБ+КЗН 589",
        "notes": [
          "↑ CPL Урбан 83 → 98 ₽ (+15 ₽)"
        ]
      },
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 170,
          "fact": 374,
          "cpl": 81,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 200,
          "fact": 469,
          "cpl": 86,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 150,
          "fact": 305,
          "cpl": 77,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 270,
          "fact": 528,
          "cpl": 97,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 40,
          "fact": 116,
          "cpl": 79,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 500,
          "fact": 1233,
          "cpl": 99,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 600,
          "fact": 1089,
          "cpl": 71,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 157,
        "cpl": 98,
        "spend": 15426,
        "adapted": 20,
        "conversion": 12.74
      },
      "chlbkzn": {
        "leads": 589,
        "cpl": 79,
        "spend": 48593,
        "adapted": 106,
        "conversion": 17.99
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 156 → 1 185 +29"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "Показы",
              "value": "—"
            },
            {
              "label": "Просмотры видео",
              "value": "—"
            },
            {
              "label": "Лиды ВК / Юла",
              "value": "33 (ВК 21 + Юла 12)"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "315"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "ER",
              "value": "—"
            },
            {
              "label": "Реклама",
              "value": "⏸ приостановлена"
            },
            {
              "label": "Причина",
              "value": "идёт найм SMM-специалиста"
            }
          ]
        }
      ],
      "tg": {
        "value": null,
        "sub": "пакеты",
        "details": []
      }
    },
    {
      "label": "6–12 июля",
      "avito": {
        "leads": 2704,
        "plan": 1930,
        "planNote": null,
        "cpl": 92,
        "budget": 248241
      },
      "vk": 12,
      "yula": 4,
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "932",
        "sub": "Урбан 142 · ЧЛБ+КЗН 790",
        "notes": [
          "↑ CPL Урбан 98 → 128 ₽ (+30 ₽)",
          "↓ CPL ЧЛБ+КЗН 79 → 72 ₽ (−7 ₽)"
        ]
      },
      "alerts": [
        {
          "type": "success",
          "title": "CPL удержан при сокращении бюджета",
          "text": "Бюджет Авито снижен на 34% (373 810 → 248 241 ₽), лиды упали пропорционально (4 114 → 2 704). CPL при этом почти не изменился: 91 → 92 ₽. Эффективность закупки сохранена — просело только количество."
        },
        {
          "type": "warning",
          "title": "Урбан Дикси: CPL вырос на 31%",
          "text": "98 → 128 ₽ (+30 ₽) при падении лидов 157 → 142. Единственный канал, где стоимость лида ушла в красную зону. Нужно разобрать причину до следующей закупки."
        },
        {
          "type": "success",
          "title": "ЧЛБ + КЗН ОБ — лучший результат недели",
          "text": "790 лидов (+201, +34%) при снижении CPL 79 → 72 ₽. Конверсия в адаптацию выросла с 17,99% до 46,33%, адаптированных 106 → 366 (×3,5). Рост объёма, удешевление лида и качества одновременно."
        },
        {
          "type": "warning",
          "title": "Инвентаризация — единственный недобор плана",
          "text": "589 лидов при плане 600 (98%). Остальные 6 проектов план перевыполнили. CPL 70 ₽ — лучший по Авито, стоит рассмотреть увеличение бюджета."
        },
        {
          "type": "warning",
          "title": "ВК+Юла просели к прошлой неделе",
          "text": "Суммарно 24 → 16 лидов (−8, −33%). ВК: 22 → 12 (−10). Юла: 2 → 4 (+2). Реклама в TG приостановлена, идёт найм SMM-специалиста."
        }
      ],
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 170,
          "fact": 270,
          "cpl": 71,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 200,
          "fact": 310,
          "cpl": 71,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 150,
          "fact": 221,
          "cpl": 88,
          "hidden": false
        },
        {
          "name": "Ростикс МСК",
          "plan": 270,
          "fact": 293,
          "cpl": 98,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 40,
          "fact": 120,
          "cpl": 80,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 500,
          "fact": 901,
          "cpl": 88,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 600,
          "fact": 589,
          "cpl": 70,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 142,
        "cpl": 128,
        "spend": 18197,
        "adapted": 17,
        "conversion": 11.97
      },
      "chlbkzn": {
        "leads": 790,
        "cpl": 72,
        "spend": 59074,
        "adapted": 366,
        "conversion": 46.33
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 185 → 1 231 (+46)"
            },
            {
              "label": "Прирост vs пр. неделя",
              "value": "+46 против +29 ↑"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "Лиды ВК / Юла",
              "value": "16 (ВК 12 + Юла 4)"
            },
            {
              "label": "Динамика лидов",
              "value": "24 → 16 (−8, −33%)"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "—"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "ER",
              "value": "—"
            },
            {
              "label": "Реклама",
              "value": "⏸ приостановлена"
            },
            {
              "label": "Причина",
              "value": "идёт найм SMM-специалиста"
            }
          ]
        }
      ],
      "tg": {
        "value": null,
        "sub": "пакеты",
        "details": []
      }
    },
    {
      "label": "13–19 июля",
      "avito": {
        "leads": 3805,
        "plan": 2060,
        "planNote": null,
        "cpl": 87,
        "budget": 330798
      },
      "vk": 25,
      "yula": 9,
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "1 159",
        "sub": "Урбан 273 · МСК 166 · ЧЛБ+КЗН 720",
        "notes": [
          "↓ CPL Урбан 128 → 84 ₽ (−44 ₽)",
          "↑ CPL ЧЛБ+КЗН 72 → 74 ₽ (+2 ₽)",
          "+ новый блок МСК ДРС: 166 лидов"
        ]
      },
      "alerts": [
        {
          "type": "success",
          "title": "Рекордный объём — 3 805 лидов",
          "text": "Рост к прошлой неделе +41% (2 704 → 3 805) при снижении CPL 92 → 87 ₽. Выполнение плана 185% (план 2 060). Бюджет 330 798 ₽ (+33%)."
        },
        {
          "type": "success",
          "title": "Инвентаризация — лидер недели",
          "text": "1 397 лидов при плане 600 (233%), CPL 73 ₽. Неделей ранее была единственным недобором (589/600, 98%) — полный разворот. Самый объёмный проект периода."
        },
        {
          "type": "success",
          "title": "Урбан Дикси восстановился",
          "text": "CPL 128 → 84 ₽ (−34%) при росте лидов 142 → 273 (+92%). На прошлой неделе был единственной красной зоной — теперь один из лучших CPL по ДРС."
        },
        {
          "type": "warning",
          "title": "Ростикс МСК остановлен",
          "text": "0 лидов против 293 неделей ранее. Проект выведен из закупки — уточнить причину (пауза кабинета / смена приоритета) и планы на возобновление."
        },
        {
          "type": "success",
          "title": "ЛЕНТА МСК запущена",
          "text": "Новый проект: 534 лида (134% плана). CPL 126 ₽ — высокий для старта, требует оптимизации, но объём хороший."
        },
        {
          "type": "success",
          "title": "ВК+Юла — рост в разы",
          "text": "34 лида (ВК 25 + Юла 9) против 16 неделей ранее (+113%). Лучший результат по соцканалам за последние недели."
        }
      ],
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 170,
          "fact": 237,
          "cpl": 87,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 200,
          "fact": 327,
          "cpl": 73,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 150,
          "fact": 308,
          "cpl": 91,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 400,
          "fact": 534,
          "cpl": 126,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 40,
          "fact": 117,
          "cpl": 88,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 500,
          "fact": 885,
          "cpl": 75,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 600,
          "fact": 1397,
          "cpl": 73,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 273,
        "cpl": 84,
        "spend": 23028,
        "adapted": 8,
        "conversion": 2.93
      },
      "chlbkzn": {
        "leads": 720,
        "cpl": 74,
        "spend": 55947,
        "adapted": 336,
        "conversion": 46.67
      },
      "msk": {
        "leads": 166,
        "cpl": 77,
        "spend": 12830,
        "adapted": null,
        "conversion": null
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 228 → 1 264 (+36)"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "Лиды ВК / Юла",
              "value": "34 (ВК 25 + Юла 9)"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "—"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "ER",
              "value": "—"
            },
            {
              "label": "Реклама",
              "value": "⏸ приостановлена"
            },
            {
              "label": "Причина",
              "value": "идёт найм SMM-специалиста"
            }
          ]
        }
      ],
      "tg": {
        "value": null,
        "sub": "пакеты",
        "details": []
      }
    },
    {
      "label": "20–26 июля",
      "avito": {
        "leads": 3515,
        "plan": 2060,
        "planNote": null,
        "cpl": 82,
        "budget": 287053
      },
      "vk": 32,
      "yula": 6,
      "vkyulaNote": "лиды 20.07–29.07",
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "1 440",
        "sub": "Урбан 220 · МСК 571 · ЧЛБ+КЗН 649",
        "notes": [
          "↑ МСК ДРС 166 → 571 лид (×3,4)",
          "↑ CPL Урбан 84 → 106 ₽ (+22 ₽)",
          "= CPL ЧЛБ+КЗН 74 ₽ (без изменений)"
        ]
      },
      "alerts": [
        {
          "type": "success",
          "title": "МСК ДРС — взрывной рост",
          "text": "571 лид против 166 неделей ранее (×3,4). CPL снижен 77 → 63 ₽. Крупнейший блок ДРС в этом периоде."
        },
        {
          "type": "success",
          "title": "CPL Авито улучшился до 82 ₽",
          "text": "87 → 82 ₽ (−5 ₽) при сохранении объёма (3 805 → 3 515, −8%). Лучшие: Инвентаризация 69 ₽, ЛЕНТА КЗН 63 ₽. Выполнение плана 171%."
        },
        {
          "type": "success",
          "title": "ЧЛБ+КЗН — сильная конверсия",
          "text": "649 лидов, конверсия в адаптацию 39,91%, адаптированных 259. CPL 74 ₽. Стабильно высокое качество канала."
        },
        {
          "type": "warning",
          "title": "Урбан Дикси: CPL снова вырос",
          "text": "84 → 106 ₽ (+26%) при падении лидов 273 → 220. Конверсия низкая — 8,18%, адаптированных 18. Требует разбора: второй скачок CPL за месяц."
        },
        {
          "type": "success",
          "title": "Инвентаризация — снова лидер объёма",
          "text": "1 195 лидов (199% плана) при лучшем CPL по Авито — 69 ₽. Самый результативный проект периода."
        }
      ],
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 170,
          "fact": 345,
          "cpl": 83,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 200,
          "fact": 428,
          "cpl": 73,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 150,
          "fact": 361,
          "cpl": 63,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 400,
          "fact": 521,
          "cpl": 82,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 40,
          "fact": 117,
          "cpl": 85,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 500,
          "fact": 548,
          "cpl": 73,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 600,
          "fact": 1195,
          "cpl": 69,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 220,
        "cpl": 106,
        "spend": 23487,
        "adapted": 18,
        "conversion": 8.18
      },
      "chlbkzn": {
        "leads": 649,
        "cpl": 74,
        "spend": 53729,
        "adapted": 259,
        "conversion": 39.91
      },
      "msk": {
        "leads": 571,
        "cpl": 63,
        "spend": 36256,
        "adapted": null,
        "conversion": null
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "1 264 → 1 305 (+41)"
            },
            {
              "label": "Прирост vs пр. неделя",
              "value": "+41 против +36 ↑"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "Лиды ВК / Юла (20.07–29.07)",
              "value": "38 (ВК 32 + Юла 6)"
            }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            {
              "label": "Подписчики",
              "value": "—"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "ER",
              "value": "—"
            },
            {
              "label": "Реклама",
              "value": "⏸ приостановлена"
            },
            {
              "label": "Причина",
              "value": "идёт найм SMM-специалиста"
            }
          ]
        }
      ],
      "tg": {
        "value": null,
        "sub": "пакеты",
        "details": []
      }
    }
  ],
  "tasks": [
    "Telegram-бот с новой логикой подключения к искусственному интеллекту",
    "Завершить публикацию сайтов ЮЛ на домены",
    "Согласовать логотипы юридических лиц",
    "Разработка дизайна мерча РМ Групп",
    "Увеличение подписчиков Telegram-канала",
    "Увеличение подписчиков ВКонтакте",
    "Согласовать структуру сайта РМ Групп и запустить в работу",
    "Согласование брендбука бренда в ресурсе",
    "Презентация для отдела продаж",
    "Размещение рекламных объявлений по потребности ОПИ и ОБ",
    "Внедрить автоматизацию Авито — свыше 5 объявлений по курьерке"
  ]
};
