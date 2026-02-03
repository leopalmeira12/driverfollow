const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_ultra_secreto_da_nasa_2026';

// Google OAuth2 Configuration
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
);

// Memory fallback
if (!global.memoryUsers) global.memoryUsers = [];

// Step 1: Redirect to Google
exports.googleAuth = (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/youtube.readonly' // To get channel info
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });

    res.redirect(authUrl);
};

// Step 2: Handle Callback
exports.googleCallback = async (req, res) => {
    const { code } = req.query;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!code) {
        return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get user info
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: profile } = await oauth2.userinfo.get();

        // Get YouTube channel info (optional)
        let channelInfo = null;
        try {
            const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
            const { data: channels } = await youtube.channels.list({
                part: 'snippet,statistics',
                mine: true
            });
            if (channels.items && channels.items.length > 0) {
                const channel = channels.items[0];
                channelInfo = {
                    channelId: channel.id,
                    channelTitle: channel.snippet.title,
                    subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
                    channelUrl: `https://www.youtube.com/channel/${channel.id}`
                };
            }
        } catch (ytError) {
            console.log('YouTube channel fetch optional, continuing without:', ytError.message);
        }

        let user;

        if (global.HAS_DB) {
            // Find or create user in MongoDB
            user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.email }] });

            if (user) {
                // Update existing user with Google info
                user.googleId = profile.id;
                user.avatar = profile.picture;
                if (channelInfo) {
                    user.channelId = channelInfo.channelId;
                    user.channelTitle = channelInfo.channelTitle;
                    user.subscriberCount = channelInfo.subscriberCount;
                    user.channelUrl = channelInfo.channelUrl;
                }
                await user.save();
            } else {
                // Create new user
                user = await User.create({
                    googleId: profile.id,
                    email: profile.email,
                    name: profile.name,
                    avatar: profile.picture,
                    credits: 10,
                    plan: 'free',
                    role: 'driver',
                    ...(channelInfo || {})
                });
            }
        } else {
            // Memory mode
            user = global.memoryUsers.find(u => u.googleId === profile.id || u.email === profile.email);

            if (user) {
                user.googleId = profile.id;
                user.avatar = profile.picture;
                if (channelInfo) Object.assign(user, channelInfo);
            } else {
                user = {
                    _id: 'mem_g_' + Date.now(),
                    googleId: profile.id,
                    email: profile.email,
                    name: profile.name,
                    avatar: profile.picture,
                    credits: 10,
                    plan: 'free',
                    role: 'driver',
                    viewedVideos: [],
                    completedMissions: [],
                    referralCode: 'TD' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                    ...(channelInfo || {})
                };
                global.memoryUsers.push(user);
            }
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Prepare user data for frontend
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            credits: user.credits,
            plan: user.plan,
            channelTitle: user.channelTitle,
            referralCode: user.referralCode
        };

        // Redirect to frontend with token
        const encodedUser = encodeURIComponent(JSON.stringify(userData));
        res.redirect(`${FRONTEND_URL}/login?token=${token}&user=${encodedUser}`);

    } catch (error) {
        console.error('Google OAuth Error:', error);
        res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }
};
