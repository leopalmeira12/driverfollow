const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    youtubeVideoId: { type: String, required: true },
    title: { type: String, required: true },
    thumbnailUrl: { type: String },
    duration: { type: String }, // ISO 8601 duration from YouTube API

    // Mission Logic
    targetViews: { type: Number, default: 0 },
    completedViews: { type: Number, default: 0 },

    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);
