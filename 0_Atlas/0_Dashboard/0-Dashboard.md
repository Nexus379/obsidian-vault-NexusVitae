---
banner: "![[xAttachment/Images/Banner/violet sky ocean.jpg]]"
banner_y: 0.316
banner_icon: 💫
status:
cssclasses:
  - wide-page
  - dashboard-no-border
---

# 💫 Dashboard
| [[0_Atlas/0_Dashboard/0-Dashboard|💫Dashy]] | [[0_Atlas/0_Dashboard/0-Inbox|💌Inbox]] | [[0_Atlas/0_Dashboard/0-Calendar|📅Calendar]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard|🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive_Financeboard|🪙Finance]] | [[0_Atlas/0_Dashboard/7-Reviews|🛰️Reviews]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

--- 
>[!multi-column]
> 
> > [!blank|wide-0] 
> > #### 🔱 **NEXUS FLOW**
> > 
> > ```dataviewjs
> > await require(app.vault.adapter.basePath + "/zData/2scripts/dashboardMain.js")().flow(dv, app, this);
> > ``` 
> > ---
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5] 📊 Status & Records
> > > [!multi-column]
> > > 
> > > > [!pink] **🌷 LIFE (PLM)**  
> > > > ```dataviewjs
> > > > {
> > > >     const container = this.container;
> > > >     if (container.innerHTML.length < 50) {
> > > >         const pages = dv.pages('!"zData" and !"0_Calendar" and -"yArchive"').where(p => p.inbox !== true)
> > > >             .where(p => dv.array(p.persona).some(m => ["guardian", "warrior", "nurturer", "parent", "child", "sibling", "partner", "friend", "lover", "host", "traveler", "player", "monk_nun", "caretaker"].some(tag => String(m).toLowerCase().includes(tag))) 
> > > >                      || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("plm")))
> > > >             .sort(p => p.file.mtime, "desc").limit(5);
> > > > 
> > > >         let html = `<div style="display: flex; flex-direction: column; gap: 4px; padding: 5px 0;">`;
> > > >         pages.forEach(p => {
> > > >             const color = "#ff79c6";
> > > >             const auroraBg = `linear-gradient(270deg, ${color}15 0%, transparent 95%)`;
> > > >             
> > > >             html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px; box-shadow: -2px 0 8px ${color}33;">
> > > >                 <div style="display: flex; align-items: center; gap: 10px;">
> > > >                     <span style="font-size: 1.1em;">🌷</span>
> > > >                     <span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px;">PLM</span>
> > > >                 </div>
> > > >                 <div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 180px;">
> > > >                     <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.78em; font-weight: 500; opacity: 0.9;">${p.file.name}</a>
> > > >                     <div style="font-size: 0.52em; color: var(--text-faint); margin-top: -1px; opacity: 0.6;">${moment(p.file.mtime.toString()).fromNow()}</div>
> > > >                 </div>
> > > >             </div>`;
> > > >         });
> > > >         dv.el("div", html + `</div>`);
> > > >     }
> > > > }
> > > > ```
> > > 
> > > > [!success] **🌻 MANAGE (PPM)**  
> > > > ```dataviewjs
> > > > {
> > > >     const container = this.container;
> > > >     if (container.innerHTML.length < 50) {
> > > >         const pages = dv.pages('!"zData" and !"0_Calendar" and -"yArchive"').where(p => p.inbox !== true)
> > > >             .where(p => dv.array(p.persona).some(m => ["worker", "trainer", "strategist", "organizer", "healer", "queen_king", "diplomat", "visionary", "architect", "entrepreneur", "mentor", "critic", "engineer", "advocate", "artisan"].some(tag => String(m).toLowerCase().includes(tag))) 
> > > >                      || (dv.array(p.archtype).some(t => String(t).toLowerCase().includes("ppm") && !String(t).toLowerCase().includes("study"))))
> > > >             .where(p => !dv.array(p.status).includes("done"))
> > > >             .sort(p => p.file.mtime, "desc").limit(5);
> > > > 
> > > >         let html = `<div style="display: flex; flex-direction: column; gap: 4px; padding: 5px 0;">`;
> > > >         pages.forEach(p => {
> > > >             const color = "#a6e3a1";
> > > >             const auroraBg = `linear-gradient(270deg, ${color}15 0%, transparent 95%)`;
> > > >             
> > > >             html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px; box-shadow: -2px 0 8px ${color}33;">
> > > >                 <div style="display: flex; align-items: center; gap: 10px;">
> > > >                     <span style="font-size: 1.1em;">🌻</span>
> > > >                     <span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px;">PPM</span>
> > > >                 </div>
> > > >                 <div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 180px;">
> > > >                     <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.78em; font-weight: 500; opacity: 0.9;">${p.file.name}</a>
> > > >                     <div style="font-size: 0.52em; color: var(--text-faint); margin-top: -1px; opacity: 0.6;">${moment(p.file.mtime.toString()).fromNow()}</div>
> > > >                 </div>
> > > >             </div>`;
> > > >         });
> > > >         dv.el("div", html + `</div>`);
> > > >     }
> > > > }
> > > > ```
> > > 
> > > > [!info] **🌼 KNOWLEDGE (PKM)**  
> > > > ```dataviewjs
> > > > {
> > > >     const container = this.container;
> > > >     if (container.innerHTML.length < 50) {
> > > >         const pages = dv.pages('!"zData" and !"0_Calendar" and -"yArchive"').where(p => p.inbox !== true)
> > > >             .where(p => dv.array(p.persona).some(m => ["student", "analyst", "creator", "teacher", "author", "speaker", "explorer", "alchemist", "seeker", "mystic", "researcher", "archivist", "technician", "study", "scholar", "philosopher"].some(tag => String(m).toLowerCase().includes(tag))) 
> > > >                      || (p.discipline && dv.array(p.discipline).length > 0) 
> > > >                      || dv.array(p.archtype).some(t => ["3pkm", "pkm", "study"].some(tag => String(t).toLowerCase().includes(tag)))
> > > >                      || dv.array(p.arch).some(a => String(a).includes("#5note")))
> > > >             .sort(p => p.file.mtime, "desc").limit(5);
> > > > 
> > > >         let html = `<div style="display: flex; flex-direction: column; gap: 4px; padding: 5px 0;">`;
> > > >         pages.forEach(p => {
> > > >             let color = "#89dceb"; 
> > > >             if (p.file.path.includes("Permanent")) color = "#ffd700";
> > > >             if (p.file.path.includes("Literatur")) color = "#4169e1";
> > > >             if (p.file.path.includes("Evergreen")) color = "#228b22";
> > > >             
> > > >             const auroraBg = `linear-gradient(270deg, ${color}15 0%, transparent 95%)`;
> > > >             
> > > >             html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px; box-shadow: -2px 0 8px ${color}33;">
> > > >                 <div style="display: flex; align-items: center; gap: 10px;">
> > > >                     <span style="font-size: 1.1em;">🌼</span>
> > > >                     <span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px;">PKM</span>
> > > >                 </div>
> > > >                 <div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 180px;">
> > > >                     <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.78em; font-weight: 500; opacity: 0.9;">${p.file.name}</a>
> > > >                     <div style="font-size: 0.52em; color: var(--text-faint); margin-top: -1px; opacity: 0.6;">${moment(p.file.mtime.toString()).fromNow()}</div>
> > > >                 </div>
> > > >             </div>`;
> > > >         });
> > > >         dv.el("div", html + `</div>`);
> > > >     }
> > > > }
> > > > ```
> > 
> > 
> > 
> > > > 
> > > > 
> > ```dataviewjs
> > await require(app.vault.adapter.basePath + "/zData/2scripts/dashboardMain.js")().heatmap(dv, app, this);
> > ```
>   









