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
      "vk": 24,
      "yula": 2,
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
              "label": "Лиды ВК / Юла",
              "value": "26 (ВК 24 + Юла 2)"
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
      "label": "27 июля–2 августа",
      "avito": {
        "leads": 3931,
        "plan": 2060,
        "planNote": null,
        "cpl": 80,
        "budget": 315624
      },
      "vk": 17,
      "yula": 10,
      "vkyulaNote": "по 04.08 включительно",
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "1 002",
        "sub": "Урбан 213 · МСК ВкусВилл 432 · ЧЛБ+КЗН 357",
        "notes": [
          "↑ CPL Урбан 106 → 140 ₽ (+34 ₽) — третий рост подряд",
          "↑ Конверсия ЧЛБ+КЗН 39,9% → 65,0% (+25 п.п.)",
          "↓ CPL МСК ВкусВилл 63 → 62 ₽"
        ]
      },
      "alerts": [
        {
          "type": "success",
          "title": "Авито: +416 лидов при снижении CPL",
          "text": "3 515 → 3 931 лид (+12%) при CPL 82 → 80 ₽. Выполнение плана 191% против 171% неделей ранее. Рост объёма не стоил эффективности."
        },
        {
          "type": "success",
          "title": "Инвентаризация — рекорд периода",
          "text": "1 636 лидов (273% плана) при лучшем CPL по Авито — 66 ₽. +37% к прошлой неделе. Проект даёт 42% всех лидов Авито."
        },
        {
          "type": "success",
          "title": "ЧЛБ+КЗН: конверсия в адаптацию 65%",
          "text": "39,9% → 65,0% (+25 п.п.). 232 адаптированных при 357 лидах против 259 при 649 — вдвое меньше лидов дают почти тот же результат. Расход сокращён с 53,7 до 28,6 тыс ₽."
        },
        {
          "type": "critical",
          "title": "Урбан Дикси: CPL 140 ₽ — третий рост подряд",
          "text": "84 → 106 → 140 ₽ (+32% за неделю) при 213 лидах. Конверсия упала 8,18% → 5,16%, адаптированных 11. Расход вырос до 29 273 ₽ — платим больше за худшее качество. Нужен разбор кампании."
        },
        {
          "type": "warning",
          "title": "ДРС суммарно 1 440 → 1 002 лида (−30%)",
          "text": "Основной вклад — ЧЛБ+КЗН (расход −47%) и МСК ВкусВилл 571 → 432. Это управляемое сокращение бюджета, а не потеря эффективности: CPL МСК держится 62 ₽, конверсия ЧЛБ+КЗН выросла в 1,6 раза."
        },
        {
          "type": "warning",
          "title": "ВК на паузе: 0 лидов с 03.08 — ожидаем пополнение кабинета",
          "text": "Итого по каналу 26 → 27 лидов (по 04.08 включительно) — держимся за счёт Юлы: 2 → 10 (×5). ВК просел 24 → 17 за неделю, с 03.08 откликов нет: открутка остановлена, ожидаем пополнение кабинета. При прежних 1–5 лидах в день неделя простоя — это ~15 лидов. Реклама в Telegram на паузе — продолжается найм SMM-специалиста."
        }
      ],
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 170,
          "fact": 222,
          "cpl": 80,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 200,
          "fact": 461,
          "cpl": 76,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 150,
          "fact": 423,
          "cpl": 75,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 400,
          "fact": 530,
          "cpl": 76,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 40,
          "fact": 81,
          "cpl": 79,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 500,
          "fact": 578,
          "cpl": 75,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 600,
          "fact": 1636,
          "cpl": 66,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 213,
        "cpl": 140,
        "spend": 29273,
        "adapted": 11,
        "conversion": 5.16
      },
      "chlbkzn": {
        "leads": 357,
        "cpl": 77,
        "spend": 28567,
        "adapted": 232,
        "conversion": 64.99
      },
      "msk": {
        "leads": 432,
        "cpl": 62,
        "spend": 27145,
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
              "value": "—"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "Лиды ВК / Юла",
              "value": "27 (ВК 17 + Юла 10) — по 04.08"
            },
            {
              "label": "Динамика лидов",
              "value": "26 → 27 (+1)"
            },
            {
              "label": "ВК с 03.08",
              "value": "0 лидов ↓ — ожидаем пополнение кабинета"
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
      "label": "3–9 августа",
      "avito": {
        "leads": 1995,
        "plan": 1620,
        "planNote": null,
        "cpl": 96,
        "budget": 191366
      },
      "vk": 16,
      "yula": 16,
      "vkyulaNote": "по 11.08 включительно",
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "1 365",
        "sub": "Урбан 624 · ЧЛБ+КЗН 420 · МСК ВкусВилл 321",
        "notes": [
          "↓ CPL Урбан 140 → 93 ₽ — рост остановлен, объём вырос ×2,9",
          "↑ Адаптированных Урбан 11 → 37, конверсия 5,16% → 5.93%",
          "↓ Конверсия ЧЛБ+КЗН 65,0% → 48.1% — без данных по Ленте и Пятёрочке КЗН"
        ]
      },
      "alerts": [
        {
          "type": "success",
          "title": "Урбан Дикси: CPL 140 → 93 ₽, тревога снята",
          "text": "Три недели подряд CPL рос (84 → 106 → 140 ₽), на этой неделе упал на 47 ₽ при росте объёма 213 → 624 лида. Адаптированных 11 → 37, конверсия 5,16% → 5,93%. Разбор кампании дал результат."
        },
        {
          "type": "success",
          "title": "ОПИ: план выполнен на 123% при урезанной потребности",
          "text": "1 995 лидов против плана 1 620. Потребность сокращена на 21% (2 060 → 1 620), и факт впервые идёт вплотную к плану, а не втрое выше: по шести проектам из восьми расхождение с планом в пределах 10%. Работа стала точнее по потребности."
        },
        {
          "type": "critical",
          "title": "CPL Авито 80 → 96 ₽ (+16 ₽) — максимум за 8 недель",
          "text": "Бюджет сократился на 39% (315 624 → 191 366 ₽), а лиды на 49% (3 931 → 1 995). Основной вклад — Инвентаризация: 1 636 → 943 лида при расходе 116 285 → 75 588 ₽, фактический CPL 71 → 80 ₽. По Курьерам расхождение больше: заявлено 80 ₽, по факту 41 710 / 298 = 140 ₽."
        },
        {
          "type": "success",
          "title": "ВК и Юла: 32 лида по 11.08 — рост несмотря на трёхдневный простой",
          "text": "Открутка ВК стояла 03–05.08 из-за пустого кабинета, отклики возобновились 06.08, основной объём пришёл 10–11.08 (10 из 16). Юла отработала всю неделю: 10 → 16 откликов. Итого по каналу 27 → 32. Таргетированная реклама дополнительно привела 31 подписчика в сообщество. Реклама в Telegram по-прежнему на паузе — продолжается найм SMM-специалиста."
        },
        {
          "type": "warning",
          "title": "Гравис: новый проект, CPL 107 ₽ — самый дорогой в ОПИ",
          "text": "22 лида при плане 20 (110%), расход 7 216 ₽. Дороже среднего по Авито на 11 ₽ и вдвое дороже Ленты МСК. Первая неделя — нужен второй замер, прежде чем делать вывод."
        }
      ],
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 160,
          "fact": 167,
          "cpl": 79,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 200,
          "fact": 194,
          "cpl": 77,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 60,
          "fact": 65,
          "cpl": 76,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 250,
          "fact": 269,
          "cpl": 74,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 30,
          "fact": 37,
          "cpl": 80,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 300,
          "fact": 298,
          "cpl": 80,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 600,
          "fact": 943,
          "cpl": 75,
          "hidden": false
        },
        {
          "name": "Гравис",
          "plan": 20,
          "fact": 22,
          "cpl": 107,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 624,
        "cpl": 93,
        "spend": 58112,
        "adapted": 37,
        "conversion": 5.93
      },
      "chlbkzn": {
        "leads": 420,
        "cpl": 95,
        "spend": 39953,
        "adapted": 202,
        "conversion": 48.1
      },
      "msk": {
        "leads": 321,
        "cpl": 65,
        "spend": 20824,
        "adapted": 19,
        "conversion": 5.92
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "+31 привлечено таргетом · замера базы не было"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "Лиды ВК / Юла",
              "value": "32 (ВК 16 + Юла 16) — по 11.08"
            },
            {
              "label": "Динамика лидов",
              "value": "27 → 32 (+5)"
            },
            {
              "label": "Простой ВК",
              "value": "03–05.08 без откликов, возобновились 06.08"
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
      "label": "10–16 августа",
      "avito": {
        "leads": 2612,
        "plan": 1620,
        "planNote": null,
        "cpl": 109,
        "budget": 285865
      },
      "vk": 15,
      "yula": 11,
      "vkyulaNote": "чистая неделя 10–16.08",
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "814",
        "sub": "Урбан 208 · ЧЛБ+КЗН 410 · МСК ВкусВилл 196",
        "notes": [
          "↑ CPL Урбан 93 → 151 ₽ при падении объёма 624 → 208",
          "↑ Конверсия ЧЛБ+КЗН 48,1% → 57.07%, адаптированных 202 → 234",
          "↓ Конверсия ВкусВилл 5,92% → 1.02%, адаптированных 19 → 2"
        ]
      },
      "alerts": [
        {
          "type": "critical",
          "title": "CPL Авито 96 → 109 ₽ — третья неделя роста подряд",
          "text": "Динамика 80 → 96 → 109 ₽, максимум за всё время наблюдений. Бюджет вырос на 49% (191 366 → 285 865 ₽), лиды — на 31% (1 995 → 2 612): расход опережает отдачу. Дороже всех Гравис (87 ₽) и Курьеры (86 ₽), дешевле всех Лента МСК и Инвентаризация (по 72 ₽)."
        },
        {
          "type": "critical",
          "title": "Урбан Дикси: откат — CPL 93 → 151 ₽, объём 624 → 208",
          "text": "Неделей ранее CPL удалось сбить со 140 до 93 ₽ при росте объёма втрое. Сейчас движение в обратную сторону: лидов втрое меньше, лид дороже на 58 ₽. Адаптированных 37 → 21, но конверсия выросла 5,93% → 10,10% — то есть трафик стал уже и качественнее, а не хуже. Нужно понять, сокращение это по потребности или сбой открутки."
        },
        {
          "type": "warning",
          "title": "ОПИ: 161% плана — перевыполнение вернулось",
          "text": "2 612 лидов против плана 1 620. Неделей ранее факт впервые шёл вплотную к плану (123%), теперь снова разрыв. Основной вклад — Магнит КРД: 579 при плане 160 (362%) и Гравис: 75 при плане 20 (375%). Потребность при этом не менялась — плановые цифры те же, что неделю назад."
        },
        {
          "type": "warning",
          "title": "ВкусВилл МСК: конверсия 5,92% → 1,02%",
          "text": "196 лидов и всего 2 адаптированных против 19 неделей ранее. CPL почти не изменился (65 → 69 ₽), то есть дело не в качестве закупки трафика, а в том, что происходит после передачи лида."
        },
        {
          "type": "success",
          "title": "ЧЛБ + КЗН: конверсия 48,1% → 57,1%, лучший результат за период",
          "text": "410 лидов и 234 адаптированных. Лидируют КЗН Табыш (32 из 44, 72,7%) и ЧЛБ Пятёрочка (20 из 30, 66,7%). CPL вырос 95 → 103 ₽, но при такой конверсии стоимость адаптированного всё равно ниже, чем на других направлениях."
        },
        {
          "type": "success",
          "title": "ВК и Юла: 26 лидов за неделю, +27 подписчиков с таргета",
          "text": "ВК 15, Юла 11, простоев на неделе не было. Расход: ВК 23 102 ₽, Юла 2 799 ₽ — лид из ВК стоил 1 540 ₽. Пик пришёлся на 10 и 11 августа (11 и 7 откликов), 15 и 16 августа — пусто. Таргетированная реклама дополнительно привела 27 подписчиков в сообщество. Реклама в Telegram по-прежнему на паузе — продолжается найм SMM-специалиста."
        }
      ],
      "projects": [
        {
          "name": "МАГНИТ КРД",
          "plan": 160,
          "fact": 579,
          "cpl": 83,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КРД",
          "plan": 200,
          "fact": 351,
          "cpl": 77,
          "hidden": false
        },
        {
          "name": "ЛЕНТА КЗН",
          "plan": 60,
          "fact": 120,
          "cpl": 75,
          "hidden": false
        },
        {
          "name": "ЛЕНТА МСК",
          "plan": 250,
          "fact": 470,
          "cpl": 72,
          "hidden": false
        },
        {
          "name": "ЛЕНТА ЧЛБ",
          "plan": 30,
          "fact": 36,
          "cpl": 78,
          "hidden": false
        },
        {
          "name": "Курьеры",
          "plan": 300,
          "fact": 308,
          "cpl": 86,
          "hidden": false
        },
        {
          "name": "Инвентаризация",
          "plan": 600,
          "fact": 673,
          "cpl": 72,
          "hidden": false
        },
        {
          "name": "Гравис",
          "plan": 20,
          "fact": 75,
          "cpl": 87,
          "hidden": false
        }
      ],
      "urban": {
        "leads": 208,
        "cpl": 151,
        "spend": 31315,
        "adapted": 21,
        "conversion": 10.1
      },
      "chlbkzn": {
        "leads": 410,
        "cpl": 103,
        "spend": 42226,
        "adapted": 234,
        "conversion": 57.07
      },
      "msk": {
        "leads": 196,
        "cpl": 69,
        "spend": 13427,
        "adapted": 2,
        "conversion": 1.02
      },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            {
              "label": "Подписчики",
              "value": "+27 привлечено таргетом · замера базы не было"
            },
            {
              "label": "Охват",
              "value": "—"
            },
            {
              "label": "Лиды ВК / Юла",
              "value": "26 (ВК 15 + Юла 11) — чистая неделя"
            },
            {
              "label": "Динамика лидов",
              "value": "26 лидов · расход 25 901 ₽"
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
      "label": "17–23 августа",
      "avito": {
        "leads": 3293,
        "plan": 1620,
        "planNote": null,
        "cpl": 94,
        "budget": 309879
      },
      "vk": 12,
      "yula": 6,
      "vkyulaNote": "чистая неделя 17–23.08",
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "914",
        "sub": "Урбан 201 · ЧЛБ+КЗН 471 · МСК ВкусВилл 242",
        "notes": [
          "↑ CPL Урбан 151 → 182 ₽ (+31 ₽) при том же объёме 208 → 201",
          "↓ Конверсия ЧЛБ+КЗН 57,1% → 48,8%, вышедших 234 → 230",
          "↑ Конверсия ВкусВилл 1,02% → 2,48%, вышедших 2 → 6"
        ]
      },
      "alerts": [
        {
          "type": "critical",
          "title": "Инвентаризация: 2 158 лидов и 210 тыс ₽ — 68% всего бюджета Авито",
          "text": "Лиды выросли втрое (673 → 2 158), расход — в 2,4 раза (88 054 → 209 861 ₽). Проект забрал 68% недельного бюджета ОПИ и дал 66% лидов. Вышедших при этом 15 — конверсия 0,7%. Стоимость одного вышедшего по проекту — 13 991 ₽. Требуется решение: нужен ли такой объём при текущей потребности."
        },
        {
          "type": "success",
          "title": "CPL Авито 109 → 94 ₽ при росте лидов на 26%",
          "text": "2 612 → 3 293 лида при бюджете 285 865 → 309 879 ₽ (+8%). Объём вырос сильно дешевле, чем расход — впервые за три недели тренд роста CPL сломлен. Дешевле всех Лента КЗН (73 ₽), дороже всех Гравис (101 ₽)."
        },
        {
          "type": "success",
          "title": "Курьеры: расход сокращён на 66%, лид подешевел с 211 до 97 ₽",
          "text": "64 927 → 21 878 ₽ при лидах 308 → 226 (−27%). Снятие продвижения дало падение стоимости лида по расходу более чем вдвое. Проект остаётся в плане на 75% — при потребности это управляемое сокращение, а не провал."
        },
        {
          "type": "warning",
          "title": "ДРС: CPL 107 → 135 ₽ (+28 ₽) при росте объёма",
          "text": "914 лидов против 814 (+12%), но расход вырос с 86 968 до 123 010 ₽ (+41%). Дороже всех Урбан Дикси — 182 ₽ за лид. ЧЛБ+КЗН 123 ₽, ВкусВилл 117 ₽. Рост объёма куплен опережающим ростом бюджета."
        },
        {
          "type": "critical",
          "title": "Стоимость вышедшего: 11 477 ₽ у ОПИ против 488 ₽ у ДРС",
          "text": "У Даниила 27 вышедших на 3 293 лида Авито (0,8%) при расходе 309 879 ₽. У Дианы 252 вышедших на 914 лидов Авито (27,6%) при 123 010 ₽. CPL у обоих сопоставим, а стоимость результата отличается в 23 раза. Пока не подтверждено, полностью ли заполняется колонка «Вышедшие» по ОПИ — это первое, что нужно проверить."
        },
        {
          "type": "warning",
          "title": "ВК Дианы: 5 354 ₽ и ноль лидов — вторая неделя подряд",
          "text": "За две недели по ВК Дианы 10 540 ₽ без единого зафиксированного отклика. У Даниила ВК дал 12 лидов при 15 190 ₽ — по 1 266 ₽ за лид. Юла: Даниил 1 лид за 2 207 ₽, Диана 5 лидов по 514 ₽. Суммарно каналы дали 18 лидов против 26 неделей раньше при почти том же расходе — 25 319 против 25 901 ₽."
        }
      ],
      "projects": [
        { "name": "МАГНИТ КРД", "plan": 160, "fact": 245, "cpl": 75, "hidden": false },
        { "name": "ЛЕНТА КРД", "plan": 200, "fact": 171, "cpl": 77, "hidden": false },
        { "name": "ЛЕНТА КЗН", "plan": 60, "fact": 114, "cpl": 73, "hidden": false },
        { "name": "ЛЕНТА МСК", "plan": 250, "fact": 297, "cpl": 75, "hidden": false },
        { "name": "ЛЕНТА ЧЛБ", "plan": 30, "fact": 46, "cpl": 78, "hidden": false },
        { "name": "Курьеры", "plan": 300, "fact": 226, "cpl": 81, "hidden": false },
        { "name": "Инвентаризация", "plan": 600, "fact": 2158, "cpl": 90, "hidden": false },
        { "name": "Гравис", "plan": 20, "fact": 36, "cpl": 101, "hidden": false }
      ],
      "urban":   { "leads": 201, "cpl": 182, "spend": 36687, "adapted": 16,  "conversion": 7.96 },
      "chlbkzn": { "leads": 471, "cpl": 123, "spend": 58104, "adapted": 230, "conversion": 48.83 },
      "msk":     { "leads": 242, "cpl": 117, "spend": 28219, "adapted": 6,   "conversion": 2.48 },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            { "label": "Подписчики", "value": "1 305 → 1 316 (+11)" },
            { "label": "Лиды ВК / Юла", "value": "18 (ВК 12 + Юла 6) — чистая неделя" },
            { "label": "Динамика лидов", "value": "26 → 18 (−8, −31%)" },
            { "label": "Расход", "value": "ВК 20 544 ₽ · Юла 4 775 ₽" },
            { "label": "Цена лида", "value": "ВК 1 712 ₽ · Юла 796 ₽" }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            { "label": "Подписчики", "value": "—" },
            { "label": "Охват", "value": "—" },
            { "label": "ER", "value": "—" },
            { "label": "Реклама", "value": "⏸ приостановлена" },
            { "label": "Причина", "value": "идёт найм SMM-специалиста" }
          ]
        }
      ],
      "tg": { "value": null, "sub": "пакеты", "details": [] }
    },
    {
      "label": "24–30 августа",
      "avito": {
        "leads": 3012,
        "plan": 1620,
        "planNote": null,
        "cpl": 127,
        "budget": 383331
      },
      "vk": 9,
      "yula": 8,
      "vkyulaNote": "чистая неделя 24–30.08",
      "extraKpi": {
        "label": "Проекты ДРС",
        "value": "842",
        "sub": "Урбан 199 · ЧЛБ+КЗН 457 · Ростикс 104 · ВкусВилл 82",
        "notes": [
          "↑ CPL Урбан 182 → 303 ₽ (+121 ₽) при том же объёме 201 → 199",
          "↑ Конверсия Урбан 7,96% → 11,56%, вышедших 16 → 23",
          "↓ ЧЛБ+КЗН 471 → 457 лидов, конверсия 48,8% → 49,0%",
          "Ростикс ДРС — новый проект: 104 лида, CPL 116 ₽"
        ]
      },
      "alerts": [
        {
          "type": "critical",
          "title": "CPL Авито 94 → 127 ₽ (+35%) при падении лидов на 9%",
          "text": "Расход ОПИ вырос с 309 879 до 383 331 ₽ (+24%), лиды снизились с 3 293 до 3 012. Это первая неделя, где бюджет и объём разошлись в разные стороны. Основной вклад — Курьеры и Лента КРД: на них ушло 126 тыс ₽ против 29 тыс неделей раньше."
        },
        {
          "type": "critical",
          "title": "Курьеры: расход вырос в 4 раза — 21 878 → 86 729 ₽",
          "text": "Лиды при этом снизились: 226 → 219. По расходу лид стоит 396 ₽ против 97 ₽ неделей раньше, в колонке таблицы — 80 ₽. Разница в четыре раза — это продвижение, которое входит в расход, но не входит в стоимость лида. Проект выполнил план на 73%. Нужно решение по объёму продвижения."
        },
        {
          "type": "warning",
          "title": "Урбан Дикси: 60 343 ₽ за 199 лидов, CPL 303 ₽",
          "text": "Расход вырос на 64% при том же объёме лидов (201 → 199), CPL 182 → 303 ₽. При этом конверсия улучшилась: 7,96% → 11,56%, вышедших 16 → 23. Стоимость вышедшего 2 624 ₽ против 2 293 ₽ — рост на 14%, то есть подорожание частично окупилось качеством."
        },
        {
          "type": "success",
          "title": "Инвентаризация: доля в бюджете ОПИ снижена с 68% до 46%",
          "text": "Расход 209 861 → 178 039 ₽ (−15%), лиды 2 158 → 1 500. План выполнен на 250%. Неделей раньше проект забирал две трети бюджета ОПИ — сейчас меньше половины. Управляемое сокращение, о котором говорили в прошлом периоде."
        },
        {
          "type": "success",
          "title": "ДРС: 251 вышедший при 842 лидах — конверсия 29,8%",
          "text": "Против 27,6% неделей раньше. Лучшие: ЧЛБ Монетка 118 вышедших из 193 (61,1%), Лента ЧЛБ 30 из 52 (57,7%), ЧЛБ Пятёрочка 22 из 47 (46,8%). Стоимость вышедшего по ДРС — 531 ₽."
        },
        {
          "type": "warning",
          "title": "Вышедшие по ОПИ: 16 на 3 012 лидов (0,53%)",
          "text": "Неделей раньше было 27 на 3 293. Стоимость вышедшего выросла с 11 477 до 23 958 ₽. Колонка «Вышедшие» по ОПИ заполняется частично — по Курьерам за неделю не проставлено ни одного значения. До того как делать выводы по эффективности, нужно подтвердить полноту учёта."
        }
      ],
      "projects": [
        { "name": "МАГНИТ КРД", "plan": 160, "fact": 203, "cpl": 74, "hidden": false },
        { "name": "ЛЕНТА КРД", "plan": 200, "fact": 447, "cpl": 74, "hidden": false },
        { "name": "ЛЕНТА КЗН", "plan": 60, "fact": 195, "cpl": 80, "hidden": false },
        { "name": "ЛЕНТА МСК", "plan": 250, "fact": 379, "cpl": 75, "hidden": false },
        { "name": "ЛЕНТА ЧЛБ", "plan": 30, "fact": 30, "cpl": 85, "hidden": false },
        { "name": "Курьеры", "plan": 300, "fact": 219, "cpl": 80, "hidden": false },
        { "name": "Инвентаризация", "plan": 600, "fact": 1500, "cpl": 90, "hidden": false },
        { "name": "Гравис", "plan": 20, "fact": 39, "cpl": 105, "hidden": false }
      ],
      "urban":   { "leads": 199, "cpl": 303, "spend": 60343, "adapted": 23,  "conversion": 11.56 },
      "chlbkzn": { "leads": 457, "cpl": 115, "spend": 52726, "adapted": 224, "conversion": 49.02 },
      "msk":     { "leads": 82,  "cpl": 98,  "spend": 8065,  "adapted": 4,   "conversion": 4.88 },
      "rostiks": { "leads": 104, "cpl": 116, "spend": 12038, "adapted": null, "conversion": null },
      "social": [
        {
          "name": "💙 ВКонтакте",
          "platform": "таргет / сообщество",
          "stats": [
            { "label": "Подписчики", "value": "—" },
            { "label": "Лиды ВК / Юла", "value": "17 (ВК 9 + Юла 8) — чистая неделя" },
            { "label": "Динамика лидов", "value": "18 → 17 (−1)" },
            { "label": "Расход", "value": "ВК 18 657 ₽ · Юла 4 264 ₽" },
            { "label": "Цена лида", "value": "ВК 2 073 ₽ · Юла 533 ₽" }
          ]
        },
        {
          "name": "✈ Telegram",
          "platform": "канал",
          "stats": [
            { "label": "Подписчики", "value": "—" },
            { "label": "Охват", "value": "—" },
            { "label": "ER", "value": "—" },
            { "label": "Реклама", "value": "⏸ приостановлена" },
            { "label": "Причина", "value": "идёт найм SMM-специалиста" }
          ]
        }
      ],
      "tg": { "value": null, "sub": "пакеты", "details": [] }
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
