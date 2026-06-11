// api/analyze.js — Vercel serverless function
// Proxies image analysis requests to Claude API
// Set ANTHROPIC_API_KEY in Vercel Environment Variables

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });

  try {
    const body = req.body || {};
    const { image, mode } = body;
    if (!mode) return res.status(400).json({ error: 'No mode specified' });
    if (!image && mode !== 'summary') return res.status(400).json({ error: 'No image provided' });

    let systemPrompt, userContent;

    if (mode === 'fish') {
      systemPrompt = `You are an expert freshwater fish identification specialist for UK rivers, particularly chalkstreams. Analyse the photo and respond in ONLY valid JSON (no markdown, no backticks):
{
  "quality": "good" | "poor" | "unusable",
  "quality_note": "string — if poor/unusable, explain what's wrong (too blurry, too dark, bad angle, fish not visible)",
  "species": "Brown Trout" | "Rainbow Trout" | "Grayling" | "Sea Trout" | "Atlantic Salmon" | "Pike" | "Perch" | "Other" | "Unknown",
  "species_confidence": "high" | "medium" | "low",
  "species_notes": "string — key identifying features you used",
  "wild_stocked": "Wild" | "Stocked" | "Uncertain",
  "wild_notes": "string — reasoning: fin condition, colour, spots, body shape",
  "weight_estimate_lb": number or null,
  "weight_range": "string — e.g. '1.5 - 2.5 lb'",
  "weight_notes": "string — reasoning based on body proportions",
  "condition": "Excellent" | "Good" | "Fair" | "Poor",
  "condition_notes": "string — body condition, colour, fin state",
  "additional": "string — any other observations, spawning condition, notable markings"
}
If the image is unusable, still return the JSON with quality "unusable" and null/empty values for other fields. Be honest about uncertainty. UK chalkstream context: most fish will be brown trout or grayling. Stocked fish typically have rounded, damaged fins (especially pectoral and dorsal), less vivid colouration, and often a clipped adipose fin. Wild fish have sharp, well-formed fins, vivid spots, and buttery flanks.`;
      userContent = [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: "Identify this fish. Assess species, wild vs stocked, and estimate weight. Be specific about the features you're using to make your assessment." }
      ];
    } else if (mode === 'fly') {
      systemPrompt = `You are an expert entomologist specialising in UK freshwater invertebrates relevant to fly fishing. Analyse the photo and respond in ONLY valid JSON (no markdown, no backticks):
{
  "quality": "good" | "poor" | "unusable",
  "quality_note": "string — if poor/unusable, explain what's wrong",
  "order": "Ephemeroptera" | "Trichoptera" | "Diptera" | "Plecoptera" | "Other" | "Unknown",
  "common_group": "string — e.g. 'Olives', 'Sedges', 'Mayfly', 'Iron Blues', 'Midges'",
  "likely_species": "string — best guess species name",
  "confidence": "high" | "medium" | "low",
  "life_stage": "Dun" | "Spinner" | "Emerger" | "Larva/Nymph" | "Adult" | "Unknown",
  "size_mm": "string — estimated size range",
  "matching_artificials": ["string — recommended fly patterns with hook sizes"],
  "identification_notes": "string — key features used: wing shape, body colour, tails, size",
  "fishing_notes": "string — how fish typically take this species, best presentation",
  "tie_on_now": "string — the single best artificial fly to tie on right now to match this insect, with size and specific pattern name"
}
UK chalkstream context. Common species: Large Dark Olive (Baetis rhodani), Medium Olive (Baetis vernus/tenax), Blue-winged Olive (Serratella ignita), Iron Blue (Baetis pumilus/niger), Pale Watery (Baetis fuscatus), Mayfly (Ephemera danica), Grannom (Brachycentrus subnubilus), various sedges (Trichoptera). Be honest about uncertainty — insect ID from photos is genuinely difficult.`;
      userContent = [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: `Identify this insect for fly fishing purposes. What is it, what stage, and what artificial fly should I use to match it? Give me a single 'tie on now' recommendation.${body.observations ? '\n\nAngler observations: ' + body.observations : ''}` }
      ];
    } else if (mode === 'flybox') {
      const conditions = body.conditions || 'Unknown conditions';
      systemPrompt = `You are an expert UK chalkstream fishing guide looking at an angler's fly box. Your job is to identify the flies you can see, then recommend which ones to use RIGHT NOW based on current conditions. Respond in ONLY valid JSON (no markdown, no backticks):
{
  "quality": "good" | "poor" | "unusable",
  "quality_note": "string — if poor/unusable, explain what's wrong",
  "flies_identified": [
    {"name": "string — pattern name", "size_estimate": "string — hook size", "type": "dry" | "emerger" | "nymph" | "streamer" | "buzzer" | "unknown", "quantity": "string — rough count", "condition": "good" | "worn" | "unclear"}
  ],
  "tie_on_now": {"name": "string — the specific fly from their box to tie on first", "reason": "string — why this fly right now"},
  "backup": {"name": "string — second choice from their box", "reason": "string — when to switch to this"},
  "missing": ["string — flies they should add to their box for these conditions"],
  "box_notes": "string — overall assessment of their fly box for current conditions. What's good, what's lacking, any advice on organisation",
  "fishing_plan": "string — suggested order: start with X, switch to Y if Z happens"
}
Be specific about which flies you can actually see. Don't guess patterns you can't identify. If the photo is unclear, say so. Current conditions: ${conditions}`;
      userContent = [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: `Here's my fly box. Current conditions: ${conditions}. Which fly should I tie on right now? What's my plan for the session?` }
      ];
    } else if (mode === 'summary') {
      systemPrompt = `You are a concise, knowledgeable fishing guide writing a brief session summary. Write in a warm, understated British tone. 2-3 sentences maximum. Mention highlights, patterns noticed, and one piece of advice for next time.`;
      userContent = [{ type: "text", text: body.sessionData }];
    } else if (mode === 'describe') {
      systemPrompt = `You are a fly fishing companion describing what you see in a photo. This could be a fish, a river scene, wildlife, a handwritten fishing diary entry, flies on the water, tackle, or anything the angler photographed during their session. Respond in ONLY valid JSON (no markdown, no backticks):
{
  "type": "fish" | "river_scene" | "wildlife" | "handwritten_notes" | "tackle" | "fly_insect" | "other",
  "description": "string — 1-2 sentence natural description of what's in the image",
  "summary": "string — short caption suitable for a photo log",
  "fishing_relevance": "string — if relevant to fishing, brief note on what it means (e.g. rising fish, good holding water, hatch activity). null if not relevant",
  "transcription": "string — if handwritten notes are visible, transcribe them as accurately as possible. null if no text",
  "quality": "good" | "poor" | "unusable"
}
Be natural and observant. Notice details an angler would care about.`;
      userContent = [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: "Describe this image from a fishing session. If it contains handwritten notes, transcribe them." }
      ];
    } else if (mode === 'river') {
      systemPrompt = `You are an expert fly fishing guide analysing a photograph of a river or stream. The angler wants to know where to stand, where to cast, and where fish are likely to be holding. Respond in ONLY valid JSON (no markdown, no backticks):
{
  "quality": "good" | "poor" | "unusable",
  "quality_note": "string — if poor/unusable, explain",
  "water_type": "riffle" | "pool" | "glide" | "run" | "pocket_water" | "tail" | "bend" | "mixed",
  "where_to_stand": "string — specific advice on positioning relative to features visible in the photo",
  "where_to_cast": "string — specific target areas, seams, lies, structure",
  "likely_fish_lies": ["string — each likely holding spot described"],
  "approach": "string — how to approach without spooking fish",
  "casting_advice": "string — type of cast, direction, distance",
  "fly_suggestion": "string — what to try based on the water type",
  "hazards": "string — overhanging trees, wading depth, current strength, anything to watch",
  "overall": "string — 2-3 sentence guide briefing for this piece of water"
}
Think like a guide walking a client to a pool for the first time. Be specific about what you can see.`;
      userContent = [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: "Analyse this piece of river. Where should I stand? Where should I cast? Where are the fish likely to be? How should I approach it?" }
      ];
    } else {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: mode === 'summary' ? 512 : 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = data.error?.message || JSON.stringify(data.error) || 'API error';
      console.error('Anthropic API error:', response.status, msg);
      return res.status(response.status).json({ error: msg, status: response.status });
    }

    const text = data.content?.map(b => b.text || '').join('') || '';

    if (mode === 'summary') {
      return res.status(200).json({ summary: text });
    }

    // Parse JSON response
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json({ raw: text, quality: 'good', parse_error: true });
    }

  } catch (err) {
    console.error('analyze handler error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
