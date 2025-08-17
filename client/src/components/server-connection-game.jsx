import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

  const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];

  useEffect(() => {
    if (isOpen && gameState === 'instructions') {
      initializeGame();
    }
  }, [isOpen]);

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

  const initializeGame = () => {
    const numConnections = Math.floor(Math.random() * 3) + 4; // 4-6 connections
    const gameColors = colors.slice(0, numConnections);
    
    // Create cables (left side) - randomize positions
    const shuffledIndexes = Array.from({length: numConnections}, (_, i) => i).sort(() => Math.random() - 0.5);
    const newCables = gameColors.map((color, index) => ({
      id: `cable-${index}`,
      color,
      x: 20,
      y: 80 + shuffledIndexes[index] * 50,
      connected: false
    }));

    // Create ports (right side) - randomize colors and positions
    const shuffledColors = [...gameColors].sort(() => Math.random() - 0.5);
    const shuffledPortIndexes = Array.from({length: numConnections}, (_, i) => i).sort(() => Math.random() - 0.5);
    const newPorts = shuffledColors.map((color, index) => ({
      id: `port-${index}`,
      color,
      x: 380,
      y: 80 + shuffledPortIndexes[index] * 50,
      connected: false
    }));

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
    setGameState('success');
    updateServerMutation.mutate(server.id);
    toast({
      title: t('serverminigame5'),
      description: t('serverminigame6'),
    });
  };

  const handleGameFailed = () => {
    setGameState('failed');
    damageServerMutation.mutate(server.id);
    toast({
      title: t('serverminigame7'),
      description: t('serverminigame8'),
      variant: 'destructive'
    });
  };

  const closeGame = () => {
    setGameState('instructions');
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
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={closeGame}
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
              <Button onClick={closeGame} className="bg-green-600 hover:bg-green-700">
                {t('close')}
              </Button>
            </div>
          )}

          {gameState === 'failed' && (
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-red-600">{t('serverminigame7')}</div>
              <div className="text-gray-600 dark:text-gray-300">{t('serverminigame11')}</div>
              <Button onClick={closeGame} variant="destructive">
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