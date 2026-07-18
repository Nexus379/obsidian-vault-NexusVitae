<%-*
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const year = targetMoment.format("YYYY");
const kw = targetMoment.format("WW");
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.26
banner_icon: 🍱
fileTitle: "<%- tp.variables.title || (year + '-W' + kw + '_meal') %>"
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan"
frozen: false
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
mon_brk: []
mon_ben: []
mon_lun: []
mon_snk: []
mon_eve: []
tue_brk: []
tue_ben: []
tue_lun: []
tue_snk: []
tue_eve: []
wed_brk: []
wed_ben: []
wed_lun: []
wed_snk: []
wed_eve: []
thu_brk: []
thu_ben: []
thu_lun: []
thu_snk: []
thu_eve: []
fri_brk: []
fri_ben: []
fri_lun: []
fri_snk: []
fri_eve: []
sat_brk: []
sat_ben: []
sat_lun: []
sat_snk: []
sat_eve: []
sun_brk: []
sun_ben: []
sun_lun: []
sun_snk: []
sun_eve: []
mon_add: []
fri_rem: []
wed_add: []
---

# 🍱 Nexus Weekly Meal Architect: <%- year %>-W<%- kw %>

---
## ⏲️ Molecular Timing & Absorption Matrix
> [!info] **Strategic Synergy:** Use this matrix to align your weekly shopping and daily intake.


## 🍝 Weekly Meal Matrix

`BUTTON[edit-meal]` `BUTTON[generate-shopping-list]` 

```dataviewjs
const c = dv.current();
const slots = [
    { id: "brk", label: "🌅 Breakfast" },
    { id: "ben", label: "🍱 Bento" },
    { id: "lun", label: "🥗 Lunch" },
    { id: "snk", label: "🍎 Snack" },
    { id: "eve", label: "🌙 Dinner" }
];

const getMeals = (day, slot) => {
    const val = c[`${day}_${slot}`];
    if (!val) return "—";
    
    let arr = Array.isArray(val) ? val : [val];
    if (arr.length === 0) return "—";
    
    return arr.map(link => {
        let pathStr = (typeof link === "object" && link.path) ? link.path : String(link).replace(/[\[\]"]/g, "").split("|")[0].trim();
        let r = dv.page(pathStr);
        return r ? `${r.file.name}` : link;
    }).join("<br>");
};

const headers = ["🍽️ Slot", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const rows = slots.map(s => [
    `**${s.label}**`,
    getMeals("mon", s.id),
    getMeals("tue", s.id),
    getMeals("wed", s.id),
    getMeals("thu", s.id),
    getMeals("fri", s.id),
    getMeals("sat", s.id),
    getMeals("sun", s.id)
]);

dv.table(headers, rows);
``` 

`BUTTON[reset-schedule]` 

> [!multi-column]
> 
> > [!info] **🌅 Morning (AM)** _Focus: Oxygen & Energy_
> > - **Iron + Vit C:** Best on empty stomach.
> > - **B-Complex:** Activates metabolism.
> > - **Creatine:** Saturation for the day.
> > - **Hydration:** Pinch of sea salt (Adrenal support).
> > ---
> > _🚫 Blocker:_ Coffee, Tea & Polyphenols (60min gap).
> 
> > [!info] **☀️ Midday (MID)** _Focus: Protection & Lipids_
> > - **D3 + K2 + Omega-3:** Needs fat to absorb.
> > - **Choline:** Supports midday focus.
> > - **Vitamin A:** Essential Co-Factor for D3.
> > - **Sequencing:** Fiber/Protein first (Glucose control).
> > ---
> > _🥑 Synergy:_ Take with meal for hormone synthesis.
> 
> > [!info] **🌙 Evening (PM)** _Focus: Recovery & CNS_
> > - **Magnesium:** Relaxes muscles & CNS.
> > - **Zinc + Selenium:** Immune & hormone repair.
> > - **Glycine:** Lowers core temp for sleep.
> > - **Environment:** Low blue light (Melatonin boost).
> > ---
> > _🛌 Rule:_ High Protein/Low Sugar (GH-Optimization).


---


```dataviewjs
/**
 * 🍱 NEXUS WEEKLY MEAL ARCHITECT - Smart Synthesis
 */

const getVal = (stats, key) => Number((stats && stats[key]) || 0);
const Nutri = {
    synergyRules: [
        { type: "success", name: "Iron Catalyst", message: "Iron and Vitamin C are both present.", check: (stats) => getVal(stats, "iron_total_mg") > 0 && getVal(stats, "vit_c_mg") >= 20 },
        { type: "success", name: "Fat-Soluble Support", message: "Vitamin A and fat are both present.", check: (stats) => getVal(stats, "vit_a_total_mcg") > 0 && getVal(stats, "fat_total_g") >= 3 },
        { type: "warning", name: "Mineral Balance", message: "High calcium with low magnesium.", check: (stats) => getVal(stats, "calcium_mg") > 400 && getVal(stats, "magnesium_mg") < 50 }
    ]
};

const p = dv.current();
const days = [
    { id: "mon", name: "Monday" }, { id: "tue", name: "Tuesday" },
    { id: "wed", name: "Wednesday" }, { id: "thu", name: "Thursday" },
    { id: "fri", name: "Friday" }, { id: "sat", name: "Saturday" }, { id: "sun", name: "Sunday" }
];
const slots = ["brk", "ben", "lun", "snk", "eve"];
const slotsLabels = { brk: "🌅 AM", ben: "🍱 Box", lun: "🥗 Mid", snk: "🍎 Snk", eve: "🌙 PM" };

const metrics = ["kcal", "protein_g", "fat_total_g", "carbs_total_g", "fiber_g", "magnesium_mg", "iron_heme_mg", "iron_plant_mg", "iron_total_mg", "calcium_mg", "zinc_mg", "potassium_mg", "vit_a_retinol_mcg", "vit_a_beta_carotin_mcg", "vit_a_total_mcg", "vit_b12_mcg", "vit_c_mg", "vit_d_mcg", "vit_k_mcg", "vit_k1_mcg", "vit_k2_mcg"];

let weeklyData = {};
const round3 = (num) => Math.round(num * 1000) / 1000;

// 🔱 1. CALCULATE DAILY TOTALS
for (let d of days) {
    weeklyData[d.id] = {};
    metrics.forEach(m => weeklyData[d.id][m] = 0);

    for (let s of slots) {
        let links = p[`${d.id}_${s}`];
        if (!links) continue;
        let mealArray = Array.isArray(links) ? links : [links];
        
        for (let link of mealArray) {
            if (!link) continue;
            let pathStr = (typeof link === "object" && link.path) ? link.path : String(link).replace(/[\[\]"]/g, "").split("|")[0].trim();
            let r = dv.page(pathStr);
            
            if (r) {
                const portions = Number(r.portions) || 1;
                metrics.forEach(m => {
                    let val = Number(r["recipe_" + m]) || 0;
                    weeklyData[d.id][m] += (val / portions);
                });
            }
        }
    }
}

// 🔱 2. SMART YAML SYNC (Anti-Lag Guard)
const tFile = app.workspace.getActiveFile();
if (tFile && tFile.path === p.file.path) {
    const currentFm = app.metadataCache.getFileCache(tFile)?.frontmatter || {};
    let needsUpdate = false;

    days.forEach(d => {
        metrics.forEach(m => {
            const val = round3(weeklyData[d.id][m]);
            const fmKey = `${d.id}_${m}`;
            const currentVal = currentFm[fmKey];
            
            if (val > 0 && currentVal !== val) needsUpdate = true;
            if (val === 0 && currentVal !== undefined) needsUpdate = true;
        });
    });

    if (needsUpdate) {
        await app.fileManager.processFrontMatter(tFile, (fm) => {
            days.forEach(d => {
                metrics.forEach(m => {
                    const val = round3(weeklyData[d.id][m]);
                    if (val > 0) fm[`${d.id}_${m}`] = val;
                    else delete fm[`${d.id}_${m}`];
                });
            });
        });
    }
}

// 🔱 3. RENDERING THE MASTER DASHBOARD
dv.header(2, "🛰️ Nexus Weekly Diagnostics");

for (let d of days) {
    const data = weeklyData[d.id];
    if (data.kcal === 0) continue; 

    dv.header(3, d.name);
    
    for (let s of slots) {
        let links = p[`${d.id}_${s}`];
        if (!links) continue;
        let mealArray = Array.isArray(links) ? links : [links];
        
        for (let link of mealArray) {
            let pathStr = (typeof link === "object" && link.path) ? link.path : String(link).replace(/[\[\]"]/g, "").split("|")[0].trim();
            let r = dv.page(pathStr);
            if (r) {
                let title = r.file.name;
                dv.paragraph(`> [!quote|clean] **${slotsLabels[s]}**: [[${pathStr}|${title}]]`);
            }
        }
    }

    dv.paragraph(`🔥 **${Math.round(data.kcal)}** kcal | 💪 **${data.protein_g.toFixed(1)}**g Pro | 🥑 **${data.fat_total_g.toFixed(1)}**g Fat | 🌾 **${data.carbs_total_g.toFixed(1)}**g Carbs`);

    let fullHtml = `<details><summary style="cursor: pointer; opacity: 0.6; font-size: 0.8em;">🧬 View Molecular Profile</summary>`;
    fullHtml += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 5px; font-size: 0.8em; margin-top: 10px; opacity: 0.8;">`;
    
    metrics.forEach(m => {
        if(data[m] > 0) {
            let cleanName = m.replace(/_total_mg|_total|_mg|_mcg|_g|_iu|_ml|_ug/g, "").replace(/_/g, " ");
            cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            let unit = m.includes("_ug") || m.includes("_mcg") ? "mcg" : m.split('_').pop();
            if (m === "iron_total_mg") cleanName = "Iron (Total)";
            if (m === "vit_a_total_mcg") cleanName = "Vitamin A (Total Eq)";
            fullHtml += `<div><b>${cleanName}:</b> ${data[m].toFixed(1)} ${unit}</div>`;
        }
    });
    fullHtml += `</div></details>`;
    dv.span(fullHtml);

    if (Nutri && Nutri.synergyRules) {
        Nutri.synergyRules.forEach(rule => {
            if (rule.check(data)) {
                const type = rule.type === "warning" ? "warning" : "success";
                const icon = rule.type === "warning" ? "⚠️" : "🚀";
                dv.paragraph(`> [!${type}] ${icon} **${rule.name}:** ${rule.message}`);
            }
        });
    }
    dv.paragraph("---");
}
```


---

`BUTTON[freeze-week]` `BUTTON[archive]`