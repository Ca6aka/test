import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/contexts/game-context';

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { gameState } = useGame();

  const getAssistantTips = () => {
    const tips = [];
    
    if (!gameState.user) return tips;

    if (gameState.user.balance < 15000) {
      tips.push("Complete tutorial jobs to earn money and unlock new features!");
    }
    
    if (gameState.servers && gameState.servers.length === 0 && gameState.user.balance >= 5000) {
      tips.push("You have enough money to buy your first server! Visit the Server Store.");
    }
    
    if (gameState.servers && gameState.servers.some(s => !s.isOnline)) {
      tips.push("Some of your servers are offline. Turn them on to earn income!");
    }
    
    if (!gameState.currentLearning && gameState.user.balance >= 2000) {
      tips.push("Consider taking a learning course to unlock more server slots!");
    }
    
    if (gameState.servers && gameState.servers.length >= (gameState.user.serverLimit || 3)) {
      tips.push("You've reached your server limit. Complete learning courses to unlock more slots!");
    }

    return tips;
  };

  const tips = getAssistantTips();

  return (
    <>
      {/* Assistant Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 sm:w-14 h-12 sm:h-14 bg-primary hover:bg-primary/80 rounded-full shadow-2xl transition-all hover:scale-105"
        >
          <i className="fas fa-robot text-white text-sm sm:text-lg"></i>
        </Button>
      </div>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-50 w-72 sm:w-80">
          <Card className="bg-slate-800/95 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary flex items-center space-x-2">
                <i className="fas fa-robot"></i>
                <span>AI Assistant</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="ml-auto h-8 w-8 p-0"
                >
                  <i className="fas fa-times text-slate-400"></i>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tips.length > 0 ? (
                <>
                  <p className="text-sm text-slate-400 mb-3">Here are some tips to help you:</p>
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-slate-700/30 rounded-lg">
                      <i className="fas fa-lightbulb text-accent text-sm mt-0.5"></i>
                      <p className="text-sm text-slate-300">{tip}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle text-secondary text-2xl mb-2"></i>
                  <p className="text-sm text-slate-300">You're doing great! Keep up the good work!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
