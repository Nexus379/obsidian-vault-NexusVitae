
# 💊 Nexus Vital-Tracker: Molecular Command Center

> [!abstract] **Strategische Ausrichtung** Dieses Modul synchronisiert die physische Einnahme (Checkboxes) mit der molekularen Berechnung aus dem Meal Plan und deinen Supplement-Silos.

---

## 🏗️ Action Matrix (Daily Execution)

**🌅 AM | Focus & Energy**

- [ ] **Baseline:** Wasser & Elektrolyte ^h2o-elek
    
- [ ] **Anabolic Trigger:** Gesamt-Protein & Leucin ^protein-leucin
    
- [ ] **Energy:** B-Komplex (Bioaktiv) ^[vit-b • Jod] ^iodine
    
- [ ] **Oxygen:** Pflanzeneisen + Vit C ^iron-plant ^vit-c
    
- [ ] **ATP:** Kreatin ^amino-creatine
    

**☀️ MID | Protection & Absorption**

- [ ] **Lipids:** Vit D3, K2 & E ^vit-d-k2-e • Omega-3 (EPA/DHA) ^omega
    
- [ ] **Cognition:** Cholin ^choline • Vit A / Beta-Carotin ^vit-a-beta
    
- [ ] **Defense:** Ballaststoffe ^fiber • Sulforaphan ^phyto-sulf
    

**🌙 PM | Recovery & ZNS-Sleep**

- [ ] **Neural Calm:** Magnesium ^mag • Tryptophan & L-Theanin ^amino-tryp-thea
    
- [ ] **Structural Repair:** Glycin & Prolin (Kollagen) ^amino-glycin-prolin
    
- [ ] **Mineral Matrix:** Calcium & Phosphor ^cal-phos • Zink, Selen & Kupfer ^trace-minerals
    

---

## 📊 Live Molecular Dashboard

> [!multi-column]
> 
> > ### 🧬 Makro-Status
> > 
> > Code snippet
> > 
> > ```dataviewjs
> > // Protein-Ziel: 120g
> > const target = 120;
> > const current = 94; // Beispielwert aus der Engine
> > const pct = Math.min(100, (current/target)*100).toFixed(0);
> > dv.paragraph(`**Protein:** ${current}g / ${target}g`);
> > dv.paragraph(`<progress value="${pct}" max="100"></progress> ${pct}%`);
> > ```
> 
> > ### 💎 Mineral-Status
> > 
> > Code snippet
> > 
> > ```dataviewjs
> > // Magnesium-Ziel: 350mg
> > const targetM = 350;
> > const currentM = 180; 
> > const pctM = Math.min(100, (currentM/targetM)*100).toFixed(0);
> > dv.paragraph(`**Magnesium:** ${currentM}mg / ${targetM}mg`);
> > dv.paragraph(`<progress value="${pctM}" max="100"></progress> ${pctM}%`);
> > ```

---

## 🧪 Spontane Alchemie (Bonus)

- [ ] **Phyto-Power:** Allicin ^phyto-allicin • Anthocyane ^phyto-antho • Chlorophyll ^phyto-chloro
    
- [ ] **Microbiome:** Probiotika ^probio • Präbiotika ^prebio
    
- [ ] **Awareness:** Oxalsäure-Distanz ^blocker-oxa • Phytinsäure neutralisiert ^blocker-phyto
    

---

## 🛠️ Quick-Infuze (Apotheke & Drogerie)

`BUTTON[add-atom-synthesis]` _(Nutze diesen Button, um spontan ein Supplement aus deinem Silo hinzuzufügen, falls die Grafik oben noch im roten Bereich ist.)_

---