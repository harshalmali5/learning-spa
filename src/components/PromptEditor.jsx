import { useState, useEffect } from "react";

const DEFAULT_PROMPTS = {
  tutor: `You are an expert tutor. Be encouraging, patient, and helpful. 
Provide clear explanations and ask follow-up questions to engage the student. 
Keep responses concise but informative.`,
  
  quiz: `You are an expert educator creating interactive quizzes. Generate engaging questions that test understanding.
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
}`,
  
  evaluator: `You are an AI tutor evaluating student answers. Provide constructive feedback and assign XP points (1-10) based on answer quality.
Return as JSON: {"feedback": "...", "xp": number, "suggestions": "..."}`
};

export default function PromptEditor({ onPromptChange }) {
  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem("learningPrompts");
    return saved ? JSON.parse(saved) : DEFAULT_PROMPTS;
  });
  
  const [activeTab, setActiveTab] = useState("tutor");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem("learningPrompts", JSON.stringify(prompts));
    if (onPromptChange) {
      onPromptChange(prompts);
    }
  }, [prompts]);

  const handlePromptChange = (key, value) => {
    setPrompts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    if (confirm("Reset all prompts to defaults?")) {
      setPrompts(DEFAULT_PROMPTS);
    }
  };

  if (!isExpanded) {
    return (
      <div className="modern-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl float">⚙️</div>
            <div>
              <h3 className="text-lg font-bold gradient-text">Prompt Editor</h3>
              <p className="text-gray-600 text-sm">Customize AI behavior for different features</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="btn-secondary"
          >
            Expand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl float">⚙️</div>
          <h3 className="text-2xl font-bold gradient-text">Prompt Editor</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
        {Object.keys(prompts).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Prompt
        </label>
        <textarea
          value={prompts[activeTab]}
          onChange={(e) => handlePromptChange(activeTab, e.target.value)}
          className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-mono text-sm bg-white/80 backdrop-blur-sm"
          placeholder="Enter your custom prompt..."
        />
      </div>

      {/* Description */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center">
          <span className="mr-2">📖</span>
          How to use:
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <strong>Tutor:</strong> Controls how the AI tutor responds in conversations
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <strong>Quiz:</strong> Defines the format and style of generated quizzes
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <strong>Evaluator:</strong> Sets how answers are evaluated and feedback is given
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={resetToDefaults}
          className="btn-secondary"
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => {
            const textarea = document.querySelector('textarea');
            textarea.select();
            document.execCommand('copy');
            alert('Prompt copied to clipboard!');
          }}
          className="btn-primary"
        >
          Copy Current Prompt
        </button>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
        <h4 className="font-bold text-amber-800 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Tips:
        </h4>
        <ul className="text-sm text-amber-700 space-y-2">
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            Be specific about the AI's role and personality
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            Include format requirements for structured responses
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            Test your prompts to ensure they work as expected
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            Prompts are automatically saved to localStorage
          </li>
        </ul>
      </div>
    </div>
  );
} 