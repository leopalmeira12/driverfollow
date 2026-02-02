# PROMPT MESTRE: DRIVERFOLLOW - PLATAFORMA DE GROWTH HUMANIZADO

**Objetivo:** Criar um ecossistema "Anti-Farm" onde motoristas se ajudam a crescer organicamente no YouTube.

**Stack:**
- **Frontend:** Vite + React (JavaScript, TailwindCSS v4)
- **Backend:** Node.js + Express (JavaScript)
- **Database:** MongoDB
- **Cache:** Redis (Fila de Prioridade)

---

## 🛡️ SISTEMA "EXTERNAL TRAFFIC" (ANTI-BAN TOTAL)

Para garantir segurança máxima da conta e zero risco de banimento:

### 1. Fluxo de Visualização (Safe Harbor)
1. O usuário vê o **Card do Vídeo** na plataforma (Thumbnail + Título).
2. Clica em "Assistir no YouTube" (Botão Grande).
3. A plataforma abre o app/site do YouTube em nova aba (target="_blank").
4. **No App DriverFollow:** Inicia um **Timer Regressivo** (Ex: 3 minutos).
5. **Ação:** O usuário assiste, curte e comenta lá no YouTube.
6. **Retorno:** O usuário volta, espera o timer zerar e clica "Confirmar Conclusão".

### 2. Desacoplamento Temporal (A Arma Secreta)
É **PROIBIDO** pedir inscrição logo após a visualização.
1.  **Dia 0 (Watch):** O usuário assiste ao vídeo. Nenhuma inscrição é pedida.
2.  **Delay Aleatório:** O sistema agenda uma "Missão de Inscrição" para `Daqui a [1, 2, 3, 5] Dias` (Sorteio).
3.  **Dia X (Subscribe):** O canal reaparece no feed sugerindo: "Você viu um vídeo deste canal há 3 dias. Que tal se inscrever?".
*Resultado:* Quebra total de padrão. O YouTube vê como "Retorno Orgânico".

### 3. Validação Temporal (Trust Timer)
- O servidor marca o `timestamp` do clique de saída.
- O botão "Confirmar" só é aceito se `Agora - Saída >= Duração Mínima`.

### 3. Fila Inteligente
- Mantém a regra de não repetir vídeos para o mesmo usuário.
- Prioriza quem tem Plano Pago na fila de exibição.

---

## 🎨 FRONTEND: DESIGN SYSTEM "NIGHT RIDER"

O design deve focar no uso **Mobile/Noturno** (motoristas dirigindo à noite).

- **Paleta:** Fundo `Neutral-950`, Acentos `Emerald-500` (Dinheiro/Siga) e `Amber-500` (Alerta).
- **Tipografia:** Fonte grande, legível, botões gigantes (fácil de clicar no suporte do carro).
- **Feed:** Scroll Vertical, Cards Grandes (1 por tela).

---

## ⚙️ BACKEND: MODULAR E SEGURO

### Endpoints Críticos:

1.  `GET /api/missions/next`
    - Retorna próximo vídeo (Thumbnail, Título, YoutubeID).
  
2.  `POST /api/missions/start`
    - Registra que o usuário clicou para ir ao YouTube. 
    - Retorna `expectedReturnTime`.

3.  `POST /api/missions/verify`
    - Valida se o tempo passou.
    - Credita os pontos.

---

## 💰 BUSINESS MODEL & PROMISE

- **Offer:** R$ 10/month for Premium (Faster Queue).
- **Promise:** "Monetize in 90 Days" via consistent daily engagement.
- **Method:** 10 videos/day x 90 days = 900 interactions (enough to trigger algo).
