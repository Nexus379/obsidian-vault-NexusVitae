<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

// We use the ID created by the 6-resourcesPrompt, or generate a new one
let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🤖 AI Subject / Chat Name?", "");
}
if (!title || title.trim() === "") title = "AI-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. PLATFORM SELECTION
const pOptions = ["Nexus (Gemini) 🔱", "Le Chat (Mistral) 🐱", "OpenAI (GPT) 🧠", "Claude (Anthropic) 🎭", "Perplexity 🔍", "Local LLM 🏠", "[+] Custom..."];
const pValues = ["Google-AI", "Mistral-AI", "OpenAI-AI", "Anthropic-AI", "Perplexity-AI", "Local", "custom"];

let chatUrl = await tp.system.prompt("🔗 Link to Chat? (Optional)", "");
tp.variables.chatUrl = chatUrl;

let plat = await tp.system.suggester(pOptions, pValues);
if (plat === "custom") plat = await tp.system.prompt("✨ New AI Platform?");
if (!plat) plat = "AI-General";

// 🔱 4. CLEANING (Nexus Standard)
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(ai-|ki-|n-|r-|s-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 🤖
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/ai"
status:
  - 1active
priority:
  - "1"
persona:
plattform: 
  - "<%- plat %>"
publisher:
url: "<%- chatUrl %>"
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
# 🤖 AI: <%- luhmannId %> <%- displayTitle %>

> [!reference] AI Log Details
> **ID:** <%- luhmannId %> | **Platform:** `$= dv.current().plattform` | **Context:** <%- pLink %>

## 🧠 System-Prompt / Conversation Logic
- 


## ⚙️ Workflow / Prompt
- 







---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>