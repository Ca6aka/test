import { createServer } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage.js";

export async function registerRoutes(app) {
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
      
      const existingUser = await storage.getUserByNickname(nickname);
      if (existingUser) {
        return res.status(400).json({ message: 'Nickname already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ 
        nickname, 
        password: hashedPassword,
        admin: nickname === 'Ca6aka' ? 1 : 0,  // Make Ca6aka super admin automatically
        isOnline: true 
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
      
      const user = await storage.getUserByNickname(nickname);
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
      res.json({ servers });
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
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      await storage.toggleServer(req.session.userId, id);
      
      res.json({ message: 'Server status updated' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/api/servers/:id', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      await storage.deleteServer(req.session.userId, id);
      
      res.json({ message: 'Server deleted successfully' });
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
        case 'banUser':
          // Only super-admin can ban other admins
          if (targetUser.admin >= 1 && currentUser.nickname !== 'Ca6aka') {
            return res.status(403).json({ message: 'Only super admin can ban other admins' });
          }
          updatedUser.banned = true;
          updatedUser.isOnline = false;
          actionDescription = `Account banned by admin ${currentUser.nickname}`;
          break;
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

  app.post('/api/quests/:questId/claim', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { questId } = req.params;
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const quest = (user.dailyQuests || []).find(q => q.id === questId);
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }
      
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
      
      const updatedUser = await storage.updateUser(req.session.userId, {
        balance: user.balance + quest.reward,
        dailyQuests: updatedQuests
      });

      await storage.addActivity(req.session.userId, `Quest reward claimed: ${quest.title} (+$${quest.reward.toLocaleString()})`);
      
      res.json({ user: updatedUser, message: 'Reward claimed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chat routes
  app.get('/api/chat/messages', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
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
      
      const { message } = req.body;
      
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: 'Message cannot be empty' });
      }
      
      if (message.length > 500) {
        return res.status(400).json({ message: 'Message too long (max 500 characters)' });
      }
      
      const newMessage = await storage.sendChatMessage(req.session.userId, message);
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

  const httpServer = createServer(app);
  return httpServer;
}
