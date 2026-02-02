import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleGoogleLogin = () => {
        // Mock Google Login for visual demo
        // In production: this would trigger Firebase Auth or Passport JS
        setLoading(true);
        setTimeout(() => {
            alert("Google Login requer configuração de API Key. Usando modo simulação.");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">

            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-neutral-950 z-0">
                {/* Traffic Lights Blur Effect */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[150px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] opacity-60"></div>
            </div>

            <div className="w-full max-w-md backdrop-blur-xl bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative z-10 transition-all hover:border-neutral-700">

                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">TubeDrivers</h1>
                    <p className="text-neutral-400">O combustível digital do seu canal.</p>
                </div>

                {/* GOOGLE BUTTON - TOP PRIORITY */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 bg-white text-gray-900 font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-6 group"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    <span className="group-hover:translate-x-1 transition-transform">Continuar com Google</span>
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-neutral-800 flex-1"></div>
                    <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">ou use seu email</span>
                    <div className="h-px bg-neutral-800 flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="group">
                        <input
                            type="email"
                            className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                            placeholder="Email cadastrado"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="group">
                        <input
                            type="password"
                            className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                            placeholder="Sua senha secreta"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <div className="text-right mt-2">
                            <a href="#" className="text-xs text-neutral-500 hover:text-emerald-400 transition">Esqueceu a senha?</a>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 p-4 rounded-xl border border-red-500/20 animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg transition-all border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? 'Acelerando...' : (
                            <>
                                Entrar Agora <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-neutral-500 text-sm mt-8">
                    Novo na estrada? <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold transition ml-1">Criar conta grátis</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
