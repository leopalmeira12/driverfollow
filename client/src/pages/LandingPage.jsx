import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Play, ChevronRight, Video, TrendingUp, DollarSign, MapPin, MicOff,
    Gift, Trophy, Car, Phone, Shield, Users, Heart, Star, Zap, CheckCircle,
    ArrowRight, Sparkles, Target, Youtube
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LandingPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [totalSubscribers, setTotalSubscribers] = useState(0);

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
                console.log('Stats fetch error');
            }
        };
        fetchStats();
    }, []);

    // Auto-advance steps for animation
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">

            {/* Navigation */}
            <nav className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-white">TubeDrivers</span>
                            <p className="text-[9px] text-emerald-500 font-medium">Comunidade de Motoristas</p>
                        </div>
                    </div>

                    <Link to="/login" className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition">
                        <span className="text-sm font-bold text-white">Entrar</span>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge - Real Stats */}
                        {totalSubscribers > 0 && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                                <Users className="w-4 h-4 text-emerald-500" />
                                <span className="text-emerald-400 text-sm font-bold">
                                    {totalSubscribers.toLocaleString()} motoristas já estão crescendo!
                                </span>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                            Ganhe Dinheiro com
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                                Seu Canal no YouTube
                            </span>
                        </h1>

                        <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Junte-se à comunidade onde motoristas se ajudam a crescer.
                            <strong className="text-white"> Você assiste, é assistido, todos lucram.</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                to="/register"
                                className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                            >
                                Começar Agora - R$ 25,90/mês
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white text-lg font-bold rounded-xl transition-all border border-neutral-700"
                            >
                                Já sou membro
                            </Link>
                        </div>

                        <p className="text-sm text-neutral-500">
                            ✓ Cancele quando quiser · ✓ Parte do valor vai para os prêmios
                        </p>
                    </div>
                </div>
            </header>

            {/* Community Progress Bar */}
            <div className="bg-neutral-900 py-8 border-y border-neutral-800">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-emerald-500" />
                                <span className="font-bold text-white">Progresso da Comunidade</span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-emerald-500">{totalSubscribers.toLocaleString()}</span>
                                <span className="text-neutral-500 text-sm ml-2">motoristas</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-4 bg-neutral-800 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min((totalSubscribers / 1000) * 100, 100)}%` }}
                            />
                        </div>

                        {/* Milestones */}
                        <div className="flex justify-between text-xs">
                            <div className={`flex items-center gap-1 ${totalSubscribers >= 1000 ? 'text-emerald-500' : 'text-neutral-500'}`}>
                                <Phone className="w-3 h-3" />
                                1k - 3 Phones/semana
                            </div>
                            <div className={`flex items-center gap-1 ${totalSubscribers >= 5000 ? 'text-emerald-500' : 'text-neutral-500'}`}>
                                <Shield className="w-3 h-3" />
                                5k - Seguros semanais
                            </div>
                            <div className={`flex items-center gap-1 ${totalSubscribers >= 10000 ? 'text-emerald-500' : 'text-neutral-500'}`}>
                                <Car className="w-3 h-3" />
                                10k - Carro 0km/mês
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <section className="py-20 bg-neutral-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">
                            Como Você
                            <span className="text-emerald-500"> Ganha Dinheiro</span>
                        </h2>
                        <p className="text-neutral-400 text-lg">Sistema simples e transparente</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                step: 1,
                                emoji: '👀',
                                title: 'Assista Vídeos',
                                desc: 'Assista vídeos de outros motoristas da comunidade',
                            },
                            {
                                step: 2,
                                emoji: '📺',
                                title: 'Receba Views',
                                desc: 'Outros motoristas assistem os seus vídeos',
                            },
                            {
                                step: 3,
                                emoji: '💵',
                                title: 'YouTube Paga',
                                desc: 'O YouTube paga por cada 1.000 visualizações!',
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="relative p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-emerald-500/30 transition-all"
                            >
                                <div className="text-5xl mb-4">{item.emoji}</div>
                                <div className="text-xs text-emerald-500 font-bold mb-2">PASSO {item.step}</div>
                                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                                <p className="text-neutral-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* YouTube Earnings - Main Value Proposition */}
            <section className="py-20 bg-neutral-900">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                                <Youtube className="w-5 h-5 text-red-500" />
                                <span className="text-red-400 font-bold">MONETIZAÇÃO YOUTUBE</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4">
                                Quanto Você Pode
                                <span className="text-emerald-500"> Ganhar?</span>
                            </h2>
                        </div>

                        {/* Community Power Example with Conservative Calculations */}
                        <div className="bg-gradient-to-br from-emerald-900/40 to-neutral-900 border border-emerald-500/30 rounded-2xl p-8 mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">O Poder da Comunidade</h3>
                                    <p className="text-emerald-400">Cálculo conservador com 1.000 motoristas</p>
                                </div>
                            </div>

                            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
                                Com <span className="text-emerald-500 font-bold">1.000 motoristas</span> na plataforma,
                                se cada um fizer sua parte assistindo vídeos dos colegas:
                            </p>

                            {/* Time Estimates */}
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-white mb-1">1.000 views</div>
                                    <div className="text-emerald-400 font-bold">~1 dia</div>
                                    <div className="text-sm text-amber-500 mt-2">R$ 6 - R$ 25</div>
                                </div>
                                <div className="bg-neutral-800/50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-white mb-1">10.000 views</div>
                                    <div className="text-emerald-400 font-bold">~10 dias</div>
                                    <div className="text-sm text-amber-500 mt-2">R$ 60 - R$ 250</div>
                                </div>
                                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-white mb-1">100.000 views</div>
                                    <div className="text-emerald-400 font-bold text-lg">~1 mês</div>
                                    <div className="text-lg text-emerald-500 mt-2 font-bold">R$ 600 - R$ 2.500</div>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-500 text-center italic">
                                * Cálculo conservador considerando que cada motorista assista em média 3-5 vídeos por dia.
                            </p>
                        </div>

                        {/* YouTube Monetization Requirements */}
                        <div className="bg-gradient-to-br from-red-900/20 to-neutral-900 border border-red-500/20 rounded-2xl p-8 mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center">
                                    <Youtube className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">Primeiro Passo: Monetizar seu Canal</h3>
                                    <p className="text-red-400">Requisitos do YouTube Partner Program</p>
                                </div>
                            </div>

                            <p className="text-neutral-400 leading-relaxed mb-6">
                                Para receber pagamentos do YouTube, seu canal precisa ser aprovado no <strong className="text-white">Programa de Parcerias</strong>:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-neutral-800/50 rounded-xl p-5 text-center">
                                    <div className="text-4xl font-black text-red-500 mb-1">1.000</div>
                                    <div className="text-neutral-400">Inscritos no canal</div>
                                </div>
                                <div className="bg-neutral-800/50 rounded-xl p-5 text-center">
                                    <div className="text-4xl font-black text-red-500 mb-1">4.000h</div>
                                    <div className="text-neutral-400">Horas de visualização (12 meses)</div>
                                </div>
                            </div>

                            <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white font-bold mb-1">Com a TubeDrivers, isso fica MUITO mais fácil!</p>
                                        <p className="text-neutral-400">
                                            Ao invés de esperar meses para crescer sozinho, nossa comunidade acelera seu canal.
                                            Views reais de motoristas reais! Por isso pedimos que compartilhe com o máximo
                                            de motoristas possível - <strong className="text-amber-400">SOMOS MUITOS PELA CIDADE!</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-neutral-500">
                            Depois de aprovado, o YouTube paga diretamente na sua conta através do Google AdSense.
                        </p>
                    </div>
                </div>
            </section>

            {/* Prize System */}
            <section className="py-20 bg-neutral-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                            <Gift className="w-5 h-5 text-amber-500" />
                            <span className="text-amber-400 font-bold">SORTEIOS</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-4">
                            Prêmios para a
                            <span className="text-amber-500"> Comunidade!</span>
                        </h2>
                        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                            Parte do valor das assinaturas é <strong className="text-white">reservada para os sorteios</strong>.
                            Quanto mais motoristas, maiores os prêmios!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                target: 1000,
                                prize: '3 Smartphones',
                                frequency: 'por semana',
                                icon: Phone,
                                color: 'emerald',
                                current: totalSubscribers,
                            },
                            {
                                target: 5000,
                                prize: 'Seguros Veiculares',
                                frequency: 'semanais (1 ano)',
                                icon: Shield,
                                color: 'amber',
                                current: totalSubscribers,
                            },
                            {
                                target: 10000,
                                prize: 'Carro 0km',
                                frequency: 'todo mês',
                                icon: Car,
                                color: 'rose',
                                current: totalSubscribers,
                            },
                        ].map((goal, idx) => {
                            const progress = Math.min((goal.current / goal.target) * 100, 100);
                            const isUnlocked = goal.current >= goal.target;

                            return (
                                <div
                                    key={idx}
                                    className={`relative p-6 rounded-2xl border overflow-hidden ${isUnlocked
                                        ? 'bg-emerald-900/30 border-emerald-500/30'
                                        : 'bg-neutral-900/80 border-neutral-800'
                                        }`}
                                >
                                    <div className={`w-14 h-14 bg-${goal.color}-500/20 rounded-2xl flex items-center justify-center mb-4`}>
                                        <goal.icon className={`w-7 h-7 text-${goal.color}-500`} />
                                    </div>

                                    <div className="text-xs text-neutral-500 mb-1">
                                        Meta: {goal.target.toLocaleString()} motoristas
                                    </div>
                                    <h3 className="text-xl font-black text-white">{goal.prize}</h3>
                                    <p className={`text-${goal.color}-500 font-bold text-sm mb-4`}>{goal.frequency}</p>

                                    {/* Progress Bar */}
                                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-2">
                                        <div
                                            className={`h-full bg-${goal.color}-500 rounded-full transition-all`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>{goal.current.toLocaleString()}</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>

                                    {isUnlocked && (
                                        <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                                            ATIVO
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Ghost Driver Strategy */}
            <section className="py-20 bg-neutral-900">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded-full mb-6">
                                <Video className="w-4 h-4 text-emerald-500" />
                                <span className="text-emerald-400 text-sm font-bold">ESTRATÉGIA GHOST DRIVER</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black mb-6">
                                Você Dirige.
                                <br />
                                <span className="text-emerald-500">A Câmera Trabalha.</span>
                            </h2>

                            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                                Esqueça dancinhas e roteiros! O nicho de
                                <strong className="text-white"> "Dashcam" (Câmera no Painel) </strong>
                                explode no mundo todo. Pessoas relaxam vendo trânsito, chuva e estrada.
                                Você já faz isso todo dia!
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: MapPin, text: 'Filme apenas o trajeto e a rua' },
                                    { icon: MicOff, text: 'Sem falar, sem roteiro, sem aparecer' },
                                    { icon: DollarSign, text: 'YouTube paga em dólar por views' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                                        <item.icon className="w-6 h-6 text-emerald-500" />
                                        <span className="text-white font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            {/* Phone Mockup */}
                            <div className="bg-neutral-800 rounded-3xl p-3 max-w-[280px] mx-auto border border-neutral-700 shadow-2xl">
                                <div className="bg-neutral-900 rounded-2xl aspect-[9/16] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/50 via-neutral-800 to-neutral-900" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-32 bg-neutral-700/50" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />

                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-xs text-white font-mono">REC</span>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 rounded-xl p-3 backdrop-blur-sm">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white font-bold">12.4K views</span>
                                            <span className="text-emerald-400">+R$ 74,40</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-4 -right-4 bg-emerald-500 text-black font-bold px-4 py-2 rounded-full text-sm shadow-lg animate-bounce">
                                100% Passivo! 💰
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription Info */}
            <section className="py-16 bg-neutral-950">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                        <h3 className="text-xl font-black text-white mb-6 text-center">Sobre a Assinatura</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-3xl font-black text-emerald-500 mb-2">R$ 25,90</div>
                                <div className="text-neutral-400">por mês</div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    'Acesso ilimitado à plataforma',
                                    'Participe de todos os sorteios',
                                    'Parte do valor vai para os prêmios',
                                    'Cancele quando quiser',
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-neutral-300">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-b from-neutral-900 to-black">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        Pronto para Lucrar?
                    </h2>
                    <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
                        Junte-se a motoristas que estão transformando suas viagens em dinheiro.
                    </p>

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-emerald-600/20"
                    >
                        Entrar na Comunidade
                        <ArrowRight className="w-6 h-6" />
                    </Link>

                    <p className="text-sm text-neutral-600 mt-6">
                        R$ 25,90/mês • Cancele quando quiser
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-black border-t border-neutral-900">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Play className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                            <span className="font-bold text-white">TubeDrivers</span>
                        </div>
                        <p className="text-neutral-600 text-sm">
                            © 2026 TubeDrivers. Comunidade de motoristas criadores de conteúdo.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
