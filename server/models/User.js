const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Auth - Support both Google and Email/Password
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google users
    name: { type: String, required: true },
    avatar: { type: String },

    // YouTube Data
    channelId: { type: String },
    channelTitle: { type: String },
    channelUrl: { type: String },
    subscriberCount: { type: Number, default: 0 },

    // Platform Economy
    credits: { type: Number, default: 10 },
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    planExpiresAt: { type: Date },
    role: { type: String, enum: ['driver', 'admin'], default: 'driver' },

    // Referral System
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referralCount: { type: Number, default: 0 },

    // Mission Progress
    dailyMissions: {
        completed: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now }
    },

    // Gamification & Anti-Bot
    reputationScore: { type: Number, default: 100 },
    dailyStats: {
        videosWatched: { type: Number, default: 0 },
        channelsSubscribed: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now }
    },

    // History to prevent repeating videos
    viewedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    completedMissions: [{
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
        completedAt: { type: Date, default: Date.now },
        creditsEarned: { type: Number, default: 2 }
    }],

    createdAt: { type: Date, default: Date.now }
});

// Generate unique referral code before saving
UserSchema.pre('save', function (next) {
    if (!this.referralCode && this.isNew) {
        this.referralCode = 'TD' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
