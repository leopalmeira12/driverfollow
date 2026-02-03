import React, { useState, useEffect, useCallback } from 'react';
import {
    AlertCircle, CheckCircle2, Play, Youtube, Clock, ThumbsUp, MessageSquare,
    Share2, Bell, FastForward, ScrollText, CheckCircle, Eye, ExternalLink,
    Pause, Settings, ShieldCheck, Fingerprint, Loader2, X, ChevronRight,
    Timer, Heart, Sparkles, Target, Zap
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * 🎯 ORGANIC VIDEO CARD
 * 
 * Componente de visualização que guia o usuário através do processo
 * de visualização orgânica seguindo as regras do YouTube.
 * 
 * Features:
 * - Instruções passo-a-passo
 * - Timer dinâmico por etapa
 * - Engajamentos sugeridos (like, comentário, share, subscribe)
 * - Feedback visual do progresso
 * - Score de organicidade
 */
const VideoCard = ({ video, onComplete }) => {
    // Estados
    const [status, setStatus] = useState('idle'); // idle, watching, engaging, verifying, success, error
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalWatchTime, setTotalWatchTime] = useState(0);
    const [error, setError] = useState('');
    const [completedEngagements, setCompletedEngagements] = useState({
        liked: false,
        commented: false,
        shared: false,
        subscribed: false
    });
    const [humanBehaviors, setHumanBehaviors] = useState([]);
    const [showEngagementPanel, setShowEngagementPanel] = useState(false);

    // Dados do vídeo
    const youtubeId = video.youtubeId || video.youtubeVideoId;
    const blueprint = video.blueprint || {};
    const instructions = blueprint.instructions || [];
    const engagement = blueprint.engagement || {};
    const viewNumber = blueprint.viewNumber || 1;
    const viewDescription = blueprint.viewDescription || 'Primeira Visita';

    // Calcula duração total das instruções
    const totalDuration = instructions.reduce((sum, step) => sum + (step.duration || 0), 0);

    // Inicia a missão
    const handleStart = useCallback(() => {
        if (!youtubeId) {
            setError('ID do vídeo inválido.');
            return;
        }

        // Constrói URL com ponto de entrada variável
        const startAt = blueprint.startAtSecond || 0;
        const params = startAt > 0 ? `&t=${startAt}` : '';
        const url = `https://www.youtube.com/watch?v=${youtubeId}${params}`;

        // Abre o YouTube em nova aba
        const win = window.open(url, '_blank');
        if (!win) {
            setError(
                <span>
                    Pop-up bloqueado! <a href={url} target="_blank" rel="noopener" className="underline text-emerald-400">Clique aqui</a>
                </span>
            );
            return;
        }

        // Registra início da missão
        fetch(`${API_URL}/api/missions/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ missionId: video.missionId })
        }).catch(console.error);

        setStatus('watching');
        setCurrentStepIdx(0);
        setTimeLeft(instructions[0]?.duration || 30);
        setTotalWatchTime(0);
        setHumanBehaviors([]);
    }, [youtubeId, video.missionId, blueprint.startAtSecond, instructions]);

    // Registra comportamento humano
    const recordBehavior = useCallback((action) => {
        setHumanBehaviors(prev => [...prev, {
            action,
            timestamp: totalWatchTime
        }]);
    }, [totalWatchTime]);

    // Marca engajamento como completo
    const markEngagement = useCallback((type) => {
        setCompletedEngagements(prev => ({ ...prev, [type]: true }));
        recordBehavior(type);
    }, [recordBehavior]);

    // Verifica e finaliza a missão
    const handleVerify = async () => {
        setStatus('verifying');

        try {
            const res = await fetch(`${API_URL}/api/missions/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    missionId: video.missionId,
                    sessionData: {
                        watchTimeSeconds: totalWatchTime,
                        startedAtSecond: blueprint.startAtSecond || 0,
                        endedAtSecond: (blueprint.startAtSecond || 0) + totalWatchTime,
                        entryType: blueprint.entryType || 'recommendation',
                        engagements: completedEngagements,
                        humanBehaviors: humanBehaviors
                    }
                })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setTimeout(() => onComplete(data.creditsEarned), 2000);
            } else {
                setError(data.error || 'Erro ao verificar missão.');
                setStatus('error');
            }
        } catch (err) {
            setError('Erro de conexão.');
            setStatus('error');
        }
    };

    // Timer e progressão de etapas
    useEffect(() => {
        let interval;
        if (status === 'watching' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                setTotalWatchTime(prev => prev + 1);
            }, 1000);
        } else if (timeLeft === 0 && status === 'watching') {
            // Próxima etapa
            if (currentStepIdx < instructions.length - 1) {
                const nextIdx = currentStepIdx + 1;
                const nextStep = instructions[nextIdx];

                // Se próxima etapa é de engajamento, mostra painel
                if (nextStep.engagement) {
                    setShowEngagementPanel(true);
                }

                setCurrentStepIdx(nextIdx);
                setTimeLeft(nextStep.duration || 10);
            } else {
                // Todas etapas concluídas
                setStatus('engaging');
                setShowEngagementPanel(true);
            }
        }
        return () => clearInterval(interval);
    }, [status, timeLeft, currentStepIdx, instructions]);

    // Componente de passo atual
    const currentStep = instructions[currentStepIdx];

    // Ícone baseado no tipo de ação
    const getStepIcon = (step) => {
        if (step?.engagement === 'like') return <ThumbsUp className="w-4 h-4" />;
        if (step?.engagement === 'comment') return <MessageSquare className="w-4 h-4" />;
        if (step?.engagement === 'share') return <Share2 className="w-4 h-4" />;
        if (step?.engagement === 'subscribe') return <Bell className="w-4 h-4" />;
        if (step?.icon === '⏸️') return <Pause className="w-4 h-4" />;
        if (step?.icon === '⏩') return <FastForward className="w-4 h-4" />;
        if (step?.icon === '💬') return <ScrollText className="w-4 h-4" />;
        if (step?.icon === '⚙️') return <Settings className="w-4 h-4" />;
        if (step?.icon === '🏁') return <Target className="w-4 h-4" />;
        return <Eye className="w-4 h-4" />;
    };

    // Cor baseada no número da visita
    const getViewColor = () => {
        switch (viewNumber) {
            case 1: return 'emerald';
            case 2: return 'blue';
            case 3: return 'amber';
            case 4: return 'rose';
            default: return 'emerald';
        }
    };

    const viewColor = getViewColor();

    return (
        <div className="flex-1 flex flex-col bg-neutral-900/80 relative overflow-hidden">
            {/* Efeito de fundo baseado na visita */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${viewColor}-900/20 to-transparent pointer-events-none`} />

            {/* Header com info da visita */}
            <div className={`p-4 border-b border-neutral-800 flex items-center justify-between relative z-10 ${status === 'watching' ? `bg-${viewColor}-500/10` : ''}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${viewNumber === 1 ? 'bg-emerald-500 text-black' :
                            viewNumber === 2 ? 'bg-blue-500 text-white' :
                                viewNumber === 3 ? 'bg-amber-500 text-black' :
                                    'bg-rose-500 text-white'
                        }`}>
                        {viewNumber}/4
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">{viewDescription}</div>
                        <div className="text-[10px] text-neutral-500">{video.channelName || 'Canal de Motorista'}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tight">Orgânico</span>
                    </div>
                </div>
            </div>

            {/* Área do vídeo */}
            <div
                className={`relative aspect-video w-full bg-black group overflow-hidden ${status === 'idle' ? 'cursor-pointer' : ''}`}
                onClick={status === 'idle' ? handleStart : undefined}
            >
                {/* Thumbnail */}
                <img
                    src={video.thumbnailUrl || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt=""
                    className={`w-full h-full object-cover transition-all duration-1000 ${status === 'idle' ? 'opacity-40 grayscale group-hover:opacity-60 group-hover:grayscale-0 scale-105 group-hover:scale-100' :
                            'opacity-20 grayscale scale-110'
                        }`}
                />

                {/* Overlay de conteúdo */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    {/* Estado Idle - Botão Play */}
                    {status === 'idle' && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                            <div className={`w-20 h-20 bg-${viewColor}-500/20 backdrop-blur rounded-full flex items-center justify-center border-2 border-${viewColor}-500/40 group-hover:border-${viewColor}-500 transition-all shadow-2xl group-hover:shadow-${viewColor}-500/30`}>
                                <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
                            </div>
                            <div className="text-center">
                                <div className={`text-${viewColor}-400 text-xs font-bold uppercase tracking-wider`}>
                                    {viewNumber === 1 ? 'Descobrir Canal' :
                                        viewNumber === 2 ? 'Voltar ao Canal' :
                                            viewNumber === 3 ? 'Demonstrar Interesse' :
                                                'Super Fã Mode'}
                                </div>
                                {blueprint.startAtSecond > 0 && (
                                    <div className="text-neutral-500 text-[10px] mt-1">
                                        Inicia em {formatTime(blueprint.startAtSecond)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Estado Watching - Instrução atual */}
                    {status === 'watching' && currentStep && (
                        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-300">
                            <div className={`px-4 py-1.5 bg-${viewColor}-500/20 rounded-full border border-${viewColor}-500/30`}>
                                <span className={`text-[10px] font-black text-${viewColor}-400 uppercase tracking-widest`}>
                                    Passo {currentStepIdx + 1} de {instructions.length}
                                </span>
                            </div>

                            <div className="text-xl md:text-2xl font-bold text-white leading-tight max-w-md drop-shadow-lg">
                                {currentStep.text}
                            </div>

                            {/* Timer circular */}
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="40" cy="40" r="36"
                                        className="stroke-neutral-800"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <circle
                                        cx="40" cy="40" r="36"
                                        className={`stroke-${viewColor}-500`}
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 36}`}
                                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - timeLeft / (currentStep.duration || 30))}`}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-mono font-bold text-white">{timeLeft}s</span>
                                </div>
                            </div>

                            <div className="text-[10px] text-neutral-500 flex items-center gap-2">
                                <Timer className="w-3 h-3" />
                                Total: {formatTime(totalWatchTime)}
                            </div>
                        </div>
                    )}

                    {/* Estado Engaging - Painel de engajamento */}
                    {(status === 'engaging' || showEngagementPanel) && status !== 'verifying' && status !== 'success' && (
                        <div className="flex flex-col items-center gap-4 w-full max-w-sm animate-in slide-in-from-bottom duration-500">
                            <div className="text-center mb-2">
                                <div className="text-lg font-bold text-white mb-1">
                                    🎯 Hora de Engajar!
                                </div>
                                <div className="text-xs text-neutral-400">
                                    Complete os engajamentos sugeridos (opcional)
                                </div>
                            </div>

                            <div className="w-full space-y-2">
                                {engagement.shouldLike && (
                                    <button
                                        onClick={() => markEngagement('liked')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${completedEngagements.liked
                                                ? 'bg-emerald-500/20 border border-emerald-500/40'
                                                : 'bg-neutral-800/80 border border-neutral-700 hover:border-emerald-500/50'
                                            }`}
                                    >
                                        <ThumbsUp className={`w-5 h-5 ${completedEngagements.liked ? 'text-emerald-400' : 'text-neutral-400'}`} />
                                        <span className="text-sm font-medium text-white flex-1 text-left">
                                            Curtir o vídeo
                                        </span>
                                        {completedEngagements.liked && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                    </button>
                                )}

                                {engagement.shouldComment && (
                                    <button
                                        onClick={() => markEngagement('commented')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${completedEngagements.commented
                                                ? 'bg-blue-500/20 border border-blue-500/40'
                                                : 'bg-neutral-800/80 border border-neutral-700 hover:border-blue-500/50'
                                            }`}
                                    >
                                        <MessageSquare className={`w-5 h-5 ${completedEngagements.commented ? 'text-blue-400' : 'text-neutral-400'}`} />
                                        <span className="text-sm font-medium text-white flex-1 text-left">
                                            Comentar no vídeo
                                        </span>
                                        {completedEngagements.commented && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                    </button>
                                )}

                                {engagement.shouldShare && (
                                    <button
                                        onClick={() => markEngagement('shared')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${completedEngagements.shared
                                                ? 'bg-amber-500/20 border border-amber-500/40'
                                                : 'bg-neutral-800/80 border border-neutral-700 hover:border-amber-500/50'
                                            }`}
                                    >
                                        <Share2 className={`w-5 h-5 ${completedEngagements.shared ? 'text-amber-400' : 'text-neutral-400'}`} />
                                        <span className="text-sm font-medium text-white flex-1 text-left">
                                            Compartilhar
                                        </span>
                                        {completedEngagements.shared && <CheckCircle className="w-4 h-4 text-amber-500" />}
                                    </button>
                                )}

                                {engagement.shouldSubscribe && (
                                    <button
                                        onClick={() => markEngagement('subscribed')}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${completedEngagements.subscribed
                                                ? 'bg-rose-500/20 border border-rose-500/40'
                                                : 'bg-neutral-800/80 border border-neutral-700 hover:border-rose-500/50'
                                            }`}
                                    >
                                        <Bell className={`w-5 h-5 ${completedEngagements.subscribed ? 'text-rose-400' : 'text-neutral-400'}`} />
                                        <span className="text-sm font-medium text-white flex-1 text-left">
                                            Se inscrever no canal
                                        </span>
                                        {completedEngagements.subscribed && <CheckCircle className="w-4 h-4 text-rose-500" />}
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setShowEngagementPanel(false);
                                    if (status === 'engaging') handleVerify();
                                }}
                                className={`mt-2 px-6 py-3 bg-${viewColor}-500 text-black font-bold rounded-xl hover:opacity-90 transition flex items-center gap-2`}
                            >
                                {status === 'engaging' ? 'Finalizar Missão' : 'Continuar'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Estado Verifying */}
                    {status === 'verifying' && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                            <span className="text-sm font-medium text-neutral-300">
                                Validando visualização orgânica...
                            </span>
                        </div>
                    )}

                    {/* Estado Success */}
                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                                <CheckCircle2 className="w-10 h-10 text-black" />
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-white mb-1">Missão Completa!</div>
                                <div className="text-sm text-emerald-400">{formatTime(totalWatchTime)} assistidos</div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                {completedEngagements.liked && <ThumbsUp className="w-4 h-4 text-emerald-400" />}
                                {completedEngagements.commented && <MessageSquare className="w-4 h-4 text-blue-400" />}
                                {completedEngagements.shared && <Share2 className="w-4 h-4 text-amber-400" />}
                                {completedEngagements.subscribed && <Bell className="w-4 h-4 text-rose-400" />}
                            </div>
                        </div>
                    )}

                    {/* Estado Error */}
                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <div className="text-sm text-red-400 text-center">{error}</div>
                            <button
                                onClick={() => { setStatus('idle'); setError(''); }}
                                className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer com info do vídeo */}
            <div className="p-4 bg-neutral-900/80 border-t border-neutral-800 relative z-10">
                <div className="flex items-start gap-3">
                    <img
                        src={video.thumbnailUrl || `https://i.ytimg.com/vi/${youtubeId}/default.jpg`}
                        alt=""
                        className="w-16 h-10 object-cover rounded-lg opacity-80"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{video.videoTitle}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-neutral-500">{video.channelName || 'Canal'}</span>
                            <span className="text-neutral-700">•</span>
                            <span className="text-xs text-neutral-500">{formatTime(blueprint.durationSeconds || 0)}</span>
                        </div>
                    </div>
                    {status === 'idle' && (
                        <a
                            href={`https://youtube.com/watch?v=${youtubeId}`}
                            target="_blank"
                            rel="noopener"
                            className="p-2 text-neutral-500 hover:text-white transition"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {/* Barra de progresso das instruções */}
                {status === 'watching' && (
                    <div className="mt-3 flex gap-1">
                        {instructions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx < currentStepIdx ? 'bg-emerald-500' :
                                        idx === currentStepIdx ? `bg-${viewColor}-500` :
                                            'bg-neutral-700'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Formata segundos em mm:ss
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default VideoCard;
