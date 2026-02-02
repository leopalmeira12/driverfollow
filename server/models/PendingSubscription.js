const mongoose = require('mongoose');

const PendingSubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetVideoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true }, // The video that triggered this

    // We store channel info here to speed up feed generation without population
    targetChannelName: { type: String },
    targetChannelId: { type: String }, // YouTube Channel ID
    targetThumbnail: { type: String },

    unlockAt: { type: Date, required: true }, // When this mission becomes available
    status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },

    createdAt: { type: Date, default: Date.now }
});

// Index for fast query of "What is ready for me today?"
PendingSubscriptionSchema.index({ userId: 1, status: 1, unlockAt: 1 });

module.exports = mongoose.model('PendingSubscription', PendingSubscriptionSchema);
