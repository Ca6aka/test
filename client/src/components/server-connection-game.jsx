import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const ServerConnectionGame = ({ isOpen, onClose, server, onSuccess }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [gameState, setGameState] = useState('instructions'); // instructions, playing, success, failed
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [connections, setConnections] = useState([]);
  const [draggedCable, setDraggedCable] = useState(null);
  const [cables, setCables] = useState([]);
  const [ports, setPorts] = useState([]);

  const updateServerMutation = useMutation({
    mutationFn: (serverId) => apiRequest(`/api/servers/${serverId}/toggle`, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      onSuccess();
    }
  });

  const damageServerMutation = useMutation({
    mutationFn: (serverId) => apiRequest(`/api/servers/${serverId}/damage`, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
    }
  });

  const updateExpMutation = useMutation({
    mutationFn: (xpGained) => apiRequest('/api/users/add-xp', 'POST', { xp: xpGained }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error) => {
      console.error('Failed to add XP:', error);
    }
  });

  const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];

  useEffect(() => {
    if (isOpen && gameState === 'instructions' && !gameCompleted) {
      initializeGame();
    }
  }, [isOpen, gameCompleted]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      handleGameFailed();
    }
  }, [timeLeft, gameState]);

  const generateCables = () => {
    const numConnections = Math.floor(Math.random() * 3) + 4; // 4-6 connections
    const gameColors = colors.slice(0, numConnections);
    
    // Create cables (left side) - randomize positions
    const shuffledIndexes = Array.from({length: numConnections}, (_, i) => i).sort(() => Math.random() - 0.5);
    return gameColors.map((color, index) => ({
      id: `cable-${index}`,
      color,
      x: 30,
      y: 60 + shuffledIndexes[index] * 50,
      connected: false
    }));
  };

  const generatePorts = () => {
    const numConnections = cables.length || Math.floor(Math.random() * 3) + 4;
    const gameColors = colors.slice(0, numConnections);
    
    // Create ports (right side) - randomize colors and positions
    const shuffledColors = [...gameColors].sort(() => Math.random() - 0.5);
    const shuffledPortIndexes = Array.from({length: numConnections}, (_, i) => i).sort(() => Math.random() - 0.5);
    return shuffledColors.map((color, index) => ({
      id: `port-${index}`,
      color,
      x: 380,
      y: 60 + shuffledPortIndexes[index] * 50,
      connected: false
    }));
  };

  const initializeGame = () => {
    const newCables = generateCables();
    const newPorts = generatePorts();
    
    setCables(newCables);
    setPorts(newPorts);
    setConnections([]);
    setTimeLeft(30);
  };

  const startGame = () => {
    setGameState('playing');
  };

  const handleCableMouseDown = (cable) => {
    if (!cable.connected) {
      setDraggedCable(cable);
    }
  };

  const handlePortClick = (port) => {
    if (draggedCable && !port.connected && draggedCable.color === port.color) {
      // Correct connection
      const newConnection = {
        from: draggedCable,
        to: port,
        id: `connection-${draggedCable.id}-${port.id}`
      };

      setConnections(prev => [...prev, newConnection]);
      setCables(prev => prev.map(c => c.id === draggedCable.id ? {...c, connected: true} : c));
      setPorts(prev => prev.map(p => p.id === port.id ? {...p, connected: true} : p));
      setDraggedCable(null);

      // Check if all connections are made
      if (connections.length + 1 === cables.length) {
        handleGameSuccess();
      }
    } else if (draggedCable && !port.connected) {
      // Wrong connection
      setDraggedCable(null);
      toast({
        title: t('serverminigame3'),
        description: t('serverminigame4'),
        variant: 'destructive'
      });
    }
  };

  const handleGameSuccess = () => {
    setGameCompleted(true);
    // Add 1 second delay before showing result window
    setTimeout(() => {
      setGameState('success');
      // Server connection game should NOT give XP, only activate the server
      updateServerMutation.mutate(server.id);
      toast({
        title: t('serverminigame5'),
        description: t('serverminigame6'),
      });
    }, 1000);
  };

  const handleGameFailed = () => {
    setGameCompleted(true);
    // Add 1 second delay before showing result window
    setTimeout(() => {
      setGameState('failed');
      damageServerMutation.mutate(server.id);
      toast({
        title: t('serverminigame7'),
        description: t('serverminigame8'),
        variant: 'destructive'
      });
    }, 1000);
  };

  const closeGame = () => {
    setGameState('instructions');
    setGameCompleted(false);
    setConnections([]);
    setCables(generateCables());
    setPorts(generatePorts());
    setTimeLeft(30);
    setDraggedCable(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeGame}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            {t('serverminigame1')}
          </DialogTitle>
          <DialogDescription>
            {t('serverminigame2') || 'Connect the cables to their matching ports to activate the server'}
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={closeGame}
            data-testid="button-close-game"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {gameState === 'instructions' && (
            <div className="text-center space-y-4">
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {t('serverminigame2')}
              </div>
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                {t('startGame')}
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">{t('timeLeft')}: {timeLeft}s</div>
                <Progress value={(30 - timeLeft) / 30 * 100} className="w-32" />
              </div>

              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4" style={{ height: '400px' }}>

                {/* Cables (left side) */}
                {cables.map((cable) => (
                  <div
                    key={cable.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                      cable.connected ? 'opacity-50' : ''
                    }`}
                    style={{
                      backgroundColor: cable.color,
                      left: `${cable.x}px`,
                      top: `${cable.y}px`,
                      border: draggedCable?.id === cable.id ? '3px solid white' : '2px solid #333'
                    }}
                    onMouseDown={() => handleCableMouseDown(cable)}
                    data-testid={`cable-${cable.id}`}
                  />
                ))}

                {/* Ports (right side) */}
                {ports.map((port) => (
                  <div
                    key={port.id}
                    className={`absolute w-4 h-4 cursor-pointer transition-transform hover:scale-110 ${
                      port.connected ? 'opacity-50' : ''
                    }`}
                    style={{
                      backgroundColor: port.color,
                      left: `${port.x}px`,
                      top: `${port.y}px`,
                      border: '2px solid #333',
                      clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
                    }}
                    onClick={() => handlePortClick(port)}
                    data-testid={`port-${port.id}`}
                  />
                ))}

                {/* Connection lines */}
                {connections.map((connection) => (
                  <svg
                    key={connection.id}
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <line
                      x1={connection.from.x + 8}
                      y1={connection.from.y + 8}
                      x2={connection.to.x + 8}
                      y2={connection.to.y + 8}
                      stroke={connection.from.color}
                      strokeWidth="3"
                    />
                  </svg>
                ))}

                {/* Dragged cable line */}
                {draggedCable && (
                  <svg
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <line
                      x1={draggedCable.x + 8}
                      y1={draggedCable.y + 8}
                      x2={draggedCable.x + 100}
                      y2={draggedCable.y + 8}
                      stroke={draggedCable.color}
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  </svg>
                )}
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('serverminigame9')} {connections.length}/{cables.length}
                </div>
              </div>
            </div>
          )}

          {gameState === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-green-600">{t('serverminigame5')}</div>
              <div className="text-gray-600 dark:text-gray-300">{t('serverminigame10')}</div>
              <div className="text-lg font-medium text-green-400">Server activated successfully!</div>
              <Button 
                onClick={closeGame} 
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-close-success"
              >
                {t('close')}
              </Button>
            </div>
          )}

          {gameState === 'failed' && (
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-red-600">{t('serverminigame7')}</div>
              <div className="text-gray-600 dark:text-gray-300">{t('serverminigame11')}</div>
              <Button 
                onClick={closeGame} 
                variant="destructive"
                data-testid="button-close-failed"
              >
                {t('close')}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServerConnectionGame;