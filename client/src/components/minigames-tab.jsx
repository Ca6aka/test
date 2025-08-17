import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap, X, Play, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useGame } from '@/contexts/game-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const MiniGamesTab = () => {
  const { t } = useLanguage();
  const { user } = useGame();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, tutorial, playing, results
  const [hoveredGame, setHoveredGame] = useState(null);
  
  // Game 1: DDoS Protection
  const [ddosState, setDdosState] = useState({
    packets: [],
    score: 0,
    timeLeft: 30,
    speed: 1,
    gameOver: false
  });
  
  // Game 2: Firewall
  const [firewallState, setFirewallState] = useState({
    requests: [],
    currentRequest: null,
    score: 0,
    requestsLeft: 15,
    correctChoices: 0,
    wrongChoices: 0,
    gameOver: false
  });

  const updateExpMutation = useMutation({
    mutationFn: (xpGained) => apiRequest('/api/users/add-xp', 'POST', { xp: xpGained }),
    onSuccess: (data) => {
      console.log('XP successfully added:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error) => {
      console.error('Failed to add XP:', error);
      toast({
        title: 'Error',
        description: 'Failed to add XP',
        variant: 'destructive'
      });
    }
  });

  const miniGames = [
    {
      id: 'ddos-protection',
      title: t('minigame1'),
      description: t('minigame1Desc'),
      icon: Shield,
      difficulty: t('medium'),
      duration: '30s',
      reward: '+1 XP/packet'
    },
    {
      id: 'firewall-filter',
      title: t('minigame2'),
      description: t('minigame2Desc'),
      icon: Zap,
      difficulty: t('medium'),
      duration: '15 requests',
      reward: '+1 XP/correct'
    }
  ];

  const requestTypes = [
    { type: 'User login', safe: true },
    { type: 'Backup', safe: true },
    { type: 'System update', safe: true },
    { type: 'File download', safe: true },
    { type: 'Email sync', safe: true },
    { type: 'Brute Force Attack', safe: false },
    { type: 'Malware', safe: false },
    { type: 'SQL Injection', safe: false },
    { type: 'Virus Download', safe: false },
    { type: 'Data Breach Attempt', safe: false }
  ];

  // DDoS Game Logic
  const startDdosGame = () => {
    setGameState('playing');
    setDdosState({
      packets: [],
      score: 0,
      timeLeft: 30,
      speed: 1,
      gameOver: false
    });
  };

  useEffect(() => {
    if (gameState === 'playing' && selectedGame?.id === 'ddos-protection' && ddosState.timeLeft > 0) {
      const gameInterval = setInterval(() => {
        setDdosState(prev => {
          if (prev.timeLeft <= 0) return { ...prev, gameOver: true };
          
          const newPackets = [...prev.packets];
          
          // Add new packet - full width
          if (Math.random() < 0.3) {
            newPackets.push({
              id: Date.now(),
              x: Math.random() * 560, // Full width of container
              y: 0,
              speed: prev.speed
            });
          }
          
          // Move packets
          newPackets.forEach(packet => {
            packet.y += packet.speed * 2;
          });
          
          // Remove packets that reached bottom
          const filteredPackets = newPackets.filter(packet => packet.y < 400);
          const reachedBottom = newPackets.length - filteredPackets.length;
          
          // Increase speed every 5 seconds
          const newSpeed = prev.speed + (30 - prev.timeLeft) * 0.1;
          
          return {
            ...prev,
            packets: filteredPackets,
            timeLeft: prev.timeLeft - 1,
            speed: newSpeed,
            gameOver: prev.timeLeft <= 1 || reachedBottom > 10
          };
        });
      }, 1000);

      return () => clearInterval(gameInterval);
    }
  }, [gameState, selectedGame, ddosState.timeLeft]);

  // Firewall Game Logic
  const startFirewallGame = () => {
    setGameState('playing');
    const shuffledRequests = [...requestTypes].sort(() => Math.random() - 0.5);
    setFirewallState({
      requests: shuffledRequests.slice(0, 15),
      currentRequest: shuffledRequests[0],
      score: 0,
      requestsLeft: 15,
      correctChoices: 0,
      wrongChoices: 0,
      gameOver: false
    });
  };

  const handleFirewallChoice = (choice) => {
    const currentReq = firewallState.currentRequest;
    const correct = (choice === 'allow' && currentReq.safe) || (choice === 'block' && !currentReq.safe);
    
    setFirewallState(prev => {
      const newRequestsLeft = prev.requestsLeft - 1;
      const nextRequest = prev.requests[15 - newRequestsLeft];
      
      return {
        ...prev,
        currentRequest: nextRequest,
        requestsLeft: newRequestsLeft,
        correctChoices: prev.correctChoices + (correct ? 1 : 0),
        wrongChoices: prev.wrongChoices + (correct ? 0 : 1),
        score: prev.score + (correct ? 1 : 0), // Changed from 5 to 1 XP per correct answer
        gameOver: newRequestsLeft <= 0
      };
    });
  };

  const finishGame = () => {
    if (selectedGame?.id === 'ddos-protection') {
      updateExpMutation.mutate(ddosState.score);
      toast({
        title: t('gameCompleted'),
        description: t('earnedXP').replace('{amount}', ddosState.score)
      });
    } else if (selectedGame?.id === 'firewall-filter') {
      updateExpMutation.mutate(firewallState.score);
      toast({
        title: t('gameCompleted'),
        description: t('earnedXP').replace('{amount}', firewallState.score)
      });
    }
    setGameState('results');
  };

  const destroyPacket = (packetId) => {
    setDdosState(prev => ({
      ...prev,
      packets: prev.packets.filter(p => p.id !== packetId),
      score: prev.score + 1
    }));
  };

  useEffect(() => {
    if ((ddosState.gameOver && selectedGame?.id === 'ddos-protection') || 
        (firewallState.gameOver && selectedGame?.id === 'firewall-filter')) {
      finishGame();
    }
  }, [ddosState.gameOver, firewallState.gameOver]);

  const closeGame = () => {
    setSelectedGame(null);
    setGameState('menu');
    setDdosState({ packets: [], score: 0, timeLeft: 30, speed: 1, gameOver: false });
    setFirewallState({ requests: [], currentRequest: null, score: 0, requestsLeft: 15, correctChoices: 0, wrongChoices: 0, gameOver: false });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('miniGames')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('miniGamesDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {miniGames.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card
              key={game.id}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => setSelectedGame(game)}
              data-testid={`minigame-${game.id}`}
            >
              {hoveredGame === game.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
              )}
              
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <Badge variant="secondary">{game.difficulty}</Badge>
                </div>
                <CardTitle className="text-lg">{game.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {game.description}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>{t('duration')}:</span>
                    <span className="font-medium">{game.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('reward')}:</span>
                    <span className="font-medium text-green-600">{game.reward}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" data-testid={`start-${game.id}`}>
                  <Play className="w-4 h-4 mr-2" />
                  {t('startPlaying')}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Game Dialog */}
      <Dialog open={selectedGame !== null} onOpenChange={() => closeGame()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedGame && React.createElement(selectedGame.icon, { className: "w-6 h-6" })}
              {selectedGame?.title}
            </DialogTitle>
          </DialogHeader>

          {gameState === 'menu' && selectedGame && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg mb-4">{selectedGame.description}</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedGame.duration}</div>
                    <div className="text-sm text-gray-600">{t('duration')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedGame.reward}</div>
                    <div className="text-sm text-gray-600">{t('reward')}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2">{t('howToPlay')}</h3>
                <p className="text-sm">
                  {selectedGame.id === 'ddos-protection' ? t('ddosInstructions') : t('firewallInstructions')}
                </p>
              </div>

              <Button
                onClick={() => selectedGame.id === 'ddos-protection' ? startDdosGame() : startFirewallGame()}
                className="w-full"
                data-testid="start-game"
              >
                {t('startGame')}
              </Button>
            </div>
          )}

          {gameState === 'playing' && selectedGame?.id === 'ddos-protection' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">{t('score')}: {ddosState.score}</div>
                <div className="text-lg">{t('timeLeft')}: {ddosState.timeLeft}s</div>
              </div>
              
              <div 
                className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                style={{ height: '400px', width: '100%' }}
              >
                {ddosState.packets.map(packet => (
                  <div
                    key={packet.id}
                    className="absolute bg-red-500 text-white rounded p-2 cursor-pointer hover:bg-red-600 transition-colors"
                    style={{
                      left: `${packet.x}px`,
                      top: `${packet.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => destroyPacket(packet.id)}
                    data-testid={`packet-${packet.id}`}
                  >
                    📦
                  </div>
                ))}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto" />
                  <div className="text-sm mt-2">{t('yourServer')}</div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'playing' && selectedGame?.id === 'firewall-filter' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">{t('score')}: {firewallState.score}</div>
                <div className="text-lg">{t('requestsLeft')}: {firewallState.requestsLeft}</div>
              </div>
              
              <Progress value={(15 - firewallState.requestsLeft) / 15 * 100} className="w-full" />
              
              {firewallState.currentRequest && (
                <div className="text-center space-y-6">
                  <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
                    <div className="text-2xl font-bold mb-4">
                      {firewallState.currentRequest.type}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('blockOrAllow')}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleFirewallChoice('block')}
                      variant="destructive"
                      size="lg"
                      data-testid="block-request"
                    >
                      <XCircle className="w-6 h-6 mr-2" />
                      {t('block')}
                    </Button>
                    <Button
                      onClick={() => handleFirewallChoice('allow')}
                      variant="default"
                      size="lg"
                      data-testid="allow-request"
                    >
                      <CheckCircle className="w-6 h-6 mr-2" />
                      {t('allow')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState === 'results' && (
            <div className="text-center space-y-6">
              <div className="text-3xl font-bold text-green-600">{t('gameCompleted')}</div>
              
              {selectedGame?.id === 'ddos-protection' && (
                <div className="space-y-4">
                  <div className="text-xl">{t('packetsDestroyed')}: {ddosState.score}</div>
                  <div className="text-lg text-green-600">+{ddosState.score} XP</div>
                </div>
              )}
              
              {selectedGame?.id === 'firewall-filter' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{firewallState.correctChoices}</div>
                      <div className="text-sm">{t('correct')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{firewallState.wrongChoices}</div>
                      <div className="text-sm">{t('wrong')}</div>
                    </div>
                  </div>
                  <div className="text-lg text-green-600">+{firewallState.score} XP</div>
                </div>
              )}

              <Button onClick={closeGame} className="w-full" data-testid="close-results">
                {t('close')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiniGamesTab;