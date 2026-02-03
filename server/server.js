const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driverfollow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB Connected');
    global.HAS_DB = true;
  })
  .catch(err => {
    console.error('❌ MongoDB Failed:', err.message);
    console.log('⚠️  Server running in MEMORY MODE (Data will be lost on restart)');
    global.HAS_DB = false;
  });

// Routes
const authMiddleware = require('./middleware/auth');
const authController = require('./controllers/authController');
const missionController = require('./controllers/missionController');
const videoController = require('./controllers/videoController');

app.get('/', (req, res) => {
  res.send({ status: 'active', message: 'TubeDrivers API v1.0 (Live)' });
});

// Auth API
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, authController.getMe);

// Google OAuth
const googleAuthController = require('./controllers/googleAuthController');
app.get('/api/auth/google', googleAuthController.googleAuth);
app.get('/api/auth/google/callback', googleAuthController.googleCallback);

// Check if Google OAuth is configured
app.get('/api/auth/google/status', (req, res) => {
  const isConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  res.json({ configured: isConfigured });
});

// Video API
app.post('/api/videos', authMiddleware, videoController.addVideo);
app.get('/api/videos', authMiddleware, videoController.getMyVideos);
app.get('/api/videos/community', videoController.getCommunityVideos); // Public - community videos

// Community Stats API (Public)
const User = require('./models/User');
app.get('/api/stats/community', async (req, res) => {
  try {
    let totalMembers = 0;

    if (global.HAS_DB) {
      totalMembers = await User.countDocuments();
    } else {
      totalMembers = global.memoryUsers?.length || 0;
    }

    res.json({
      totalMembers,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    res.json({ totalMembers: 0 });
  }
});

// Mission API
app.get('/api/missions/next', authMiddleware, missionController.getNextMission);
app.post('/api/missions/start', authMiddleware, missionController.startMission);
app.post('/api/missions/verify', authMiddleware, missionController.verifyMission);
app.get('/api/missions/stats', authMiddleware, missionController.getStats);

// Channel Watch Time Stats (for monetization progress)
const ViewSession = require('./models/ViewSession');
app.get('/api/stats/channel', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let stats = {
      totalWatchTimeHours: 0,
      totalViews: 0,
      uniqueViewers: 0,
      weeklyProgress: { current: 0, max: 4 }
    };

    if (global.HAS_DB) {
      const channelStats = await ViewSession.getChannelWatchTimeStats(userId);
      stats = {
        totalWatchTimeHours: channelStats.totalWatchTimeHours || 0,
        totalWatchTimeMinutes: channelStats.totalWatchTimeMinutes || 0,
        totalViews: channelStats.totalViews || 0,
        uniqueViewers: channelStats.uniqueViewers || 0
      };
    }

    res.json({
      ...stats,
      monetization: {
        watchTimeRequired: 4000,
        watchTimeProgress: Math.min((stats.totalWatchTimeHours / 4000) * 100, 100),
        subscribersRequired: 1000,
        estimatedDaysRemaining: Math.ceil((4000 - stats.totalWatchTimeHours) / 100) // ~100h/day with 1000 members
      }
    });
  } catch (err) {
    console.error('Channel stats error:', err);
    res.json({ totalWatchTimeHours: 0, totalViews: 0, uniqueViewers: 0 });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
