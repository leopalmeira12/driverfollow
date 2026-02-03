import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Users, TrendingUp, Play, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Componente de Contador Regressivo
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const launchDate = new Date('2026-03-01T00:00:00');

        const updateTimer = () => {
            const now = new Date();
            const diff = launchDate - now;

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60)
                });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-10 p-6 bg-gradient-to-br from-emerald-900/30 to-neutral-900/80 border border-emerald-500/30 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Lançamento em</span>
            </div>

            <div className="flex gap-3">
                {[
                    { value: timeLeft.days, label: 'Dias' },
                    { value: timeLeft.hours, label: 'Horas' },
                    { value: timeLeft.minutes, label: 'Min' },
                    { value: timeLeft.seconds, label: 'Seg' }
                ].map((item, idx) => (
                    <div key={idx} className="flex-1 text-center">
                        <div className="bg-black/50 border border-emerald-500/20 rounded-xl py-3 px-2 mb-1">
                            <span className="text-2xl lg:text-3xl font-black text-white">
                                {String(item.value).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 uppercase">{item.label}</span>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-neutral-400 mt-4">
                🚀 1 de Março de 2026 - Prepare-se para decolar!
            </p>
        </div>
    );
};

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, setUser, setToken } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        { icon: TrendingUp, title: 'Ganhe Views Reais', desc: 'Até 5x o valor da assinatura em 30 dias' },
        { icon: Users, title: 'Comunidade Forte', desc: 'Motoristas unidos como os motoboys' },
        { icon: Shield, title: '100% Seguro', desc: 'Recomendações orgânicas, sem riscos' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Handle Google OAuth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userDataParam = urlParams.get('user');

        if (token && userDataParam) {
            try {
                const userData = JSON.parse(decodeURIComponent(userDataParam));
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setToken(token);
                setUser(userData);
                window.history.replaceState({}, document.title, '/login');
                navigate('/dashboard');
            } catch (e) {
                console.error('Erro ao processar login Google:', e);
            }
        }
    }, [navigate, setToken, setUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login(formData.email, formData.password);
            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.error || 'Credenciais incorretas.');
            }
        } catch (err) {
            setError('Erro de conexão. Servidor offline?');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);

        // Check if Google OAuth is configured
        try {
            const res = await fetch(`${API_URL}/api/auth/google/status`);
            const data = await res.json();

            if (data.configured) {
                window.location.href = `${API_URL}/api/auth/google`;
            } else {
                alert('⚠️ Login com Google ainda não configurado.\n\nPor favor, use email e senha por enquanto, ou peça ao administrador para configurar o Google OAuth.');
                setGoogleLoading(false);
            }
        } catch (err) {
            // If check fails, try anyway (old behavior)
            window.location.href = `${API_URL}/api/auth/google`;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">

            {/* LEFT PANEL - Visual Impact (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/20 via-transparent to-amber-900/10" />

                    {/* Animated Road Lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,50 Q25,30 50,50 T100,50" stroke="url(#roadGlow)" strokeWidth="0.5" fill="none" className="animate-pulse" />
                        <path d="M0,60 Q25,40 50,60 T100,60" stroke="url(#roadGlow)" strokeWidth="0.3" fill="none" className="animate-pulse delay-500" />
                        <path d="M0,70 Q25,50 50,70 T100,70" stroke="url(#roadGlow)" strokeWidth="0.2" fill="none" className="animate-pulse delay-1000" />
                    </svg>

                    {/* Floating Particles */}
                    <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-emerald-500 rounded-full animate-float opacity-60" />
                    <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 bg-amber-500 rounded-full animate-float-delayed opacity-40" />
                    <div className="absolute top-[40%] left-[20%] w-1 h-1 bg-emerald-400 rounded-full animate-float opacity-30" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 py-12">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tight">TubeDriver</span>
                        </div>
                        <p className="text-neutral-500 text-sm ml-[60px]">A comunidade que acelera seu canal</p>
                    </div>

                    {/* Hero Text */}
                    <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                        Seu canal no
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                            próximo nível
                        </span>
                    </h1>

                    <p className="text-neutral-400 text-lg mb-10 max-w-md leading-relaxed">
                        Junte-se a milhares de motoristas que estão crescendo juntos.
                        Assista, apoie e seja apoiado pela maior comunidade de criadores de conteúdo automotivo.
                    </p>

                    {/* Features Carousel */}
                    <div className="space-y-3">
                        {features.map((feat, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${activeFeature === idx
                                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                                    : 'bg-neutral-900/50 border border-transparent'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${activeFeature === idx
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-neutral-800 text-neutral-500'
                                    }`}>
                                    <feat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`font-bold transition-colors ${activeFeature === idx ? 'text-white' : 'text-neutral-400'
                                        }`}>{feat.title}</h3>
                                    <p className="text-neutral-500 text-sm">{feat.desc}</p>
                                </div>
                                {activeFeature === idx && (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto animate-scale-in" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CONTADOR REGRESSIVO - Lançamento 1 de Março */}
                    <CountdownTimer />

                    {/* Stats */}
                    <div className="flex gap-8 mt-8 pt-8 border-t border-neutral-800/50">
                        <div>
                            <div className="text-3xl font-black text-white">2.847</div>
                            <div className="text-neutral-500 text-sm">Pré-inscritos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-emerald-500">1 Mar</div>
                            <div className="text-neutral-500 text-sm">Lançamento</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-amber-500">🚀</div>
                            <div className="text-neutral-500 text-sm">Em breve!</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Login Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-black text-white">TubeDriver</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-black text-white mb-2">
                            Bem-vindo de volta! 👋
                        </h2>
                        <p className="text-neutral-500">Entre para continuar acelerando seu canal</p>
                    </div>

                    {/* GOOGLE LOGIN - Primary CTA */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full py-4 bg-white hover:bg-neutral-100 text-neutral-900 font-bold rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 group mb-6"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-900 rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="group-hover:translate-x-0.5 transition-transform">Continuar com Google</span>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-neutral-800 flex-1" />
                        <span className="text-xs text-neutral-600 uppercase tracking-widest font-medium">ou</span>
                        <div className="h-px bg-neutral-800 flex-1" />
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-neutral-400 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-lg px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-neutral-400 text-sm font-medium">Senha</label>
                                <a href="#" className="text-xs text-emerald-500 hover:text-emerald-400 transition">Esqueceu?</a>
                            </div>
                            <input
                                type="password"
                                className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-lg px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 p-4 rounded-lg border border-red-500/20">
                                <Zap className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Entrar <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-neutral-500 text-sm mt-8">
                        Novo por aqui?{' '}
                        <Link to="/register" className="text-emerald-500 hover:text-emerald-400 font-bold transition">
                            Criar conta grátis
                        </Link>
                    </p>

                    {/* Trust Badge */}
                    <div className="mt-8 pt-6 border-t border-neutral-800/50">
                        <div className="flex items-center justify-center gap-2 text-neutral-600 text-xs">
                            <Shield className="w-4 h-4" />
                            Seus dados estão seguros conosco
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(-10px) translateX(-5px); }
                    75% { transform: translateY(-25px) translateX(5px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-15px) translateX(-10px); }
                    50% { transform: translateY(-25px) translateX(5px); }
                    75% { transform: translateY(-10px) translateX(-5px); }
                }
                @keyframes scale-in {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; animation-delay: 1s; }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-1000 { animation-delay: 1s; }
            `}</style>
        </div>
    );
};

export default LoginPage;
