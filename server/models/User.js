const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },

    // YouTube Data
    channelId: { type: String },
    channelTitle: { type: String },
    subscriberCount: { type: Number, default: 0 },

    // Platform Economy
    credits: { type: Number, default: 10 }, // Start with 10 credits
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    planExpiresAt: { type: Date },

    // Gamification & Anti-Bot
    reputationScore: { type: Number, default: 100 },
    dailyStats: {
        videosWatched: { type: Number, default: 0 },
        channelsSubscribed: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now }
    },

    // History to prevent repeating videos
    viewedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
