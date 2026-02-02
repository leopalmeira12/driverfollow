import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

const OnboardingTour = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Bem-vindo ao TubeDrivers! 👋",
            desc: "Você está na plataforma que vai transformar seu tempo ocioso em dinheiro. Vamos aprender como funciona em 3 passos rápidos?",
            image: "👋"
        },
        {
            title: "1. Assista e Ganhe 🪙",
            desc: "Sua missão: assistir vídeos de colegas. A cada vídeo completo, você ganha 1 Crédito. Sem robôs, apenas visualizações reais.",
            image: "📺"
        },
        {
            title: "2. Troque por Views 🚀",
            desc: "Use seus créditos para colocar SEU vídeo na fila. Outros motoristas vão assistir e você ganha retenção alta no YouTube.",
            image: "📈"
        },
        {
            title: "3. Vire VIP (Opcional) 👑",
            desc: "Quer acelerar? O plano VIP te dá o DOBRO de créditos e fura a fila. Ideal para quem quer monetizar em menos de 60 dias.",
            image: "👑"
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-neutral-900 border border-neutral-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="text-center mb-6">
                    <div className="text-6xl mb-4 animate-bounce-slow">{steps[step].image}</div>
                    <h2 className="text-2xl font-bold text-white mb-2">{steps[step].title}</h2>
                    <p className="text-neutral-400">{steps[step].desc}</p>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mb-6">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-emerald-500' : 'w-2 bg-neutral-700'}`}></div>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition hover:scale-105 shadow-lg"
                >
                    {step === steps.length - 1 ? 'Começar a Usar' : 'Próximo'}
                    {step < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </button>

                <button onClick={onComplete} className="absolute top-4 right-4 text-neutral-500 hover:text-white p-2">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default OnboardingTour;
