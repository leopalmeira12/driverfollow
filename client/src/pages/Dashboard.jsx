import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import {
    Info, LogOut, TrendingUp, Users, LayoutDashboard, Target, Clock8,
    Gift, Trophy, Car, Phone, Shield, Crown, Copy, CheckCircle,
    Sparkles, ChevronRight, DollarSign, Play, Zap, Youtube, HelpCircle, X
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// FAQ Data
const FAQ_ITEMS = [
    {
        question: 'Como funciona a TubeDrivers?',
        answer: 'Você grava vídeos da estrada enquanto dirige, posta no YouTube, e adiciona o link aqui. Outros motoristas assistem seu vídeo e você assiste os deles. Todos crescem juntos!'
    },
    {
        question: 'Preciso aparecer no vídeo?',
        answer: 'NÃO! Basta apoiar o celular no painel e filmar a estrada. Seu rosto não precisa aparecer.'
    },
    {
        question: 'Quanto tempo leva para monetizar?',
        answer: 'Com vídeos de 40-50 minutos e postando a cada 2 dias, você pode atingir os requisitos do YouTube em 5-7 dias!'
    },
    {
        question: 'Quem paga os meus ganhos?',
        answer: 'O YouTube/Google paga diretamente para você via AdSense. A TubeDrivers não toca no seu dinheiro!'
    },
    {
        question: 'Qual o tamanho ideal do vídeo?',
        answer: 'Entre 30-50 minutos. Vídeos mais longos geram mais watch time e você monetiza mais rápido.'
    },
    {
        question: 'Posso postar vídeos de outras pessoas?',
        answer: 'NÃO! Todos os vídeos devem ser 100% originais e gravados por você. O YouTube pode banir seu canal por violação de direitos autorais.'
    },
];

// Tour Steps - Contextual (aponta para seções do painel)
const TOUR_STEPS = [
    {
        id: 'welcome',
        title: '👋 Bem-vindo à TubeDrivers!',
        content: 'Aqui motoristas se ajudam a crescer no YouTube. Vou te mostrar como tudo funciona!',
        target: null, // Intro sem target específico
        position: 'center'
    },
    {
        id: 'how-it-works',
        title: '🎬 Como Funciona',
        content: 'Esta seção mostra o passo a passo: grave seu vídeo, poste no YouTube e cole o link aqui. Não precisa aparecer no vídeo!',
        target: 'how-it-works-section',
        position: 'bottom'
    },
    {
        id: 'community-videos',
        title: '👀 Vídeos da Comunidade',
        content: 'Aqui você vê vídeos de outros motoristas. Quanto mais você assiste, mais views você recebe de volta!',
        target: 'community-videos-section',
        position: 'top'
    },
    {
        id: 'missions',
        title: '🎯 Sua Missão',
        content: 'Clique na aba "Sua Missão" para ver qual vídeo você precisa assistir agora e ganhar pontos!',
        target: 'tabs-section',
        position: 'top'
    },
    {
        id: 'monetization',
        title: '💰 Monetização',
        content: 'Na aba "Monetização" você vê quanto falta para atingir os requisitos do YouTube e começar a ganhar dinheiro!',
        target: 'tabs-section',
        position: 'top'
    },
    {
        id: 'help',
        title: '❓ Precisa de Ajuda?',
        content: 'Clique no botão verde "?" a qualquer momento para ver as perguntas frequentes ou rever este tour!',
        target: 'help-button',
        position: 'left'
    }
];

// Community Goals Data - CORRECTED
const COMMUNITY_GOALS = [
    {
        target: 1000,
        prize: '3 Smartphones por Semana',
        description: 'Sorteio semanal de 3 celulares entre os membros ativos!',
        icon: Phone,
        color: 'emerald'
    },
    {
        target: 5000,
        prize: 'Seguros Veiculares Semanais',
        description: 'Sorteio semanal de seguros veiculares completos (1 ano)!',
        icon: Shield,
        color: 'amber'
    },
    {
        target: 10000,
        prize: 'Carro 0km Mensal',
        description: 'Todo mês um motorista ganha um veículo zero quilômetro!',
        icon: Car,
        color: 'rose'
    }
];

// YouTube Earnings Data
const YOUTUBE_EARNINGS = [
    { views: '1.000', min: 'R$ 6', max: 'R$ 25', usd: 'US$ 1-5' },
    { views: '10.000', min: 'R$ 60', max: 'R$ 250', usd: 'US$ 12-50' },
    { views: '100.000', min: 'R$ 600', max: 'R$ 2.500', usd: 'US$ 120-500' },
];

// Carrossel de Informações
const InfoCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const items = [
        {
            title: 'Você Sabia?',
            text: 'Comunidade forte cresce junta! Assista para ser assistido.',
            icon: '🤝',
            color: 'from-blue-500/20 to-blue-600/10'
        },
        {
            title: 'Dica de Ouro',
            text: 'Grave vídeos de 40min+ para monetizar mais rápido!',
            icon: '💡',
            color: 'from-amber-500/20 to-amber-600/10'
        },
        {
            title: 'Monetização',
            text: 'O YouTube paga em Dólar! Receba direto na sua conta.',
            icon: '💰',
            color: 'from-emerald-500/20 to-emerald-600/10'
        },
        {
            title: 'Sem Aparecer',
            text: 'Não precisa mostrar o rosto, apenas a estrada!',
            icon: '🛣️',
            color: 'from-purple-500/20 to-purple-600/10'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [items.length]);

    return (
        <div className="relative overflow-hidden rounded-2xl mb-6 bg-neutral-900 border border-neutral-800">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`w-full flex-shrink-0 p-4 bg-gradient-to-r ${item.color} flex items-center justify-between`}
                    >
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span>{item.icon}</span> {item.title}
                            </h3>
                            <p className="text-sm text-neutral-300 mt-1">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-3' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

function Dashboard() {
    const navigate = useNavigate();
    const { logout, user, refreshUser } = useAuth();
    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dailyProgress, setDailyProgress] = useState(0);
    const [cooldown, setCooldown] = useState(0);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('missions');

    // Tour & FAQ states
    const [showTour, setShowTour] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [showFaq, setShowFaq] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [communityVideos, setCommunityVideos] = useState([]);

    // Real subscriber count - fetched from API
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const [loadingStats, setLoadingStats] = useState(true);

    const referralCode = user?.referralCode || 'TD' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const referralLink = `https://tubedrivers.com/convite/${referralCode}`;

    // Check if should show tour (first 10 days)
    useEffect(() => {
        const tourDismissed = localStorage.getItem('tourDismissed');
        const userCreated = user?.createdAt ? new Date(user.createdAt) : new Date();
        const daysSinceCreation = Math.floor((new Date() - userCreated) / (1000 * 60 * 60 * 24));

        if (!tourDismissed && daysSinceCreation <= 10) {
            setShowTour(true);
        }
    }, [user]);

    // Fetch community videos
    useEffect(() => {
        const fetchCommunityVideos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/videos/community?limit=4`);
                if (res.ok) {
                    const data = await res.json();
                    setCommunityVideos(data.videos || []);
                }
            } catch (err) {
                console.log('Error fetching community videos');
            }
        };
        fetchCommunityVideos();
    }, []);

    // Fetch real community stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/stats/community`);
                if (res.ok) {
                    const data = await res.json();
                    setTotalSubscribers(data.totalMembers || 0);
                }
            } catch (err) {
                console.log('Stats fetch error, using default');
            }
            setLoadingStats(false);
        };
        fetchStats();
    }, []);

    useEffect(() => {
        if (user) {
            const completed = JSON.parse(localStorage.getItem('completedMissions') || '[]');
            setDailyProgress(completed.length % 5);
            fetchMission();
        }
    }, [user]);

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
            const res = await fetch(`${API_URL}/api/missions/next?t=${Date.now()}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'x-auth-token': token }
            });
            const data = await res.json();

            if (data.onCooldown) {
                setCooldown(data.waitTime);
                setMission(null);
            } else if (data.missionId) {
                setMission(data);
                setDailyProgress(data.dailyProgress || dailyProgress);
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

    const handleMissionComplete = () => {
        const completed = JSON.parse(localStorage.getItem('completedMissions') || '[]');
        completed.push({ date: new Date().toISOString() });
        localStorage.setItem('completedMissions', JSON.stringify(completed));

        setDailyProgress(prev => Math.min(prev + 1, 5));
        setMission(null);
        refreshUser();
        fetchMission();
    };

    const handleCopyReferral = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        if (window.confirm("Sair do cockpit?")) {
            logout();
            navigate('/login');
        }
    };

    const getCurrentGoal = () => {
        return COMMUNITY_GOALS.find(g => totalSubscribers < g.target) || COMMUNITY_GOALS[COMMUNITY_GOALS.length - 1];
    };

    const getGoalProgress = (goal) => {
        return Math.min((totalSubscribers / goal.target) * 100, 100);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-32">

            {/* Header - Limpo e simples */}
            <header className="bg-neutral-900/90 border-b border-neutral-800 px-4 py-3 sticky top-0 z-40">
                <div className="container mx-auto flex justify-between items-center max-w-6xl">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <h1 className="font-black text-xl leading-none tracking-tight">TubeDrivers</h1>
                    </div>

                    <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-red-500 transition rounded-lg hover:bg-neutral-800">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 pt-6 max-w-6xl relative z-10">

                {/* Welcome */}
                <div className="mb-4">
                    <h2 className="text-2xl font-black mb-1">
                        Olá, {user?.name?.split(' ')[0] || 'Motorista'}! 👋
                    </h2>
                    <p className="text-neutral-500 text-sm">
                        Assista vídeos de outros motoristas e receba views no seu canal
                    </p>
                </div>

                {/* CARROSSEL DE INFORMAÇÕES ANIMADO */}
                <InfoCarousel />

                {/* Community Progress Bar - MAIN FEATURE */}
                <div className="mb-8 p-6 bg-gradient-to-br from-emerald-900/30 to-neutral-900/80 border border-emerald-500/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-emerald-500" />
                            <div>
                                <h3 className="font-bold text-white">Motoristas na Comunidade</h3>
                                <p className="text-xs text-neutral-400">Próxima meta: {getCurrentGoal().target.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-emerald-500">
                                {loadingStats ? '...' : totalSubscribers.toLocaleString()}
                            </div>
                            <div className="text-xs text-neutral-500">motoristas ativos</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 bg-neutral-800 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                            style={{ width: `${getGoalProgress(getCurrentGoal())}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                        <span>0</span>
                        <span>{getCurrentGoal().target.toLocaleString()} motoristas</span>
                    </div>
                </div>

                {/* COMO FUNCIONA - PRIMEIRA COISA QUE O USUÁRIO VÊ */}
                <div id="how-it-works-section" className="mb-8 p-6 bg-gradient-to-br from-amber-900/20 to-neutral-900/80 border border-amber-500/20 rounded-2xl relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🎬</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Como Funciona a TubeDrivers?</h3>
                            <p className="text-xs text-amber-400">É simples: você grava, posta, e a comunidade assiste!</p>
                        </div>
                    </div>

                    {/* Vídeo de Exemplo */}
                    <div className="bg-black rounded-xl overflow-hidden mb-4 relative">
                        <div className="aspect-video">
                            <iframe
                                src="https://www.youtube.com/embed/K7zBNQOXIE8?start=0"
                                title="Exemplo de vídeo de estrada"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase">
                            Exemplo de Vídeo
                        </div>
                    </div>

                    {/* Passo a Passo Simples */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="bg-neutral-800/50 rounded-xl p-3 text-center">
                            <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">1</div>
                            <p className="text-[10px] text-neutral-300 leading-tight">Apoie o celular no painel</p>
                        </div>
                        <div className="bg-neutral-800/50 rounded-xl p-3 text-center">
                            <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">2</div>
                            <p className="text-[10px] text-neutral-300 leading-tight">Grave 40-50 min</p>
                        </div>
                        <div className="bg-neutral-800/50 rounded-xl p-3 text-center">
                            <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">3</div>
                            <p className="text-[10px] text-neutral-300 leading-tight">Poste no YouTube</p>
                        </div>
                        <div className="bg-neutral-800/50 rounded-xl p-3 text-center">
                            <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">4</div>
                            <p className="text-[10px] text-neutral-300 leading-tight">Cole o link aqui</p>
                        </div>
                    </div>

                    {/* Aviso Importante */}
                    <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-500/30 rounded-lg mb-3">
                        <span>⚠️</span>
                        <p className="text-xs text-neutral-300">
                            <strong className="text-red-400">IMPORTANTE:</strong> Vídeos devem ser <strong className="text-white">100% originais</strong>.
                            Nunca poste vídeos de outras pessoas ou repetidos!
                        </p>
                    </div>

                    {/* Não precisa aparecer */}
                    <div className="flex items-start gap-2 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg mb-4">
                        <span>✅</span>
                        <p className="text-xs text-neutral-300">
                            <strong className="text-emerald-400">Você NÃO precisa aparecer no vídeo!</strong> Basta filmar a estrada.
                            Seu celular faz todo o trabalho enquanto você dirige normalmente.
                        </p>
                    </div>

                    {/* PRIMEIRA MISSÃO - DESTAQUE */}
                    <div className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 border-2 border-amber-500/50 rounded-xl p-4 relative">
                        <div className="absolute -top-2 left-4 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            Sua 1ª Missão
                        </div>
                        <p className="text-sm text-white mt-1">
                            🎯 <strong>Grave seu primeiro vídeo</strong> e poste no YouTube.
                            É o primeiro passo para começar a ganhar!
                        </p>
                    </div>

                    {/* Botão de Ação */}
                    <button
                        onClick={() => navigate('/my-videos')}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Play className="w-5 h-5" />
                        Completar Minha 1ª Missão
                    </button>
                </div>

                {/* VÍDEOS DA COMUNIDADE - Sugestões */}
                <div id="community-videos-section" className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Vídeos da Comunidade
                        </h3>
                        <span className="text-xs text-neutral-500">Assista e ganhe views de volta</span>
                    </div>

                    {/* Grid de vídeos da comunidade */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {communityVideos.length > 0 ? (
                            communityVideos.map((video) => (
                                <div
                                    key={video._id}
                                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
                                    className="bg-neutral-800/50 border border-neutral-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all cursor-pointer group"
                                >
                                    <div className="aspect-video bg-neutral-900 relative">
                                        <img
                                            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <div className="w-10 h-10 bg-emerald-500/80 rounded-full flex items-center justify-center">
                                                <Play className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                                            {video.duration || '40:00'}
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs text-neutral-300 truncate">{video.title}</p>
                                        <p className="text-[10px] text-neutral-500">{video.owner}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Placeholders quando não há vídeos
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-neutral-800/30 border border-neutral-700/50 border-dashed rounded-xl overflow-hidden">
                                    <div className="aspect-video bg-neutral-900/50 relative flex items-center justify-center">
                                        <div className="text-center">
                                            <Play className="w-8 h-8 text-neutral-600 mx-auto mb-1" />
                                            <p className="text-[10px] text-neutral-600">Em breve</p>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs text-neutral-600">Aguardando vídeos...</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <p className="text-center text-xs text-neutral-500 mt-3">
                        {communityVideos.length > 0
                            ? 'Quanto mais vídeos você assistir, mais views você recebe! 🔄'
                            : 'Seja o primeiro a postar um vídeo e receba views da comunidade!'}
                    </p>
                </div>

                {/* CONVIDE MOTORISTAS - QR Code + Link */}
                <div id="share-section" className="mb-8 p-5 bg-gradient-to-br from-emerald-900/20 to-neutral-900/80 border border-emerald-500/20 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Convide Motoristas</h3>
                            <p className="text-xs text-emerald-400">Mais motoristas = mais views para você!</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* QR Code */}
                        <div className="bg-white rounded-xl p-4 flex flex-col items-center">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=0a0a0a`}
                                alt="QR Code para convite"
                                className="w-32 h-32 mb-2"
                            />
                            <p className="text-xs text-neutral-700 text-center">
                                Aponte a câmera do celular
                            </p>
                        </div>

                        {/* Link + Botão */}
                        <div className="flex flex-col justify-center">
                            <p className="text-xs text-neutral-400 mb-2">Ou compartilhe o link:</p>
                            <div className="bg-black/50 border border-neutral-700 rounded-lg p-3 mb-3">
                                <p className="text-xs text-emerald-400 truncate font-mono">{referralLink}</p>
                            </div>
                            <button
                                onClick={handleCopyReferral}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Link Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copiar Link
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-neutral-500 text-center mt-2">
                                Cada motorista que entrar usando seu link te ajuda a crescer!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div id="tabs-section" className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: 'missions', label: 'Sua Missão', icon: Target },
                        { id: 'earnings', label: 'Monetização', icon: DollarSign },
                        { id: 'prizes', label: 'Sorteios', icon: Gift },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-emerald-500 text-black'
                                : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* TAB: Missions */}
                {activeTab === 'missions' && (
                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* My Videos CTA */}
                            <div
                                onClick={() => navigate('/my-videos')}
                                className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition shadow-lg shadow-emerald-500/20 group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <Youtube className="w-8 h-8 text-white/80" />
                                    <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-1">Meus Vídeos</h3>
                                <p className="text-emerald-100/80 text-sm">Adicione seus vídeos para receber views</p>
                            </div>

                            {/* How it Works */}
                            <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl">
                                <h4 className="font-black text-white mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-emerald-500" />
                                    Como Funciona?
                                </h4>
                                <div className="space-y-3">
                                    {[
                                        { step: 1, text: 'Assista vídeos de outros motoristas', emoji: '👀' },
                                        { step: 2, text: 'Outros motoristas assistem os seus', emoji: '📺' },
                                        { step: 3, text: 'Todos crescem juntos no YouTube!', emoji: '🚀' },
                                    ].map(item => (
                                        <div key={item.step} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                                            <span className="text-xl">{item.emoji}</span>
                                            <span className="text-sm text-neutral-300">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Referral Card */}
                            <div className="bg-gradient-to-br from-amber-900/30 to-neutral-900 border border-amber-500/20 p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <Gift className="w-5 h-5 text-amber-500" />
                                    <h4 className="font-black text-white">Convide Motoristas!</h4>
                                </div>
                                <p className="text-neutral-400 text-sm mb-4">
                                    Quanto mais motoristas, mais views para todos e maiores os prêmios!
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-400 font-mono truncate">
                                        {referralCode}
                                    </div>
                                    <button
                                        onClick={handleCopyReferral}
                                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${copied
                                            ? 'bg-emerald-500 text-black'
                                            : 'bg-amber-500 text-black hover:bg-amber-400'
                                            }`}
                                    >
                                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Video Feed */}
                        <div className="lg:col-span-8">
                            <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 overflow-hidden min-h-[500px] flex flex-col">
                                <div className="bg-neutral-800/50 p-4 border-b border-neutral-800 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${cooldown > 0 ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                                        <span className="text-sm font-bold text-white">
                                            {cooldown > 0 ? 'Aguardando...' : 'Próxima Missão'}
                                        </span>
                                    </div>
                                    {cooldown === 0 && !loading && (
                                        <button
                                            onClick={fetchMission}
                                            className="text-xs font-bold text-neutral-500 hover:text-white transition"
                                        >
                                            Pular
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 relative flex flex-col justify-center">
                                    {cooldown > 0 ? (
                                        <div className="flex flex-col items-center justify-center p-12 text-center">
                                            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 mb-6 relative">
                                                <Clock8 className="w-8 h-8 text-amber-500" />
                                                <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                                            </div>
                                            <h3 className="text-lg font-black text-white mb-2">Intervalo de Segurança</h3>
                                            <p className="text-neutral-500 text-sm max-w-[280px] mb-6">
                                                Para proteger os canais, aguarde alguns segundos
                                            </p>
                                            <div className="text-4xl font-mono font-black text-amber-500">
                                                0:{cooldown.toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                    ) : loading ? (
                                        <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                            <p className="text-sm text-neutral-500">Buscando missão...</p>
                                        </div>
                                    ) : mission ? (
                                        <VideoCard
                                            key={`${mission.missionId}-${mission.startAtSecond}`}
                                            video={mission}
                                            onComplete={handleMissionComplete}
                                        />
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                            <Info className="w-16 h-16 text-neutral-700 mb-4" />
                                            <h3 className="text-white font-bold mb-2">Nenhuma missão disponível</h3>
                                            <p className="text-neutral-500 text-sm mb-6">
                                                Adicione seu vídeo para receber views!
                                            </p>
                                            <button
                                                onClick={() => navigate('/my-videos')}
                                                className="px-6 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500 transition"
                                            >
                                                Adicionar Meu Vídeo
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: YouTube Earnings */}
                {activeTab === 'earnings' && (
                    <div className="space-y-6">
                        {/* Main Value Proposition */}
                        <div className="bg-gradient-to-br from-emerald-900/40 to-neutral-900 border border-emerald-500/30 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                    <DollarSign className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Ganhe com o YouTube!</h2>
                                    <p className="text-emerald-400">Monetização real através de views reais</p>
                                </div>
                            </div>

                            {/* Power of Community with Conservative Calculations */}
                            <div className="bg-neutral-800/50 rounded-xl p-6 mb-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-amber-500" />
                                    O Poder da Comunidade (Cálculo Conservador)
                                </h3>
                                <p className="text-neutral-300 leading-relaxed mb-4">
                                    Com <span className="text-emerald-500 font-bold">1.000 motoristas</span> na plataforma,
                                    se cada um fizer sua parte assistindo vídeos dos colegas:
                                </p>

                                {/* Time Estimates Table */}
                                <div className="grid gap-3 mb-4">
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-900/50 rounded-xl">
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Meta de Views</div>
                                            <div className="font-bold text-white">1.000 views</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Tempo Estimado</div>
                                            <div className="font-bold text-emerald-400">~1 dia</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Ganho Médio</div>
                                            <div className="font-bold text-amber-500">R$ 6 - R$ 25</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-900/50 rounded-xl">
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Meta de Views</div>
                                            <div className="font-bold text-white">10.000 views</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Tempo Estimado</div>
                                            <div className="font-bold text-emerald-400">~10 dias</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Ganho Médio</div>
                                            <div className="font-bold text-amber-500">R$ 60 - R$ 250</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Meta de Views</div>
                                            <div className="font-bold text-white text-lg">100.000 views</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Tempo Estimado</div>
                                            <div className="font-bold text-emerald-400 text-lg">~1 mês</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-neutral-500 mb-1">Ganho Médio</div>
                                            <div className="font-bold text-emerald-500 text-lg">R$ 600 - R$ 2.500</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-neutral-500 italic">
                                    * Cálculo conservador considerando que cada motorista assista em média 3-5 vídeos por dia.
                                </p>
                            </div>
                        </div>

                        {/* YouTube Monetization Requirements - CARD VERMELHO */}
                        <div className="bg-gradient-to-br from-red-900/30 to-neutral-900 border border-red-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                                    <Youtube className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Monetização do YouTube</h3>
                                    <p className="text-sm text-red-400">Requisitos do YouTube Partner Program</p>
                                </div>
                            </div>

                            {/* Requisitos */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-red-950/50 border border-red-500/20 rounded-xl p-4 text-center">
                                    <div className="text-4xl font-black text-red-500 mb-1">1.000</div>
                                    <div className="text-sm text-neutral-400">Inscritos no canal</div>
                                </div>
                                <div className="bg-red-950/50 border border-red-500/20 rounded-xl p-4 text-center">
                                    <div className="text-4xl font-black text-red-500 mb-1">4.000h</div>
                                    <div className="text-sm text-neutral-400">Horas assistidas (12 meses)</div>
                                </div>
                            </div>

                            {/* CENÁRIO BÁSICO vs OTIMIZADO */}
                            <div className="bg-neutral-800/50 rounded-xl p-5 mb-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                    <h4 className="font-bold text-white">Tempo para Monetizar</h4>
                                </div>

                                {/* Cenário Básico */}
                                <div className="mb-4 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700">
                                    <div className="text-xs text-neutral-500 mb-2">Cenário Básico (1 vídeo de 7 min)</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-neutral-400">1.000 motoristas × 7 min = 116h/rodada</span>
                                        <span className="font-bold text-neutral-300">~2 meses</span>
                                    </div>
                                </div>

                                {/* Cenário Otimizado - DESTAQUE */}
                                <div className="p-4 bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 border-2 border-emerald-500/50 rounded-xl relative">
                                    <div className="absolute -top-2 left-4 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded">
                                        RECOMENDADO
                                    </div>

                                    <div className="text-xs text-emerald-400 mb-3 mt-1">
                                        Cenário Otimizado (vídeos de 30-50 min + postar a cada 2 dias)
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-300">1.000 motoristas × 40 min</span>
                                            <span className="font-bold text-emerald-400">= 666h/rodada</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-neutral-300">6 vídeos (post a cada 2 dias)</span>
                                            <span className="font-bold text-white">= 4.000 horas</span>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/20 rounded-lg p-3 text-center">
                                        <div className="text-3xl font-black text-emerald-400">5-7 DIAS</div>
                                        <div className="text-xs text-neutral-300">para monetizar seu canal</div>
                                    </div>
                                </div>
                            </div>

                            {/* DICAS PARA ACELERAR */}
                            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 mb-4">
                                <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                                    💡 Dicas para Monetizar Mais Rápido
                                </h4>
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                    <div className="flex items-start gap-2">
                                        <span className="text-amber-400">•</span>
                                        <span className="text-neutral-300">Poste vídeos de <strong className="text-white">30-50 minutos</strong> (mais watch time)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-amber-400">•</span>
                                        <span className="text-neutral-300">Poste <strong className="text-white">1 vídeo a cada 2 dias</strong> (múltiplos vídeos = mais horas)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-amber-400">•</span>
                                        <span className="text-neutral-300">Convide mais motoristas para a <strong className="text-white">comunidade crescer</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Regras de Visualização Orgânica */}
                            <div className="bg-neutral-800/30 rounded-xl p-4 mb-4">
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    Regras de Visualização Orgânica
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                        <span className="text-neutral-300">4 views/semana por usuário</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                        <span className="text-neutral-300">Pontos de entrada variados</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                        <span className="text-neutral-300">Engajamento natural</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                        <span className="text-neutral-300">Watch time mínimo 30s</span>
                                    </div>
                                </div>
                            </div>

                            {/* APÓS MONETIZAÇÃO - MENSAGEM MOTIVACIONAL */}
                            <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-xl p-5 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Crown className="w-5 h-5 text-amber-400" />
                                    <h4 className="font-bold text-white">Depois de Monetizado...</h4>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">🚀</span>
                                        <p className="text-neutral-300">
                                            <strong className="text-emerald-400">Tudo fica mais rápido e fácil!</strong> Você continua recebendo views
                                            da comunidade e seu canal cresce exponencialmente.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">📈</span>
                                        <p className="text-neutral-300">
                                            <strong className="text-white">Quanto mais a plataforma cresce, maiores seus ganhos!</strong> Mais motoristas
                                            = mais views = mais dinheiro no seu bolso.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">💰</span>
                                        <p className="text-neutral-300">
                                            <strong className="text-amber-400">100% pago pelo YouTube/Google!</strong> Nós não tocamos no seu dinheiro.
                                            O Google paga diretamente na sua conta via AdSense.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-black/30 rounded-lg text-center">
                                    <p className="text-xs text-neutral-400">
                                        🎯 Sua única tarefa: <strong className="text-white">postar vídeos e assistir vídeos de outros motoristas</strong>
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-500 text-center">
                                O YouTube paga diretamente via Google AdSense após aprovação no Programa de Parcerias.
                            </p>
                        </div>

                        {/* CTA - Invite More Drivers */}
                        <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0yNiAzNGgtMnYtNGgydjR6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
                            </div>

                            <div className="relative z-10">
                                <Users className="w-12 h-12 text-black/30 mx-auto mb-3" />
                                <h3 className="text-2xl font-black text-black mb-2">
                                    🚗 SOMOS MUITOS PELA CIDADE!
                                </h3>
                                <p className="text-amber-100 mb-6 max-w-md mx-auto">
                                    Quanto mais motoristas na comunidade, mais rápido todos alcançam as metas!
                                    <strong className="text-black"> Compartilhe com seus colegas de corrida.</strong>
                                </p>

                                <button
                                    onClick={handleCopyReferral}
                                    className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-neutral-900 transition-all shadow-lg inline-flex items-center gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Link Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            Copiar Meu Link de Convite
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-black/60 mt-4">
                                    Código: <span className="font-mono font-bold">{referralCode}</span>
                                </p>
                            </div>
                        </div>

                        {/* Subscription Info */}
                        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" />
                                Sobre a Assinatura
                            </h3>
                            <p className="text-neutral-400 leading-relaxed">
                                O valor da assinatura (<span className="text-white font-bold">R$ 25,90/mês</span>) é utilizado para:
                            </p>
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    Manter a plataforma funcionando 24/7
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span><strong className="text-amber-500">Parte do valor é reservada para os prêmios</strong> dos sorteios</span>
                                </li>
                                <li className="flex items-center gap-3 text-neutral-300">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    Garantir uma comunidade de qualidade e ativa
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* TAB: Prizes */}
                {activeTab === 'prizes' && (
                    <div className="space-y-6">
                        {/* Current Progress */}
                        <div className="bg-gradient-to-br from-amber-900/20 to-neutral-900 border border-amber-500/20 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <Trophy className="w-6 h-6 text-amber-500" />
                                    Progresso da Comunidade
                                </h3>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-amber-500">
                                        {loadingStats ? '...' : totalSubscribers.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-neutral-500">motoristas ativos</div>
                                </div>
                            </div>

                            <p className="text-neutral-400 text-sm mb-6">
                                Quanto mais motoristas entrarem, maiores os prêmios para todos!
                                <span className="text-amber-400 font-bold"> Convide seus colegas!</span>
                            </p>
                        </div>

                        {/* All Goals with Progress Bars */}
                        <div className="space-y-4">
                            {COMMUNITY_GOALS.map((goal, idx) => {
                                const progress = getGoalProgress(goal);
                                const isUnlocked = totalSubscribers >= goal.target;
                                const isNext = !isUnlocked && (idx === 0 || totalSubscribers >= COMMUNITY_GOALS[idx - 1].target);

                                return (
                                    <div
                                        key={idx}
                                        className={`p-6 rounded-2xl border transition-all ${isUnlocked
                                            ? 'bg-emerald-900/30 border-emerald-500/30'
                                            : isNext
                                                ? 'bg-neutral-900/80 border-neutral-700'
                                                : 'bg-neutral-900/40 border-neutral-800 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isUnlocked
                                                ? 'bg-emerald-500'
                                                : 'bg-neutral-800 border border-neutral-700'
                                                }`}>
                                                <goal.icon className={`w-7 h-7 ${isUnlocked ? 'text-black' : 'text-neutral-500'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-black text-white text-lg">{goal.prize}</h3>
                                                    {isUnlocked && (
                                                        <span className="px-2 py-0.5 bg-emerald-500 text-black text-xs font-bold rounded-full">
                                                            ATIVO
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-neutral-400 text-sm">{goal.description}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-2">
                                            <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500' : 'bg-gradient-to-r from-neutral-600 to-neutral-500'
                                                        }`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-500">
                                                {totalSubscribers.toLocaleString()} motoristas
                                            </span>
                                            <span className={`font-bold ${isUnlocked ? 'text-emerald-500' : 'text-neutral-400'}`}>
                                                {isUnlocked ? '100%' : `${progress.toFixed(0)}%`} da meta de {goal.target.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Invite CTA */}
                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-2xl text-center">
                            <Crown className="w-12 h-12 text-white/80 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-white mb-2">Ajude a Desbloquear os Prêmios!</h3>
                            <p className="text-emerald-100/80 text-sm mb-4 max-w-md mx-auto">
                                Convide outros motoristas e acelere o desbloqueio dos sorteios.
                                Quanto mais membros, maiores os prêmios para todos!
                            </p>
                            <button
                                onClick={handleCopyReferral}
                                className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-neutral-100 transition"
                            >
                                {copied ? 'Link Copiado! ✓' : 'Copiar Link de Convite'}
                            </button>
                        </div>

                        {/* How Prizes Work */}
                        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4">Como funcionam os sorteios?</h3>
                            <ul className="space-y-3 text-neutral-400 text-sm">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>Parte do valor das assinaturas é <strong className="text-white">reservada exclusivamente para os prêmios</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>Os sorteios são realizados entre os <strong className="text-white">membros ativos</strong> da plataforma</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>Quanto mais motoristas, <strong className="text-white">mais prêmios são desbloqueados</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 p-4 z-50">
                <div className="flex justify-around items-center max-w-lg mx-auto">
                    <NavButton icon={<LayoutDashboard className="w-6 h-6" />} label="Cockpit" active={true} onClick={() => navigate('/dashboard')} />
                    <NavButton icon={<TrendingUp className="w-6 h-6" />} label="Vídeos" active={false} onClick={() => navigate('/my-videos')} />
                    <NavButton icon={<Users className="w-6 h-6" />} label="Perfil" active={false} onClick={() => navigate('/profile')} />
                </div>
            </nav>

            {/* Botão de Ajuda Flutuante */}
            <button
                id="help-button"
                onClick={() => setShowFaq(true)}
                className="fixed bottom-24 right-4 w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all hover:scale-110"
            >
                <HelpCircle className="w-6 h-6" />
            </button>

            {/* TOUR CONTEXTUAL - Tooltips que apontam para seções */}
            {showTour && (
                <>
                    {/* Overlay escuro */}
                    <div className="fixed inset-0 bg-black/60 z-[90]" onClick={() => { }} />

                    {/* Highlight da seção atual */}
                    {TOUR_STEPS[tourStep].target && (
                        <style>{`
                            #${TOUR_STEPS[tourStep].target} {
                                position: relative;
                                z-index: 95;
                                box-shadow: 0 0 0 4px #10b981, 0 0 20px #10b98150;
                                border-radius: 16px;
                            }
                        `}</style>
                    )}

                    {/* Tooltip do Tour */}
                    <div
                        className={`fixed z-[100] w-80 bg-neutral-900 border-2 border-emerald-500 rounded-2xl p-5 shadow-2xl transform transition-all duration-300 ${TOUR_STEPS[tourStep].target ? '' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            }`}
                        style={TOUR_STEPS[tourStep].target ? {
                            top: TOUR_STEPS[tourStep].position === 'bottom' ? 'auto' :
                                TOUR_STEPS[tourStep].position === 'top' ? 'auto' : '50%',
                            bottom: TOUR_STEPS[tourStep].position === 'top' ? '100px' : 'auto',
                            left: TOUR_STEPS[tourStep].position === 'left' ? 'auto' : '50%',
                            right: TOUR_STEPS[tourStep].position === 'left' ? '80px' : 'auto',
                            transform: TOUR_STEPS[tourStep].position === 'left' ? 'translateY(-50%)' : 'translateX(-50%)',
                            marginTop: TOUR_STEPS[tourStep].position === 'bottom' ? '20px' : '0'
                        } : undefined}
                    >
                        {/* Indicador de passo */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-emerald-400 font-bold">
                                Passo {tourStep + 1} de {TOUR_STEPS.length}
                            </span>
                            <button
                                onClick={() => {
                                    setShowTour(false);
                                    localStorage.setItem('tourDismissed', 'true');
                                }}
                                className="text-neutral-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Conteúdo */}
                        <h3 className="text-lg font-bold text-white mb-2">{TOUR_STEPS[tourStep].title}</h3>
                        <p className="text-sm text-neutral-300 mb-4">{TOUR_STEPS[tourStep].content}</p>

                        {/* Progress bar */}
                        <div className="h-1 bg-neutral-800 rounded-full mb-4 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${((tourStep + 1) / TOUR_STEPS.length) * 100}%` }}
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex gap-2">
                            {tourStep > 0 && (
                                <button
                                    onClick={() => {
                                        setTourStep(tourStep - 1);
                                        const prevTarget = TOUR_STEPS[tourStep - 1].target;
                                        if (prevTarget) {
                                            document.getElementById(prevTarget)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                    className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium text-sm transition"
                                >
                                    ← Anterior
                                </button>
                            )}
                            {tourStep < TOUR_STEPS.length - 1 ? (
                                <button
                                    onClick={() => {
                                        setTourStep(tourStep + 1);
                                        const nextTarget = TOUR_STEPS[tourStep + 1].target;
                                        if (nextTarget) {
                                            setTimeout(() => {
                                                document.getElementById(nextTarget)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }, 100);
                                        }
                                    }}
                                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold text-sm transition"
                                >
                                    Próximo →
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowTour(false);
                                        localStorage.setItem('tourDismissed', 'true');
                                    }}
                                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold text-sm transition"
                                >
                                    Entendi! 🚀
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* FAQ MODAL */}
            {showFaq && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 w-full max-w-lg max-h-[80vh] rounded-2xl border border-neutral-700 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-emerald-500" />
                                Perguntas Frequentes
                            </h2>
                            <button
                                onClick={() => setShowFaq(false)}
                                className="p-2 hover:bg-neutral-800 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-neutral-400" />
                            </button>
                        </div>

                        {/* FAQ Items */}
                        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
                            {FAQ_ITEMS.map((item, index) => (
                                <div key={index} className="border border-neutral-800 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-800/50 transition"
                                    >
                                        <span className="font-medium text-white text-sm">{item.question}</span>
                                        <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`} />
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="px-4 pb-4">
                                            <p className="text-sm text-neutral-300 bg-neutral-800/50 p-3 rounded-lg">
                                                {item.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-neutral-800">
                            <button
                                onClick={() => setShowTour(true)}
                                className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl font-bold text-sm transition"
                            >
                                📖 Ver Tour Novamente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const NavButton = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 ${active ? 'text-emerald-500' : 'text-neutral-500 hover:text-white'}`}
    >
        {icon}
        <span className="text-[10px] font-bold mt-1">{label}</span>
        {active && <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1" />}
    </button>
);

export default Dashboard;
