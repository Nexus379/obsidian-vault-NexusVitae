<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎶 Track/Album/Artist Name?", "");
}
if (!title || title.trim() === "") title = "Music-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. PLATFORM & ARTIST (Nexus Input)
const pOptions = ["Spotify 🟢", "YouTube 🔴", "Soundcloud 🟠", "Apple Music 🍎", "Vinyl/CD 📀"];
const pValues = ["Spotify", "YouTube", "Soundcloud", "AppleMusic", "Physical"];
let plat = await tp.system.suggester(pOptions, pValues) || "Unknown";

// Creator = Composer/Band | Artist = Singer/Performer
let creator = await tp.system.prompt("✍️ Creator (Band/Composer)?", "Unknown");
let artist = await tp.system.prompt("🎤 Artist (Performer/Singer)?", creator);

// 🔱 4. TITLE CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(music-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/aesthetic-anime-character-gaming.jpg]]"
banner_y: 0.5
banner_icon: 🎶
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/music"
status:
  - 1active
priority:
  - "1"
persona:
cover: ""
url: ""
plattform: 
  - "<%- plat %>"
creator: "<%- creator %>"
artist: "<%- artist %>"
publisher:
pub-date:
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---
# 🎶 Music: <%- luhmannId %> <%- displayTitle %>


> [!abstract] Audio Resonance
> **Creator:** <%- creator %> 
> 
> **Artist:** <%- artist %>
> 
> **Source:** `$= dv.current().plattform`


## 🎧 Focus & Notes
- **Why this music?** ## 🖇️ Connections
- Linked to Project/Area: <%- pLink %>









---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>