const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    youtubeVideoId: { type: String, required: true },
    title: { type: String, required: true },
    thumbnailUrl: { type: String },
    duration: { type: String }, // ISO 8601 duration from YouTube API (ex: "PT7M30S")
    durationSeconds: { type: Number, default: 420 }, // Duração em segundos (default 7 min)

    // Mission Logic
    targetViews: { type: Number, default: 0 },
    completedViews: { type: Number, default: 0 },

    // Watch Time Tracking (para cálculo de monetização)
    totalWatchTimeSeconds: { type: Number, default: 0 }, // Soma de todo watch time
    totalWatchTimeMinutes: { type: Number, default: 0 }, // Calculado automaticamente

    // Engagement Stats
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },

    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },

    createdAt: { type: Date, default: Date.now }
});

// Índices para queries rápidas
VideoSchema.index({ user: 1, status: 1 });
VideoSchema.index({ status: 1, completedViews: 1 });

// Converte duração ISO 8601 para segundos ao salvar
VideoSchema.pre('save', function (next) {
    if (this.duration && !this.durationSeconds) {
        const match = this.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
            const hours = parseInt(match[1] || 0);
            const minutes = parseInt(match[2] || 0);
            const seconds = parseInt(match[3] || 0);
            this.durationSeconds = hours * 3600 + minutes * 60 + seconds;
        }
    }
    // Calcula minutos automaticamente
    if (this.totalWatchTimeSeconds) {
        this.totalWatchTimeMinutes = Math.floor(this.totalWatchTimeSeconds / 60);
    }
    next();
});

module.exports = mongoose.model('Video', VideoSchema);
