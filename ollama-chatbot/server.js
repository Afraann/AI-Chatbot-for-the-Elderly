const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Ollama API endpoint
const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

// 1️⃣ System Prompt (elderly-friendly style)
const systemPrompt = `
You are an empathetic and patient chatbot designed for elderly users.
Speak in a clear, gentle tone and use simple language.
Always be polite and friendly, and avoid complex jargon.
If asked for medical advice, provide a disclaimer and encourage the user to consult a healthcare professional.
`;

// 2️⃣ In-Context Examples (demonstrate the desired style)
const examples = `
User: I'm feeling lonely today.
Chatbot: I'm sorry to hear that. Would you like to talk more about what's on your mind?

User: What time is it?
Chatbot: It's about 2:30 PM. Is there anything else I can help you with?
`;

// 3️⃣ Define Keywords for Disclaimers
const emergencyKeyword = "emergency";
const healthKeywords = [
  "health", "medicine", "doctor", "nurse", "pain", "clinic", "treatment",
  "hospital", "illness", "disease", "therapy", "prescription", "symptom",
  "medical", "pharmacy", "ambulance"
];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // 4️⃣ Build disclaimers based on keywords
    let disclaimers = "";
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes(emergencyKeyword)) {
      disclaimers += "If this is an emergency, please call 911 or your local emergency services immediately.\n";
    }
    if (healthKeywords.some((word) => lowerMessage.includes(word))) {
      disclaimers += "Disclaimer: I'm not a medical professional. For health concerns, please consult a doctor.\n";
    }

    // 5️⃣ Combine system prompt, disclaimers, examples, and user message
    const finalPrompt = `
${systemPrompt}

Here are some example conversations:
${examples}

${disclaimers ? `Additional disclaimers:\n${disclaimers}` : ""}

Now continue this conversation.

User: ${userMessage}
Chatbot:
    `.trim();

    console.log("🔵 Final Prompt to Ollama:\n", finalPrompt);

    // 6️⃣ Send the combined prompt to Ollama with the llama3.2:1b model
    const response = await axios.post(OLLAMA_URL, {
      model: "llama3.2:1b",
      prompt: finalPrompt,
      stream: false, // attempt to get a single consolidated response
    });

    console.log("🟢 Ollama raw response:", response.data);

    // 7️⃣ Safely handle the response
    const rawResponse = response.data?.response;
    if (rawResponse === undefined) {
      // If Ollama didn't return "response" at all, fallback
      console.error("No 'response' field in Ollama output");
      return res.json({
        reply: "I’m not sure how to respond. Could you please rephrase?"
      });
    }

    let botReply = rawResponse.trim();
    if (!botReply) {
      // If it's an empty string, fallback
      botReply = "I’m not sure how to respond to that. Could you clarify?";
    }

    // 8️⃣ Send final reply to the frontend
    res.json({ reply: botReply });
  } catch (error) {
    console.error("🔴 Error communicating with Ollama:", error.message);
    if (error.response && error.response.data) {
      console.error("Ollama error details:", error.response.data);
    }
    res.status(500).json({ error: "Ollama failed to respond" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
