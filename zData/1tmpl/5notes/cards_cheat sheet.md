
# Cards Cheat Sheet


> [!abstract]- 📖 Anki Syntax Cheatsheet
> <small>(Custom Regex) _(Important: When actually creating cards, write the triggers without spaces: `; ;` and `Q ;` )_ </small>
> 
> **1. Basic Card (One direction only)** 
> 	 Q ; Your Question/Fact
> 	 A ; Your Answer
> 
> **2. Reversed Card (Vocabulary in both directions)** 
> 	_Option A_ 
> 		insula, ae ; ; island, the
> 	 _Option B_ 
> 		 insula, ae ; ;
> 		 island, the
>  
> **3. Cloze Card (Fill-in-the-blank)** 
> C ; The first Roman emperor was named {{c1::Augustus}}.
>
> > [!quote]-  Multi Answers
> > Q ; What are the 3 pillars of Rome's power?
> > A ;
> > a) The Military (Legions)
> > b) The Economy (Trade)
> > c) The Administration (Bureaucracy)
> >
> > insula, ae, f. ; ;
> > a) die Insel
> > b) der Wohnblock
> >
> > (*kann auch 1., 2., 3., / `-, -, -` *)
> >
> >C ; Rom wurde der Legende nach im Jahr {{c1::753}} v. Chr. gegründet.
> > Die Stadt wuchs besonders schnell, 
> > da sie strategisch klug am Fluss {{c2::Tiber}} lag.
>
> **4. Image Occlusion (Hiding parts of images)** ❌ Do not do this via text in Obsidian! Drag the image directly into the Anki app:
> > [!info]- 🗺️ How to use Image Occlusion
> >  Since Regex can only read text, you cannot use it to draw graphical boxes on images directly in Obsidian. Instead, use this standard workflow:
> > 
> > 2. Open the **Anki app** on your computer.
> > 3. Install the Anki Add-on **"Image Occlusion Enhanced"**.
> > 4. Drag and drop your image (e.g. a map or anatomy chart) directly into Anki.
> > 5. Use the pop-up tool to quickly draw boxes over the areas you want to hide, and click OK.
> > 
> > Anki will instantly generate the flashcards for you. It's much faster and less frustrating than trying to force this graphical process through Obsidian!
> 
> **5. DELETE and FROZEN**
> > [!caution] How to delete and freeze
> > 
> > Q ; What is the capital of Italy?
> > A ; Rome
> > DELETE
> > < ! - - I D : 169xxxxx432 - - >
> >
> >! after syncing with Anki, you can delete it.

> [!info]- SRS Card Syntax
> **One-way card:** `Question :: Answer`
>
> **Reversed card:** `Question ::: Answer`
>
> **Cloze card:** `The capital of Iceland is ==Reykjavik==.`
>
> **Multi-line card:**
> ```text
> Question
> ?
> Answer line 1
> Answer line 2
> ```
>
> Use `#cards` for cards reviewed by the Obsidian Spaced Repetition community plugin.
> Use `#studycards` for Nexus-internal Studycard notes with `study_lvl`, `study_rank`, and `study_date`.


