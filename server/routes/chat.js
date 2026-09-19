const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, lang = 'en' } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      // Fallback if API key is not configured
      return res.status(200).json({
        text: lang === 'hi' ? 'क्षमा करें, AI सहायक अभी कॉन्फ़िगर नहीं किया गया है। कृपया बाद में प्रयास करें।' :
              (lang === 'mr' ? 'क्षमस्व, AI सहाय्यक अद्याप कॉन्फिगर केलेले नाही. कृपया नंतर प्रयत्न करा.' :
              'Sorry, the AI assistant is not configured yet. Please try again later.'),
        actions: []
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are "Pashuraksha Assistance", a highly skilled veterinary AI assistant for rural livestock farmers in India.
Your goal is to provide immediate, actionable triage advice based on the symptoms described by the farmer.

CRITICAL RULES:
1. Always respond in the language requested: ${lang === 'hi' ? 'Hindi (हिंदी)' : (lang === 'mr' ? 'Marathi (मराठी)' : 'English')}.
2. Keep your response brief, simple, and easy to understand for a farmer. Avoid highly technical medical jargon.
3. If the symptoms indicate a highly contagious or fatal disease (like FMD, PPR, Lumpy Skin Disease, or Anthrax), tell them to ISOLATE the animal immediately and call a vet.
4. DO NOT provide definitive diagnoses. Use words like "could be", "suspected", or "might indicate".
5. Return your response as a valid JSON object matching this schema:
{
  "text": "Your helpful response paragraph here. Use \\n for line breaks.",
  "actions": [
    {"id": "report", "label": "REPORT HEALTH ISSUE", "primary": true},
    {"id": "call", "label": "CALL 1962 (VET HELPLINE)", "primary": false}
  ]
}
You can choose to return 0, 1, or 2 actions. Available action IDs are: 'report', 'call', 'vaccine_nav', 'herd'. Translate the labels of the actions to the requested language.`;

    const prompt = `${systemPrompt}\n\nFarmer says: "${message}"\n\nReturn ONLY the raw JSON object.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Strip markdown JSON block if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }

    const parsedResponse = JSON.parse(responseText);
    res.json(parsedResponse);
    
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;
