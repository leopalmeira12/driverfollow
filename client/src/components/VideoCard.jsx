import React, { useState, useEffect } from 'react';
import {
    AlertCircle, CheckCircle2, Play, Youtube, Clock,
    MousePointer2, FastForward, ScrollText, CheckCircle,
    Pause, Settings, ShieldCheck, Fingerprint
} from 'lucide-react';

const VideoCard = ({ video, onComplete }) => {
    const [status, setStatus] = useState('idle');
    const [currentStep, setCurrentStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState('');
    const [imgError, setImgError] = useState(false);

    const youtubeId = video.youtubeId || video.youtubeVideoId;
    const blueprint = video.blueprint || { steps: [] };
    const steps = blueprint.steps;

    const handleStart = () => {
        if (!youtubeId) return setError('ID inválido.');

        // IA Dynamic URL Construction: Including the random start timestamp (&t=)
        // Using pure seconds (without 's') for maximum compatibility across devices
        const startParams = video.startAtSecond ? `&t=${video.startAtSecond}` : '';
        const url = `https://www.youtube.com/watch?v=${youtubeId}${startParams}`;

        const win = window.open(url, '_blank');
        if (!win) {
            setError(<span>Pop-up bloqueado! <a href={url} target="_blank" className="underline">Clique aqui</a></span>);
            return;
        }

        fetch('/api/missions/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ missionId: video.missionId })
        });

        setStatus('watching');
        setCurrentStep(0);
        setTimeLeft(steps[0]?.duration || 30);
    };

    const handleVerify = async () => {
        setStatus('verifying');
        const res = await fetch('/api/missions/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ missionId: video.missionId })
        });
        const data = await res.json();
        if (res.ok) {
            setStatus('success');
            setTimeout(() => onComplete(data.creditsEarned), 1500);
        } else {
            setError(data.error);
            setStatus('ready');
        }
    };

    useEffect(() => {
        let interval;
        if (status === 'watching' && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && status === 'watching') {
            if (currentStep < steps.length - 1) {
                const next = currentStep + 1;
                setCurrentStep(next);
                setTimeLeft(steps[next].duration);
            } else {
                setStatus('ready');
            }
        }
        return () => clearInterval(interval);
    }, [status, timeLeft, currentStep, steps]);

    const getIcon = (icon) => {
        switch (icon) {
            case 'jump': return <FastForward className="w-3.5 h-3.5" />;
            case 'scroll': return <ScrollText className="w-3.5 h-3.5" />;
            case 'pause': return <Pause className="w-3.5 h-3.5" />;
            case 'settings': return <Settings className="w-3.5 h-3.5" />;
            default: return <MousePointer2 className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-black/40">
            {/* Header com Identidade da IA */}
            <div className={`p-4 border-b border-white/5 flex items-center justify-between ${status === 'watching' ? 'bg-emerald-500/10' : ''}`}>
                <div className="flex items-center gap-2">
                    <Fingerprint className={`w-4 h-4 ${status === 'watching' ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        Protocolo GhostDriver {blueprint.mode?.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/50 rounded-full border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Safe Engagement</span>
                </div>
            </div>

            <div
                className={`relative aspect-video w-full bg-neutral-900 group overflow-hidden ${status === 'idle' ? 'cursor-pointer' : ''}`}
                onClick={status === 'idle' ? handleStart : undefined}
            >
                <img
                    src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover opacity-20 grayscale scale-110 group-hover:scale-100 group-hover:opacity-40 transition-all duration-1000"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    {status === 'idle' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-emerald-500/10 backdrop-blur-3xl rounded-full flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-500 transition shadow-2xl">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] animate-pulse">Sintonizar IA</span>
                        </div>
                    )}
                    {status === 'watching' && (
                        <div className="flex flex-col items-center gap-4 px-6 text-center">
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    Instrução Ativa IA
                                </span>
                                <div className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 drop-shadow-2xl max-w-sm">
                                    {steps[currentStep]?.text}
                                </div>
                                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                    <div className="text-xl font-mono font-black text-emerald-400">
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Sincronizando...</span>
                                </div>
                            </div>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest animate-pulse mt-2">
                                Mantenha a aba do YouTube aberta para validar
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 flex-1 bg-gradient-to-b from-neutral-900/60 to-black/80">
                <div className="mb-6">
                    <h3 className="text-white font-bold mb-1 leading-tight">{video.videoTitle}</h3>
                    <div className="flex items-center gap-2">
                        <div className="text-left">
                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Iniciar Protocolo</div>
                            <div className="text-xs font-bold text-white tracking-tight">
                                Salto IA: Iniciar aos {video.startAtSecond || 0}s
                            </div>
                        </div>
                        <div className="h-px flex-1 bg-white/5"></div>
                        <span className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.2em]">Fluxo Humano Sequencial</span>
                        <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-700 ${idx === currentStep && status === 'watching'
                                ? 'bg-emerald-500/10 border-emerald-500/40 translate-x-1'
                                : idx < currentStep || status === 'ready' || status === 'success'
                                    ? 'bg-neutral-800/10 border-transparent opacity-30 scale-95'
                                    : 'bg-black/20 border-transparent opacity-10'
                                }`}
                        >
                            <div className={`p-1.5 rounded-lg ${idx === currentStep && status === 'watching' ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-neutral-800 text-neutral-600'
                                }`}>
                                {idx < currentStep || status === 'success' ? <CheckCircle className="w-3 h-3" /> : getIcon(step.icon)}
                            </div>
                            <p className={`text-[11px] font-bold flex-1 ${idx === currentStep && status === 'watching' ? 'text-white' : 'text-neutral-500'}`}>
                                {step.text}
                            </p>
                            <span className="text-[9px] font-mono text-neutral-700">{step.duration}s</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    {status === 'idle' && (
                        <button onClick={handleStart} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition shadow-[0_10px_30px_rgba(5,150,105,0.3)] uppercase tracking-widest text-[10px]">
                            Implementar GhostDriver
                        </button>
                    )}
                    {status === 'ready' && (
                        <button onClick={handleVerify} className="w-full py-4 bg-white text-black font-black rounded-2xl animate-bounce-subtle uppercase tracking-widest text-[10px]">
                            Finalizar Análise de Retenção
                        </button>
                    )}
                    {status === 'success' && (
                        <div className="w-full py-4 bg-emerald-500 text-black font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="uppercase tracking-widest text-[10px]">Crescimento Validado!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
