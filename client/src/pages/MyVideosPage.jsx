import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, AlertCircle, X, Check, Eye, LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyVideosPage = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Add Video Form State
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchMyVideos();
    }, []);

    const fetchMyVideos = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/videos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setVideos(data);
            }
        } catch (err) {
            console.error('Failed to fetch videos');
        }
        setLoading(false);
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url: newVideoUrl, title: newVideoTitle })
            });

            const data = await res.json();
            if (res.ok) {
                setVideos([data.video || data, ...videos]);
                setIsModalOpen(false);
                setNewVideoUrl('');
                setNewVideoTitle('');
                refreshUser();
                alert("Vídeo adicionado com sucesso!");
            } else {
                alert(data.error || "Erro ao adicionar vídeo");
            }
        } catch (err) {
            alert("Erro de conexão");
        }
        setIsAdding(false);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans pb-32">
            <header className="bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 p-6 sticky top-0 z-40">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Meus Vídeos</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-5 h-5" /> Novo Canal/Vídeo
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-neutral-800" />
                        <p className="text-neutral-500">Você ainda não tem vídeos sendo impulsionados.</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 text-emerald-400 font-bold hover:underline">Começar Agora</button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {videos.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => {
                                    const id = video.youtubeId || video.youtubeVideoId;
                                    if (id) window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
                                    else alert("Link do YouTube não encontrado para este vídeo.");
                                }}
                                className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden group hover:border-emerald-500/50 transition cursor-pointer active:scale-[0.98] shadow-lg"
                            >
                                <div className="aspect-video bg-black relative">
                                    <img
                                        src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId || video.youtubeVideoId}/hqdefault.jpg`}
                                        alt=""
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-emerald-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">ATIVO</div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition">{video.title}</h3>
                                    <div className="flex justify-between items-center text-xs text-neutral-500">
                                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {video.viewsCount || 0} views</span>
                                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> {video.targetViews || 100} meta</span>
                                    </div>
                                    <div className="mt-4 w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                                        <div className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981]" style={{ width: `${Math.min(100, ((video.viewsCount || 0) / (video.targetViews || 100)) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 w-full max-w-md rounded-3xl p-8 border border-neutral-800 relative shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-neutral-500 hover:text-white"><X /></button>
                        <h2 className="text-2xl font-bold mb-6">Impulsionar</h2>
                        <form onSubmit={handleAddVideo} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Link do Vídeo ou Canal</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 transition"
                                    placeholder="https://youtube.com/..."
                                    value={newVideoUrl}
                                    onChange={e => setNewVideoUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Título de Referência</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 transition"
                                    placeholder="Ex: Meu novo vídeo de chuva"
                                    value={newVideoTitle}
                                    onChange={e => setNewVideoTitle(e.target.value)}
                                />
                            </div>
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <p className="text-xs text-emerald-400"><strong>Custo:</strong> 5 Créditos para entrar na fila de recomendação global.</p>
                            </div>
                            <button
                                disabled={isAdding}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl mt-4 transition flex items-center justify-center gap-2"
                            >
                                {isAdding ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Confirmar e Iniciar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800 p-4 z-50">
                <div className="flex justify-around items-center max-w-lg mx-auto">
                    <NavButton icon={<LayoutDashboard className="w-6 h-6" />} label="Cockpit" active={false} onClick={() => navigate('/dashboard')} />
                    <NavButton icon={<TrendingUp className="w-6 h-6" />} label="Canais" active={true} onClick={() => navigate('/my-videos')} />
                    <NavButton icon={<Users className="w-6 h-6" />} label="Perfil" active={false} onClick={() => navigate('/profile')} />
                </div>
            </nav>
        </div>
    );
};

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

export default MyVideosPage;
