import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', channelId: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await register(formData);

        if (res.success) {
            navigate('/payment');
        } else {
            setError(res.error || 'Erro ao criar conta.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-neutral-900 rounded-3xl border border-neutral-800 p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Junte-se ao Time</h1>
                    <p className="text-neutral-400 text-sm">Crie sua conta e comece a monetizar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-neutral-500 font-bold mb-2">Nome Completo</label>
                        <input
                            type="text"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                            placeholder="Ex: João da Silva"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-neutral-500 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-neutral-500 font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                            placeholder="******"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-neutral-500 font-bold mb-2">ID do Canal (Opcional agora)</label>
                        <input
                            type="text"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                            placeholder="Ex: UC123..."
                            value={formData.channelId}
                            onChange={e => setFormData({ ...formData, channelId: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg transition-colors border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 mt-6 disabled:opacity-50"
                    >
                        {loading ? 'Validando...' : 'Ir para Reserva (Pagamento)'}
                    </button>
                </form>

                <p className="text-center text-neutral-500 text-sm mt-6">
                    Já tem conta? <Link to="/login" className="text-emerald-500 hover:underline">Fazer Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
