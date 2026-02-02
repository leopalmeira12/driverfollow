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

// Video API
app.post('/api/videos', authMiddleware, videoController.addVideo);
app.get('/api/videos', authMiddleware, videoController.getMyVideos);

// Mission API
app.get('/api/missions/next', authMiddleware, missionController.getNextMission);
app.post('/api/missions/start', authMiddleware, missionController.startMission);
app.post('/api/missions/verify', authMiddleware, missionController.verifyMission);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
