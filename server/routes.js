import { createServer } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage.js";
import path from 'path';

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
      
      const allAchievements = storage.getAchievements();
      const userAchievements = user.achievements || [];
      
      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        earned: userAchievements.includes(achievement.id)
      }));
      
      res.json({ achievements: achievementsWithStatus });
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
      
      const messages = await storage.getChatMessages();
      
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
      const deletedMessage = await storage.deleteChatMessage(messageId, req.session.userId);
      
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
      
      const reaction = await storage.addMessageReaction(messageId, req.session.userId, emoji);
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
      const result = await storage.pinMessage(messageId, req.session.userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get pinned message
  app.get('/api/chat/pinned', async (req, res) => {
    try {
      const pinnedMessage = await storage.getPinnedMessage();
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

  const httpServer = createServer(app);
  return httpServer;
}
