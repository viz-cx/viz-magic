# Plan: Mana Display — от basis points к процентам

## Цель
Изменить отображение маны (энергии VIZ) с формата «X / 10000» на «X.XX%» в UI.
Блокчейн-значения остаются прежними (0–10000 basis points — это требование сети VIZ).
Только отображение пользователю меняется.

## Принцип
- Внутренний формат: 0–10000 (basis points). НЕ ТРОГАЕМ.
- Для отображения: bpToPercent(val) = val / 100 → «1.00%»
- Максимум 10000 → «100.00%»
- Стоимость 100 → «1.00%»
- Стоимость 5000 → «50.00%»

## Что НЕ трогаем (внутренняя логика)
- config.js — ENERGY.MAX, MIN_HUNT_COST, MIN_BLESS_COST (числа в basis points нужны engine)
- broadcast.js — award() шлёт energy в блокчейн, тип числа не меняем
- duel-protocol.js, guild-protocol.js — energy_pledge передаётся в цепь
- engine/duel.js, engine/formulas.js, engine/crafting.js, engine/enchanting.js — внутренняя математика
- blockchain/account.js — calculateCurrentEnergy() возвращает 0–10000
- duel-state.js — energyPledge хранится в basis points

## Что меняем (только отображение)

### 1. helpers.js — добавить bpToPercent()
Новая утилита: (val / 100).toFixed(2) + '%'

### 2. i18n/en.js и i18n/ru.js
- hunt_mana_cost: «Costs {cost}% mana» / «Стоит {cost}% маны»
  (cost будет уже в процентах)

### 3. ui/screens/home.js
- ProgressBar.create max:10000 → max:100
- ProgressBar.update: передавать currentEnergy / 100 вместо raw value
- label маны: показывать «100.00%» через bpToPercent

### 4. ui/screens/hunt.js
- spell-cost display: s.manaCost / 10000 * 100 → bpToPercent(s.manaCost)
- aria-label: использовать bpToPercent(s.manaCost)
- playerEnergy fallback 10000 — оставить (внутренняя логика), но убрать hardcoded текст
- i18n строка hunt_mana_cost передаёт уже %

### 5. ui/screens/crafting.js (строка 159)
- «recipe.manaCost / 10000 Mana» → bpToPercent(recipe.manaCost) + Mana

### 6. ui/screens/chronicle.js
- BLESS_ENERGY = 100 — оставить (это BP), но display «1.00%»

### 7. ui/components/progress-bar.js
- Если max=100 передаётся, работает автоматически. Ничего дополнительно.

### 8. engine/enchanting.js (строка 293)
- manaRestored = 2000 — не трогаем (внутренний BP). 
  Но сообщение пользователю о восстановлении (если есть) — показать %.

## Места, где 10000 НЕ отображение (не трогаем):
- engine/world-boss.js: sharePercent — это доля HP, не мана
- engine/territory.js: TAX_MIN 500 — налоги, не мана
- engine/guild.js: tithe_pct 1000 — тиды, не мана
- ui/screens/map.js: homeBonus / 10 — бонус зон, не мана

## Итого файлов к правке
1. app/js/utils/helpers.js — добавить bpToPercent()
2. app/js/i18n/en.js — строки hunt_mana_cost
3. app/js/i18n/ru.js — строки hunt_mana_cost
4. app/js/ui/screens/home.js — ProgressBar + mana update
5. app/js/ui/screens/hunt.js — spell-cost display + aria
6. app/js/ui/screens/crafting.js — mana cost строка
7. (опционально) app/js/ui/screens/chronicle.js — BLESS display

## Риски
- NONE критических. Все расчёты остаются в basis points.
- Единственный риск — пропустить место отображения → решается grep-проверкой.

## Definition of Done
- Ни одного «/ 10000» в UI-коде отображения
- Ни одного голого manaCost без конвертации в отображаемых строках
- ProgressBar маны работает с диапазоном 0–100 (не 0–10000)
- Все места показа маны используют bpToPercent()
