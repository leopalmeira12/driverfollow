import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, CheckCircle, Gift, Users, Zap, Play, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, setUser, setToken } = useAuth();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', referralCode: '' });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get referral code from URL if present
    useEffect(() => {
        const refCode = searchParams.get('ref');
        if (refCode) {
            setFormData(prev => ({ ...prev, referralCode: refCode }));
        }
    }, [searchParams]);

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
                window.history.replaceState({}, document.title, '/register');
                navigate('/dashboard');
            } catch (e) {
                console.error('Erro ao processar login Google:', e);
            }
        }
    }, [navigate, setToken, setUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await register(formData);

        if (res.success) {
            // Go directly to dashboard - no payment required for initial signup
            navigate('/dashboard');
        } else {
            setError(res.error || 'Erro ao criar conta.');
        }
        setLoading(false);
    };

    const handleGoogleRegister = async () => {
        setGoogleLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/google/status`);
            const data = await res.json();

            if (data.configured) {
                window.location.href = `${API_URL}/api/auth/google`;
            } else {
                alert('⚠️ Cadastro com Google ainda não configurado.\n\nPor favor, use email e senha por enquanto.');
                setGoogleLoading(false);
            }
        } catch (err) {
            window.location.href = `${API_URL}/api/auth/google`;
        }
    };

    const benefits = [
        { icon: Zap, text: 'Acesso imediato ao dashboard' },
        { icon: Users, text: 'Entre na comunidade de motoristas' },
        { icon: Gift, text: 'Ganhe 10 créditos de boas-vindas' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            {/* Left Panel - Benefits (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-emerald-900/20 to-neutral-950">
                <div className="relative z-10 flex flex-col justify-center px-12 py-12">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tight">TubeDrivers</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-white leading-tight mb-6">
                        Comece sua jornada
                        <br />
                        <span className="text-emerald-500">100% Grátis</span>
                    </h1>

                    <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
                        Crie sua conta agora e ganhe acesso imediato à maior comunidade
                        de motoristas criadores de conteúdo do Brasil.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4 mb-10">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                    <benefit.icon className="w-5 h-5 text-emerald-500" />
                                </div>
                                <span className="text-white font-medium">{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badge */}
                    <div className="flex items-center gap-3 text-neutral-500 text-sm">
                        <Shield className="w-4 h-4" />
                        Cadastro seguro • Sem cartão de crédito
                    </div>
                </div>

                {/* Background Effects */}
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-black text-white">TubeDrivers</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-black text-white mb-2">
                            Criar Conta Grátis 🚀
                        </h2>
                        <p className="text-neutral-500">Preencha seus dados para começar</p>
                    </div>

                    {/* Google Register */}
                    <button
                        onClick={handleGoogleRegister}
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
                                <span className="group-hover:translate-x-0.5 transition-transform">Cadastrar com Google</span>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-neutral-800 flex-1" />
                        <span className="text-xs text-neutral-600 uppercase tracking-widest font-medium">ou</span>
                        <div className="h-px bg-neutral-800 flex-1" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-neutral-400 text-sm font-medium mb-2">Nome</label>
                            <input
                                type="text"
                                className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-lg px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                                placeholder="Seu nome completo"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

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
                            <label className="block text-neutral-400 text-sm font-medium mb-2">Senha</label>
                            <input
                                type="password"
                                className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-lg px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Referral Code (optional) */}
                        {formData.referralCode && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                                <Gift className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-emerald-400">
                                    Indicado por: <strong>{formData.referralCode}</strong>
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 p-4 rounded-lg border border-red-500/20">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Criar Minha Conta <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-neutral-500 text-sm mt-8">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-bold transition">
                            Fazer Login
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-center text-neutral-600 text-xs mt-6">
                        Ao criar sua conta, você concorda com nossos{' '}
                        <a href="#" className="text-neutral-500 hover:text-white transition">Termos de Uso</a>
                        {' '}e{' '}
                        <a href="#" className="text-neutral-500 hover:text-white transition">Política de Privacidade</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
