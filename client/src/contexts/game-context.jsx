import { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const GameContext = createContext(undefined);

const initialState = {
  user: null,
  servers: [],
  activities: [],
  jobCooldowns: {},
  currentLearning: null,
  totalIncomePerMinute: 0,
  unlockedTabs: ['tutorial'],
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      const unlockedTabs = ['tutorial'];
      if (action.payload?.balance >= 15000 || action.payload?.tutorialCompleted) {
        unlockedTabs.push('servers', 'hosting', 'learning');
      }
      return {
        ...state,
        user: action.payload,
        unlockedTabs,
      };

    case 'SET_SERVERS':
      const totalIncome = action.payload.reduce((sum, server) =>
        sum + (server.isOnline ? server.incomePerMinute : 0), 0
      );
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

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: userResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !gameState.user,
    retry: false,
  });

  // Fetch servers
  const { data: serversResponse } = useQuery({
    queryKey: ['/api/servers'],
    enabled: !!gameState.user,
  });

  // Fetch activities
  const { data: activitiesResponse } = useQuery({
    queryKey: ['/api/activities'],
    enabled: !!gameState.user,
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
      const response = await apiRequest('POST', '/api/income/update');
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'UPDATE_INCOME', payload: data });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ nickname, password }) => {
      const response = await apiRequest('POST', '/api/auth/login', { nickname, password });
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries();
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ nickname, password, confirmPassword }) => {
      const response = await apiRequest('POST', '/api/auth/register', { nickname, password, confirmPassword });
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout');
      return response.json();
    },
    onSuccess: () => {
      dispatch({ type: 'RESET' });
      queryClient.clear();
    },
  });

  // Job completion mutation
  const jobMutation = useMutation({
    mutationFn: async (jobType) => {
      const response = await apiRequest('POST', `/api/jobs/${jobType}/start`);
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs/cooldowns'] });
    },
  });

  // Server purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (productId) => {
      const response = await apiRequest('POST', '/api/servers/purchase', { productId });
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
  });

  // Server toggle mutation
  const toggleMutation = useMutation({
    mutationFn: async (serverId) => {
      const response = await apiRequest('POST', `/api/servers/${serverId}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
    },
  });

  // Server delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (serverId) => {
      const response = await apiRequest('DELETE', `/api/servers/${serverId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
  });

  // Tutorial completion mutation
  const tutorialMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/tutorial/complete');
      return response.json();
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_USER', payload: data.user });
    },
  });

  // Learning start mutation
  const startLearningMutation = useMutation({
    mutationFn: async (courseId) => {
      const response = await apiRequest('POST', '/api/learning/start', { courseId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning/current'] });
    },
  });

  // Update state when data changes
  useEffect(() => {
    if (userResponse?.user) {
      dispatch({ type: 'SET_USER', payload: userResponse.user });
    }
  }, [userResponse]);

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
