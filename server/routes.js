import { createServer } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import avatar generation function
function generateRandomAvatar(nickname = '') {
  // Special avatar for Ca6aka (super admin)
  if (nickname === 'Ca6aka') {
    return {
      gradient: 'from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
      pattern: 'rainbow-super-admin',
      seed: 999999,
      animation: 'rainbow-pulse'
    };
  }
  
  const multiColorGradients = [
    'from-red-400 via-pink-500 to-purple-600',
    'from-blue-400 via-purple-500 to-indigo-600', 
    'from-green-400 via-teal-500 to-cyan-600',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-purple-400 via-violet-500 to-indigo-600',
    'from-pink-400 via-rose-500 to-red-600',
    'from-indigo-400 via-blue-500 to-cyan-600',
    'from-teal-400 via-emerald-500 to-green-600',
    'from-orange-400 via-amber-500 to-yellow-600',
    'from-cyan-400 via-sky-500 to-blue-600',
    'from-emerald-400 via-green-500 to-teal-600',
    'from-rose-400 via-pink-500 to-red-600',
    'from-violet-400 via-purple-500 to-indigo-600',
    'from-amber-400 via-orange-500 to-red-600',
    'from-lime-400 via-green-500 to-emerald-600'
  ];
  
  const animations = [
    'gradient-shift',
    'pulse-glow', 
    'shimmer-wave',
    'color-dance',
    'soft-pulse'
  ];
  
  const selectedGradient = multiColorGradients[Math.floor(Math.random() * multiColorGradients.length)];
  const selectedAnimation = animations[Math.floor(Math.random() * animations.length)];
  
  return {
    gradient: selectedGradient,
    pattern: 'multi-color',
    seed: Math.floor(Math.random() * 1000000),
    animation: selectedAnimation
  };
}

export async function registerRoutes(app) {
  // Middleware for requiring authentication
  const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
  };

  // Update user real activity for manual interactions (not automatic API calls)
  app.use('/api', (req, res, next) => {
    if (req.session?.userId) {
      // Only update realActivity for manual user interactions, not automatic background calls
      const isAutomatic = req.path.includes('/income') || 
                          req.path.includes('/stats/general') || 
                          req.path.includes('/rankings') ||
                          req.path.includes('/auth/me') ||
                          req.path.includes('/servers') ||
                          req.path.includes('/learning/current') ||
                          req.path.includes('/jobs/cooldowns') ||
                          req.path.includes('/activities');
      
      if (!isAutomatic) {
        storage.updateUserRealActivity(req.session.userId).catch(console.error);
      }
    }
    next();
  });

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { nickname, password, confirmPassword } = req.body;
      
      if (!nickname || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
      
      if (password.length < 6) {
        return res.status(404).json({ success: false, message: 'Password must be at least 6 characters long' });
      }

      // IP-based registration limits
      const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                      (req.connection.socket ? req.connection.socket.remoteAddress : null);
      
      // Check if IP already registered maximum accounts (lifetime limit)
      const registrations = await storage.checkRegistrationsByIP(clientIP);
      if (registrations >= 5) {
        return res.status(400).json({ 
          message: 'Registration limit exceeded. Maximum 5 accounts per IP address.' 
        });
      }
      
      // Normalize nickname to handle auto-translation issues
      const normalizedNickname = nickname.toLowerCase().trim();
      
      // Check for existing user with case-insensitive nickname
      const existingUser = await storage.getUserByNickname(nickname);
      if (existingUser) {
        return res.status(400).json({ message: 'Nickname already exists' });
      }
      
      // Additional check for case-insensitive duplicates
      const existingUserCaseInsensitive = await storage.getUserByNicknameCaseInsensitive(nickname);
      if (existingUserCaseInsensitive) {
        return res.status(400).json({ message: 'A user with this nickname already exists (case-insensitive)' });
      }
      
      // Generate random avatar for new user
      const avatarColors = [
        'from-red-400 to-pink-600',
        'from-blue-400 to-purple-600', 
        'from-green-400 to-teal-600',
        'from-yellow-400 to-orange-600',
        'from-purple-400 to-indigo-600',
        'from-pink-400 to-red-600',
        'from-indigo-400 to-blue-600',
        'from-teal-400 to-green-600',
        'from-orange-400 to-yellow-600',
        'from-cyan-400 to-blue-600',
        'from-emerald-400 to-cyan-600',
        'from-rose-400 to-pink-600',
        'from-violet-400 to-purple-600',
        'from-amber-400 to-orange-600',
        'from-lime-400 to-green-600'
      ];
      
      const randomAvatar = generateRandomAvatar(nickname);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ 
        nickname, 
        password: hashedPassword,
        admin: nickname === 'Ca6aka' ? 2 : 0,  // Make Ca6aka super admin automatically
        isOnline: true,
        avatar: randomAvatar,
        registrationIP: clientIP,
        registrationTime: Date.now()
      });
      
      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { nickname, password } = req.body;
      
      if (!nickname || !password) {
        return res.status(400).json({ message: 'Nickname and password are required' });
      }
      
      // Try to find user by exact match first, then case-insensitive
      let user = await storage.getUserByNickname(nickname);
      if (!user) {
        // Try case-insensitive search to handle auto-translation issues
        user = await storage.getUserByNicknameCaseInsensitive(nickname);
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check if user is banned
      if (user.banned) {
        return res.status(403).json({ message: 'Account has been banned. Contact administrator.' });
      }
      
      // Set user online when logging in
      await storage.updateUser(user.id, { ...user, isOnline: true, lastSeen: Date.now() });
      
      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined, isOnline: true } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // User activity is now updated by middleware
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    const userId = req.session.userId;
    
    // Update user's online status to false
    if (userId) {
      try {
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(userId, { ...user, isOnline: false });
        }
      } catch (error) {
        console.log('Error updating offline status:', error);
      }
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Server routes
  app.get('/api/servers', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const servers = await storage.getUserServers(req.session.userId);
      
      // Check for server overloads in real-time
      for (const server of servers) {
        if (server.isOnline && server.loadPercentage) {
          await storage.checkServerOverload(req.session.userId, server.id, server.loadPercentage);
        }
      }
      
      // Get updated servers after overload check
      const updatedServers = await storage.getUserServers(req.session.userId);
      
      // Sync with global servers JSON
      await storage.syncServerData(updatedServers);
      res.json({ servers: updatedServers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/servers/purchase', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { productId } = req.body;
      const result = await storage.purchaseServer(req.session.userId, productId);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/servers/:id/toggle', async (req, res) => {
    try {
      console.log(`[SERVER TOGGLE] Request received for server ${req.params.id}`);
      console.log(`[SERVER TOGGLE] User ID: ${req.session.userId}`);
      
      if (!req.session.userId) {
        console.log('[SERVER TOGGLE] Not authenticated');
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      console.log(`[SERVER TOGGLE] Calling storage.toggleServer for user ${req.session.userId}, server ${id}`);
      
      await storage.toggleServer(req.session.userId, id);
      
      console.log(`[SERVER TOGGLE] Server ${id} toggled successfully`);
      res.json({ message: 'Server status updated', success: true });
    } catch (error) {
      console.error(`[SERVER TOGGLE] Error: ${error.message}`);
      res.status(400).json({ message: error.message, success: false });
    }
  });

  app.delete('/api/servers/:id', async (req, res) => {
    try {
      if (!req.session.userId) {
        console.log('[SERVER DELETE] No user ID in session');
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      console.log(`[SERVER DELETE] User ${req.session.userId} deleting server ${id}`);
      
      await storage.deleteServer(req.session.userId, id);
      
      console.log(`[SERVER DELETE] Server ${id} deleted successfully`);
      res.json({ message: 'Server deleted successfully' });
    } catch (error) {
      console.error(`[SERVER DELETE] Error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/servers/:id/load', async (req, res) => {
    try {
      if (!req.session.userId) {
        console.log('[SERVER LOAD] No user ID in session');
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      const { loadPercentage } = req.body;
      
      console.log(`[SERVER LOAD] User ${req.session.userId} updating server ${id} to ${loadPercentage}%`);
      
      if (loadPercentage < 10 || loadPercentage > 100) {
        return res.status(400).json({ message: 'Load percentage must be between 10 and 100' });
      }
      
      await storage.updateServerLoad(req.session.userId, id, loadPercentage);
      
      console.log(`[SERVER LOAD] Server ${id} load updated successfully to ${loadPercentage}%`);
      res.json({ message: 'Server load updated successfully' });
    } catch (error) {
      console.error(`[SERVER LOAD] Error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/servers/:id/repair', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      const { repairType = 'full' } = req.body;
      
      if (!['full', 'partial'].includes(repairType)) {
        return res.status(400).json({ message: 'Invalid repair type. Must be "full" or "partial"' });
      }
      
      const result = await storage.repairServer(req.session.userId, id, repairType);
      
      res.json({ 
        message: 'Server repaired successfully',
        ...result
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Job routes
  app.post('/api/jobs/:jobType/start', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { jobType } = req.params;
      const result = await storage.startJob(req.session.userId, jobType);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/jobs/cooldowns', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const cooldowns = await storage.getJobCooldowns(req.session.userId);
      res.json({ cooldowns });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Learning routes
  app.post('/api/learning/start', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { courseId } = req.body;
      const result = await storage.startLearning(req.session.userId, courseId);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/learning/current', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const learning = await storage.getCurrentLearning(req.session.userId);
      res.json({ learning });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Activity routes
  app.get('/api/activities', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const activities = await storage.getUserActivities(req.session.userId);
      res.json({ activities });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Income update route
  app.post('/api/income/update', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const result = await storage.updateIncome(req.session.userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.get('/api/admin/users', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.admin < 1) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const users = await storage.getAllUsers();
      res.json({ 
        users: users.map(user => ({ 
          ...user, 
          password: undefined 
        })) 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/admin/manage', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.admin < 1) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const { userId, action, amount } = req.body;
      const targetUser = await storage.getUser(userId);
      
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent non-super-admins from modifying super admin (except for money operations by super admin himself)
      if (targetUser.nickname === 'Ca6aka' && currentUser.nickname !== 'Ca6aka') {
        return res.status(400).json({ message: 'Cannot modify super admin' });
      }
      
      let updatedUser = { ...targetUser };
      let actionDescription = '';
      
      switch (action) {
        case 'giveAdmin':
          if (currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Super admin access required' });
          }
          updatedUser.admin = 1;
          actionDescription = `Given admin privileges by ${currentUser.nickname}`;
          break;
        case 'removeAdmin':
          if (currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Super admin access required' });
          }
          updatedUser.admin = 0;
          actionDescription = `Admin privileges removed by ${currentUser.nickname}`;
          break;

          async function forceLogoutUser(userId) {
            return new Promise((resolve, reject) => {
              const store = req.sessionStore; // стандартный store из express-session
              store.all((err, sessions) => {
                if (err) return reject(err);
          
                const destroyPromises = [];
                for (const sid in sessions) {
                  const sess = sessions[sid];
                  if (sess.userId === userId) {
                    destroyPromises.push(
                      new Promise((res, rej) => store.destroy(sid, e => (e ? rej(e) : res())))
                    );
                  }
                }
          
                Promise.all(destroyPromises).then(resolve).catch(reject);
              });
            });
          }

        case 'banUser':
          // Only super-admin can ban other admins
          if (targetUser.admin >= 1 && currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Only super admin can ban other admins' });
          }
          updatedUser.banned = true;
          updatedUser.isOnline = false;
          
          // Turn off all user's servers when banned
          try {
            const servers = await storage.getUserServers(userId);
            for (const server of servers) {
              if (server.isOnline) {
                await storage.toggleServer(userId, server.id);
              }
            }
          } catch (error) {
            console.error('Failed to turn off banned user servers:', error);
          }
          
          // Force logout the banned user
          try {
            await forceLogoutUser(targetUser.id);
          } catch (error) {
            console.error('Failed to force logout banned user:', error);
          }
          
          await storage.updateUser(userId, updatedUser);

          actionDescription = `Account banned by admin ${currentUser.nickname}`;
          return res.json({ message: `User ${targetUser.nickname} has been banned`, banned: true });
        case 'unbanUser':
          updatedUser.banned = false;
          actionDescription = `Account unbanned by admin ${currentUser.nickname}`;
          break;
        case 'addMoney':
          if (currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Super admin access required' });
          }
          if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount required' });
          }
          updatedUser.balance = (targetUser.balance || 0) + amount;
          actionDescription = `Received $${amount.toLocaleString()} from super admin`;
          break;
        case 'removeMoney':
          if (currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Super admin access required' });
          }
          if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount required' });
          }
          updatedUser.balance = Math.max(0, (targetUser.balance || 0) - amount);
          actionDescription = `$${amount.toLocaleString()} removed by super admin`;
          break;
        case 'deleteUser':
          if (!currentUser || currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Only super admin can delete users.' });
          }

          try {
            await storage.deleteUserByNickname(targetUser.nickname);
            await storage.deleteServersByOwner(targetUser.id); // <-- это удалит все сервера игрока
            actionDescription = `User ${targetUser.nickname} deleted by super admin ${currentUser.nickname}`;
            break;
          } catch (error) {
            return res.status(500).json({ message: 'Failed to delete user' });
          }
        case 'muteUser':
          // Can't mute other admins unless you're super admin
          if (targetUser.admin >= 1 && currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Only super admin can mute other admins' });
          }
          const muteDuration = amount || 30; // Default 30 minutes
          const muteExpires = Date.now() + (muteDuration * 60 * 1000);
          updatedUser.muted = true;
          updatedUser.muteExpires = muteExpires;
          actionDescription = `Muted for ${muteDuration} minutes by admin ${currentUser.nickname}`;
          break;
        case 'unmuteUser':
          updatedUser.muted = false;
          updatedUser.muteExpires = null;
          actionDescription = `Unmuted by admin ${currentUser.nickname}`;
          break;
        default:
          return res.status(400).json({ message: 'Invalid action' });
      }
      
      await storage.updateUser(userId, updatedUser);
      
      // Add activity to target user's log
      if (actionDescription) {
        await storage.addActivity(userId, actionDescription);
      }
      
      res.json({ success: true, message: 'Action completed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tutorial route
  app.post('/api/tutorial/complete', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const result = await storage.completeTutorial(req.session.userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Rankings route
  app.get('/api/rankings', async (req, res) => {
    try {
      const rankings = await storage.getRankings();
      res.json({ rankings });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // General stats route for landing page
  app.get('/api/stats/general', async (req, res) => {
    try {
      const stats = await storage.getGeneralStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Player profile route
  app.get('/api/player/:nickname', async (req, res) => {
    try {
      const { nickname } = req.params;
      const player = await storage.getPlayerByNickname(nickname);
      
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      const isOnline = storage.isUserOnline(player);
      
      res.json({ 
        player: {
          ...player,
          password: undefined // Remove password from response
        },
        isOnline 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Achievements routes
  app.get('/api/achievements', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check for new achievements
      await storage.checkAchievements(req.session.userId);
      
      // Get regular achievements
      const allAchievements = storage.getAchievements();
      const userAchievements = user.achievements || [];
      
      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        earned: userAchievements.includes(achievement.id)
      }));

      // Get chat achievements and integrate them
      const chatAchievements = await storage.getChatAchievements(req.session.userId);
      const userChatAchievements = user.chatAchievements || [];
      
      const chatAchievementsWithStatus = chatAchievements.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: 'fas fa-comment',
        reward: 0, // Chat achievements don't give money rewards
        earned: userChatAchievements.includes(achievement.id),
        progress: achievement.progress,
        requirement: achievement.requirement,
        isChat: true
      }));

      // Combine all achievements
      const allCombinedAchievements = [...achievementsWithStatus, ...chatAchievementsWithStatus];
      
      res.json({ achievements: allCombinedAchievements });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Daily quests routes
  app.get('/api/quests', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check for quest reset
      await storage.checkDailyQuestReset(req.session.userId);
      
      const updatedUser = await storage.getUser(req.session.userId);
      res.json({ quests: updatedUser.dailyQuests || [] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Handle both GET and POST for quest claim (some frontend libraries might use GET)
  app.get('/api/quests/:questId/claim', async (req, res) => {
    console.log('*** CLAIM QUEST ENDPOINT HIT (GET) ***', req.params.questId);
    try {
      if (!req.session.userId) {
        console.log('*** Not authenticated ***');
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const questId = decodeURIComponent(req.params.questId);
      console.log('*** Claiming quest (GET):', questId, 'for user:', req.session.userId, '***');
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        console.log('User not found:', req.session.userId);
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('User found, checking quests:', user.dailyQuests?.length || 0);
      const quest = (user.dailyQuests || []).find(q => q.id === questId);
      if (!quest) {
        console.log('Quest not found:', questId, 'Available quests:', user.dailyQuests?.map(q => q.id));
        return res.status(404).json({ message: 'Quest not found' });
      }
      
      console.log('Quest found:', quest.title, 'completed:', quest.completed, 'claimed:', quest.claimed);
      
      if (!quest.completed) {
        return res.status(400).json({ message: 'Quest not completed yet' });
      }
      
      if (quest.claimed) {
        return res.status(400).json({ message: 'Reward already claimed' });
      }

      // Mark quest as claimed and give reward
      const updatedQuests = user.dailyQuests.map(q => 
        q.id === questId ? { ...q, claimed: true } : q
      );
      
      const newBalance = user.balance + quest.reward;
      console.log('Updating balance from', user.balance, 'to', newBalance, 'reward:', quest.reward);
      
      const updatedUser = await storage.updateUser(req.session.userId, {
        balance: newBalance,
        dailyQuests: updatedQuests
      });

      await storage.addActivity(req.session.userId, `Quest reward claimed: ${quest.title} (+$${quest.reward.toLocaleString()})`);
      
      console.log('Reward claimed successfully, new balance:', updatedUser.balance);
      res.json({ user: updatedUser, message: 'Reward claimed successfully' });
    } catch (error) {
      console.error('Error claiming quest reward:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/quests/:questId/claim', async (req, res) => {
    console.log('*** CLAIM QUEST ENDPOINT HIT (POST) ***', req.params.questId);
    try {
      if (!req.session.userId) {
        console.log('*** Not authenticated ***');
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const questId = decodeURIComponent(req.params.questId);
      console.log('*** Claiming quest (POST):', questId, 'for user:', req.session.userId, '***');
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        console.log('User not found:', req.session.userId);
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('User found, checking quests:', user.dailyQuests?.length || 0);
      const quest = (user.dailyQuests || []).find(q => q.id === questId);
      if (!quest) {
        console.log('Quest not found:', questId, 'Available quests:', user.dailyQuests?.map(q => q.id));
        return res.status(404).json({ message: 'Quest not found' });
      }
      
      console.log('Quest found:', quest.title, 'completed:', quest.completed, 'claimed:', quest.claimed);
      
      if (!quest.completed) {
        return res.status(400).json({ message: 'Quest not completed yet' });
      }
      
      if (quest.claimed) {
        return res.status(400).json({ message: 'Reward already claimed' });
      }

      // Mark quest as claimed and give reward
      const updatedQuests = user.dailyQuests.map(q => 
        q.id === questId ? { ...q, claimed: true } : q
      );
      
      const newBalance = user.balance + quest.reward;
      console.log('Updating balance from', user.balance, 'to', newBalance, 'reward:', quest.reward);
      
      const updatedUser = await storage.updateUser(req.session.userId, {
        balance: newBalance,
        dailyQuests: updatedQuests
      });

      await storage.addActivity(req.session.userId, `Quest reward claimed: ${quest.title} (+$${quest.reward.toLocaleString()})`);
      
      console.log('Reward claimed successfully, new balance:', updatedUser.balance);
      res.json({ user: updatedUser, message: 'Reward claimed successfully' });
    } catch (error) {
      console.error('Error claiming quest reward:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Chat routes
  app.get('/api/chat/messages', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { language } = req.query;
      
      const messages = await storage.getChatMessages(language || 'en');
      
      // Show all messages to admins, filter deleted for regular users
      const user = await storage.getUser(req.session.userId);
      const filteredMessages = user.admin >= 1 
        ? messages 
        : messages.filter(msg => !msg.deleted);
      
      res.json({ messages: filteredMessages });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/chat/send', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { message, language } = req.body;
      
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: 'Message cannot be empty' });
      }
      
      if (message.length > 500) {
        return res.status(400).json({ message: 'Message too long (max 500 characters)' });
      }
      
      // Check cooldown (5 seconds between messages)
      const user = await storage.getUser(req.session.userId);
      const lastMessageTime = user.lastMessageTime || 0;
      const now = Date.now();
      if (now - lastMessageTime < 5000 && user.admin < 1) {
        return res.status(429).json({ 
          message: 'Please wait before sending another message',
          cooldownRemaining: Math.ceil((5000 - (now - lastMessageTime)) / 1000)
        });
      }
      
      const newMessage = await storage.sendChatMessage(req.session.userId, message, language);
      res.json({ message: newMessage });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/api/chat/message/:messageId', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { messageId } = req.params;
      const { language } = req.query;
      const deletedMessage = await storage.deleteChatMessage(messageId, req.session.userId, language || 'en');
      
      res.json({ success: true, message: deletedMessage });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/chat/mute', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { userId, duration } = req.body;
      
      if (!userId || !duration) {
        return res.status(400).json({ message: 'User ID and duration required' });
      }
      
      const result = await storage.muteUser(userId, req.session.userId, duration);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/chat/unmute', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID required' });
      }
      
      const result = await storage.unmuteUser(userId, req.session.userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // New chat routes for advanced features
  
  // React to message
  app.post('/api/chat/message/:messageId/react', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { messageId } = req.params;
      const { emoji } = req.body;
      
      const { language } = req.query;
      const reaction = await storage.addMessageReaction(messageId, req.session.userId, emoji, language || 'en');
      res.json({ reaction });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Pin/unpin message (super-admin only)
  app.post('/api/chat/message/:messageId/pin', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { messageId } = req.params;
      const { language } = req.query;
      const result = await storage.pinMessage(messageId, req.session.userId, language || 'en');
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get pinned message
  app.get('/api/chat/pinned', async (req, res) => {
    try {
      const { language } = req.query;
      const pinnedMessage = await storage.getPinnedMessage(language || 'en');
      res.json({ pinnedMessage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Mark chat as read (remove new message indicator)
  app.post('/api/chat/mark-read', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      await storage.markChatAsRead(req.session.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get chat achievements
  app.get('/api/achievements/chat', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const achievements = await storage.getChatAchievements(req.session.userId);
      res.json({ achievements });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get active mutes for admin panel
  app.get('/api/chat/active-mutes', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user || user.admin < 1) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const activeMutes = await storage.getActiveMutes();
      res.json({ mutes: activeMutes });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reports System Routes
  app.get('/api/reports', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      let reports;
      if (user.admin >= 1) {
        // Admin sees all reports
        reports = await storage.getAdminReports();
      } else {
        // User sees only their reports
        reports = await storage.getUserReports(user.id);
      }

      res.json(reports);
    } catch (error) {
      console.error('Error getting reports:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/reports', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.banned) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { subject, category, message } = req.body;

      if (!subject || !category || !message) {
        return res.status(400).json({ message: 'Subject, category, and message are required' });
      }

      if (subject.length > 50) {
        return res.status(400).json({ message: 'Subject must be no more than 50 characters' });
      }

      if (message.length > 500) {
        return res.status(400).json({ message: 'Message must be no more than 500 characters' });
      }

      const report = await storage.createReport(user.id, subject, category, message);
      res.json(report);
    } catch (error) {
      console.error('Error creating report:', error);
      if (error.message === 'You already have an active report') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/reports/:reportId/messages', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { reportId } = req.params;
      const report = await storage.getReportById(reportId);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      // Check if user can access this report
      if (user.admin < 1 && report.userId !== user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const messages = await storage.getReportMessages(reportId);
      
      // Mark as read by clearing new messages flag
      if (user.admin >= 1 || report.userId === user.id) {
        await storage.updateReport(reportId, { hasNewMessages: false });
      }

      res.json(messages);
    } catch (error) {
      console.error('Error getting report messages:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/reports/:reportId/messages', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.banned) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { reportId } = req.params;
      const { message } = req.body;

      if (!message || message.length > 500) {
        return res.status(400).json({ message: 'Message is required and must be under 500 characters' });
      }

      const report = await storage.getReportById(reportId);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      if (report.status !== 'open') {
        return res.status(400).json({ message: 'Cannot send message to closed report' });
      }

      // Check if user can send messages to this report
      const isFromAdmin = user.admin >= 1;
      if (!isFromAdmin && report.userId !== user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const newMessage = await storage.createReportMessage(reportId, user.id, message, isFromAdmin);
      res.json(newMessage);
    } catch (error) {
      console.error('Error creating report message:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/reports/:reportId/close', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.admin < 1) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { reportId } = req.params;
      const updatedReport = await storage.closeReport(reportId, user.id);
      res.json(updatedReport);
    } catch (error) {
      console.error('Error closing report:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/reports/:reportId/mark', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.admin < 1) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { reportId } = req.params;
      const updatedReport = await storage.markReport(reportId, user.id);
      res.json(updatedReport);
    } catch (error) {
      console.error('Error marking report:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/reports/:reportId/reopen', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.admin < 1) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { reportId } = req.params;
      const report = await storage.getReportById(reportId);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      if (report.status === 'open') {
        return res.status(400).json({ message: 'Report is already open' });
      }

      await storage.updateReport(reportId, {
        status: 'open',
        closedAt: null,
        closedBy: null
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error reopening report:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/reports/:reportId', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.admin < 1) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { reportId } = req.params;
      await storage.deleteReport(reportId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Add XP to user (for mini-games)
  app.post('/api/users/add-xp', requireAuth, async (req, res) => {
    try {
      const { xp } = req.body;
      
      if (!xp || typeof xp !== 'number' || xp < 0) {
        return res.status(400).json({ message: 'Invalid XP amount' });
      }

      const user = await storage.getUser(req.session.userId);
      const oldLevel = user.level || 1;
      
      const updatedUser = await storage.addUserXP(req.session.userId, xp);
      const newLevel = updatedUser.level || 1;
      
      const leveledUp = newLevel > oldLevel;
      
      res.json({ 
        user: updatedUser, 
        xpGained: xp,
        experience: updatedUser.experience,
        level: updatedUser.level,
        balance: updatedUser.balance,
        leveledUp,
        newLevel: leveledUp ? newLevel : undefined
      });
    } catch (error) {
      console.error('Error adding XP:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Damage server durability (for failed mini-game)
  app.post('/api/servers/:serverId/damage', requireAuth, async (req, res) => {
    try {
      const { serverId } = req.params;
      const server = await storage.getServer(serverId);
      
      if (!server || server.ownerId !== req.session.userId) {
        return res.status(404).json({ message: 'Server not found' });
      }

      const updatedServer = await storage.updateServer(serverId, {
        durability: Math.max(0, server.durability - 1)
      });

      res.json({ server: updatedServer });
    } catch (error) {
      console.error('Error damaging server:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Hidden achievements endpoints
  app.get('/api/hidden-achievements', requireAuth, async (req, res) => {
    try {
      const achievements = await storage.getHiddenAchievements();
      const userData = await storage.getUser(req.session.userId);
      const unlockedAchievements = userData.unlockedHiddenAchievements || [];
      
      const processedAchievements = achievements.map(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        if (!isUnlocked) {
          return {
            id: achievement.id,
            name: '???',
            description: 'Hidden achievement',
            isLocked: true,
            isHidden: true
          };
        }
        return { ...achievement, isLocked: false };
      });
      
      res.json({ achievements: processedAchievements });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get hidden achievements' });
    }
  });

  // Daily login bonus endpoints
  app.get('/api/daily-bonus', requireAuth, async (req, res) => {
    try {
      const bonusInfo = await storage.getDailyLoginBonus(req.session.userId);
      res.json(bonusInfo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get daily bonus info' });
    }
  });

  app.post('/api/daily-bonus/claim', requireAuth, async (req, res) => {
    try {
      const result = await storage.claimDailyBonus(req.session.userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to claim daily bonus' });
    }
  });

  // Tutorial endpoints
  app.get('/api/tutorial', requireAuth, async (req, res) => {
    try {
      const progress = await storage.getTutorialProgress(req.session.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get tutorial progress' });
    }
  });

  app.post('/api/tutorial/progress', requireAuth, async (req, res) => {
    try {
      const { step } = req.body;
      const progress = await storage.updateTutorialProgress(req.session.userId, step);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update tutorial progress' });
    }
  });

  // Additional API endpoints for new features
  app.get('/api/achievements/hidden', requireAuth, async (req, res) => {
    try {
      const achievements = await storage.getHiddenAchievementsForUser(req.session.userId);
      res.json({ achievements });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Daily bonus API
  app.get('/api/daily-bonus', requireAuth, async (req, res) => {
    try {
      const bonusInfo = await storage.getDailyLoginBonus(req.session.userId);
      res.json(bonusInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



  // Donation routes
  app.post('/api/donation/purchase', requireAuth, async (req, res) => {
    try {
      const { type, gateway } = req.body;
      const userId = req.session.userId;
      
      if (!type || !gateway) {
        return res.status(400).json({ error: 'Type and gateway are required' });
      }

      if (!['vip', 'premium'].includes(type) || !['crypto'].includes(gateway)) {
        return res.status(400).json({ error: 'Invalid type or gateway' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check conflicting statuses
      const hasVip = user.vipExpires && new Date(user.vipExpires) > new Date();
      const hasPremium = user.premiumActive;

      if (type === 'premium' && hasPremium) {
        return res.status(400).json({ error: 'You already have this status, you can support the project with another service' });
      }

      if (type === 'vip' && hasPremium) {
        return res.status(400).json({ error: 'PREMIUM status blocks VIP purchase' });
      }

      if (type === 'premium' && hasVip) {
        return res.status(400).json({ error: 'VIP status blocks PREMIUM purchase' });
      }

      // Redirect to new crypto payment system
      return res.status(400).json({ 
        error: 'Please use the new crypto payment system in the donate section'
      });
    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  });

  // Admin routes for managing VIP/Premium
  app.post('/api/admin/manage-subscription', requireAuth, async (req, res) => {
    try {
      const admin = await storage.getUser(req.session.userId);
      if (!admin || admin.admin < 2) {
        return res.status(403).json({ error: 'Super admin access required' });
      }

      const { userId, type, action, days } = req.body;
      
      if (!userId || !type || !action) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      if (!['vip', 'premium'].includes(type) || !['grant', 'revoke'].includes(action)) {
        return res.status(400).json({ error: 'Invalid type or action' });
      }

      if (action === 'grant' && (!days || days < 1)) {
        return res.status(400).json({ error: 'Days must be specified for grant action' });
      }

      const result = await storage.manageSubscription(userId, type, action, days);
      res.json(result);
    } catch (error) {
      console.error('Subscription management error:', error);
      res.status(500).json({ error: 'Failed to manage subscription' });
    }
  });

  // VIP/Premium purchase route with Ukrainian payment gateways
  app.post('/api/purchase', requireAuth, async (req, res) => {
    try {
      const { type, gateway } = req.body;
      const user = await storage.getUser(req.session.userId);

      // Check subscription conflicts
      if (type === 'vip' && user.premiumStatus === 'active') {
        return res.status(400).json({ 
          message: 'У вас уже есть Premium статус. Покупка VIP заблокирована.' 
        });
      }
      
      if (type === 'premium' && user.premiumStatus === 'active') {
        return res.status(400).json({ 
          message: 'У вас уже есть Premium статус. Повторная покупка невозможна.' 
        });
      }

      if (type === 'premium' && user.vipStatus === 'active') {
        return res.status(400).json({ 
          message: 'У вас активен VIP статус. Покупка Premium заблокирована.' 
        });
      }

      // Price configuration  
      const prices = { 
        vip: 2.5,       // VIP месяц за $2.50
        premium: 10,    // Premium навсегда за $10
      };
      const amount = prices[type];
      
      if (!amount) {
        return res.status(400).json({ message: 'Неверный тип подписки' });
      }

      // Demo payment simulation for Ukrainian gateways
      const orderId = `${type}_${user.id}_${Date.now()}`;
      
      if (gateway === 'fondy') {
        // Simulate successful payment for demo
        setTimeout(async () => {
          try {
            if (type === 'vip') {
              const expiresAt = new Date();
              expiresAt.setMonth(expiresAt.getMonth() + 1);
              
              await storage.updateUser(user.id, {
                vipStatus: 'active',
                vipExpiresAt: expiresAt.toISOString()
              });
            } else if (type === 'premium') {
              await storage.updateUser(user.id, {
                premiumStatus: 'active',
                premiumActivatedAt: new Date().toISOString()
              });
            }
            
            console.log(`Demo payment successful: ${type} for ${user.nickname}`);
          } catch (error) {
            console.error('Demo payment processing error:', error);
          }
        }, 2000);

        return res.json({
          success: true,
          message: 'Демо-платеж через Fondy обрабатывается...',
          orderId
        });
      } 
      
      if (gateway === 'wayforpay') {
        // Simulate successful payment for demo
        setTimeout(async () => {
          try {
            if (type === 'vip') {
              const expiresAt = new Date();
              expiresAt.setMonth(expiresAt.getMonth() + 1);
              
              await storage.updateUser(user.id, {
                vipStatus: 'active',
                vipExpiresAt: expiresAt.toISOString()
              });
            } else if (type === 'premium') {
              await storage.updateUser(user.id, {
                premiumStatus: 'active',
                premiumActivatedAt: new Date().toISOString()
              });
            }
            
            console.log(`Demo payment successful: ${type} for ${user.nickname}`);
          } catch (error) {
            console.error('Demo payment processing error:', error);
          }
        }, 2000);

        return res.json({
          success: true,
          message: 'Демо-платеж через WayForPay обрабатывается...',
          orderId
        });
      }

      res.status(400).json({ message: 'Неподдерживаемый платежный шлюз' });
    } catch (error) {
      console.error('Purchase error:', error);
      res.status(500).json({ message: 'Ошибка при обработке платежа' });
    }
  });

  // Admin subscription management
  app.post('/api/admin/subscription', requireAuth, async (req, res) => {
    try {
      const { action, targetNickname, days } = req.body;
      const adminUser = await storage.getUser(req.session.userId);

      if (adminUser.nickname !== 'Ca6aka') {
        return res.status(403).json({ message: 'Доступ запрещен' });
      }

      const targetUser = await storage.getUserByNickname(targetNickname);
      if (!targetUser) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      if (action === 'giveVip') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
        
        await storage.updateUser(targetUser.id, {
          vipStatus: 'active',
          vipExpiresAt: expiresAt.toISOString()
        });
      } else if (action === 'givePremium') {
        await storage.updateUser(targetUser.id, {
          premiumStatus: 'active',
          premiumActivatedAt: new Date().toISOString()
        });
      } else if (action === 'removeSubscription') {
        await storage.updateUser(targetUser.id, {
          vipStatus: 'inactive',
          vipExpiresAt: null,
          premiumStatus: 'inactive',
          premiumActivatedAt: null
        });
      }

      res.json({ message: 'Статус успешно обновлен' });
    } catch (error) {
      console.error('Admin subscription error:', error);
      res.status(500).json({ message: 'Ошибка при управлении подпиской' });
    }
  });

  // Card-to-Crypto payment endpoint with email confirmation
  app.post('/api/card-crypto-purchase', async (req, res) => {
    console.log('=== PAYMENT DEBUG START ===');
    console.log('Request body:', req.body);
    console.log('Session:', req.session);
    
    if (!req.session?.userId) {
      console.log('ERROR: Not authenticated');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { type } = req.body;
    console.log('Payment type:', type);
    
    if (!['vip', 'premium'].includes(type)) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }

    // Пакетные цены с дополнительными бонусами для обхода минимума NOWPayments ($19.22)
    const prices = { 
      vip: 20,        // VIP Пакет: 8 месяцев + бонусы за $20  
      premium: 25,    // Premium Пакет: навсегда + эксклюзивные бонусы за $25
    };
    const amount = prices[type];

    try {
      const user = await storage.getUser(req.session.userId);
      console.log('User found:', user ? user.nickname : 'No user');
      
      // Generate unique order ID
      const orderId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated order ID:', orderId);
      
      // NOWPayments integration for USDT payments
      const nowPaymentsApiKey = process.env.NOWPAYMENTS_API_KEY;
      const publicApiKey = '2e08170d-5e62-48ac-ac23-6a76fead8132'; // Public API key
      const gameEmail = process.env.GAME_EMAIL || 'noreply@yourgame.com';
      
      console.log('NOWPayments API Key exists:', !!nowPaymentsApiKey);
      console.log('Game email:', gameEmail);
      
      if (!nowPaymentsApiKey) {
        console.log('ERROR: API key not configured');
        return res.status(500).json({ message: 'Ошибка создания платежа: API key не настроен' });
      }
      
      // Find best crypto with low minimum for small payments
      console.log('Finding crypto with lowest minimum amount...');
      const cryptoOptions = ['ltc', 'doge', 'trx', 'xlm', 'xrp'];
      let bestCrypto = 'ltc';
      let lowestMinimum = 999999;
      
      for (const crypto of cryptoOptions) {
        try {
          const minAmountResponse = await fetch(`https://api.nowpayments.io/v1/min-amount?currency_from=usd&currency_to=${crypto}`, {
            headers: { 'x-api-key': nowPaymentsApiKey }
          });
          const minData = await minAmountResponse.json();
          const minimum = minData.min_amount || 999999;
          console.log(`Minimum for ${crypto.toUpperCase()}:`, minimum);
          
          if (minimum < lowestMinimum && minimum <= amount) {
            lowestMinimum = minimum;
            bestCrypto = crypto;
          }
        } catch (err) {
          console.log(`Error checking ${crypto}:`, err.message);
        }
      }
      
      console.log(`Best crypto for $${amount}: ${bestCrypto.toUpperCase()} (min: $${lowestMinimum})`);
      
      // If we still can't find suitable crypto, inform user
      if (lowestMinimum > amount) {
        console.log(`All cryptos have higher minimum than ${amount}`);
        return res.status(400).json({ 
          message: `Минимальная сумма платежа $${lowestMinimum}. Попробуйте пакетную покупку или увеличьте сумму.`,
          minimumAmount: lowestMinimum,
          suggestedCrypto: bestCrypto
        });
      }

      // Create NOWPayments invoice with best crypto option
      const nowPaymentsPayload = {
        price_amount: amount,
        price_currency: 'usd', 
        pay_currency: bestCrypto, // Use crypto with lowest minimum
        order_id: orderId,
        order_description: `${type === 'vip' ? 'VIP Пакет (8 месяцев + бонусы)' : 'Premium Пакет (навсегда + бонусы)'} subscription for ${user.nickname}`,
        success_url: `${req.protocol}://${req.get('host')}/payment-success?orderId=${orderId}`,
        cancel_url: `${req.protocol}://${req.get('host')}/donate`,
        is_fee_paid_by_user: true
      };
      
      console.log('NOWPayments payload:', JSON.stringify(nowPaymentsPayload, null, 2));

      // Call NOWPayments API to create invoice
      let paymentUrl = '';
      try {
        console.log('Calling NOWPayments Invoice API for fiat payments...');
        const nowResponse = await fetch('https://api.nowpayments.io/v1/invoice', {
          method: 'POST',
          headers: {
            'x-api-key': nowPaymentsApiKey,
            'x-public-key': publicApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nowPaymentsPayload)
        });

        console.log('NOWPayments response status:', nowResponse.status);
        const nowData = await nowResponse.json();
        console.log('NOWPayments response data:', JSON.stringify(nowData, null, 2));
        
        if (nowResponse.ok && nowData.invoice_url) {
          paymentUrl = nowData.invoice_url;
          console.log('Payment URL created:', paymentUrl);
        } else {
          console.log('NOWPayments API error:', nowData);
          throw new Error(nowData.message || 'Failed to create payment invoice');
        }
      } catch (error) {
        console.error('NOWPayments error:', error);
        return res.status(500).json({ message: 'Ошибка создания платежа: ' + error.message });
      }
      
      // Store payment info in JSON file
      const paymentsFile = path.join(__dirname, '..', 'data', 'payments.json');
      
      let payments = [];
      try {
        if (fs.existsSync(paymentsFile)) {
          payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
        }
      } catch (err) {
        console.log('Creating new payments file');
      }
      
      const paymentRecord = {
        orderId,
        userId: user.id,
        userNickname: user.nickname,
        type,
        amount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentUrl
      };
      
      payments.push(paymentRecord);
      
      // Ensure data directory exists
      const dataDir = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
      
      console.log('Payment creation successful');
      console.log('=== PAYMENT DEBUG END ===');
      
      res.json({
        message: 'Payment created successfully',
        paymentUrl,
        orderId,
        amount,
        type
      });
    } catch (error) {
      console.error('Card-crypto purchase error:', error);
      console.log('=== PAYMENT DEBUG END (ERROR) ===');
      res.status(500).json({ message: 'Failed to create payment' });
    }
  });

  // PDF receipt generation
  app.get('/api/payment-receipt/:orderId', async (req, res) => {
    const { orderId } = req.params;
    
    try {
      const puppeteer = (await import('puppeteer')).default;
      
      const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');
      let payments = [];
      
      if (fs.existsSync(paymentsFile)) {
        payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
      }
      
      const payment = payments.find(p => p.orderId === orderId);
      if (!payment || payment.status !== 'completed') {
        return res.status(404).json({ message: 'Payment not found or not completed' });
      }
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .receipt { background: white; padding: 40px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; }
            .title { color: #2563eb; font-size: 28px; font-weight: bold; margin: 0; }
            .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
            .info-row { display: flex; justify-content: space-between; margin: 15px 0; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #111827; }
            .status { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #64748b; font-size: 12px; }
            .amount { font-size: 24px; font-weight: bold; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1 class="title">📄 Документ об оплате</h1>
              <p class="subtitle">Server Simulation Game</p>
            </div>
            
            <div class="info-row">
              <span class="label">Заказ:</span>
              <span class="value">#${payment.orderId}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Игрок:</span>
              <span class="value">${payment.userNickname}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Тип подписки:</span>
              <span class="value">${payment.type === 'vip' ? '⭐ VIP статус (8 месяцев)' : '👑 PREMIUM статус (навсегда)'}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Сумма:</span>
              <span class="value amount">$${payment.amount}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Дата оплаты:</span>
              <span class="value">${new Date(payment.completedAt || payment.createdAt).toLocaleString('ru-RU')}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Статус:</span>
              <span class="status">✅ Оплачено</span>
            </div>
            
            <div class="footer">
              <p>Спасибо за поддержку проекта Server Simulation Game!</p>
              <p>Документ сгенерирован: ${new Date().toLocaleString('ru-RU')}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      const pdf = await page.pdf({ 
        format: 'A4', 
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
      });
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="receipt-${orderId}.pdf"`);
      res.send(pdf);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  });

  // Fiat-to-Crypto Payment Endpoint (NOWPayments Invoice API)
  app.post('/api/donate/fiat', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      const { type } = req.body;

      if (!['vip', 'premium'].includes(type)) {
        return res.status(400).json({ message: 'Invalid subscription type' });
      }

      // Пакетные цены с дополнительными бонусами для обхода минимума NOWPayments ($19.22)
      const prices = { 
        vip: 20,        // VIP Пакет: 8 месяцев + бонусы за $20  
        premium: 25,    // Premium Пакет: навсегда + эксклюзивные бонусы за $25
      };
      const amount = prices[type];

      // Generate unique order ID
      const orderId = `fiat_${type}_${user.id}_${Date.now()}`;
      
      console.log(`Creating fiat-to-crypto invoice for ${user.nickname}: ${type} - $${amount}`);

      const invoiceData = {
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: 'trx', // Используем TRX как основную валюту для fiat
        order_id: orderId,
        order_description: `${type === 'vip' ? 'VIP Пакет (8 месяцев + бонусы)' : 'Premium Пакет (навсегда + бонусы)'} для ${user.nickname} - Fiat`,
        success_url: `${req.protocol}://${req.get('host')}/payment-success?orderId=${orderId}&fiat=true`,
        cancel_url: `${req.protocol}://${req.get('host')}/donate`,
        // Фиксированный TRX адрес для fiat платежей
        ipn_callback_url: `${req.protocol}://${req.get('host')}/api/payment-webhook`
      };

      console.log('Creating NOWPayments fiat invoice with data:', invoiceData);

      const invoiceResponse = await fetch('https://api.nowpayments.io/v1/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NOWPAYMENTS_API_KEY
        },
        body: JSON.stringify(invoiceData)
      });

      const invoiceResult = await invoiceResponse.json();
      console.log('NOWPayments fiat invoice response:', invoiceResult);

      if (!invoiceResponse.ok) {
        console.error('Invoice creation failed:', invoiceResult);
        return res.status(400).json({ message: `Payment creation failed: ${invoiceResult.message || 'Unknown error'}` });
      }

      // Save payment record
      const paymentsFile = path.join(__dirname, '..', 'data', 'payments.json');
      
      let payments = [];
      if (fs.existsSync(paymentsFile)) {
        payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
      }

      const paymentRecord = {
        id: invoiceResult.id,
        orderId,
        userId: user.id,
        userNickname: user.nickname,
        type,
        amount,
        currency: 'USD',
        status: 'pending',
        createdAt: new Date().toISOString(),
        invoiceUrl: invoiceResult.invoice_url,
        paymentType: 'fiat-to-crypto'
      };

      payments.push(paymentRecord);
      fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));

      console.log(`Fiat payment created: ${invoiceResult.invoice_url}`);

      res.json({
        success: true,
        paymentUrl: invoiceResult.invoice_url,
        orderId
      });

    } catch (error) {
      console.error('Fiat payment creation error:', error);
      res.status(500).json({ 
        message: 'Fiat payment creation failed',
        details: error.message 
      });
    }
  });

  // NOWPayments Webhook endpoint
  app.post('/api/payment-webhook', async (req, res) => {
    try {
      console.log('NOWPayments webhook received:', req.body);
      
      // NOWPayments webhook format
      const { payment_status, order_id, pay_amount, pay_currency, price_amount, price_currency, outcome_amount, outcome_currency } = req.body;
      
      // Handle completed payments
      if (payment_status === 'finished' && order_id) {
        const paymentsFile = path.join(__dirname, '..', 'data', 'payments.json');
        
        let payments = [];
        if (fs.existsSync(paymentsFile)) {
          payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
        }
        
        // Find payment by orderId
        const paymentIndex = payments.findIndex(p => p.orderId === order_id);
        if (paymentIndex !== -1) {
          const payment = payments[paymentIndex];
          payment.status = 'completed';
          payment.completedAt = new Date().toISOString();
          payment.paidAmount = pay_amount;
          payment.paidCurrency = pay_currency;
          payment.outcomeAmount = outcome_amount;
          payment.outcomeCurrency = outcome_currency;
          
          // Activate subscription
          const user = await storage.getUser(payment.userId);
          if (user) {
            if (payment.type === 'vip') {
              const expiresAt = new Date();
              expiresAt.setMonth(expiresAt.getMonth() + 8); // 8 месяцев за $20
              
              // VIP Пакет бонусы
              const vipBonuses = {
                money: 10000,      // +$10,000 стартового капитала
                experience: 5000,  // +5,000 опыта
                servers: 5         // +5 слотов серверов (всего 30)
              };
              
              await storage.updateUser(user.id, {
                vipStatus: 'active',
                vipExpiresAt: expiresAt.toISOString(),
                money: (user.money || 0) + vipBonuses.money,
                experience: (user.experience || 0) + vipBonuses.experience,
                serverSlots: Math.max(user.serverSlots || 25, 30) // VIP получает 30 слотов
              });
            } else if (payment.type === 'premium') {
              // Premium Пакет бонусы
              const premiumBonuses = {
                money: 50000,      // +$50,000 стартового капитала
                experience: 15000, // +15,000 опыта
                servers: 10        // +10 слотов серверов (всего 35)
              };
              
              await storage.updateUser(user.id, {
                premiumStatus: 'active',
                premiumActivatedAt: new Date().toISOString(),
                money: (user.money || 0) + premiumBonuses.money,
                experience: (user.experience || 0) + premiumBonuses.experience,
                serverSlots: Math.max(user.serverSlots || 25, 35) // Premium получает 35 слотов
              });
            }
            
            // Send confirmation email (placeholder - requires SendGrid setup)
            console.log(`Payment completed for ${user.nickname}: ${payment.type} - $${payment.amount}`);
            // await sendPaymentConfirmationEmail(payment);
          }
          
          fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Payment webhook error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  });

  // Payment success page
  app.get('/payment-success', async (req, res) => {
    const { orderId } = req.query;
    
    let message = 'Payment completed successfully!';
    let details = '';
    
    if (orderId) {
      try {
        const paymentsFile = path.join(__dirname, '..', 'data', 'payments.json');
        
        if (fs.existsSync(paymentsFile)) {
          const payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
          const payment = payments.find(p => p.orderId === orderId);
          
          if (payment) {
            // Update payment status to completed
            payment.status = 'completed';
            payment.completedAt = new Date().toISOString();
            fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
            
            // Activate user subscription
            const user = await storage.getUser(payment.userId);
            if (user) {
              if (payment.type === 'vip') {
                const expiresAt = new Date();
                expiresAt.setMonth(expiresAt.getMonth() + 1);
                await storage.updateUser(user.id, {
                  vipStatus: 'active',
                  vipExpiresAt: expiresAt.toISOString()
                });
                message = 'VIP status activated successfully!';
              } else if (payment.type === 'premium') {
                await storage.updateUser(user.id, {
                  premiumStatus: 'active',
                  premiumActivatedAt: new Date().toISOString()
                });
                message = 'PREMIUM status activated successfully!';
              }
            }
            
            details = `<p>Order ID: ${orderId}</p><p>Amount: $${payment.amount}</p>`;
          }
        }
      } catch (error) {
        console.error('Payment success page error:', error);
      }
    }
    
    res.send(`
      <html>
        <head><title>Payment Successful - Root Tycoon</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; margin: 0;">
          <div style="max-width: 500px; margin: 0 auto; background: rgba(15, 23, 42, 0.8); padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
            <h1 style="color: #22c55e; margin-bottom: 20px;">${message}</h1>
            ${details}
            <p style="margin-bottom: 30px; color: #cbd5e1;">Your status is now active! Return to the game to enjoy your benefits.</p>
            <a href="/" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 10px; font-weight: bold; transition: transform 0.2s;">Return to Game</a>
          </div>
        </body>
      </html>
    `);
  });

  const httpServer = createServer(app);
  return httpServer;
}
