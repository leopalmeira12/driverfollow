import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Loader, ShieldCheck, Clock } from 'lucide-react';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('waiting'); // waiting, checking, paid
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCopyPix = () => {
        navigator.clipboard.writeText("00020126360014BR.GOV.BCB.PIX0114+55119999999995204000053039865802BR5913TubeDrivers6009Sao Paulo62070503***6304E2CA");
        alert("Código Pix copiado!");

        setTimeout(() => {
            setStatus('checking');
            setTimeout(() => {
                setStatus('paid');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            }, 4000);
        }, 5000);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (status === 'paid') {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
                <div className="bg-white text-center p-10 rounded-3xl shadow-2xl animate-fade-in-up">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscrição Confirmada!</h1>
                    <p className="text-gray-600 mb-6">Bem-vindo à Turma de Março (Lote 1).</p>
                    <p className="text-sm text-gray-400">Redirecionando para o painel...</p>
                    <Loader className="w-5 h-5 animate-spin mx-auto mt-4 text-emerald-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 mb-4 animate-pulse">
                        <Clock className="w-3 h-3" /> Vagas esgotam em {formatTime(timeLeft)}
                    </div>
                    <h1 className="text-xl font-bold">Assinatura Lote 1 - Março</h1>
                    <p className="text-neutral-400 text-sm mt-1">Acesso ao grupo de monetização acelerada.</p>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center bg-neutral-800 p-4 rounded-xl mb-6 border border-neutral-700">
                    <div className="text-left">
                        <div className="text-xs text-neutral-400 uppercase">Valor Mensal</div>
                        <div className="text-xl font-bold text-white">R$ 25,90</div>
                    </div>
                    <ShieldCheck className="text-emerald-500 w-8 h-8" />
                </div>

                {/* QR Code Mock */}
                <div className="bg-white p-4 rounded-xl mb-6 relative group cursor-pointer" onClick={handleCopyPix}>
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {/* Mock QR */}
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PagamentoMarço2590" alt="QR Code Pix" className="opacity-90 blur-[2px] hover:blur-none transition duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur">Clique para Copiar</span>
                        </div>
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopyPix}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                    <Copy className="w-5 h-5" />
                    {status === 'checking' ? 'Verificando assinatura...' : 'Copiar Código Pix'}
                </button>

                {/* Status */}
                {status === 'checking' && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-400">
                        <Loader className="w-4 h-4 animate-spin" />
                        Verificando com o banco...
                    </div>
                )}

                <p className="text-center text-xs text-neutral-500 mt-6">
                    Acesso liberado imediatamente após confirmação.
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;
