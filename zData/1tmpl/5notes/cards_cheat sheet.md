

> [!info]- 📖 Anki Syntax Cheat Sheet
> **1. Basic Card (Front & Back)**
> START
> {Basic}
> Front: Your question?
> Back: Your answer!
> ID: 0 (Plugin fills this out)
> END
> 
> **2. Cloze Card (Fill-in-the-blank)**
> START
> {Cloze}
> Text: Rome is the {{c1::capital}} of {{c2::Italy}}.
> Extra: Additional info here.
> ID: 0
> END
> 
> **3. Image Occlusion (Hide image parts)**
> START
> {Image Occlusion}
> Header: Title of the image
> Image: paste your image embed here
> ID: 0
> END
> 
> ---
> - **`START` / `END`**: Card boundaries. Everything in between = one flashcard.
> - **`{Basic}`**: Card type. "Basic" = Question on front, answer on back.
> - **`Front:` / `Back:`**: Text for the front/back of the card.
> - **`ID: ...`**: Card fingerprint. Anki recognizes updates instead of creating duplicates.





> [!info]- 📖 Anki Cloze Syntax Cheat Sheet
> **1. Cloze Card (Fill-in-the-blank)**
> START
> {Cloze}
> Text: Rome is the {{c1::capital}} of {{c2::Italy}}.
> Extra: Additional info here.
> ID: 0
> END
> 
> **2. Basic Card (Front & Back)**
> START
> {Basic}
> Front: Your question?
> Back: Your answer!
> ID: 0
> END
> 
> **3. Image Occlusion (Hide image parts)**
> START
> {Image Occlusion}
> Header: Title of the image
> Image: paste your image embed here
> ID: 0
> END
> 
> ---
> - **`{{c1::text}}`**: Cloze deletion. The number (`c1`, `c2`…) groups blanks per card.
> - **`Text:`**: The full sentence with cloze deletions embedded.
> - **`Extra:`**: Additional context shown on the back of the card.
> - **`START` / `END`**: Card boundaries. Everything in between = one flashcard.
> - **`ID: ...`**: Card fingerprint. Anki recognizes updates instead of creating duplicates.


> [!info] 📖 SRS-92 Syntax Cheat Sheet
> **Basic (One-way):** `Question :: Answer`
> **Reversed (Bidirectional):** `Question ::: Answer` (Generates 2 cards automatically)
> **Cloze (Fill-in-the-blank):** `The capital of Iceland is ==Reykjavik==.`
> **Multi-Line:** 
> `Question`
> `?`
> `Answer Line 1`
> `Answer Line 2`

