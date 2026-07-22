<%-*
// 🔱 1. INITIALIZATION & DATE
if (!tp.variables) tp.variables = {}; // 🛡️ crash guard
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const energy = tp.variables.energy || "3";
const [yy, mm] = dateStr.split("-");
const py = tp.variables.planYear || tp.date.now("YYYY");
const pk = tp.variables.planKw || tp.date.now("WW");

// 🔱 2. DISCIPLINE PICK (disciplineEngine)
let disc = "#disc", sci = "#science", label = "General", icon = "📚", persona = "student";
if (typeof tp.user.disciplineEngine === "function") {
    const engine = tp.user.disciplineEngine();
    const list = engine.getDisciplineLabels();
    const sel = await tp.system.suggester(
        list.map(d => `${d.icon}${d.label}`),
        list, false, "📚 Focus discipline?"
    );
    if (sel) {
        disc = sel.disc;
        sci = sel.sci.join('", "');
        label = sel.label;
        icon = sel.icon;
        persona = sel.persona;
    }
}

// 🔱 3. MAIN TOPIC
let topic = await tp.system.prompt("📝 Main topic / theme this week?", "");
if (!topic) topic = "General Study";

// 🔱 4. FOR WHOM (Original Naming Logic + Group Subfolders)
const relFolder = "2_Areas/2_Relationship";
const persons = app.vault.getMarkdownFiles()
    .filter(f => f.path.startsWith(relFolder + "/") && f.basename.startsWith("Person_"));

const pOpts = ["🧍 Me / myself", ...persons.map(f => {
    const cleanName = f.basename.replace(/^Person_/, "");
    const groupName = f.parent.name !== "2_Relationship" ? ` (${f.parent.name})` : "";
    return `👤 ${cleanName}${groupName}`;
}), "➕ ✨ New person..."];
const pVals = ["__me__", ...persons.map(f => f.basename), "__new__"];

let forName = ""; 
const pick = await tp.system.suggester(pOpts, pVals, false, "👤 Plan for whom?");

if (pick === "__new__") {
    let nn = await tp.system.prompt("👤 New person — name?", "");
    if (nn && nn.trim()) {
        nn = nn.trim().replace(/[\\/:*?"<>|]/g, ""); 
        forName = "Person_" + nn; 
        
        const groupOpts = ["👨‍👩‍👧‍👦 Family", "👯 Friends", "🎓 Students", "💼 Colleagues", "❤️ Partner", "➕ Custom Group..."];
        const groupVals = ["Family", "Friends", "Students", "Colleagues", "Partner", "Custom"];
        let groupName = await tp.system.suggester(groupOpts, groupVals, false, "📂 Select Group/Folder for this person:") || "Uncategorized";

        if (groupName === "Custom") {
            groupName = await tp.system.prompt("📂 Enter custom group name:", "Acquaintance") || "Uncategorized";
            groupName = groupName.trim().replace(/[\\/:*?"<>|]/g, "-"); 
        }

        const targetDir = `${relFolder}/${groupName}`;
        const pPath = `${targetDir}/${forName}.md`;
        
        if (!app.vault.getAbstractFileByPath(pPath)) {
            let cur = "";
            for (const seg of targetDir.split("/")) { 
                cur = cur ? cur + "/" + seg : seg; 
                if (!app.vault.getAbstractFileByPath(cur)) await app.vault.createFolder(cur); 
            }
            
            const profileYAML = `---\nbanner_icon: "👤"\narch:\n  - "#2area"\narchtype:\n  - "#2area/2relationship"\nstatus: 1active\npriority:\n  - "4"\narea2: "#2area/2relationship"\nparent: "[[2_Areas/2_Relationship]]"\n---\n# 👤 ${nn}\n\n> [!quote] "The quality of your life is the quality of your relationships."\n\n## 🤝 Profile & Base Data\n> [!multi-column]\n>\n> > [!info|wide-1] 👤 Vitals\n> > **Relation:** ${groupName}\n> > **Birthday:** \n>\n> > [!love|wide-1] 🎁 Traits & Preferences\n> > **Interests:** \n\n## 🚀 Active Responsibilities\n\`\`\`dataview\nTABLE status AS Status, persona AS Persona\nFROM "3_Projects"\nWHERE contains(area2, this.file.link) OR contains(parent, this.file.link)\nSORT file.mtime DESC\n\`\`\`\n`;
            await app.vault.create(pPath, profileYAML);
        }
    }
} else if (pick && pick !== "__me__") {
    forName = pick;
}

const forLink = forName ? `[[${forName}]]` : "";
const whoSlug = forName ? forName.replace(/^Person_/, "") : "me";

// 🔱 5. SMART ROUTING & RENAME
const baseName = `${py}-W${pk}_study_${whoSlug}`;
let targetFolder = "";

if (whoSlug === "me") {
    targetFolder = `0_Calendar/7_Plan/${py}/${mm}`;
} else {
    targetFolder = `3_Projects/1_Active/Studyplan_${whoSlug}/Plans/${py}`;
}

let tPath = "";
for (const seg of targetFolder.split('/')) {
    tPath = tPath === "" ? seg : `${tPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(tPath)) await app.vault.createFolder(tPath);
}

let uniq = baseName;
let n = 2;
while (app.vault.getAbstractFileByPath(`${targetFolder}/${uniq}.md`) && tp.file.title !== uniq) { 
    uniq = `${baseName}-${n++}`; 
}

const finalDest = `${targetFolder}/${uniq}.md`;

if (tp.file.title !== uniq) await tp.file.rename(uniq);
if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    await new Promise(r => setTimeout(r, 200));
    await tp.file.move(finalDest);
}

tR += "---";
%>
banner_icon: <%- icon %>
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/study"
frozen: false
plan_type: study
plan_year: "<%- py %>"
plan_kw: "<%- pk %>"
status: 1active
persona: "<%- persona %>"
cal_date: "<%- dateStr %>"
energy: "<%- energy %>"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
topic: "<%- topic %>"
for: "<%- forLink %>"
area2: "<%- forLink || '#2area/1selfcare' %>"
tt_start: 08:15
tt_duration: 45
tt_periods: 16
tt_breaks: "2:15, 4:15, 6:30"
---
# <%- icon %> Study · <%- whoSlug %> · <%- py %>-W<%- pk %>

> [!info] 🎯 Focus
> **For:** <%- forLink || "Me" %>
> **Discipline:** `$= dv.current().discipline`  ·  **Science:** `$= dv.current().science`
> **Main Topic:** <%- topic %>

---

## 🗓️ Weekly Timetable

`BUTTON[setup-timetable]` `BUTTON[edit-timetable]`
<small style="opacity:0.45;font-style:italic;">(empty grid? run Setup Timetable for start/periods, then Edit Timetable to place disciplines)</small>

```dataviewjs
// 1. DATEN AUS DEM YAML LESEN
const c = dv.current();
const startTime = c.tt_start || "08:00";     
const classDuration = Number(c.tt_duration) || 45;      
const totalPeriods = Number(c.tt_periods) || 8;        
const breaksStr = String(c.tt_breaks || "");

const customBreaks = {};
if (breaksStr) {
    breaksStr.split(",").forEach(b => {
        let parts = b.split(":");
        if(parts.length === 2) {
            let pIdx = parseInt(parts[0].trim());
            let pDur = parseInt(parts[1].trim());
            if(!isNaN(pIdx) && !isNaN(pDur)) customBreaks[pIdx] = pDur;
        }
    });
}

// 2. ENGINE LADEN
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/disciplineEngine.js";
let engine = null;
try { engine = require(enginePath)(); } catch(e) {}

const getD = (key) => {
    if (Array.isArray(key)) return key.map(k => getD(k)).join("<br>");
    if (!key || key === "free") return "—";
    if (key === "break") return "☕ **BREAK**";
    
    let parts = String(key).split("|");
    let baseKey = parts[0];
    let detail = parts.length > 1 ? ` _(${parts.slice(1).join(" ")})_` : "";

    if (baseKey === "custom") return `🔸 ${parts.slice(1).join(" ")}`;
    
    if (engine && engine.all && engine.all[baseKey]) {
        return `${engine.all[baseKey].icon} ${engine.all[baseKey].label}${detail}`;
    }
    return `❓ ${key}`;
};

// 3. ZEITEN AUTOMATISCH BERECHNEN
let current = moment(startTime, "HH:mm");
let slots = [];

for (let i = 1; i <= totalPeriods; i++) {
    let end = moment(current).add(classDuration, 'minutes');
    slots.push({ id: String(i), time: `${current.format("HH:mm")} - ${end.format("HH:mm")}`, isBreak: false });
    current = end;

    if (customBreaks[i] && i !== totalPeriods) {
        let currentBreakDuration = customBreaks[i];
        let breakEnd = moment(current).add(currentBreakDuration, 'minutes');
        slots.push({ id: `break${i}`, time: `${current.format("HH:mm")} - ${breakEnd.format("HH:mm")}`, isBreak: true });
        current = breakEnd;
    }
}

// 4. TABELLE ZEICHNEN
const headers = ["⌚ Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const rows = slots.map(s => {
    if(s.isBreak) {
        return [`**${s.time}**`, getD("break"), getD("break"), getD("break"), getD("break"), getD("break")];
    }
    return [
        `**${s.time}**`,
        getD(c[`tt_mon_${s.id}`]),
        getD(c[`tt_tue_${s.id}`]),
        getD(c[`tt_wed_${s.id}`]),
        getD(c[`tt_thu_${s.id}`]),
        getD(c[`tt_fri_${s.id}`])
    ];
});

dv.table(headers, rows);
```

`BUTTON[reset-schedule]`

---

## 📚 Topics to Study & Subtasks
- [ ] <%- topic %>
- [ ] 

## 🎯 Weekly Goals
- 

---
`BUTTON[freeze-week]` `BUTTON[archive]` `BUTTON[archive-month]`
