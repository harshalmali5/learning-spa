import { useState, useEffect } from "react";

const BADGES = {
  10: { name: "Beginner", icon: "🌱", color: "bg-gradient-to-r from-green-100 to-green-200 text-green-800" },
  50: { name: "Explorer", icon: "🔍", color: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800" },
  100: { name: "Scholar", icon: "📚", color: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800" },
  200: { name: "Expert", icon: "⭐", color: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800" },
  500: { name: "Master", icon: "👑", color: "bg-gradient-to-r from-red-100 to-red-200 text-red-800" },
  1000: { name: "Legend", icon: "🏆", color: "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800" }
};

const LEVELS = [
  { level: 1, xp: 0, title: "Novice" },
  { level: 2, xp: 50, title: "Apprentice" },
  { level: 3, xp: 100, title: "Student" },
  { level: 4, xp: 200, title: "Learner" },
  { level: 5, xp: 350, title: "Scholar" },
  { level: 6, xp: 500, title: "Expert" },
  { level: 7, xp: 700, title: "Master" },
  { level: 8, xp: 1000, title: "Grandmaster" },
  { level: 9, xp: 1500, title: "Legend" },
  { level: 10, xp: 2000, title: "Mythic" }
];

export default function XPTracker({ xp, onXpChange }) {
  const [totalXp, setTotalXp] = useState(() => {
    const saved = localStorage.getItem("learningXp");
    return saved ? parseInt(saved) : 0;
  });
  
  const [recentXp, setRecentXp] = useState(0);
  const [showXpGain, setShowXpGain] = useState(false);

  useEffect(() => {
    localStorage.setItem("learningXp", totalXp.toString());
  }, [totalXp]);

  useEffect(() => {
    if (xp > 0) {
      setTotalXp(prev => prev + xp);
      setRecentXp(xp);
      setShowXpGain(true);
      
      setTimeout(() => {
        setShowXpGain(false);
      }, 3000);
      
      if (onXpChange) {
        onXpChange(totalXp + xp);
      }
    }
  }, [xp]);

  const getCurrentLevel = () => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXp >= LEVELS[i].xp) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  };

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextLevelIndex = LEVELS.findIndex(level => level.level === currentLevel.level + 1);
    return nextLevelIndex >= 0 ? LEVELS[nextLevelIndex] : null;
  };

  const getProgress = () => {
    const current = getCurrentLevel();
    const next = getNextLevel();
    
    if (!next) return 100;
    
    const xpInCurrentLevel = totalXp - current.xp;
    const xpNeededForNext = next.xp - current.xp;
    
    return Math.min(100, (xpInCurrentLevel / xpNeededForNext) * 100);
  };

  const getEarnedBadges = () => {
    return Object.entries(BADGES)
      .filter(([requiredXp]) => totalXp >= parseInt(requiredXp))
      .map(([requiredXp, badge]) => ({ requiredXp: parseInt(requiredXp), ...badge }));
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progress = getProgress();
  const earnedBadges = getEarnedBadges();

  return (
    <div className="modern-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl float">🎮</div>
          <h3 className="text-xl font-bold gradient-text">Learning Progress</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600 mb-1">{totalXp}</div>
          <div className="text-sm text-gray-500 font-medium">Total XP</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-800">
            Level {currentLevel.level} - {currentLevel.title}
          </span>
          {nextLevel && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {nextLevel.xp - totalXp} XP to Level {nextLevel.level}
            </span>
          )}
        </div>
        
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Recent XP Gain Animation */}
      {showXpGain && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce z-50">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🎉</span>
            <span className="font-bold">+{recentXp} XP!</span>
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="mb-8">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          Badges Earned
        </h4>
        <div className="flex flex-wrap gap-3">
          {earnedBadges.length > 0 ? (
            earnedBadges.map((badge, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${badge.color}`}
                title={`${badge.name} - ${badge.requiredXp} XP`}
              >
                {badge.icon} {badge.name}
              </div>
            ))
          ) : (
            <div className="text-center w-full py-4">
              <div className="text-2xl mb-2">🌟</div>
              <p className="text-gray-500 text-sm">Complete activities to earn badges!</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{currentLevel.level}</div>
          <div className="text-xs text-gray-600 font-medium">Current Level</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{earnedBadges.length}</div>
          <div className="text-xs text-gray-600 font-medium">Badges Earned</div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          if (confirm("Are you sure you want to reset your progress?")) {
            setTotalXp(0);
            localStorage.removeItem("learningXp");
          }
        }}
        className="w-full py-3 text-sm text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-xl"
      >
        Reset Progress
      </button>
    </div>
  );
} 