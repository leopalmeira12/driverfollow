const User = require('../models/User');
const Video = require('../models/Video');
const ViewSession = require('../models/ViewSession');
const organicViewService = require('../services/organicViewService');

const activeMissions = new Map();
const userCooldowns = new Map();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 ORGANIC MISSION CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Implementa as regras de visualização orgânica do YouTube:
 * 
 * 1. ROTATIVIDADE: Máximo 4 visualizações/semana do mesmo usuário para o mesmo vídeo
 * 2. COOLDOWN: Mínimo 24h entre visualizações do mesmo vídeo
 * 3. HUMANIZAÇÃO: Comportamentos variados (seek, pause, qualidade, etc)
 * 4. ENGAJAMENTO NATURAL: Likes, comentários e shares distribuídos probabilisticamente
 * 5. WATCH TIME VÁLIDO: Mínimo 30s ou 50% do vídeo (YouTube rules)
 * 
 * OBJETIVO: 4000 horas de visualização em ~3 dias com 1000 motoristas ativos
 * 
 * Cálculo: 1000 motoristas × 7 min/vídeo × 4 rodadas/dia = 28.000 min/dia
 *          4000 horas = 240.000 min ÷ 28.000 = ~8.5 dias (conservador)
 *          Com mais engajamento e vídeos maiores: ~3-5 dias
 */

// Store user stats in memory for local dev
const userStats = new Map();

/**
 * GET /api/missions/next
 * Busca a próxima missão disponível seguindo regras orgânicas
 */
exports.getNextMission = async (req, res) => {
    try {
        const userId = req.user.id;

        // Initialize stats if new
        if (!userStats.has(userId)) {
            userStats.set(userId, { dailyProgress: 0, lastCheck: Date.now() });
        }

        const stats = userStats.get(userId);

        // Check for cooldown
        const nextAvailable = userCooldowns.get(userId);
        if (nextAvailable && nextAvailable > Date.now()) {
            const waitTime = Math.ceil((nextAvailable - Date.now()) / 1000);
            return res.json({
                onCooldown: true,
                waitTime: waitTime,
                message: "🛡️ Intervalo de Segurança: Protegendo seu canal e o dos outros motoristas."
            });
        }

        // Busca próxima missão usando o serviço de visualização orgânica
        const missionResult = await organicViewService.getNextAvailableMission(userId);

        if (!missionResult.available) {
            return res.json({
                noMission: true,
                message: missionResult.message,
                reason: missionResult.reason
            });
        }

        const { video, blueprint, weeklyViewNumber, durationSeconds } = missionResult;

        // Gera ID único para esta missão
        const missionId = `${video._id}_${Date.now()}`;

        // Armazena missão ativa
        activeMissions.set(`${userId}_${missionId}`, {
            startTime: Date.now(),
            videoId: video._id.toString(),
            userId: userId,
            blueprint: blueprint,
            weeklyViewNumber: weeklyViewNumber,
            durationSeconds: durationSeconds
        });

        res.json({
            missionId: missionId,
            videoId: video._id.toString(),
            type: 'WATCH',
            videoTitle: video.title,
            youtubeId: video.youtubeVideoId,
            thumbnailUrl: video.thumbnailUrl,
            channelName: video.user?.channelTitle || video.user?.name || 'Motorista',

            // Blueprint Orgânico
            blueprint: {
                viewNumber: weeklyViewNumber,
                viewDescription: getViewDescription(weeklyViewNumber),
                entryType: blueprint.entryType,
                startAtSecond: blueprint.startAtSecond,
                minimumWatchTime: blueprint.minimumWatchTime,
                behaviors: blueprint.behaviors,
                engagement: blueprint.engagement,
                instructions: blueprint.instructions,
                durationSeconds: durationSeconds
            },

            // Estatísticas
            dailyProgress: stats.dailyProgress,
            dailyMeta: 5,

            // Mensagem contextual
            message: getMissionMessage(weeklyViewNumber)
        });

    } catch (err) {
        console.error("Mission system error:", err);
        res.status(500).json({ error: 'Erro ao buscar missão.' });
    }
};

/**
 * POST /api/missions/start
 * Inicia uma missão (marca como em andamento)
 */
exports.startMission = async (req, res) => {
    const { missionId } = req.body;
    const userId = req.user.id;
    const key = `${userId}_${missionId}`;

    if (!activeMissions.has(key)) {
        return res.status(400).json({ error: 'Missão não encontrada ou expirada.' });
    }

    const mission = activeMissions.get(key);
    mission.startedAt = Date.now();
    activeMissions.set(key, mission);

    res.json({
        success: true,
        message: 'Missão iniciada! Siga as instruções na tela.'
    });
};

/**
 * POST /api/missions/verify
 * Verifica e registra uma missão completada
 */
exports.verifyMission = async (req, res) => {
    try {
        const userId = req.user.id;
        const { missionId, sessionData } = req.body;
        const key = `${userId}_${missionId}`;

        if (!activeMissions.has(key)) {
            return res.status(400).json({ error: 'Sessão de missão inválida ou expirada.' });
        }

        const missionInfo = activeMissions.get(key);
        activeMissions.delete(key);

        // Valida tempo mínimo de visualização
        const watchTime = sessionData?.watchTimeSeconds || 0;
        const minRequired = missionInfo.blueprint?.minimumWatchTime || 30;

        if (watchTime < Math.min(minRequired, 30)) {
            return res.status(400).json({
                error: 'Tempo de visualização insuficiente.',
                required: minRequired,
                watched: watchTime
            });
        }

        // Registra a visualização no banco
        try {
            await organicViewService.recordViewSession(userId, missionInfo.videoId, {
                watchTimeSeconds: watchTime,
                startedAtSecond: sessionData?.startedAtSecond || missionInfo.blueprint.startAtSecond,
                endedAtSecond: sessionData?.endedAtSecond || (missionInfo.blueprint.startAtSecond + watchTime),
                entryType: missionInfo.blueprint.entryType,
                engagements: sessionData?.engagements || {},
                humanBehaviors: sessionData?.humanBehaviors || []
            });
        } catch (dbError) {
            console.error("Failed to record view session:", dbError);
            // Continua mesmo se falhar o registro (para modo memória)
        }

        // Update Persistent Stats
        if (!userStats.has(userId)) userStats.set(userId, { dailyProgress: 0 });
        const stats = userStats.get(userId);
        stats.dailyProgress = (stats.dailyProgress || 0) + 1;

        // Fallback: Incrementa views diretamente se ViewSession falhar
        try {
            const video = await Video.findById(missionInfo.videoId);
            if (video) {
                // Adiciona watch time ao vídeo
                video.completedViews = (video.completedViews || 0) + 1;
                if (video.completedViews >= (video.targetViews || 0)) {
                    video.status = 'completed';
                }
                await video.save();
            }
        } catch (e) {
            console.error("Failed to update video views:", e);
        }

        // Cooldown adaptativo baseado no número da visualização
        // Primeira visita = cooldown menor, visitas repetidas = cooldown maior
        const baseCooldown = 20;
        const viewMultiplier = missionInfo.weeklyViewNumber || 1;
        const randomFactor = Math.floor(Math.random() * 30);
        const cooldownSeconds = baseCooldown + (viewMultiplier * 10) + randomFactor;

        userCooldowns.set(userId, Date.now() + (cooldownSeconds * 1000));

        // Mensagem de feedback baseada no tipo de visualização
        const feedbackMessage = getFeedbackMessage(missionInfo.weeklyViewNumber, sessionData?.engagements);

        res.json({
            success: true,
            creditsEarned: 1,
            watchTimeMinutes: Math.floor(watchTime / 60),
            newProgress: stats.dailyProgress,
            cooldown: cooldownSeconds,
            message: feedbackMessage,
            viewNumber: missionInfo.weeklyViewNumber,
            organicScore: organicViewService.validateOrganicScore({
                watchTimeSeconds: watchTime,
                humanBehaviors: sessionData?.humanBehaviors,
                engagements: sessionData?.engagements
            })
        });

    } catch (err) {
        console.error("Mission Verification Error:", err);
        res.status(500).json({ error: 'Falha ao processar missão.' });
    }
};

/**
 * GET /api/missions/stats
 * Retorna estatísticas de progresso para monetização
 */
exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const progress = await organicViewService.getMonetizationProgress(userId);

        res.json({
            success: true,
            ...progress
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Descrição contextual do número da visualização
 */
const getViewDescription = (viewNumber) => {
    const descriptions = {
        1: '🆕 Primeira Visita - Descoberta do Canal',
        2: '🔄 Segunda Visita - Demonstrando Interesse',
        3: '⭐ Terceira Visita - Fã em Formação',
        4: '🏆 Quarta Visita - Super Fã Engajado'
    };
    return descriptions[viewNumber] || descriptions[1];
};

/**
 * Mensagem de introdução da missão
 */
const getMissionMessage = (viewNumber) => {
    const messages = {
        1: '👋 Novo vídeo! Assista como se estivesse descobrindo o canal.',
        2: '👀 Você já viu algo deste motorista! Hora de voltar e engajar mais.',
        3: '🔥 Este canal está ganhando sua atenção! Uma visualização de qualidade.',
        4: '💎 Você é fã! Esta visualização conta muito para o algoritmo.'
    };
    return messages[viewNumber] || messages[1];
};

/**
 * Feedback após completar missão
 */
const getFeedbackMessage = (viewNumber, engagements) => {
    let message = `✅ Missão ${viewNumber}/4 desta semana concluída!`;

    if (engagements?.liked) {
        message += ' 👍 Like registrado!';
    }
    if (engagements?.commented) {
        message += ' 💬 Comentário enviado!';
    }
    if (engagements?.shared) {
        message += ' 📤 Compartilhamento contabilizado!';
    }
    if (engagements?.subscribed) {
        message += ' 🔔 Novo inscrito!';
    }

    return message;
};
