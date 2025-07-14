import { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import QuizCard from "./components/QuizCard";
import XPTracker from "./components/XPTracker";
import PromptEditor from "./components/PromptEditor";
import SentimentChat from "./components/SentimentChat";

function App() {
  const [currentView, setCurrentView] = useState("chat");
  const [subject, setSubject] = useState("general learning");
  const [xpGain, setXpGain] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey);
      setShowApiKeyModal(false);
      window.VITE_OPENAI_KEY = apiKey;
    }
  };

  const handleXpEarned = (xp) => {
    setXpGain(xp);
  };

  const handleXpChange = (newTotal) => {
    setTotalXp(newTotal);
  };

  const views = [
    { id: "chat", name: "AI Tutor", icon: "🤖", color: "from-blue-500 to-blue-600" },
    { id: "quiz", name: "Quizzes", icon: "🎯", color: "from-green-500 to-green-600" },
    { id: "progress", name: "Progress", icon: "📊", color: "from-purple-500 to-purple-600" },
    { id: "settings", name: "Settings", icon: "⚙️", color: "from-gray-500 to-gray-600" }
  ];

  const subjects = [
    "Mathematics",
    "Science",
    "History",
    "Literature",
    "Programming",
    "Languages",
    "Art",
    "Music",
    "General Learning"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="modern-card p-8 max-w-md w-full scale-in">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔑</div>
              <h2 className="text-2xl font-bold gradient-text mb-2">OpenAI API Key Required</h2>
              <p className="text-gray-600">
                This app requires an OpenAI API key to function. Please enter your key below.
              </p>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="modern-input mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={handleApiKeySubmit}
                disabled={!apiKey.trim()}
                className="btn-primary flex-1"
              >
                Save & Continue
              </button>
              <button
                onClick={() => window.open("https://platform.openai.com/api-keys", "_blank")}
                className="btn-secondary"
              >
                Get Key
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-3xl float">🎓</div>
              <h1 className="text-2xl font-bold gradient-text">
                AI Learning Hub
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="modern-input py-2 px-4 text-sm"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Change API Key"
              >
                🔑
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={`nav-tab ${currentView === view.id ? 'active' : ''}`}
              >
                <span className="mr-2">{view.icon}</span>
                {view.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex justify-center items-center" style={{ minHeight: '600px' }}>
            {currentView === "chat" && (
              <div className="w-full max-w-2xl h-[600px] slide-up flex items-center justify-center">
                <ChatBox subject={subject} />
              </div>
            )}
            
            {currentView === "quiz" && (
              <div className="slide-up">
                <QuizCard onXpEarned={handleXpEarned} />
              </div>
            )}
            
            {currentView === "progress" && (
              <div className="space-y-6 slide-up">
                <div className="modern-card p-8">
                  <h2 className="text-3xl font-bold gradient-text mb-6">📈 Learning Analytics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{totalXp}</div>
                      <div className="text-sm text-gray-600 font-medium">Total XP</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {Math.floor(totalXp / 100) + 1}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Level</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {Math.floor(totalXp / 50)}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Badges</div>
                    </div>
                  </div>
                </div>
                
                <div className="modern-card p-8">
                  <h3 className="text-2xl font-bold gradient-text mb-6">🎯 Learning Goals</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <span className="font-medium">Complete 5 quizzes</span>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">0/5</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <span className="font-medium">Earn 100 XP</span>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">{totalXp}/100</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <span className="font-medium">Have 10 tutor conversations</span>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">0/10</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentView === "settings" && (
              <div className="slide-up">
                <PromptEditor />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="scale-in">
              <XPTracker xp={xpGain} onXpChange={handleXpChange} />
            </div>
            
            <div className="modern-card p-6 scale-in">
              <h3 className="text-xl font-bold gradient-text mb-4">🚀 Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView("chat")}
                  className="w-full p-4 text-left bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 group"
                >
                  <div className="font-semibold text-blue-700 group-hover:text-blue-800">Start Learning</div>
                  <div className="text-sm text-blue-600">Chat with AI tutor</div>
                </button>
                
                <button
                  onClick={() => setCurrentView("quiz")}
                  className="w-full p-4 text-left bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 group"
                >
                  <div className="font-semibold text-green-700 group-hover:text-green-800">Take a Quiz</div>
                  <div className="text-sm text-green-600">Test your knowledge</div>
                </button>
                
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="w-full p-4 text-left bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-xl transition-all duration-200 group"
                >
                  <div className="font-semibold text-amber-700 group-hover:text-amber-800">API Settings</div>
                  <div className="text-sm text-amber-600">Manage OpenAI key</div>
                </button>
              </div>
            </div>

            <div className="glass-card p-6 scale-in">
              <h3 className="text-xl font-bold gradient-text mb-4">💡 Tips</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Ask specific questions for better responses
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Try different difficulty levels in quizzes
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Complete quizzes to earn XP and badges
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Customize AI behavior in Settings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-2xl mb-2">🎓</div>
            <p className="text-gray-600 font-medium">AI Learning Hub - Powered by OpenAI GPT-4</p>
            <p className="text-gray-500 text-sm mt-1">No backend required • All data stored locally</p>
          </div>
        </div>
      </footer>
      <SentimentChat />
    </div>
  );
}

export default App; 