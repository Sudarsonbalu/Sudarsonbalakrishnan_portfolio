# Portfolio Template

Red-and-black 3D portfolio (React + Three.js + GSAP). **You only do 3 things.**

---

## Step 1 · Generate your hero image in ChatGPT

Open ChatGPT (image generation), **upload a clear photo of your face**, paste this prompt, then save the result as:

`public/assets/hero-red-bg.jpg`

```
Using the attached photo, create a cinematic 16:9 (1920x1080) portrait of this exact person.
Keep the face, hairstyle and skin tone identical to the photo.
- Subject: waist-up, in smart professional clothing, looking at the camera with a calm confident smile.
- Position: subject on the RIGHT third of the frame. The LEFT two-thirds must stay empty (for website text).
- Background: deep black-to-crimson swirling smoke, glowing red rim light around the hair and shoulders, tiny floating red embers.
- Style: dramatic, high contrast, photorealistic, sharp focus, no text, no watermark, no logos.
```

Optional (About-section photo): upload the same photo again with

```
Create a 4:5 vertical studio portrait of this exact person, waist-up, smart professional clothing,
soft dark-red gradient background, sharp and realistic, no text.
```

Save it as `public/media/profile.webp` (a `.jpg` also works, just tell Claude in Step 2).

Project screenshots: save as `public/assets/thumbnails/project-1-1.jpg`, `project-1-2.jpg`, `project-1-3.jpg`, `project-2-1.jpg` … (1280x720).

---

## Step 2 · Let Claude fill in your content

1. Fill in the **About Me** block below (just replace the text).
2. Open Claude, paste the **prompt**, then paste your About Me, then paste the full contents of `src/data/portfolioData.ts`.
3. Copy Claude's reply over `src/data/portfolioData.ts`.

### About Me (fill this in)

```
Name:
Role / title:
Email:
Phone / WhatsApp (with country code, digits only):
GitHub URL:
LinkedIn URL:
Short bio (2-4 sentences, who you are and what you build):
Technologies you use (for the logo strip):
Areas of focus (3):
Top 6 skills + level (Advanced / Proficient):
Projects (6 or 9). For each: name, one-line subtitle, what it does, tech used, live link, GitHub link:
Services you offer + prices (5):
Numbers to show (projects built, technologies, services):
Loading-screen sentence (a short bold line about what you do):
```

### Prompt for Claude

```
I am using a portfolio website template. Below is MY ABOUT ME info, followed by the
current src/data/portfolioData.ts file.

Rewrite the ENTIRE portfolioData.ts file with my details. Rules:
- Keep every export name, key, type and the file structure exactly the same. Only change values.
- Write in first person, confident, concise, no buzzword filler. Improve my wording where needed.
- HERO.headline is my name in CAPS. SITE.phone is digits only with country code.
- Projects: 6 or 9 entries, ids in kebab-case, poster set to
  /assets/thumbnails/project-<n>-1.jpg (n = project order). Keep liveUrl/repoUrl only if I gave them.
- TECH_STACK: my technologies (names with built-in logos: React, JavaScript, Python, FastAPI, PostgreSQL, Supabase, SQLite, Three.js, GSAP; any other name shows a lettered badge).
- SKILL_CARDS: exactly 6 cards. SERVICES_PRICING: 5 items. CLIENT_STATS: 3 items.
- LOADER.redWords must be words that appear in LOADER.statement.
- If my portrait is a .jpg instead of .webp, set ABOUT.portrait accordingly.
- Return only the complete file in one code block.

MY ABOUT ME:
<paste your filled About Me here>

CURRENT FILE:
<paste src/data/portfolioData.ts here>
```

---

## Step 3 · Run it

```
npm install
npm run dev       # preview at http://localhost:5173
npm run build     # production files in dist/ (upload to Netlify / Vercel / GitHub Pages)
```

That's it. All text is in `src/data/portfolioData.ts`, all images are in `public/`.
