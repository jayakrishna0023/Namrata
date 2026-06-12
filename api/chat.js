const { 
    classifyIntent, 
    searchLocalKB, 
    callGroqCompletions, 
    formatFallbackResponse, 
    SYSTEM_PROMPTS 
} = require('../server.js');

module.exports = async (req, res) => {
    // Vercel serverless function body
    if (req.method === 'POST') {
        try {
            // Vercel automatically parses body for JSON requests
            const parsed = req.body || {};
            const query = parsed.query || '';
            const lang = parsed.lang || 'en';
            
            const intent = classifyIntent(query);
            const { contextStr, matchedData } = searchLocalKB(query, intent, lang);
            
            const apiKey = process.env.GROQ_API_KEY;
            let responseText = "";
            
            if (apiKey && apiKey.trim()) {
                try {
                    let systemPrompt = SYSTEM_PROMPTS[lang];
                    if (contextStr) {
                        systemPrompt += `\n\nUse the following verified agricultural database guidelines as grounding context:\n${contextStr}`;
                    }
                    responseText = await callGroqCompletions(query, systemPrompt, apiKey);
                } catch (groqErr) {
                    console.error("Vercel Serverless: Groq API error:", groqErr);
                    responseText = formatFallbackResponse(query, intent, lang, matchedData);
                    responseText += "\n\n*(Note: Secure server connection timeout. Showing local database matching instead)*";
                }
            } else {
                responseText = formatFallbackResponse(query, intent, lang, matchedData);
                responseText += "\n\n*(Note: Running in offline local database mode. Set GROQ_API_KEY in the environment settings to activate conversational AI)*";
            }
            
            res.status(200).json({ response: responseText });
        } catch (err) {
            console.error("Vercel Serverless Error:", err);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
};
