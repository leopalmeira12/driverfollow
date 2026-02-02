const User = require('../models/User');
const Video = require('../models/Video');

const activeMissions = new Map();
const userCooldowns = new Map();

/**
 * IA "Ghost Driver" Blueprint Generator
 * Creates a unique, non-linear engagement pattern for every single mission.
 * This makes it impossible for YouTube's automation detection (VAI/VLI) 
 * to find a repeating pattern across the network.
 */
const generateIAEngagementBlueprint = (videoDuration) => {
    // 1. Randomly decide the "Entry Intent" (How the user 'found' the video)
    const entryTypes = ["direct", "search_sim", "recommendation_sim"];
    const mode = entryTypes[Math.floor(Math.random() * entryTypes.length)];

    // 2. Generate a Dynamic Sequence of "Micro-Behaviors"
    const steps = [];

    // Initial hook (Always needed)
    steps.push({
        action: "WATCH_INITIAL",
        text: "IA analisando entrada: Assista os primeiros segundos para carregar o buffer.",
        duration: 25 + Math.floor(Math.random() * 20),
        icon: "watch"
    });

    // Random choice of middle behaviors
    const behaviors = [
        () => steps.push({
            action: "JUMP_RANDOM",
            text: `Acelere para o ponto ${15 + Math.floor(Math.random() * 30)}% do vídeo (Parecer busca de conteúdo).`,
            duration: 10 + Math.floor(Math.random() * 10),
            icon: "jump"
        }),
        () => steps.push({
            action: "SCROLL_COMMENTS",
            text: "Simulação de Curiosidade: Role a página até os comentários e volte.",
            duration: 15 + Math.floor(Math.random() * 10),
            icon: "scroll"
        }),
        () => steps.push({
            action: "PAUSE_RESUME",
            text: "Interrupção Humana: Pause o vídeo por 5s e dê play novamente.",
            duration: 15,
            icon: "pause"
        }),
        () => steps.push({
            action: "CHANGE_QUALITY",
            text: "Ajuste de Sinal: Altere a qualidade do vídeo ou clique no player.",
            duration: 12,
            icon: "settings"
        })
    ];

    // Pick 2-3 random behaviors to mix up
    const mixCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < mixCount; i++) {
        behaviors[Math.floor(Math.random() * behaviors.length)]();
    }

    // Final retention step
    steps.push({
        action: "WATCH_FINAL",
        text: "IA validando retenção final: Assista o desfecho do vídeo.",
        duration: 30 + Math.floor(Math.random() * 30),
        icon: "check"
    });

    return { mode, steps };
};

// Store user stats in memory for local dev (reset on server restart)
const userStats = new Map();

exports.getNextMission = async (req, res) => {
    try {
        const userId = req.user.id;

        // Initialize stats if new
        if (!userStats.has(userId)) {
            userStats.set(userId, { dailyProgress: 0, lastCheck: Date.now() });
        }

        const stats = userStats.get(userId);

        // Check for cooldown (Volte daqui a pouco)
        const nextAvailable = userCooldowns.get(userId);
        if (nextAvailable && nextAvailable > Date.now()) {
            const waitTime = Math.ceil((nextAvailable - Date.now()) / 1000);
            return res.json({
                onCooldown: true,
                waitTime: waitTime,
                message: "IA em análise. Volte para a próxima missão em instantes."
            });
        }

        // --- REAL MISSION LOGIC ---
        // Find a video from ANOTHER driver that still needs views
        let missionVideo;
        try {
            missionVideo = await Video.findOne({
                user: { $ne: userId },
                status: 'active',
                $expr: { $lt: ['$completedViews', '$targetViews'] }
            }).sort({ createdAt: 1 });
        } catch (e) {
            console.error("DB Query Error, falling back to mock");
        }

        const blueprint = generateIAEngagementBlueprint(600);

        // Fallback to Arizona if no missions found
        const finalId = missionVideo ? missionVideo.youtubeVideoId : 'K7zBNQOXIE8';
        const finalTitle = missionVideo ? missionVideo.title : 'Estrada do Arizona I-15 - Belas Paisagens';
        const finalMissionId = missionVideo ? missionVideo._id.toString() : 'mock_arizona_mission';

        const startAtSecond = 30 + Math.floor(Math.random() * 180);

        res.json({
            missionId: finalMissionId,
            type: 'WATCH',
            videoTitle: finalTitle,
            youtubeId: finalId,
            startAtSecond: startAtSecond,
            blueprint: blueprint,
            dailyProgress: stats.dailyProgress,
            dailyMeta: 5
        });

    } catch (err) {
        console.error("Mission system error:", err);
        res.status(500).json({ error: 'Erro ao buscar missão.' });
    }
};

exports.startMission = async (req, res) => {
    activeMissions.set(`${req.user.id}_${req.body.missionId}`, {
        startTime: Date.now(),
        videoId: req.body.missionId
    });
    res.json({ success: true });
};

exports.verifyMission = async (req, res) => {
    try {
        const userId = req.user.id;
        const { missionId } = req.body;
        const key = `${userId}_${missionId}`;

        if (!activeMissions.has(key)) {
            return res.status(400).json({ error: 'Sessão de missão inválida ou expirada.' });
        }

        const missionInfo = activeMissions.get(key);
        activeMissions.delete(key);

        // Update Persistent Stats
        if (!userStats.has(userId)) userStats.set(userId, { dailyProgress: 0 });
        const stats = userStats.get(userId);
        stats.dailyProgress = (stats.dailyProgress || 0) + 1;

        // --- REAL DB UPDATE ---
        // Increment views for the driver's video
        if (missionId !== 'mock_arizona_mission') {
            try {
                const video = await Video.findById(missionId);
                if (video) {
                    video.completedViews += 1;
                    if (video.completedViews >= video.targetViews) {
                        video.status = 'completed';
                    }
                    await video.save();
                }
            } catch (e) {
                console.error("Failed to update video views:", e);
            }
        }

        // IA Adaptive "Volte Depois" (Random 15s to 90s)
        const cooldownSeconds = 15 + Math.floor(Math.random() * 75);
        userCooldowns.set(userId, Date.now() + (cooldownSeconds * 1000));

        res.json({
            success: true,
            creditsEarned: 1,
            newProgress: stats.dailyProgress,
            cooldown: cooldownSeconds,
            message: `Meta Diária: ${stats.dailyProgress}/5 Concluída!`
        });
    } catch (err) {
        console.error("IA Verification Error:", err);
        res.status(500).json({ error: 'IA Falhou ao processar.' });
    }
};
