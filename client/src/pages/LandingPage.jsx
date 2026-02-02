import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Camera, ChevronRight, Video, MicOff, TrendingUp, DollarSign, MapPin } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">


            <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">

                    {/* Logo Bigger & Cleaner */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <img src="/logo.png" alt="TD" className="w-10 h-10 object-contain relative z-10" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-2xl font-bold tracking-tighter text-white leading-none">TubeDrivers</span>
                            <span className="text-[9px] text-emerald-500 font-mono tracking-[0.3em] uppercase opacity-80 group-hover:tracking-[0.5em] transition-all duration-500">Official</span>
                        </div>
                    </div>

                    {/* Login Button Professional */}
                    <Link to="/login" className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all group">
                        <span className="text-xs font-bold text-neutral-300 group-hover:text-white uppercase tracking-wider">Área do Membro</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    </Link>

                    {/* Mobile Login Icon */}
                    <Link to="/login" className="md:hidden p-2 text-white border border-white/10 rounded-lg bg-white/5">
                        <span className="sr-only">Login</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-12 pb-20 md:pt-24 md:pb-32 flex flex-col items-center justify-center min-h-[70vh]">
                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none animate-pulse-slow"></div>

                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">

                    <div className="inline-flex items-center gap-2 mb-6 animate-bounce-slow">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Últimas Vagas para Lote 1</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight leading-tight">
                        Não dirija de graça.
                    </h1>
                    <p className="text-xl md:text-3xl font-light text-neutral-400 mb-10">
                        Fature com cada quilômetro rodado.
                    </p>

                    {/* THE CLOCK */}
                    <div className="mb-12">
                        <CountdownTimer targetDate="2026-03-01T00:00:00" />
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full px-4">
                        <Link to="/register" className="w-full md:w-auto group relative px-8 md:px-12 py-5 bg-white text-black text-lg md:text-xl font-bold rounded-full transition transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 overflow-hidden">
                            <span className="relative z-10 whitespace-nowrap">QUERO GARANTIR MINHA VAGA</span>
                            <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </Link>

                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs md:text-sm text-neutral-500 font-mono">
                            <span className="flex items-center gap-1"><CheckIcon /> Assinatura Simbólica: R$ 25,90</span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1"><CheckIcon /> Cancela quando quiser</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Slogan Break */}
            <div className="bg-emerald-600 py-4 transform -skew-y-2 relative z-20 overflow-hidden shadow-lg">
                <div className="container mx-auto text-center">
                    <h3 className="text-black font-black text-xl md:text-3xl italic uppercase tracking-tighter">
                        ECOSSISTEMA: UM AJUDA O OUTRO 🤝
                    </h3>
                </div>
            </div>

            {/* THE MECHANISM (How it works) */}
            <section className="py-20 bg-neutral-950 relative border-b border-neutral-900">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Não é mágica.<br /><span className="text-emerald-500">É trabalho em equipe.</span></h2>
                        <p className="text-lg text-neutral-400">
                            Para seu canal decolar, você precisa ajudar o canal dos colegas. Criamos um sistema justo onde
                            <strong className="text-white"> motorista fortalece motorista</strong>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 relative group hover:border-emerald-500/50 transition duration-500">
                            <div className="absolute -top-6 left-8 bg-neutral-800 text-emerald-500 font-bold text-xl w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-700 shadow-xl">1</div>
                            <h3 className="text-2xl font-bold text-white mb-4 mt-4">Você Ativa</h3>
                            <p className="text-neutral-400 leading-relaxed">
                                Nos seus intervalos ou esperando corrida, o app sugere vídeos de colegas. Sua missão é <strong>assistir, dar like e fazer comentários reais</strong>.
                            </p>
                            <div className="mt-6 flex gap-2">
                                <span className="px-3 py-1 bg-black rounded text-xs font-mono text-emerald-400 border border-emerald-900">Like ✅</span>
                                <span className="px-3 py-1 bg-black rounded text-xs font-mono text-emerald-400 border border-emerald-900">Comentário 💬</span>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 relative group hover:border-emerald-500/50 transition duration-500">
                            <div className="absolute -top-6 left-8 bg-neutral-800 text-emerald-500 font-bold text-xl w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-700 shadow-xl">2</div>
                            <h3 className="text-2xl font-bold text-white mb-4 mt-4">Você Cresce</h3>
                            <p className="text-neutral-400 leading-relaxed">
                                Cada interação gera créditos. O sistema usa esses créditos para recomendar <strong>o SEU vídeo</strong> para milhares de outros motoristas da rede.
                            </p>
                            <div className="mt-6">
                                <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-2/3 animate-pulse"></div>
                                </div>
                                <p className="text-xs text-right mt-1 text-emerald-500">Gerando views...</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 relative group hover:border-emerald-500/50 transition duration-500 bg-gradient-to-b from-neutral-900 to-emerald-900/10">
                            <div className="absolute -top-6 left-8 bg-emerald-500 text-black font-bold text-xl w-12 h-12 flex items-center justify-center rounded-xl shadow-xl shadow-emerald-500/20">3</div>
                            <h3 className="text-2xl font-bold text-white mb-4 mt-4">O YouTube Paga</h3>
                            <p className="text-neutral-400 leading-relaxed">
                                Com engajamento real (retenção alta + inscritos ativos), o YouTube entende que seu canal é valioso e libera a <strong>Monetização em Dólar</strong>.
                            </p>
                            <div className="mt-6 flex items-center gap-3 text-emerald-400 font-bold">
                                <DollarSign className="w-6 h-6" /> Pagamentos Mensais
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* "No Face" Strategy Section */}
            <section className="py-20 md:py-32 bg-neutral-900 relative">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <div className="order-2 md:order-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-xs font-bold mb-6 border border-emerald-500/30">
                                ESTRATÉGIA GHOST DRIVER
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Você dirige. <br />
                                <span className="text-emerald-500">A câmera trabalha.</span>
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                                Esqueça dancinhas. O nicho de <strong>"Dashcam" (Câmera no Painel)</strong> explode no mundo todo. Pessoas relaxam vendo trânsito, chuva e estrada. Você já faz isso todo dia de graça.
                            </p>

                            <div className="space-y-4">
                                <FeatureItem icon={<MapPin />} title="Apenas o Trajeto" desc="Filme o painel e a rua. Ninguém precisa ver você." />
                                <FeatureItem icon={<MicOff />} title="Silêncio Total" desc="Sem falar, sem roteiro. Apenas o som do motor e da cidade." />
                                <FeatureItem icon={<DollarSign />} title="Renda em Dólar" desc="O YouTube paga em moeda forte por visualização." />
                            </div>
                        </div>

                        {/* Visual Demo */}
                        <div className="order-1 md:order-2 grid grid-cols-2 gap-4 relative">
                            {/* Floating Badge */}
                            <div className="absolute -top-6 -right-6 z-20 bg-emerald-500 text-black font-bold p-4 rounded-full text-xs md:text-sm shadow-xl animate-bounce-slow rotation-12 transform rotate-12 text-center leading-tight">
                                DÊ PLAY<br />NA RENDA
                            </div>

                            <div className="bg-neutral-800/50 rounded-2xl p-2 md:p-4 border border-neutral-700 opacity-40 grayscale blur-[1px]">
                                <div className="aspect-[9/16] bg-black rounded-lg mb-2 relative flex items-center justify-center">
                                    <span className="text-neutral-600 font-bold text-xs">BLOGUEIRO</span>
                                    <div className="absolute inset-0 border-2 border-red-500/30 rounded-lg flex items-center justify-center">
                                        <span className="rotate-45 text-red-500 font-bold text-4xl opacity-50">+</span>
                                    </div>
                                </div>
                                <p className="text-[10px] md:text-xs text-red-500 font-bold text-center mt-2 line-through">VOCÊ APARECE</p>
                            </div>

                            <div className="bg-neutral-800 rounded-2xl p-2 md:p-4 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] transform md:scale-110 z-10 bg-neutral-900">
                                <div className="aspect-[9/16] bg-neutral-700 rounded-lg mb-2 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900 to-black opacity-80 group-hover:scale-105 transition-transform duration-700"></div>

                                    {/* UI Controls */}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400">REC • 4K</div>

                                    {/* Road lines */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-full bg-neutral-600/20 transform -perspective-x"></div>
                                </div>
                                <p className="text-[10px] md:text-xs text-emerald-400 font-bold text-center mt-2 uppercase tracking-wide">Só a Estrada Lucra</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-black text-center border-t border-neutral-900">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Março está chegando.</h2>
                    <Link to="/register" className="inline-block px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg transition shadow-lg hover:shadow-emerald-500/20">
                        Garantir Minha Vaga no Lote 1
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-neutral-950 text-center text-neutral-600 text-xs md:text-sm border-t border-neutral-900">
                <p>© 2026 TubeDrivers. Onde motoristas dominam o algoritmo.</p>
            </footer>
        </div>
    );
};

const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-800/50 transition border border-transparent hover:border-neutral-800">
        <div className="text-emerald-500 w-6 h-6 mt-1 flex-shrink-0 bg-emerald-500/10 p-1 rounded box-content">{icon}</div>
        <div>
            <h4 className="text-white font-bold mb-1">{title}</h4>
            <p className="text-neutral-400 text-sm leading-snug">{desc}</p>
        </div>
    </div>
);

const CheckIcon = () => (
    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                min: Math.floor((difference / 1000 / 60) % 60),
                seg: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimerBox = ({ val, label }) => (
        <div className="flex flex-col items-center mx-1 md:mx-4">
            <div className="w-16 h-20 md:w-32 md:h-40 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 w-full h-1/2 bg-white/5 pointer-events-none"></div>
                <span className="text-3xl md:text-7xl font-bold font-mono text-white tracking-widest relative z-10">
                    {String(val || 0).padStart(2, '0')}
                </span>
                <div className="absolute inset-0 bg-emerald-500/5 blur-xl"></div>
            </div>
            <span className="text-[10px] md:text-sm uppercase tracking-widest text-neutral-500 mt-2 md:mt-4 font-bold">{label}</span>
        </div>
    );

    return (
        <div className="flex justify-center gap-2 md:gap-4">
            <TimerBox val={timeLeft.dias} label="Dias" />
            <TimerBox val={timeLeft.horas} label="Hs" />
            <TimerBox val={timeLeft.min} label="Min" />
            <TimerBox val={timeLeft.seg} label="Seg" />
        </div>
    );
};

export default LandingPage;
