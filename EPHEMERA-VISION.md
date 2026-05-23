# EPHEMERA — The Definitive Version

## What it feels like

You're standing by the car, pulling on your waders. You open Ephemera. 

One screen. Your river. A number out of 10. Two sentences from a guide who knows this water. What fly to tie on. When to be on the water. Close the app. Go fishing.

Three hours later you catch a fish. You pull out your phone. One tap: photo taken, geotagged, saved to your camera roll, timestamped. Phone goes back in your pocket. Total screen time: 3 seconds.

At the end of the day you open the app at the pub. Your session is there: 4 catches, each with a photo and a timestamp. You tap "AI Analyse" and Claude identifies each fish — species, weight estimate, wild or stocked. You add a note about the day. Tap share. A beautiful trip card goes to your mate on WhatsApp: "Test at Stockbridge. 4 fish. Best fly: Danica Emerger. Score: 8/10."

That evening, browsing the feed, you see your friend caught 3 on the Itchen. You tap the heart. Someone in Wales posted a photo of a mayfly spinner fall. You save it. A guide you follow shared a tip about fishing emergers in the film. You read it in 10 seconds.

That's Ephemera. A guide in your pocket. A fishing companion. A logbook. A quiet community of people who love rivers.

---

## The Three Modes

### 1. BEFORE — Plan the day (30 seconds)

Open the app. See:

- **Your river** (auto-detected or last used)
- **Score: 7/10** — one number, instantly understood
- **Guide briefing** — 3-4 sentences. What's hatching, what to tie on, when to fish, what to wear. Sounds like a guide talking to you at the hut
- **Tie on: Adams #16** — the single fly to start with
- **Best time: 13:00-16:00** — when the fishing peaks
- **This week** — 7 day scores, tap for detail

One scroll down (optional):
- Hatch of the day with /10 strength
- During mayfly season: Mayfly Strength meter
- "What's Hatching This Week" — expandable list

Toggle "Advanced" for: rig spec, hourly timeline, river personality, beat map.

### 2. DURING — Fish, don't scroll (3 seconds per interaction)

**Start session** — big green button. GPS tags your start point. Timer begins. Auto-saves every 30 seconds (crash-proof).

**Quick Snap** — one button, one photo, geotagged, saved to camera roll, back to fishing. Total interaction: 3 seconds.

**Share location** — safety pin. One tap sends a Google Maps link to someone you love.

**Ask the guide** — tap the mic on the Tips tab. "The fish keep refusing my fly." Claude answers in 2 sentences and reads it aloud. Hands-free after the initial tap.

**Read the water** — photograph a stretch. Claude tells you where to stand, where to cast, where the fish are.

Everything else waits until later.

### 3. AFTER — Log, review, share (5 minutes)

**End session** — review screen. Upload any photos from your camera roll. EXIF timestamps reconstruct the order. 

**AI Analyse All** — one tap. Every photo gets analysed: species, weight, condition, wild/stocked. Photos of rivers get described. Photos of handwritten notes get transcribed.

**Fill in details** — species, weight, fly, notes per catch. Most of it pre-filled by AI.

**Session summary** — Claude writes a 3-sentence guide-tone summary of the day.

**Trip card** — shareable image: river, fish count, best photo, score, fly. WhatsApp/Instagram/email.

**Save** — goes to your season log. Hatch observations saved to the community database.

---

## The Five Tabs

### Guide (home)
Score, briefing, tie-on, best time, 7-day forecast. The daily briefing adapts to: river, beat, time of day, weather, season, hatches, water temperature, wind, air temperature. During mayfly season it celebrates mayfly. In winter it switches to nymph tactics. It's never generic.

### Hatches
What's hatching ranked by strength. Fly ID: photograph or describe an insect, get identification + "tie on now" recommendation. Active hatches with matching flies. Expandable for lifecycle detail.

### Flies
Your fly box. AI scan: photograph your box, get "tie on now" from what you actually have. Full pattern library: dries, emergers, nymphs, terrestrials. Each fly shows when it's relevant and what it matches.

### Log
Season stats: sessions, fish, PB, favourite river/fly/beat. Session archive with full photos, AI analysis, trip cards. Manual session entry with date picker. AI Season Overview: "You catch more on overcast days. Your go-to fly is Adams. The Test at Stockbridge is your best water."

### Tips
Read the Water: photograph a stretch, get positioning advice. Ask the Guide: tap-to-talk voice assistant. Scenario cards: "Fish are rising but refusing" → specific tactics. This is where the AI guide lives when you're on the river.

---

## What Makes It Different From Everything Else

### vs Fishable
They tell you IF to go fishing (weather score). We tell you WHAT TO DO when you're there (guide intelligence). Their score is weather-based. Ours is entomology-based. They don't have AI. We have fish ID, fly ID, fly box scan, river analysis, voice assistant, and hatch predictions built on real insect biology.

### vs Fishbrain
They're broad (all fishing, all species, all methods). We're deep (fly fishing, trout, specific rivers, specific hatches). They have social. We have social + intelligence. A Fishbrain user logs a catch. An Ephemera user gets told what fly to use before they even start.

### vs Nothing (most fly fishers currently)
Most fly fishers check the weather app and guess. We give them a guide who knows their river, knows what's hatching, knows what fly to tie on, and adapts that advice to the exact conditions right now.

---

## The Data Moat

Every session logged builds our dataset:
- Hatch observations (which species were seen, confirmed by users on the river)
- Catch data (which flies worked, what conditions, what time)
- River conditions (crowdsourced water levels, clarity, temperature)
- Seasonal patterns (when does mayfly start on the Test vs the Dove vs the Usk)

Year 2, our predictions are better than any guide's because we have data from hundreds of sessions across dozens of rivers. Year 3, we know things nobody else knows: "Mayfly starts 3 days earlier on the Itchen than the Test. Iron Blue hatches are getting later each year. CDC Shuttlecocks outperform Adams on the Kennet by 2:1."

That data belongs to Ephemera. It's uncopyable.

---

## Technical Architecture (Next Phase)

The current single-file app has reached its limit at 1,900 lines. The next version needs:

```
ephemera/
  src/
    App.jsx                    # Shell, router, auth (~100 lines)
    components/
      Guide/
        GuideTab.jsx           # Score, briefing, forecast
        GuideBriefing.jsx      # The AI guide note
        HatchCard.jsx          # Hatch of the day
        MayflyMeter.jsx        # Mayfly season strength
        ForecastStrip.jsx      # 7-day scores
        DayPlan.jsx            # Expanded day detail
      Session/
        SessionBar.jsx         # Start/snap/end controls
        SessionReview.jsx      # Post-session review
        CatchCard.jsx          # Individual catch with AI
        TripCard.jsx           # Shareable session card
      Hatches/
        HatchesTab.jsx         # Active hatches list
        FlyId.jsx              # Fly identification
      FlyBox/
        FlyBoxTab.jsx          # Fly library + scan
      Log/
        LogTab.jsx             # Stats + archive
        SeasonStats.jsx        # Fish count, PB, favourites
        SessionArchive.jsx     # Past sessions
      Tips/
        TipsTab.jsx            # River analysis, voice, scenarios
      Shared/
        RiverPicker.jsx        # Search + near me
        Gallery.jsx            # Photo lightbox
        ScoreCircle.jsx        # /10 score display
    hooks/
      useWeather.js
      useHatch.js
      useAuth.js
      useSessions.js
      useGPS.js
    data/
      rivers.js
      flies.js
      hatches.js
      beats.js
    lib/
      supabase.js
      api.js
      scoring.js
```

Build this with Claude Code:
```bash
cd ~/Downloads/hatch-app
claude
> Break App.jsx into the component structure from CLAUDE.md
```

Then add social:
```bash
> Set up Supabase tables for profiles, follows, likes, comments
> Build a social feed tab showing public sessions from followed users
> Add trip card generation and sharing
```

---

## Revenue Model

**Free**: 1 river, basic logging, 3 AI analyses per day
**Premium £4.99/month**: All rivers, unlimited AI, full archive, advanced mode
**Guide £14.99/month**: Multi-user, verified badge, client logging, priority

At 5,000 premium users: £300k/year ARR
At 15,000 across tiers: £1M+ ARR

---

## The One Thing

Every feature, every decision, every pixel should answer one question:

**"Did this help someone have a better day on the river?"**

If yes, ship it. If no, cut it.

Ephemera isn't a data dashboard. It isn't a social network. It isn't a fishing game.

It's a calm expert beside you. A guide in your pocket. The friend who knows the water.

That's the app. Build that, and every fly fisher in the world will want it.
