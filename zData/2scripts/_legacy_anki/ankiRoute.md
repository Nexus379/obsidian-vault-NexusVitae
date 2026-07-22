---
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/anki"
status: 1active
---

# Anki Route

Preferred plugin: Obsidian_to_Anki

Required local dependency:
- Anki desktop
- AnkiConnect add-on

Route:
- `3atomic_anki` creates Basic cards.
- `3atomic_ankicloze` creates Cloze cards.
- Notes are tagged with `#anki` and `#obsidian-to-anki`.

Safety note:
- AnkiConnect exposes a local HTTP interface on the user's machine.
- Keep AnkiConnect limited to localhost unless there is a deliberate reason to change it.
