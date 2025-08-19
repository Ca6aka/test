import { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const GameContext = createContext(undefined);

const initialState = {
  user: null,
  servers: [],
  activities: [],
  jobCooldowns: {},
  currentLearning: null,
  totalIncomePerMinute: 0,
  unlockedTabs: ['tutorial', ''],
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      const unlockedTabs = ['tutorial', 'achievements', 'quests', 'reports'];
      // Only unlock servers, hosting, and learning tabs when tutorial is completed
      if (action.payload?.tutorialCompleted) {
        unlockedTabs.push('servers', 'hosting', 'learning');
      }
      return {
        ...state,
        user: action.payload,
        unlockedTabs,
      };

    case 'SET_SERVERS':
      const totalIncome = action.payload.reduce((sum, server) => {
        if (!server.isOnline) return sum;
        const baseIncome = server.incomePerMinute;
        const loadPercentage = server.loadPercentage || 50;
        const adjustedIncome = baseIncome * (1 + (loadPercentage - 50) / 100);
        return sum + adjustedIncome;
      }, 0);
      return {
        ...state,
        servers: action.payload,
        totalIncomePerMinute: totalIncome,
      };

    case 'SET_ACTIVITIES':
      return {
        ...state,
        activities: action.payload,
      };

    case 'SET_COOLDOWNS':
      return {
        ...state,
        jobCooldowns: action.payload,
      };

    case 'SET_LEARNING':
      return {
        ...state,
        currentLearning: action.payload,
      };

    case 'UPDATE_INCOME':
      return {
        ...state,
        user: action.payload.user,
      };

    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        user: {
          ...state.user,
          experience: action.payload.experience,
          level: action.payload.level,
          balance: action.payload.balance || state.user.balance
        }
      };

    case 'UPDATE_USER_DATA':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    case 'COMPLETE_LEARNING':
      return {
        ...state,
        currentLearning: null,
        user: {
          ...state.user,
          ...action.payload.user
        }
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Level-up notification function
  const showLevelUpNotification = (newLevel) => {
    // Dispatch custom event for the new level-up notification component
    window.dispatchEvent(new CustomEvent('levelUp', { 
      detail: { level: newLevel }
    }));
  };

  // Fetch current user
  const { data: userResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !gameState.user,
    retry: false,
  });

  // Refetch user data periodically to catch balance/XP updates from external sources
  const { data: userUpdateResponse } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!gameState.user,
    refetchInterval: 5000, // Check every 5 seconds for balance/XP updates
    retry: false,
  });

  // Fetch servers  
  const { data: serversResponse } = useQuery({
    queryKey: ['/api/servers'],
    enabled: !!gameState.user,
    refetchInterval: 5000, // Update every 5 seconds for real-time server status
  });

  // Fetch activities
  const { data: activitiesResponse } = useQuery({
    queryKey: ['/api/activities'],
    enabled: !!gameState.user,
    refetchInterval: 5000, // Update every 5 seconds for real-time activity updates
  });

  // Fetch job cooldowns
  const { data: cooldownsResponse } = useQuery({
    queryKey: ['/api/jobs/cooldowns'],
    enabled: !!gameState.user,
    refetchInterval: 1000,
  });

  // Fetch current learning
  const { data: learningResponse } = useQuery({
    queryKey: ['/api/learning/current'],
    enabled: !!gameState.user,
    refetchInterval: 1000,
  });

  // Income update mutation
  const incomeUpdateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/income/update', {
        method: 'POST'
      });
      return response;
    },
    onSuccess: (data) => {
      dispatch({ type: 'UPDATE_INCOME', payload: data });
      // Invalidate queries to ensure UI updates immediately
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ nickname, password }) => {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ nickname, password })
      });
      return response;
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries();
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ nickname, password, confirmPassword }) => {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nickname, password, confirmPassword })
      });
      return response;
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/auth/logout', {
        method: 'POST'
      });
      return response;
    },
    onSuccess: () => {
      dispatch({ type: 'RESET' });
      queryClient.clear();
      // Navigate to start page instead of reg
      window.location.href = '/start';
    },
  });

  // Job completion mutation
  const jobMutation = useMutation({
    mutationFn: async (jobType) => {
      const response = await apiRequest(`/api/jobs/${jobType}/start`, {
        method: 'POST'
      });
      return response;
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs/cooldowns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quests'] }); // Update quests after job completion
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      // Show level-up notification if user leveled up
      if (data.leveledUp && data.newLevel) {
        showLevelUpNotification(data.newLevel);
      }
    },
  });

  // Server purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (productId) => {
      const response = await apiRequest('/api/servers/purchase', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      return response;
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Server toggle mutation
  const toggleMutation = useMutation({
    mutationFn: async (serverId) => {
      return await apiRequest(`/api/servers/${serverId}/toggle`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Server delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (serverId) => {
      return await apiRequest(`/api/servers/${serverId}`, 'DELETE');
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch({ type: 'SET_USER', payload: data.user });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Tutorial completion mutation
  const tutorialMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/tutorial/complete', {
        method: 'POST'
      });
      return response;
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
    },
  });

  // Learning start mutation
  const startLearningMutation = useMutation({
    mutationFn: async (courseId) => {
      const response = await apiRequest('/api/learning/start', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch({ type: 'SET_USER', payload: data.user });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/learning/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });
  
  // Update state when data changes
  useEffect(() => {
    if (userResponse?.user) {
      dispatch({ type: 'SET_USER', payload: userResponse.user });
    }
  }, [userResponse]);

  // Handle periodic user updates for real-time balance/XP changes
  useEffect(() => {
    if (userUpdateResponse?.user) {
      dispatch({ type: 'SET_USER', payload: userUpdateResponse.user });
    }
  }, [userUpdateResponse]);

  useEffect(() => {
    if (serversResponse?.servers) {
      dispatch({ type: 'SET_SERVERS', payload: serversResponse.servers });
    }
  }, [serversResponse]);

  useEffect(() => {
    if (activitiesResponse?.activities) {
      dispatch({ type: 'SET_ACTIVITIES', payload: activitiesResponse.activities });
    }
  }, [activitiesResponse]);

  useEffect(() => {
    if (cooldownsResponse?.cooldowns) {
      dispatch({ type: 'SET_COOLDOWNS', payload: cooldownsResponse.cooldowns });
    }
  }, [cooldownsResponse]);

  useEffect(() => {
    if (learningResponse?.learning) {
      dispatch({ type: 'SET_LEARNING', payload: learningResponse.learning });
    }
  }, [learningResponse]);

  // Income update interval
  useEffect(() => {
    if (gameState.user && gameState.servers.length > 0) {
      const interval = setInterval(() => {
        incomeUpdateMutation.mutate();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [gameState.user, gameState.servers.length]);

  const contextValue = {
    gameState,
    login: async (nickname, password) => {
      await loginMutation.mutateAsync({ nickname, password });
    },
    register: async (nickname, password, confirmPassword) => {
      await registerMutation.mutateAsync({ nickname, password, confirmPassword });
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    completeJob: async (jobType) => {
      await jobMutation.mutateAsync(jobType);
    },
    purchaseServer: async (productId) => {
      await purchaseMutation.mutateAsync(productId);
    },
    toggleServer: async (serverId) => {
      await toggleMutation.mutateAsync(serverId);
    },
    deleteServer: async (serverId) => {
      await deleteMutation.mutateAsync(serverId);
    },
    completeTutorial: async () => {
      await tutorialMutation.mutateAsync();
    },
    startLearning: async (courseId) => {
      await startLearningMutation.mutateAsync(courseId);
    },
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
