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
    const { image, mode } = req.body; // mode: 'fish' | 'fly' | 'summary'
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
  "fishing_notes": "string — how fish typically take this species, best presentation"
}
UK chalkstream context. Common species: Large Dark Olive (Baetis rhodani), Medium Olive (Baetis vernus/tenax), Blue-winged Olive (Serratella ignita), Iron Blue (Baetis pumilus/niger), Pale Watery (Baetis fuscatus), Mayfly (Ephemera danica), Grannom (Brachycentrus subnubilus), various sedges (Trichoptera). Be honest about uncertainty — insect ID from photos is genuinely difficult.`;
      userContent = [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: "Identify this insect for fly fishing purposes. What is it, what stage, and what artificial fly should I use to match it?" }
      ];
    } else if (mode === 'summary') {
      systemPrompt = `You are a concise, knowledgeable fishing guide writing a brief session summary. Write in a warm, understated British tone. 2-3 sentences maximum. Mention highlights, patterns noticed, and one piece of advice for next time.`;
      userContent = [{ type: "text", text: req.body.sessionData }];
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
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' });

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
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
