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
      const user = await storage.createUser({ nickname, password: hashedPassword });
      
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
      
      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined } });
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
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
