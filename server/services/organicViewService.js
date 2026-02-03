const ViewSession = require('../models/ViewSession');
const Video = require('../models/Video');
const User = require('../models/User');

/**
 * 🎯 ORGANIC VIEW SERVICE
 * 
 * Serviço que implementa as regras de visualização orgânica do YouTube
 * para garantir que os canais não sejam penalizados ou desmonetizados.
 * 
 * REGRAS IMPLEMENTADAS:
 * 1. Máximo 4 visualizações/semana do mesmo usuário para o mesmo vídeo
 * 2. Cooldown mínimo de 24h entre visualizações do mesmo vídeo
 * 3. Comportamentos humanos variados (seek, pause, quality change, etc)
 * 4. Engajamentos distribuídos aleatoriamente (likes, comentários, shares)
 * 5. Pontos de entrada variados (não sempre do início)
 * 6. Watch time mínimo de 30 segundos para contar
 */

// ═══════════════════════════════════════════════════════════════════════════
// BLUEPRINT DE ENGAJAMENTO HUMANIZADO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gera um blueprint único de comportamento para cada missão
 * Simula como um humano real assistiria ao vídeo
 */
const generateOrganicBlueprint = (videoDurationSeconds, weeklyViewNumber = 1) => {
    const blueprint = {
        viewNumber: weeklyViewNumber,
        entryType: getRandomEntryType(),
        startAtSecond: calculateStartPoint(videoDurationSeconds, weeklyViewNumber),
        minimumWatchTime: getMinimumWatchTime(videoDurationSeconds),
        behaviors: [],
        engagement: generateEngagementPlan(weeklyViewNumber),
        instructions: []
    };

    // Gera sequência de comportamentos baseada no número da visualização
    blueprint.behaviors = generateBehaviorSequence(videoDurationSeconds, weeklyViewNumber);
    blueprint.instructions = generateHumanInstructions(blueprint, weeklyViewNumber);

    return blueprint;
};

/**
 * Tipos de entrada - simula como o usuário "encontrou" o vídeo
 */
const getRandomEntryType = () => {
    const types = [
        { type: 'recommendation', weight: 40, desc: 'Recomendado pelo YouTube' },
        { type: 'search', weight: 25, desc: 'Busca direta' },
        { type: 'direct', weight: 15, desc: 'Link direto' },
        { type: 'playlist', weight: 10, desc: 'Playlist automática' },
        { type: 'external', weight: 10, desc: 'Link externo (WhatsApp, etc)' }
    ];

    const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;

    for (const type of types) {
        random -= type.weight;
        if (random <= 0) return type.type;
    }
    return 'recommendation';
};

/**
 * Calcula o ponto de entrada baseado no número da visualização na semana
 * 
 * REGRAS DE PONTO DE ENTRADA:
 * 1ª visita: INÍCIO do vídeo (0-10s) - Descoberta
 * 2ª visita: PONTO ALEATÓRIO (20-70%) - Voltou para rever parte específica
 * 3ª visita: MEIO ATÉ O FINAL (50-80%) - Quer ver a conclusão
 * 4ª visita: INÍCIO (0s) - Assiste COMPLETO do início ao fim
 */
const calculateStartPoint = (videoDuration, viewNumber) => {
    const duration = Math.max(videoDuration, 120); // Mínimo 2 min

    switch (viewNumber) {
        case 1: // Primeira visita - INÍCIO
            // Começa do início mesmo (0-10s para parecer natural)
            return Math.floor(Math.random() * 10);

        case 2: // Segunda visita - PONTO ALEATÓRIO
            // Não começa do início! Simula que voltou para rever algo específico
            const randomMin = Math.floor(duration * 0.20); // 20% do vídeo
            const randomMax = Math.floor(duration * 0.70); // 70% do vídeo
            const randomStart = randomMin + Math.floor(Math.random() * (randomMax - randomMin));
            return randomStart;

        case 3: // Terceira visita - MEIO ATÉ O FINAL
            // Começa do meio e assiste até o final
            const midStart = Math.floor(duration * 0.40); // 40% do vídeo
            const midEnd = Math.floor(duration * 0.60); // 60% do vídeo
            return midStart + Math.floor(Math.random() * (midEnd - midStart));

        case 4: // Quarta visita - INÍCIO AO FIM (completo)
            // Começa do ZERO - assiste o vídeo inteiro como um super fã
            return 0;

        default:
            return Math.floor(Math.random() * 10);
    }
};

/**
 * Calcula o tempo mínimo de visualização para ser orgânico
 * YouTube considera: mín 30s OU 50% do vídeo (o que for menor para vídeos curtos)
 */
const getMinimumWatchTime = (videoDuration) => {
    const fiftyPercent = Math.floor(videoDuration * 0.5);
    const minThirtySeconds = 30;
    const maxTime = Math.max(Math.floor(videoDuration * 0.7), 60); // Não mais que 70% ou 60s

    // Para vídeos curtos (<60s), assistir pelo menos 50%
    if (videoDuration < 60) {
        return Math.max(fiftyPercent, 20);
    }

    // Para vídeos normais, entre 30s e 70% do vídeo
    return Math.min(Math.max(minThirtySeconds, fiftyPercent), maxTime);
};

/**
 * Gera plano de engajamento baseado no número da visualização
 * 
 * REGRAS DE ENGAJAMENTO (por visita):
 * 1ª visita: Apenas assistir (descoberta do canal)
 * 2ª visita: Chance de INSCREVER + curtir (demonstra interesse)
 * 3ª visita: Alta chance de inscrever + curtir + comentar
 * 4ª visita: OBRIGATÓRIO curtir + alta chance dos outros
 */
const generateEngagementPlan = (viewNumber) => {
    const plan = {
        shouldLike: false,
        shouldComment: false,
        shouldShare: false,
        shouldSubscribe: false,
        requiredActions: [], // Ações obrigatórias para esta visita
        suggestedActions: [] // Ações sugeridas (opcionais)
    };

    // 1ª visita: Apenas assistir - nenhum engajamento
    // Motivo: Primeira vez vendo o canal, ninguém curte/inscreve de cara
    if (viewNumber === 1) {
        plan.suggestedActions.push('Assista com atenção para conhecer o canal');
        // Nenhum engajamento - apenas descoberta
    }

    // 2ª visita: INSCRIÇÃO + curtir (demonstrando interesse)
    // Motivo: Voltou ao canal = interessou, hora de se inscrever!
    if (viewNumber === 2) {
        plan.shouldSubscribe = Math.random() < 0.60; // 60% chance de inscrever
        plan.shouldLike = Math.random() < 0.40; // 40% chance de curtir

        if (plan.shouldSubscribe) {
            plan.requiredActions.push('Inscreva-se no canal do motorista!');
        }
        if (plan.shouldLike) {
            plan.suggestedActions.push('Curta o vídeo');
        }
    }

    // 3ª visita: Alta chance de todos os engajamentos
    // Motivo: Já conhece bem o canal, fã em formação
    if (viewNumber === 3) {
        plan.shouldSubscribe = Math.random() < 0.80; // 80% chance (se não inscreveu antes)
        plan.shouldLike = Math.random() < 0.70; // 70% chance
        plan.shouldComment = Math.random() < 0.30; // 30% chance
        plan.shouldShare = Math.random() < 0.15; // 15% chance

        if (plan.shouldSubscribe) {
            plan.requiredActions.push('Se ainda não se inscreveu, SE INSCREVA agora!');
        }
        if (plan.shouldLike) {
            plan.requiredActions.push('Deixe seu LIKE no vídeo');
        }
        if (plan.shouldComment) {
            plan.suggestedActions.push('Deixe um comentário de apoio');
        }
    }

    // 4ª visita: Super fã - TUDO OBRIGATÓRIO (assiste do início ao fim)
    // Motivo: Quarta vez assistindo = fã do conteúdo, assiste COMPLETO
    if (viewNumber === 4) {
        plan.shouldLike = true; // 100% OBRIGATÓRIO
        plan.shouldSubscribe = true; // 100% OBRIGATÓRIO (se não inscreveu)
        plan.shouldComment = true; // 100% OBRIGATÓRIO - deixa comentário!
        plan.shouldShare = Math.random() < 0.40; // 40% chance

        plan.requiredActions.push('OBRIGATÓRIO: Assista o vídeo DO INÍCIO AO FIM');
        plan.requiredActions.push('OBRIGATÓRIO: Deixe seu LIKE');
        plan.requiredActions.push('OBRIGATÓRIO: Inscreva-se no canal');
        plan.requiredActions.push('OBRIGATÓRIO: Deixe um COMENTÁRIO de apoio');

        if (plan.shouldShare) {
            plan.suggestedActions.push('Compartilhe com outros motoristas');
        }
    }

    return plan;
};

/**
 * Gera sequência de comportamentos humanos durante a visualização
 */
const generateBehaviorSequence = (videoDuration, viewNumber) => {
    const behaviors = [];
    const possibleBehaviors = [
        { action: 'pause', icon: '⏸️', weight: 25 },
        { action: 'resume', icon: '▶️', weight: 25 },
        { action: 'seek', icon: '⏩', weight: 20 },
        { action: 'quality_change', icon: '⚙️', weight: 10 },
        { action: 'fullscreen', icon: '🔲', weight: 10 },
        { action: 'scroll_comments', icon: '💬', weight: 5 },
        { action: 'read_description', icon: '📝', weight: 5 }
    ];

    // Número de comportamentos aumenta com visitas
    const behaviorCount = Math.min(viewNumber + 1, 4);

    for (let i = 0; i < behaviorCount; i++) {
        const behavior = weightedRandom(possibleBehaviors);
        const timestamp = Math.floor(Math.random() * videoDuration);

        behaviors.push({
            action: behavior.action,
            icon: behavior.icon,
            timestamp,
            completed: false
        });
    }

    // Ordena por timestamp
    behaviors.sort((a, b) => a.timestamp - b.timestamp);

    return behaviors;
};

/**
 * Gera instruções humanizadas para o usuário
 */
const generateHumanInstructions = (blueprint, viewNumber) => {
    const instructions = [];

    // Instrução de entrada baseada no tipo
    const entryInstructions = {
        'recommendation': '👀 Assista como se tivesse encontrado nas recomendações',
        'search': '🔍 Assista como se tivesse buscado o conteúdo',
        'direct': '🔗 Assista como se tivesse recebido o link',
        'playlist': '📋 Assista como se estivesse numa playlist',
        'external': '📱 Assista como se tivesse clicado num link do WhatsApp'
    };

    instructions.push({
        step: 1,
        text: entryInstructions[blueprint.entryType] || 'Assista naturalmente',
        icon: '🎯',
        duration: 5
    });

    // Instrução específica baseada no número da visita
    const startInstructions = {
        1: {
            text: '▶️ PRIMEIRA VISITA: Assista desde o INÍCIO para conhecer o canal',
            icon: '▶️'
        },
        2: {
            text: `⏩ SEGUNDA VISITA: O vídeo começa em ${formatTime(blueprint.startAtSecond)} (ponto aleatório)`,
            icon: '⏩'
        },
        3: {
            text: `⏩ TERCEIRA VISITA: O vídeo começa no MEIO (${formatTime(blueprint.startAtSecond)}) - assista até o final`,
            icon: '⏩'
        },
        4: {
            text: '🏆 QUARTA VISITA: Assista o vídeo INTEIRO do INÍCIO AO FIM (você é Super Fã!)',
            icon: '🏆'
        }
    };

    const startInstruction = startInstructions[blueprint.viewNumber] || startInstructions[1];

    instructions.push({
        step: 2,
        text: startInstruction.text,
        icon: startInstruction.icon,
        duration: blueprint.viewNumber === 4 ? blueprint.minimumWatchTime * 2 : blueprint.minimumWatchTime,
        viewNumber: blueprint.viewNumber
    });

    // Adiciona comportamentos como instruções
    blueprint.behaviors.forEach((behavior, idx) => {
        const behaviorTexts = {
            'pause': `⏸️ Em ${formatTime(behavior.timestamp)}, pause por alguns segundos`,
            'resume': '▶️ Continue assistindo normalmente',
            'seek': `⏩ Avance ou volte um pouco na timeline`,
            'quality_change': '⚙️ Ajuste a qualidade do vídeo',
            'fullscreen': '🔲 Coloque em tela cheia por um momento',
            'scroll_comments': '💬 Role até os comentários e volte',
            'read_description': '📝 Leia a descrição do vídeo'
        };

        instructions.push({
            step: instructions.length + 1,
            text: behaviorTexts[behavior.action] || behavior.action,
            icon: behavior.icon,
            timestamp: behavior.timestamp,
            duration: 5 + Math.floor(Math.random() * 10)
        });
    });

    // INSCRIÇÃO - Vem primeiro (mais importante a partir da 2ª visita)
    if (blueprint.engagement.shouldSubscribe) {
        const subscribeTexts = {
            2: '🔔 HORA DE SE INSCREVER! Você gostou do canal, agora apoie!',
            3: '🔔 SE INSCREVA no canal do motorista (se ainda não fez)!',
            4: '🔔 OBRIGATÓRIO: Inscreva-se no canal (você é fã!)'
        };

        instructions.push({
            step: instructions.length + 1,
            text: subscribeTexts[blueprint.viewNumber] || '🔔 Se inscreva no canal!',
            icon: '🔔',
            duration: 8,
            engagement: 'subscribe',
            isRequired: blueprint.viewNumber >= 4
        });
    }

    // CURTIR
    if (blueprint.engagement.shouldLike) {
        const likeTexts = {
            2: '👍 Curta o vídeo para ajudar o algoritmo!',
            3: '👍 OBRIGATÓRIO: Deixe seu LIKE no vídeo!',
            4: '👍 OBRIGATÓRIO: Curta o vídeo (você é fã!)'
        };

        instructions.push({
            step: instructions.length + 1,
            text: likeTexts[blueprint.viewNumber] || '👍 Curta o vídeo!',
            icon: '👍',
            duration: 3,
            engagement: 'like',
            isRequired: blueprint.viewNumber >= 3
        });
    }

    // COMENTAR
    if (blueprint.engagement.shouldComment) {
        const commentSuggestions = [
            'Ótimo conteúdo, motorista! 🚗',
            'Mandando bem! Continue assim!',
            'Boa viagem! 🛣️',
            'Top demais! 👏',
            'Curti muito! Sucesso! 🔥',
            'Conteúdo de qualidade! 💪',
            'Show de bola! 🔝'
        ];
        const suggestion = commentSuggestions[Math.floor(Math.random() * commentSuggestions.length)];

        instructions.push({
            step: instructions.length + 1,
            text: `💬 Deixe um comentário de apoio: "${suggestion}"`,
            icon: '💬',
            duration: 15,
            engagement: 'comment',
            suggestion,
            isRequired: false
        });
    }

    // COMPARTILHAR
    if (blueprint.engagement.shouldShare) {
        instructions.push({
            step: instructions.length + 1,
            text: '📤 Compartilhe com outro motorista no grupo!',
            icon: '📤',
            duration: 5,
            engagement: 'share',
            isRequired: false
        });
    }

    // Instrução final
    const finalMessages = {
        1: '✅ Missão completa! Este foi seu primeiro contato com o canal. Volte amanhã para a 2ª visita!',
        2: '✅ Ótimo! Você se inscreveu e demonstrou interesse. Isso ajuda muito o motorista!',
        3: '✅ Excelente retenção! O YouTube valoriza esse tipo de engajamento.',
        4: '✅ Super Fã! Engajamento completo de alta qualidade!'
    };

    instructions.push({
        step: instructions.length + 1,
        text: finalMessages[blueprint.viewNumber] || '✅ Missão completa!',
        icon: '🏁',
        isFinal: true
    });

    return instructions;
};

// ═══════════════════════════════════════════════════════════════════════════
// SERVIÇO DE MISSÕES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Busca próxima missão disponível para o usuário
 * Considera regras de rotatividade e cooldown
 */
const getNextAvailableMission = async (userId) => {
    const weekStart = ViewSession.getWeekStart();

    // Busca vídeos que o usuário ainda não atingiu o limite semanal
    const viewedThisWeek = await ViewSession.aggregate([
        {
            $match: {
                viewer: userId,
                weekStart: weekStart
            }
        },
        {
            $group: {
                _id: '$video',
                viewCount: { $sum: 1 },
                lastViewedAt: { $max: '$viewedAt' }
            }
        }
    ]);

    // Mapeia vídeos que atingiram limite ou estão em cooldown
    const unavailableVideos = [];
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    viewedThisWeek.forEach(v => {
        // Limite de 4 views por semana
        if (v.viewCount >= 4) {
            unavailableVideos.push(v._id);
        }
        // Cooldown de 24h
        else if (now - v.lastViewedAt.getTime() < oneDayMs) {
            unavailableVideos.push(v._id);
        }
    });

    // Busca vídeos ativos que não são do próprio usuário e não estão indisponíveis
    const availableVideo = await Video.findOne({
        user: { $ne: userId },
        status: 'active',
        _id: { $nin: unavailableVideos },
        $expr: { $lt: ['$completedViews', '$targetViews'] }
    })
        .sort({ completedViews: 1, createdAt: 1 }) // Prioriza vídeos com menos views
        .populate('user', 'name channelTitle');

    if (!availableVideo) {
        return {
            available: false,
            reason: 'NO_VIDEOS_AVAILABLE',
            message: 'Nenhuma missão disponível no momento. Tente novamente mais tarde!'
        };
    }

    // Calcula qual visualização da semana será esta
    const existingViews = viewedThisWeek.find(v => v._id.equals(availableVideo._id));
    const weeklyViewNumber = existingViews ? existingViews.viewCount + 1 : 1;

    // Converte duração ISO 8601 para segundos
    const durationSeconds = parseDuration(availableVideo.duration) || 420; // Default 7 min

    // Gera blueprint orgânico
    const blueprint = generateOrganicBlueprint(durationSeconds, weeklyViewNumber);

    return {
        available: true,
        video: availableVideo,
        blueprint,
        weeklyViewNumber,
        durationSeconds,
        weekStart
    };
};

/**
 * Registra uma visualização completada
 */
const recordViewSession = async (viewerId, videoId, sessionData) => {
    const video = await Video.findById(videoId);
    if (!video) throw new Error('Video not found');

    // Verifica se pode visualizar
    const canView = await ViewSession.canViewThisWeek(viewerId, videoId);
    if (!canView.canView) {
        throw new Error(`Cannot view: ${canView.reason}`);
    }

    // Cria a sessão de visualização
    const session = new ViewSession({
        viewer: viewerId,
        video: videoId,
        videoOwner: video.user,
        watchTimeSeconds: sessionData.watchTimeSeconds,
        startedAtSecond: sessionData.startedAtSecond || 0,
        endedAtSecond: sessionData.endedAtSecond || sessionData.watchTimeSeconds,
        entryType: sessionData.entryType || 'recommendation',
        engagements: sessionData.engagements || {},
        humanBehaviors: sessionData.humanBehaviors || [],
        isOrganic: validateOrganicScore(sessionData) >= 70,
        organicScore: validateOrganicScore(sessionData),
        weeklyViewNumber: canView.viewNumber,
        weekStart: ViewSession.getWeekStart()
    });

    await session.save();

    // Atualiza contadores do vídeo
    video.completedViews += 1;

    // Atualiza watch time total (para cálculo de monetização)
    video.totalWatchTimeSeconds = (video.totalWatchTimeSeconds || 0) + sessionData.watchTimeSeconds;
    video.totalWatchTimeMinutes = Math.floor(video.totalWatchTimeSeconds / 60);

    // Atualiza engajamentos
    if (sessionData.engagements) {
        if (sessionData.engagements.liked) video.totalLikes = (video.totalLikes || 0) + 1;
        if (sessionData.engagements.commented) video.totalComments = (video.totalComments || 0) + 1;
        if (sessionData.engagements.shared) video.totalShares = (video.totalShares || 0) + 1;
    }

    // Verifica se atingiu a meta
    if (video.completedViews >= video.targetViews) {
        video.status = 'completed';
    }
    await video.save();

    return session;
};

/**
 * Valida o score orgânico da visualização
 * 100 = totalmente orgânico, 0 = suspeito de bot
 */
const validateOrganicScore = (sessionData) => {
    let score = 100;

    // Watch time muito curto = suspeito
    if (sessionData.watchTimeSeconds < 30) {
        score -= 40;
    }

    // Sem nenhum comportamento humano = suspeito
    if (!sessionData.humanBehaviors || sessionData.humanBehaviors.length === 0) {
        score -= 20;
    }

    // Tempo de sessão muito preciso (exatamente X segundos) = suspeito
    if (sessionData.watchTimeSeconds % 10 === 0) {
        score -= 10;
    }

    // Engajamento demais em uma visita = suspeito
    if (sessionData.engagements) {
        const engagementCount = Object.values(sessionData.engagements).filter(Boolean).length;
        if (engagementCount >= 3) {
            score -= 15;
        }
    }

    return Math.max(0, Math.min(100, score));
};

/**
 * Calcula estatísticas de progresso para monetização
 */
const getMonetizationProgress = async (userId) => {
    const channelStats = await ViewSession.getChannelWatchTimeStats(userId);

    // Requisitos do YouTube Partner Program
    const requirements = {
        watchTimeHours: 4000,
        subscribers: 1000
    };

    const user = await User.findById(userId);
    const subscriberCount = user?.subscriberCount || 0;

    return {
        watchTime: {
            current: channelStats.totalWatchTimeHours,
            required: requirements.watchTimeHours,
            percentage: Math.min((channelStats.totalWatchTimeHours / requirements.watchTimeHours) * 100, 100)
        },
        subscribers: {
            current: subscriberCount,
            required: requirements.subscribers,
            percentage: Math.min((subscriberCount / requirements.subscribers) * 100, 100)
        },
        totalViews: channelStats.totalViews,
        uniqueViewers: channelStats.uniqueViewers,
        isEligible: channelStats.totalWatchTimeHours >= requirements.watchTimeHours && subscriberCount >= requirements.subscribers
    };
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════════════════

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const parseDuration = (isoDuration) => {
    if (!isoDuration) return null;

    // Parse ISO 8601 duration (e.g., "PT7M30S")
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return null;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
};

const weightedRandom = (items) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }
    return items[0];
};

module.exports = {
    generateOrganicBlueprint,
    getNextAvailableMission,
    recordViewSession,
    validateOrganicScore,
    getMonetizationProgress,
    formatTime,
    parseDuration
};
