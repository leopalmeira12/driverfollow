const mongoose = require('mongoose');

/**
 * ViewSession Model - Rastreia cada visualização seguindo regras orgânicas do YouTube
 * 
 * Regras de Visualização Orgânica:
 * 1. Mesmo usuário pode ver o mesmo vídeo até 4x por semana (rotatividade)
 * 2. Cada visualização deve ter comportamento único (ponto de entrada diferente)
 * 3. Engajamentos (like, comentário, compartilhar) são distribuídos aleatoriamente
 * 4. Tempo mínimo de visualização: 30 segundos para contar
 */
const ViewSessionSchema = new mongoose.Schema({
    // Quem assistiu
    viewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Qual vídeo foi assistido
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
        index: true
    },

    // Dono do vídeo (para queries rápidas)
    videoOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Dados da Visualização
    watchTimeSeconds: { type: Number, required: true, min: 0 },
    startedAtSecond: { type: Number, default: 0 }, // Ponto de entrada no vídeo
    endedAtSecond: { type: Number, default: 0 },   // Onde parou

    // Tipo de entrada (simula como o usuário "encontrou" o vídeo)
    entryType: {
        type: String,
        enum: ['direct', 'search', 'recommendation', 'playlist', 'external'],
        default: 'recommendation'
    },

    // Engajamentos realizados nesta sessão
    engagements: {
        liked: { type: Boolean, default: false },
        commented: { type: Boolean, default: false },
        shared: { type: Boolean, default: false },
        subscribed: { type: Boolean, default: false }
    },

    // Comportamentos humanos detectados
    humanBehaviors: [{
        action: {
            type: String,
            enum: ['pause', 'resume', 'seek', 'quality_change', 'fullscreen', 'scroll_comments', 'read_description']
        },
        timestamp: { type: Number } // Segundo do vídeo quando ocorreu
    }],

    // Validação orgânica
    isOrganic: { type: Boolean, default: true },
    organicScore: { type: Number, default: 100, min: 0, max: 100 }, // 100 = totalmente orgânico

    // Flags de auditoria
    flaggedForReview: { type: Boolean, default: false },
    flagReason: { type: String },

    // Número da visualização na semana (1ª, 2ª, 3ª ou 4ª vez)
    weeklyViewNumber: { type: Number, default: 1, min: 1, max: 4 },

    // Timestamps
    viewedAt: { type: Date, default: Date.now, index: true },
    weekStart: { type: Date, required: true } // Início da semana para controle de rotatividade
});

// Índice composto para verificar visualizações repetidas
ViewSessionSchema.index({ viewer: 1, video: 1, weekStart: 1 });

// Índice para queries de estatísticas
ViewSessionSchema.index({ video: 1, viewedAt: -1 });
ViewSessionSchema.index({ videoOwner: 1, viewedAt: -1 });

/**
 * Calcula o início da semana (Domingo)
 */
ViewSessionSchema.statics.getWeekStart = function (date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Verifica se o usuário pode visualizar o vídeo novamente esta semana
 * Retorna: { canView: boolean, viewNumber: number, nextAvailableDay: Date|null }
 */
ViewSessionSchema.statics.canViewThisWeek = async function (viewerId, videoId) {
    const weekStart = this.getWeekStart();

    const viewsThisWeek = await this.countDocuments({
        viewer: viewerId,
        video: videoId,
        weekStart: weekStart
    });

    const lastView = await this.findOne({
        viewer: viewerId,
        video: videoId,
        weekStart: weekStart
    }).sort({ viewedAt: -1 });

    // Máximo 4 visualizações por semana do mesmo vídeo
    if (viewsThisWeek >= 4) {
        const nextWeek = new Date(weekStart);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return {
            canView: false,
            viewNumber: viewsThisWeek,
            nextAvailableDay: nextWeek,
            reason: 'MAX_WEEKLY_VIEWS'
        };
    }

    // Deve esperar pelo menos 1 dia entre visualizações do mesmo vídeo
    if (lastView) {
        const hoursSinceLastView = (Date.now() - lastView.viewedAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastView < 24) {
            const nextAvailable = new Date(lastView.viewedAt.getTime() + (24 * 60 * 60 * 1000));
            return {
                canView: false,
                viewNumber: viewsThisWeek,
                nextAvailableDay: nextAvailable,
                reason: 'DAILY_COOLDOWN'
            };
        }
    }

    return {
        canView: true,
        viewNumber: viewsThisWeek + 1,
        nextAvailableDay: null
    };
};

/**
 * Calcula estatísticas de watch time para um vídeo
 */
ViewSessionSchema.statics.getVideoWatchTimeStats = async function (videoId) {
    const stats = await this.aggregate([
        { $match: { video: mongoose.Types.ObjectId(videoId), isOrganic: true } },
        {
            $group: {
                _id: null,
                totalWatchTimeSeconds: { $sum: '$watchTimeSeconds' },
                totalViews: { $sum: 1 },
                uniqueViewers: { $addToSet: '$viewer' },
                avgWatchTime: { $avg: '$watchTimeSeconds' },
                totalLikes: { $sum: { $cond: ['$engagements.liked', 1, 0] } },
                totalComments: { $sum: { $cond: ['$engagements.commented', 1, 0] } },
                totalShares: { $sum: { $cond: ['$engagements.shared', 1, 0] } }
            }
        },
        {
            $project: {
                totalWatchTimeSeconds: 1,
                totalWatchTimeMinutes: { $divide: ['$totalWatchTimeSeconds', 60] },
                totalWatchTimeHours: { $divide: ['$totalWatchTimeSeconds', 3600] },
                totalViews: 1,
                uniqueViewers: { $size: '$uniqueViewers' },
                avgWatchTime: 1,
                totalLikes: 1,
                totalComments: 1,
                totalShares: 1
            }
        }
    ]);

    return stats[0] || {
        totalWatchTimeSeconds: 0,
        totalWatchTimeMinutes: 0,
        totalWatchTimeHours: 0,
        totalViews: 0,
        uniqueViewers: 0,
        avgWatchTime: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0
    };
};

/**
 * Calcula watch time total de um canal (todas as sessões dos vídeos do dono)
 */
ViewSessionSchema.statics.getChannelWatchTimeStats = async function (ownerId) {
    const stats = await this.aggregate([
        { $match: { videoOwner: mongoose.Types.ObjectId(ownerId), isOrganic: true } },
        {
            $group: {
                _id: null,
                totalWatchTimeSeconds: { $sum: '$watchTimeSeconds' },
                totalViews: { $sum: 1 },
                uniqueViewers: { $addToSet: '$viewer' }
            }
        },
        {
            $project: {
                totalWatchTimeSeconds: 1,
                totalWatchTimeMinutes: { $divide: ['$totalWatchTimeSeconds', 60] },
                totalWatchTimeHours: { $divide: ['$totalWatchTimeSeconds', 3600] },
                totalViews: 1,
                uniqueViewers: { $size: '$uniqueViewers' }
            }
        }
    ]);

    return stats[0] || {
        totalWatchTimeSeconds: 0,
        totalWatchTimeMinutes: 0,
        totalWatchTimeHours: 0,
        totalViews: 0,
        uniqueViewers: 0
    };
};

module.exports = mongoose.model('ViewSession', ViewSessionSchema);
