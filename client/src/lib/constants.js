export const TUTORIAL_UNLOCK_THRESHOLD = 15000;

export const SERVER_PRODUCTS = [
  {
    id: 'basic-web',
    name: 'Basic Web Server',
    type: 'Web Hosting',
    price: 5000,
    incomePerMinute: 15,
    monthlyCost: 45,
    icon: 'fas fa-globe',
    requiredLevel: 1
  },
  {
    id: 'high-performance',
    name: 'High Performance Server',
    type: 'Gaming/Apps',
    price: 12000,
    incomePerMinute: 50,
    monthlyCost: 120,
    icon: 'fas fa-server',
    requiredLevel: 4
  },
  {
    id: 'database-server',
    name: 'Database Server',
    type: 'Storage',
    price: 8000,
    incomePerMinute: 25,
    monthlyCost: 85,
    icon: 'fas fa-database',
    requiredLevel: 8
  },
  {
    id: 'cdn-server',
    name: 'CDN Server',
    type: 'Content Delivery',
    price: 15000,
    incomePerMinute: 100,
    monthlyCost: 180,
    icon: 'fas fa-cloud',
    requiredLevel: 12
  },
  {
    id: 'gpu-server',
    name: 'GPU Server',
    type: 'AI',
    price: 25000,
    incomePerMinute: 150,
    monthlyCost: 250,
    icon: 'fas fa-microchip',
    requiredLevel: 25,
    requiredLearning: 'ai-gpu-settings'
  },
  {
    id: 'tpu-server',
    name: 'TPU Server',
    type: 'Computing',
    price: 47500,
    incomePerMinute: 200,
    monthlyCost: 350,
    icon: 'fas fa-brain',
    requiredLevel: 45,
    requiredLearning: 'tpu-settings-machine'
  }
];

export const LEARNING_COURSES = [
  {
    id: 'basic-setup',
    title: 'Basic Server Setup',
    description: 'Learn the fundamentals of server configuration and deployment',
    difficulty: 'Beginner',
    duration: 30 * 60 * 1000, // 30 minutes in milliseconds
    reward: { type: 'serverSlots', amount: 1 },
    price: 2000,
    requiredLevel: 1
  },
  {
    id: 'advanced-management',
    title: 'Advanced Server Management',
    description: 'Master advanced server optimization and scaling techniques',
    difficulty: 'Advanced',
    duration: 120 * 60 * 1000, // 2 hours in milliseconds
    reward: { type: 'serverSlots', amount: 2 },
    price: 8000,
    requiredLevel: 5
  },
  {
    id: 'security-protocols',
    title: 'Security Protocols',
    description: 'Implement robust security measures for your server infrastructure',
    difficulty: 'Intermediate',
    duration: 90 * 60 * 1000, // 1.5 hours in milliseconds
    reward: { type: 'efficiency', amount: 15 },
    price: 5000,
    requiredLevel: 12
  },
  {
    id: 'ai-gpu-settings',
    title: 'AI GPU Settings',
    description: 'Master GPU configuration for AI workloads and machine learning tasks',
    difficulty: 'Expert',
    duration: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    reward: { type: 'serverUnlock', serverType: 'gpu-server' },
    price: 15000,
    requiredLevel: 25
  },
  {
    id: 'tpu-settings-machine',
    title: 'TPU Settings Machine',
    description: 'Advanced TPU configuration for high-performance computing and neural networks',
    difficulty: 'Master',
    duration: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
    reward: { type: 'serverUnlock', serverType: 'tpu-server' },
    price: 25000,
    requiredLevel: 45
  }
];

export const JOB_TYPES = [
  {
    id: 'maintenance',
    name: 'Server Maintenance',
    reward: 150,
    cooldown: 300000, // 5 minutes
    icon: 'fas fa-wrench'
  },
  {
    id: 'optimization',
    name: 'Performance Optimization',
    reward: 250,
    cooldown: 450000, // 7.5 minutes
    icon: 'fas fa-tachometer-alt'
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    reward: 500,
    cooldown: 600000, // 10 minutes
    icon: 'fas fa-shield-alt'
  }
];

export const formatCurrency = (amount, compact = false) => {
  if (!amount && amount !== 0) return '$0';
  
  if (compact && amount >= 1000) {
    if (amount >= 1000000) {
      return '$' + (amount / 1000000).toFixed(1) + 'M';
    }
    if (amount >= 1000) {
      return '$' + (amount / 1000).toFixed(1) + 'K';
    }
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};
