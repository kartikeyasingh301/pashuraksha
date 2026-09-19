const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, lang = 'en' } = req.body;
    
    // MOCK AI ENGINE (Fallback if Google API Key is invalid or rate limited)
    const runMockAI = () => {
      const lower = message.toLowerCase();
      let text = "I understand your concern. Please submit a health report using the Report button so our veterinarians can investigate. For urgent help, call 1962.";
      let actions = [{id: 'report', label: lang === 'hi' ? 'रिपोर्ट दर्ज करें' : (lang === 'mr' ? 'अहवाल द्या' : 'REPORT ISSUE'), primary: true}];
      
      if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('ताप') || lower.includes('blister') || lower.includes('छाले') || lower.includes('फोड') || lower.includes('fmd')) {
        text = lang === 'hi' ? "बुखार और मुंह में छाले खुरपका-मुंहपका रोग (FMD) के लक्षण हो सकते हैं।\n\nअभी क्या करें:\nकृपया इस पशु को तुरंत अन्य पशुओं से अलग करें। यह बहुत तेजी से फैलता है। कृपया 'रिपोर्ट' दर्ज करें ताकि डॉक्टर आ सकें।" :
               lang === 'mr' ? "ताप आणि तोंडात फोड हे लाळ्या खुरकूत (FMD) चे लक्षण असू शकते.\n\nआता काय करावे:\nकृपया या प्राण्याला त्वरित इतर प्राण्यांपासून वेगळे करा. हे वेगाने पसरते. कृपया 'रिपोर्ट' द्या जेणेकरून डॉक्टर येऊ शकतील." :
               "Fever and mouth blisters are strong indicators of Foot-and-Mouth Disease (FMD).\n\nWHAT TO DO NOW:\nPlease isolate this animal immediately from the rest of your herd. It is highly contagious. Submit a report so a vet can visit.";
        actions.push({id: 'call', label: 'CALL 1962', primary: false});
      } else if (lower.includes('lump') || lower.includes('गांठ') || lower.includes('गाठी')) {
        text = lang === 'hi' ? "त्वचा पर गांठे और बुखार लंपी स्किन डिजीज (LSD) का संकेत हो सकते हैं। कृपया पशु को अलग कर दें।" :
               lang === 'mr' ? "त्वचेवर गाठी आणि ताप हे लंपी स्किन डिसीज (LSD) असू शकते. कृपया प्राण्याला वेगळे करा." :
               "Skin nodules and fever could indicate Lumpy Skin Disease (LSD). Please isolate the animal.";
      }

      return { text, actions };
    };

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
      return res.status(200).json(runMockAI());
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are "Pashuraksha Assistance", a highly skilled veterinary AI assistant...`;
      const prompt = `You are an AI assistant. Return ONLY valid JSON: {"text": "Your advice here", "actions": [{"id":"report", "label":"REPORT", "primary":true}]}\n\nFarmer says: "${message}"`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      return res.json(JSON.parse(responseText));
    } catch (apiError) {
      // If the API key is invalid (404/400), seamlessly fallback to our Mock AI so the farmer never sees an error!
      console.warn("Gemini API failed, falling back to Mock AI:", apiError.message);
      return res.status(200).json(runMockAI());
    }
    
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;
