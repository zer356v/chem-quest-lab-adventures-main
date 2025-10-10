import React, { useState } from 'react';

export const useExperimentScoring = () => {
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [level, setLevel] = useState(0)
  const award = (points: number, reason?: string) => {
    setScore(prev => prev + points);
    console.log("Current Score:", score);
    if (reason) console.log(`Awarded ${points} points: ${reason}`);
  };

  const awardBadge = (badge: string) => {
    setBadges(prev => prev.includes(badge) ? prev : [...prev, badge]);
  };

  const reset = () => {
    setScore(0);
    setBadges([]);
  };
  
  const calculateLevel = (currentScore: number)=>{
    const newLevel = Math.floor(currentScore / 100);
    return newLevel;
  }

  return { score, badges, award, awardBadge, reset, calculateLevel };
};

export const ExperimentScorePanel: React.FC<{ score: number; badges: string[] }> = ({ score, badges }) => {
  return (
    <div style={{ position: 'absolute', left: 420, top: 12, zIndex: 50 }}>
      <div className="p-1 bg-card border rounded shadow">
        <div className="text-xl font-semibold inline-flex">Experiment Score:
          <div className="text-xl font-bold pl-2">{score}</div>
        </div>
      </div>
    </div>
  );
};

export default useExperimentScoring;
