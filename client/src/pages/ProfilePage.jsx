import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, CreditCard, Award, Settings, ChevronRight, X, LayoutDashboard, TrendingUp, Users } from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeModal, setActiveModal] = useState(null);

    const handleLogout = () => {
        if (window.confirm("Deseja sair da plataforma?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans pb-32">
            <div className="container mx-auto px-6 pt-12 max-w-2xl">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center p-1 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-emerald-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-neutral-500 text-sm">{user?.email}</p>
                    <div className="mt-4 flex gap-2">
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
                            Motorista Bronze
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-neutral-900/50 p-4 rounded-3xl border border-neutral-800 text-center">
                        <div className="text-2xl font-bold text-emerald-500">{user?.credits || 0}</div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Créditos</div>
                    </div>
                    <div className="bg-neutral-900/50 p-4 rounded-3xl border border-neutral-800 text-center">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Ganhos USD</div>
                    </div>
                </div>

                {/* Menu */}
                <div className="space-y-3 mb-12">
                    <MenuItem icon={<Shield className="w-5 h-5 text-blue-400" />} label="Segurança & Conta" onClick={() => setActiveModal('security')} />
                    <MenuItem icon={<CreditCard className="w-5 h-5 text-emerald-400" />} label="Assinatura & Faturamento" onClick={() => setActiveModal('billing')} />
                    <MenuItem icon={<Award className="w-5 h-5 text-amber-400" />} label="Conquistas & Ranking" onClick={() => setActiveModal('achievements')} />
                    <MenuItem icon={<Settings className="w-5 h-5 text-neutral-400" />} label="Preferências" onClick={() => setActiveModal('settings')} />

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl hover:bg-red-900/30 transition text-red-400 font-bold"
                    >
                        <LogOut className="w-5 h-5" /> Sair do Cockpit
                    </button>
                </div>
            </div>

            {/* Modal Mock */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 w-full max-w-md rounded-3xl p-8 border border-neutral-800 relative">
                        <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-neutral-500"><X /></button>
                        <h2 className="text-xl font-bold mb-4 capitalize">{activeModal}</h2>
                        <p className="text-neutral-400 text-sm">Esta funcionalidade está em manutenção para melhorias no sistema de segurança.</p>
                        <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-neutral-800 rounded-xl mt-6 font-bold">Fechar</button>
                    </div>
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800 p-4 z-50">
                <div className="flex justify-around items-center max-w-lg mx-auto">
                    <NavButton icon={<LayoutDashboard className="w-6 h-6" />} label="Cockpit" active={false} onClick={() => navigate('/dashboard')} />
                    <NavButton icon={<TrendingUp className="w-6 h-6" />} label="Canais" active={false} onClick={() => navigate('/my-videos')} />
                    <NavButton icon={<Users className="w-6 h-6" />} label="Perfil" active={true} onClick={() => navigate('/profile')} />
                </div>
            </nav>
        </div>
    );
};

const MenuItem = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition"
    >
        <div className="flex items-center gap-4">
            <div className="p-2 bg-black rounded-lg">{icon}</div>
            <span className="text-sm font-semibold text-neutral-300">{label}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-600" />
    </button>
);

const NavButton = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 ${active ? 'text-emerald-400' : 'text-neutral-500 hover:text-white'}`}
    >
        {icon}
        <span className="text-[10px] font-bold mt-1">{label}</span>
        {active && <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1"></div>}
    </button>
);

export default ProfilePage;
