import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import OnboardingTour from '../components/OnboardingTour';
import { useAuth } from '../context/AuthContext';
import { Plus, Info, LogOut, TrendingUp, Users, Share2, LayoutDashboard, Target, Zap, Clock8 } from 'lucide-react';

function Dashboard() {
    const navigate = useNavigate();
    const { logout, user, refreshUser } = useAuth();
    const [mission, setMission] = useState(null);
    const [userCredits, setUserCredits] = useState(user?.credits || 0);
    const [loading, setLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);
    const [dailyProgress, setDailyProgress] = useState(0);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (user) {
            setUserCredits(user.credits || 0);
            const hasSeenTour = localStorage.getItem('driver_tour_v1');
            if (!hasSeenTour) setShowTour(true);
            fetchMission();
        }
    }, [user]);

    // Handle Cooldown Timer
    useEffect(() => {
        let interval;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        } else if (cooldown === 0 && !mission && !loading) {
            fetchMission();
        }
        return () => clearInterval(interval);
    }, [cooldown, mission, loading]);

    const fetchMission = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/missions/next?t=${Date.now()}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'x-auth-token': token }
            });
            const data = await res.json();

            if (data.onCooldown) {
                setCooldown(data.waitTime);
                setMission(null);
            } else if (data.missionId) {
                setMission(data);
                setDailyProgress(data.dailyProgress || 0);
                setCooldown(0);
            } else {
                setMission(null);
            }
        } catch (err) {
            console.error('Mission fetch failed:', err);
            setMission(null);
        }
        setLoading(false);
    };

    const handleMissionComplete = (earnedCredits) => {
        setUserCredits(prev => prev + earnedCredits);
        setMission(null);
        refreshUser();
        // Immediately fetch the update (or let the cooldown trigger)
        fetchMission();
    };

    const handleLogout = () => {
        if (window.confirm("Sair do cockpit?")) {
            logout();
            navigate('/login');
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans pb-32">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[100px] animate-pulse-slow"></div>
            </div>

            <header className="bg-neutral-900/80 backdrop-blur-md border-b border-emerald-900/30 px-4 py-3 sticky top-0 z-40 shadow-2xl">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 w-40" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="TD" className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <h1 className="font-bold tracking-tight text-lg leading-none cursor-pointer">TubeDrivers</h1>
                    </div>

                    <div className="flex items-center gap-4 justify-end flex-1">
                        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-emerald-500/30">
                            <span className="font-mono text-sm font-bold text-white">{userCredits} CR</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-neutral-400 hover:text-red-500 transition">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 pt-8 max-w-5xl relative z-10">
                <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Crescimento Diário</h2>
                            <p className="text-xs text-emerald-400 font-bold">Complete 5 missões para liberar o bônus de rede</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${i <= dailyProgress ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-black/40 border-emerald-500/20 text-emerald-500/40'}`}>
                                    {i}
                                </div>
                            ))}
                        </div>
                        <div className="text-right ml-4">
                            <div className="text-[10px] font-black text-emerald-500 uppercase">Status</div>
                            <div className="text-lg font-mono font-black">{dailyProgress}/5</div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-4">
                        <div
                            onClick={() => navigate('/my-videos')}
                            className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/50 p-6 rounded-[32px] cursor-pointer hover:scale-[1.02] transition shadow-lg group relative overflow-hidden"
                        >
                            <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tighter">Acelerar Canais</h3>
                            <p className="text-emerald-400/80 text-xs font-medium italic">Trocar bônus por views ➔</p>
                        </div>

                        <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-[32px] space-y-4 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Aceleração Extra</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition">
                                    <span className="text-xs text-neutral-400">Seguir Canal</span>
                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+5 CR</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8">
                        <div className="bg-black/90 rounded-[40px] border border-neutral-800 overflow-hidden shadow-2xl min-h-[500px] flex flex-col border-emerald-500/5">
                            <div className="bg-neutral-900/80 p-6 border-b border-neutral-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${cooldown > 0 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></div>
                                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                                        {cooldown > 0 ? 'IA Processando Dados' : 'Feed de Drivers'}
                                    </span>
                                </div>
                                {cooldown === 0 && (
                                    <button onClick={fetchMission} className="text-[10px] font-bold text-neutral-500 hover:text-white transition uppercase tracking-widest">Pular para Próximo</button>
                                )}
                            </div>

                            <div className="flex-1 relative flex flex-col justify-center">
                                {cooldown > 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 mb-6 relative">
                                            <Clock8 className="w-10 h-10 text-amber-500 animate-spin-slow" />
                                            <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Intervalo de Humanização IA</h3>
                                        <p className="text-neutral-500 text-xs max-w-[280px] leading-relaxed mb-6">
                                            Para proteger os canais da rede, a IA solicita que você aguarde alguns instantes antes do próximo vídeo.
                                        </p>
                                        <div className="text-4xl font-mono font-black text-amber-500 mb-2">
                                            0:{(cooldown).toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.3em]">Segundo de Segurança</div>
                                    </div>
                                ) : loading ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-neutral-500">
                                        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Sintonizando Driver...</p>
                                    </div>
                                ) : mission ? (
                                    <VideoCard
                                        key={`${mission.missionId}-${mission.startAtSecond}`}
                                        video={mission}
                                        onComplete={handleMissionComplete}
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-neutral-500">
                                        <Info className="w-16 h-16 mb-4 opacity-10" />
                                        <h3 className="text-white font-bold mb-2">Estrada Vazia</h3>
                                        <button onClick={fetchMission} className="mt-6 px-8 py-3 bg-emerald-600 rounded-2xl text-white text-[10px] font-black hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest">Recarregar</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800 p-4 z-50">
                <div className="flex justify-around items-center max-w-lg mx-auto">
                    <NavButton icon={<LayoutDashboard className="w-6 h-6" />} label="Cockpit" active={true} onClick={() => navigate('/dashboard')} />
                    <NavButton icon={<TrendingUp className="w-6 h-6" />} label="Canais" active={false} onClick={() => navigate('/my-videos')} />
                    <NavButton icon={<Users className="w-6 h-6" />} label="Perfil" active={false} onClick={() => navigate('/profile')} />
                </div>
            </nav>
        </div>
    );
}

const NavButton = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 ${active ? 'text-emerald-400' : 'text-neutral-500 hover:text-white'}`}
    >
        {icon}
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
        {active && <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1"></div>}
    </button>
);

export default Dashboard;
