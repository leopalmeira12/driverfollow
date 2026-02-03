import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut, User, Shield, CreditCard, Award, Settings, ChevronRight, X,
    LayoutDashboard, TrendingUp, Users, Copy, CheckCircle, Gift,
    Star, Target, Zap, Crown, Share2, Youtube, DollarSign
} from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeModal, setActiveModal] = useState(null);
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({
        missionsCompleted: 0,
        referrals: 0
    });

    const referralCode = user?.referralCode || 'TD' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const referralLink = `https://tubedrivers.com/convite/${referralCode}`;

    useEffect(() => {
        // Load stats from localStorage
        const completed = JSON.parse(localStorage.getItem('completedMissions') || '[]');
        setStats({
            missionsCompleted: completed.length,
            referrals: 0 // Would come from API
        });
    }, []);

    const handleCopyReferral = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        if (window.confirm("Deseja sair da plataforma?")) {
            logout();
            navigate('/login');
        }
    };

    // Calculate user level based on missions completed
    const getLevel = () => {
        if (stats.missionsCompleted >= 100) return { name: 'Diamante', color: 'sky', icon: Crown };
        if (stats.missionsCompleted >= 50) return { name: 'Ouro', color: 'amber', icon: Star };
        if (stats.missionsCompleted >= 20) return { name: 'Prata', color: 'neutral', icon: Award };
        return { name: 'Bronze', color: 'orange', icon: Target };
    };

    const level = getLevel();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-32">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 pt-8 max-w-2xl relative z-10">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-white" />
                        )}
                    </div>
                    <h2 className="text-2xl font-black">{user?.name || 'Motorista'}</h2>
                    <p className="text-neutral-500 text-sm">{user?.email}</p>
                    <div className="mt-3 flex items-center gap-2">
                        <div className={`px-3 py-1.5 bg-${level.color}-500/10 border border-${level.color}-500/20 rounded-full flex items-center gap-2`}>
                            <level.icon className={`w-4 h-4 text-${level.color}-500`} />
                            <span className={`text-xs font-bold text-${level.color}-500`}>Motorista {level.name}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 text-center">
                        <div className="text-2xl font-black text-emerald-500">{stats.missionsCompleted}</div>
                        <div className="text-xs text-neutral-500">Vídeos Assistidos</div>
                    </div>
                    <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 text-center">
                        <div className="text-2xl font-black text-amber-500">{stats.referrals}</div>
                        <div className="text-xs text-neutral-500">Indicados</div>
                    </div>
                </div>

                {/* YouTube Earnings Info */}
                <div className="bg-gradient-to-br from-red-900/20 to-neutral-900 border border-red-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                            <Youtube className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Seus Ganhos</h3>
                            <p className="text-sm text-red-400">Direto do YouTube</p>
                        </div>
                    </div>

                    <p className="text-neutral-400 text-sm mb-4">
                        O YouTube paga <strong className="text-white">diretamente para você</strong> através do
                        AdSense, por cada 1.000 visualizações nos seus vídeos.
                    </p>

                    <div className="bg-neutral-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-neutral-400 text-sm">Por 100.000 views</span>
                            <span className="text-emerald-500 font-bold">R$ 600 - R$ 2.500</span>
                        </div>
                        <div className="text-xs text-neutral-600">
                            * Valores aproximados, variam por nicho
                        </div>
                    </div>
                </div>

                {/* COMO CRIAR SEUS VÍDEOS - TUTORIAL */}
                <div className="bg-gradient-to-br from-amber-900/20 to-neutral-900 border border-amber-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🎬</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Como Criar Seus Vídeos</h3>
                            <p className="text-sm text-amber-400">Super fácil e rápido!</p>
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
                        <div className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded">
                            EXEMPLO DE VÍDEO
                        </div>
                    </div>

                    {/* Passo a Passo */}
                    <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
                        <h4 className="text-sm font-bold text-white mb-3">📱 Passo a Passo:</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">1</div>
                                <p className="text-neutral-300">
                                    <strong className="text-white">Apoie seu celular no painel</strong> virado para a estrada
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
                                <p className="text-neutral-300">
                                    <strong className="text-white">Grave por 40-50 minutos</strong> enquanto dirige
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
                                <p className="text-neutral-300">
                                    <strong className="text-white">Poste no YouTube</strong> com título simples (ex: "Viagem BR-101")
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">4</div>
                                <p className="text-neutral-300">
                                    <strong className="text-white">Copie o link</strong> e adicione aqui na plataforma
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dica */}
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                            <span className="text-lg">💡</span>
                            <div>
                                <p className="text-sm text-emerald-400 font-bold mb-1">Dica de Ouro:</p>
                                <p className="text-xs text-neutral-300">
                                    Vídeos de <strong className="text-white">30-50 minutos</strong> te ajudam a monetizar em <strong className="text-emerald-400">5-7 dias</strong> com a comunidade!
                                    Poste 1 vídeo a cada 2 dias para resultados ainda mais rápidos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AVISO IMPORTANTE - VÍDEOS ORIGINAIS */}
                    <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 mt-4">
                        <div className="flex items-start gap-2">
                            <span className="text-lg">⚠️</span>
                            <div>
                                <p className="text-sm text-red-400 font-bold mb-1">IMPORTANTE:</p>
                                <p className="text-xs text-neutral-300">
                                    Todos os vídeos devem ser <strong className="text-white">100% ORIGINAIS e gravados por você</strong>.
                                    Nunca poste vídeos repetidos ou de outras pessoas.
                                    O YouTube pode <strong className="text-red-400">banir seu canal</strong> por violação de direitos autorais!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referral Card */}
                <div className="bg-gradient-to-br from-emerald-900/30 to-neutral-900 border border-emerald-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <Gift className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Convide Motoristas!</h3>
                            <p className="text-sm text-emerald-400">Desbloqueie mais prêmios</p>
                        </div>
                    </div>

                    <p className="text-neutral-400 text-sm mb-4">
                        Quanto mais motoristas na comunidade, mais views para todos e maiores os prêmios nos sorteios!
                    </p>

                    {/* Referral Code Display */}
                    <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
                        <div className="text-xs text-neutral-500 mb-1">Seu código de indicação</div>
                        <div className="text-2xl font-mono font-black text-white">{referralCode}</div>
                    </div>

                    {/* Copy Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCopyReferral}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${copied
                                ? 'bg-emerald-500 text-black'
                                : 'bg-neutral-800 text-white hover:bg-neutral-700'
                                }`}
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
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'TubeDrivers - Comunidade de Motoristas',
                                        text: 'Entre na maior comunidade de motoristas criadores de conteúdo!',
                                        url: referralLink
                                    });
                                } else {
                                    handleCopyReferral();
                                }
                            }}
                            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Progress to Next Level */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <span className="font-bold text-white">Próximo Nível</span>
                        </div>
                        <span className="text-sm text-neutral-500">
                            {stats.missionsCompleted} / 20 vídeos
                        </span>
                    </div>
                    <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((stats.missionsCompleted / 20) * 100, 100)}%` }}
                        />
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                        Assista mais {Math.max(20 - stats.missionsCompleted, 0)} vídeos para subir de nível!
                    </p>
                </div>

                {/* Menu */}
                <div className="space-y-3 mb-12">
                    <MenuItem icon={<Shield className="w-5 h-5 text-blue-400" />} label="Segurança & Conta" onClick={() => setActiveModal('security')} />
                    <MenuItem icon={<CreditCard className="w-5 h-5 text-emerald-400" />} label="Assinatura & Planos" onClick={() => setActiveModal('billing')} />
                    <MenuItem icon={<Award className="w-5 h-5 text-amber-400" />} label="Conquistas & Ranking" onClick={() => setActiveModal('achievements')} />
                    <MenuItem icon={<Settings className="w-5 h-5 text-neutral-400" />} label="Preferências" onClick={() => setActiveModal('settings')} />

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 bg-red-950/20 border border-red-500/20 rounded-xl hover:bg-red-900/30 transition text-red-400 font-bold"
                    >
                        <LogOut className="w-5 h-5" /> Sair da Conta
                    </button>
                </div>
            </div>

            {/* Modal */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 w-full max-w-md rounded-2xl p-8 border border-neutral-800 relative">
                        <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-neutral-500 hover:text-white transition">
                            <X />
                        </button>
                        <h2 className="text-xl font-bold mb-4 capitalize">{activeModal}</h2>
                        <p className="text-neutral-400 text-sm">
                            Esta funcionalidade estará disponível em breve. Estamos trabalhando para melhorar sua experiência!
                        </p>
                        <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl mt-6 font-bold transition">
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 p-4 z-50">
                <div className="flex justify-around items-center max-w-lg mx-auto">
                    <NavButton icon={<LayoutDashboard className="w-6 h-6" />} label="Cockpit" active={false} onClick={() => navigate('/dashboard')} />
                    <NavButton icon={<TrendingUp className="w-6 h-6" />} label="Vídeos" active={false} onClick={() => navigate('/my-videos')} />
                    <NavButton icon={<Users className="w-6 h-6" />} label="Perfil" active={true} onClick={() => navigate('/profile')} />
                </div>
            </nav>
        </div>
    );
};

const MenuItem = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition"
    >
        <div className="flex items-center gap-4">
            <div className="p-2 bg-neutral-800 rounded-lg">{icon}</div>
            <span className="text-sm font-medium text-neutral-300">{label}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-600" />
    </button>
);

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

export default ProfilePage;
