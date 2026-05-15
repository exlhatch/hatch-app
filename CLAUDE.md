# EPHEMERA — A Fly Fishing Guide in Your Pocket

## What this is
Ephemera is a fly fishing intelligence app. AI-enabled hatch predictions, session tracking, fish/fly identification, and guide recommendations for UK rivers and stillwaters. Built by Josh Exell (founder of EXF.STUDIO).

## Tech Stack
- **Frontend**: Vite + React (single `src/App.jsx` file, ~1500 lines)
- **Backend**: Supabase (PostgreSQL) + Vercel Serverless Functions
- **APIs**: EA Hydrology (river levels/temp), Open-Meteo (weather), Anthropic Claude (AI features), Google Maps
- **Deployment**: Vercel auto-deploy from Git. URL: hatch-app-tau.vercel.app
- **Repo**: github.com/exlhatch/hatch-app

## Deploy
```bash
cd ~/Downloads/hatch-app
git add .
git commit -m "message"
git push
# Vercel auto-deploys from main branch
```

## Project Structure
```
hatch-app/
  src/App.jsx          # The entire app (React, single file)
  api/analyze.js       # Vercel serverless: Claude AI proxy (fish ID, fly ID, fly box scan, summaries)
  api/maps-key.js      # Vercel serverless: serves Google Maps API key
  public/
    logo-mark.svg      # Bespoke mayfly roundel logo
    wordmark.svg        # EPHEMERA serif wordmark
    apple-touch-icon.png # 180x180 home screen icon
    icon-192.png        # PWA icon
    icon-512.png        # PWA icon
    manifest.json       # PWA manifest
  vercel.json           # Vercel routing config
  index.html            # Entry point with meta tags
  package.json
  vite.config.js
```

## Environment Variables (in Vercel Settings)
- `ANTHROPIC_API_KEY` — Claude API key for AI features (fish ID, fly ID, fly box scan, session summaries)
- `GOOGLE_MAPS_KEY` — Google Maps JavaScript API key for beat maps

## Supabase
- **URL**: https://vjuhpnuiwhbxmnqrraqt.supabase.co
- **Tables**: signups, feedback, sessions
- **Auth**: Custom (not Supabase Auth) — email + hashed password in signups table
- **RLS**: Enabled with permissive policies for anon insert/select

## Brand Identity
- **Name**: EPHEMERA
- **Tagline**: "Timely Insight. Better Days."
- **Sub**: "A Fly Fishing Guide in Your Pocket"
- **Logo**: Bespoke hand-drawn mayfly roundel (dark bg, cream lines)
- **Wordmark**: Custom serif EPHEMERA
- **Palette**: Dark Spruce #1F2D2A, Glacier Blue #5F6F7B, River Stone #8A948F, Fog #DDE1DE, Rust #C36A3D, Bone #F3F0E8, Green #7A9E7E
- **Colors**: Green = best/peak, Rust = medium/moderate, Grey = low
- **Font**: Barlow (Google Fonts)
- **Beta code**: RIVERTEST (case-insensitive)
- **Contact email**: ephemeraguideapp@gmail.com

## Key Features (all built)
1. **106 rivers + 15 stillwaters** across UK (8 regions + Stillwater category)
2. **Search + Favourites** — search bar, region filters, star to favourite, persists in localStorage
3. **15 premium chalkstreams** with full personality text, beat quality ratings, GPS coordinates
4. **Hatch prediction engine** — 12 species, seasonal + temperature + pressure + cloud + wind scoring
5. **Score transparency** — shows WHY (e.g. "Strong hatch activity, overcast but windy")
6. **"What Changed" delta** — vs yesterday with reasons
7. **River timeline** — hourly day evolution (7am-19pm)
8. **"Right Now" window** — current + next period always visible
9. **Anticipation** — predictive notes ("BWO possible from late afternoon")
10. **River personality** — character description per river
11. **Nighttime detection** — score 0, night card, no hatches between 10pm-5am
12. **7-day forecast** — tap any day for FULL guide panel (hatch, approach, flies to buy, best window, timeline)
13. **8-week outlook** with mayfly tracker
14. **Recommended approach** — evocative tactical advice with rig spec
15. **3 method tabs** — Dry Fly Only, Dry & Nymph, Any Method
16. **28 dry flies + 6 emergers + 6 nymphs** including terrestrials (ants, beetles, daddy)
17. **AI Fish ID** — photograph a catch, Claude analyses species, wild/stocked, weight estimate
18. **AI Fly ID** — photograph insects OR describe (size/colour/behaviour buttons) for identification
19. **AI Fly Box Scan** — photograph your box, get "TIE ON NOW", backup, session plan, missing flies
20. **AI Session Summary** — Claude writes a guide-tone session summary
21. **AI Season Overview** — analyses all past sessions for patterns and advice
22. **Session tracking** — "Start Fishing Session" with GPS breadcrumb trail
23. **Quick Snap** — photograph catches during session, log details later
24. **Post-session upload** — add photos from camera roll with EXIF timestamp extraction
25. **Session review** — species, weight, fly, wild/stocked, notes per catch
26. **GPS route map** — session path drawn on Google Maps with catch markers
27. **Manual session log** — date picker, photo upload, rating
28. **Hatch observations** — Yes/No/? buttons during session for each forecast hatch (crowdsourced data)
29. **Session archive** — expandable with photos, catches, AI summary, rating badges
30. **Google Maps beat locations** — 91 beats with real GPS coordinates
31. **Diagnose scenarios** — 8 scenarios (rising, refusing, nothing, cruising, windy, bright, spooking, missed)
32. **Reports** — keeper/guide/club/social with verified badges
33. **Login/registration** — beta code gate, email/password, newsletter + beta tester opt-in, confirmation
34. **Password reset** — checks Supabase, updates hash
35. **Feedback questionnaire** — rating + 3 text fields, saved to Supabase
36. **Light/dark mode** — persists in localStorage
37. **PWA** — home screen icon, standalone mode, manifest.json
38. **Public/private sessions** — toggle on session start

## Scoring Engine
- Hatch activity 30%, Water temp 18%, Cloud 12%, Pressure 10%, Wind 15%, Quality 15%
- 90-100 Exceptional, 75-89 Excellent, 55-74 Good, 35-54 Fair, 0-34 Poor
- River quality: Test/Itchen = 10, Kennet/Lambourn/Wylye = 8, Chess = 6, Wandle = 4
- Beat quality per beat (e.g. Stockbridge = 10, Nursling = 6)

## API Serverless Functions
- `api/analyze.js` — Proxies to Claude Haiku 4.5 for: fish ID, fly ID, flybox scan, session summary
- `api/maps-key.js` — Returns GOOGLE_MAPS_KEY from env vars

## Conventions
- Josh dislikes em dashes — never use them
- British understatement register, dry tone
- Concise, commercial, never over-engineered
- No AI-sounding phrasing
- Warm, calm expert guide tone in the app
- Green = best, Rust = medium (swapped from typical)

## TODO (not yet built)
- [ ] EmailJS integration for signup/feedback notifications
- [ ] Stillwater-specific tactics and methods (buzzers, loch style)
- [ ] Rainbow/spartic/tiger trout in catch species
- [ ] Hatch data aggregation dashboard (admin view)
- [ ] Beautiful river/fly photography integrated into UI
- [ ] Stripe payments for subscription tiers
- [ ] React Native wrapper for App Store / Google Play
- [ ] Expand to US/Canada rivers
- [ ] Salmon fishing module
- [ ] Winter/coarse fishing extension for year-round usage
