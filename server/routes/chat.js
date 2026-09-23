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
      
      // 1. Disease Triage
      if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('ताप') || lower.includes('blister') || lower.includes('छाले') || lower.includes('फोड') || lower.includes('fmd')) {
        text = lang === 'hi' ? "बुखार और मुंह में छाले खुरपका-मुंहपका रोग (FMD) के लक्षण हो सकते हैं।\n\nअभी क्या करें:\nकृपया इस पशु को तुरंत अन्य पशुओं से अलग करें। यह बहुत तेजी से फैलता है। कृपया 'रिपोर्ट' दर्ज करें ताकि डॉक्टर आ सकें।" :
               lang === 'mr' ? "ताप आणि तोंडात फोड हे लाळ्या खुरकूत (FMD) चे लक्षण असू शकते.\n\nआता काय करावे:\nकृपया या प्राण्याला त्वरित इतर प्राण्यांपासून वेगळे करा. हे वेगाने पसरते. कृपया 'रिपोर्ट' द्या जेणेकरून डॉक्टर येऊ शकतील." :
               "Fever and mouth blisters are strong indicators of Foot-and-Mouth Disease (FMD).\n\nWHAT TO DO NOW:\nPlease isolate this animal immediately from the rest of your herd. It is highly contagious. Submit a report so a vet can visit.";
        actions.push({id: 'call', label: 'CALL 1962', primary: false});
      } else if (lower.includes('lump') || lower.includes('गांठ') || lower.includes('गाठी')) {
        text = lang === 'hi' ? "त्वचा पर गांठे और बुखार लंपी स्किन डिजीज (LSD) का संकेत हो सकते हैं। कृपया पशु को अलग कर दें।" :
               lang === 'mr' ? "त्वचेवर गाठी आणि ताप हे लंपी स्किन डिसीज (LSD) असू शकते. कृपया प्राण्याला वेगळे करा." :
               "Skin nodules and fever could indicate Lumpy Skin Disease (LSD). Please isolate the animal.";
      
      // 2. App Help & Navigation
      } else if (lower.includes('help') || lower.includes('app') || lower.includes('मदद') || lower.includes('मदत') || lower.includes('how to')) {
        text = lang === 'hi' ? "मैं पशुरक्षा ऐप में आपकी सहायता कर सकती हूँ।\n• किसी बीमार पशु की जानकारी देने के लिए 'रिपोर्ट दर्ज करें' पर क्लिक करें।\n• अपने पशुओं का रिकॉर्ड देखने के लिए 'मेरे पशु' पर जाएं।\n• टीकाकरण की जानकारी के लिए 'वैक्सीन पासबुक' देखें।" :
               lang === 'mr' ? "मी तुम्हाला पशुरक्षा ॲप वापरण्यास मदत करू शकते.\n• आजारी प्राण्याची नोंद करण्यासाठी 'अहवाल द्या' वर क्लिक करा.\n• प्राण्यांची नोंद पाहण्यासाठी 'माझे प्राणी' वर जा.\n• लसीकरणासाठी 'लस पासबुक' पहा." :
               "I can help you navigate the Pashuraksha app!\n• To report a sick animal, click 'REPORT ISSUE'.\n• To see your animal records, go to 'MY HERD'.\n• For vaccination records, check the 'VACCINE PASSBOOK'.";
        actions = [
          {id: 'report', label: lang === 'hi' ? 'रिपोर्ट दर्ज करें' : (lang === 'mr' ? 'अहवाल द्या' : 'REPORT ISSUE'), primary: true},
          {id: 'herd', label: lang === 'hi' ? 'मेरे पशु' : (lang === 'mr' ? 'माझे प्राणी' : 'MY HERD'), primary: false},
          {id: 'vaccine_nav', label: lang === 'hi' ? 'वैक्सीन पासबुक' : (lang === 'mr' ? 'लस पासबुक' : 'PASSBOOK'), primary: false}
        ];
      } else if (lower.includes('vaccin') || lower.includes('टीका') || lower.includes('लस')) {
        text = lang === 'hi' ? "आप अपने पशुओं के टीकाकरण का पूरा रिकॉर्ड 'वैक्सीन पासबुक' में देख सकते हैं।" :
               lang === 'mr' ? "तुम्ही तुमच्या प्राण्यांच्या लसीकरणाची संपूर्ण माहिती 'लस पासबुक' मध्ये पाहू शकता." :
               "You can view and track all your vaccination schedules in the Vaccine Passbook.";
        actions = [{id: 'vaccine_nav', label: lang === 'hi' ? 'पासबुक खोलें' : (lang === 'mr' ? 'पासबुक उघडा' : 'OPEN PASSBOOK'), primary: true}];
      } else if (lower.includes('herd') || lower.includes('पशु') || lower.includes('प्राणी') || lower.includes('animal')) {
        text = lang === 'hi' ? "आप 'मेरे पशु' (Herd Ledger) अनुभाग में अपने सभी पशुओं की सूची और स्वास्थ्य स्थिति देख सकते हैं।" :
               lang === 'mr' ? "तुम्ही 'माझे प्राणी' (Herd Ledger) विभागात तुमच्या सर्व प्राण्यांची यादी आणि आरोग्य स्थिती पाहू शकता." :
               "You can manage your animals and view their health status in the Herd Ledger.";
        actions = [{id: 'herd', label: lang === 'hi' ? 'मेरे पशु देखें' : (lang === 'mr' ? 'माझे प्राणी पहा' : 'VIEW HERD'), primary: true}];
      }

      return { text, actions };
    };

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
      return res.status(200).json(runMockAI());
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are "Pashuraksha Assistance", a highly skilled veterinary AI assistant and app guide for rural livestock farmers in India.
Your goal is to provide immediate triage advice for diseases, AND help farmers navigate the Pashuraksha app.

CRITICAL RULES:
1. Always respond in the language requested: ${lang === 'hi' ? 'Hindi (हिंदी)' : (lang === 'mr' ? 'Marathi (मराठी)' : 'English')}.
2. Keep your response brief and easy to understand.
3. If they ask how to use the app, explain that they can Report Issues, view their Herd Ledger, or check the Vaccine Passbook.
4. Return your response as a valid JSON object matching this schema:
{
  "text": "Your helpful response paragraph here. Use \\n for line breaks.",
  "actions": [
    {"id": "report", "label": "REPORT ISSUE", "primary": true}
  ]
}
Available action IDs are: 'report', 'call', 'vaccine_nav', 'herd'. Translate the labels of the actions to the requested language.`;

      const prompt = `${systemPrompt}\n\nFarmer says: "${message}"\n\nReturn ONLY the raw JSON object.`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      return res.json(JSON.parse(responseText));
    } catch (apiError) {
      console.warn("Gemini API failed, falling back to Mock AI:", apiError.message);
      return res.status(200).json(runMockAI());
    }
    
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;
