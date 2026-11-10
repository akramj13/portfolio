---
tags: [skill-creator]
max_turns: 60
timeout_seconds: 1800
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

write a blog post from these notes about cotabby. include a screenshot of https://cotabby.app near the top. write it and leave it as a draft, i'll read it after, you don't need to check with me first.

notes:
- cotabby = ai autocomplete for mac, works in basically any app (messages, gmail, notes etc)
- ghost text shows up inline, you press tab to accept word by word
- runs on apple intelligence or any local gguf model so nothing leaves your mac
- built it in swift / swiftui + appkit, uses the accessibility apis to read whats around the cursor
- hardest part: every app handles text fields differently so getting the caret position right was a nightmare
- its open source, 6000+ downloads and 750+ stars on github so far which is insane
- next: better per-app support and smaller models
