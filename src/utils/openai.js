export async function streamGPT(messages, onChunk) {
  const apiKey = localStorage.getItem("openai_api_key") || import.meta.env.VITE_OPENAI_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please enter your API key in the app settings.');
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API error: ${res.status} - ${error}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n").filter(l => l.trim().startsWith("data: "));
    buffer = buffer.split("\n").filter(l => !l.trim().startsWith("data: ")).join("\n");
    
    for (let line of lines) {
      if (line.includes("[DONE]")) return;
      try {
        const json = JSON.parse(line.replace("data: ", ""));
        const content = json.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch (e) {
        // Ignore parsing errors for incomplete chunks
      }
    }
  }
}

export async function generateQuiz(topic, difficulty = 'medium') {
  const messages = [
    {
      role: "system",
      content: `You are an expert educator creating interactive quizzes. Generate a quiz with 3-5 questions about ${topic} at ${difficulty} difficulty level. 
      Return the response as a JSON object with this exact structure:
      {
        "title": "Quiz Title",
        "description": "Brief description",
        "questions": [
          {
            "id": 1,
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correct": 0,
            "explanation": "Why this is correct"
          }
        ]
      }`
    },
    {
      role: "user",
      content: `Create a ${difficulty} level quiz about ${topic}`
    }
  ];

  let response = "";
  await streamGPT(messages, chunk => {
    response += chunk;
  });

  try {
    return JSON.parse(response);
  } catch (e) {
    throw new Error('Failed to parse quiz response');
  }
}

export async function evaluateAnswer(question, userAnswer, correctAnswer, explanation) {
  const messages = [
    {
      role: "system",
      content: "You are an AI tutor evaluating student answers. Provide constructive feedback and assign XP points (1-10) based on answer quality."
    },
    {
      role: "user",
      content: `Question: ${question}
      Correct Answer: ${correctAnswer}
      Student Answer: ${userAnswer}
      Explanation: ${explanation}
      
      Evaluate this answer and provide:
      1. A brief feedback (1-2 sentences)
      2. XP points earned (1-10)
      3. Suggestions for improvement
      
      Return as JSON: {"feedback": "...", "xp": number, "suggestions": "..."}`
    }
  ];

  let response = "";
  await streamGPT(messages, chunk => {
    response += chunk;
  });

  try {
    return JSON.parse(response);
  } catch (e) {
    return {
      feedback: "Good effort! Keep practicing.",
      xp: 5,
      suggestions: "Review the material and try again."
    };
  }
} 

export async function getLLMResponse(prompt) {
  const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your real API key or use env variable
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  return data.choices[0].text.trim();
} 