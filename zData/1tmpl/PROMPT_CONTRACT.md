# Nexus Prompt Contract

Router prompts must stay small, modular, and portable.

## Contract

- Use `tp.variables.SYS` for system paths. Default: `{ tmpl: "zData/1tmpl", inbox: "0_Inbox" }`.
- Use `tp.variables.ARCH` for archetype roots. Do not hardcode root folders when an `ARCH` entry exists.
- Prefer `zData/4values/NexusVitae_SystemConfig.json` and `zData/2scripts/systemConfig.js` for root folders and Area main-plan fallbacks.
- Keep YAML keys, IDs, tags, and template names language-stable. Prefer English or short Latin-style identifiers for logic.
- Visible prompt labels may be friendly, but routing must not depend on localized display text.
- Keep mobile flows short: prefer trigger detection first, then compact suggester menus, then one clear fallback prompt.
- Always handle cancel/ESC without creating broken notes.
- Ensure folders segment by segment before moving notes.
- Router prompts choose destination, template, and variables only. Content logic belongs in templates or engines.
- Existing files should not be overwritten unless the user explicitly chooses an overwrite action.

## Stable Variables

- `tp.variables.title`
- `tp.variables.displayTitle`
- `tp.variables.activeTrigger`
- `tp.variables.originTrigger`
- `tp.variables.preSelectedSub`
- `tp.variables.SYS`
- `tp.variables.ARCH`

## Update Packages

- `zData` contains templates, scripts, snippets, values, design modules, and item data.
- `0_Atlas` contains dashboards, overviews, bases, MOCs, and guide files.
- Package install should skip existing files by default. Package overwrite must stay explicit.
