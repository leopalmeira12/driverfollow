# DRIVERFOLLOW - Masterplan & Architecture

## 1. Conceito do Produto
Plataforma "SaaS + Comunidade" para motoristas de aplicativo.
*   **Core Loop:** Motorista assiste/segue 10 colegas/dia -> Ganha Créditos -> Seu vídeo é exposto para 10 colegas.
*   **Meta:** Monetização do canal do YouTube em 90 dias.
*   **Modelo:** Freemium (R$ 10/mês para impulsionar ou remover limites).

## 2. Estratégia de "Humanização" (Anti-Detect YouTube)
Para evitar que o YouTube remova inscritos (spam):
1.  **Deep Link Inteligente:** O app abre o vídeo direto no App nativo do YouTube, não num iframe embutido sempre.
2.  **Variação de Origem:** Mesclar tráfego "Direto", "Busca" e "Sugestão".
3.  **Delay de Ação:** O botão "Validar Missão" só ativa após X minutos de vídeo assistido (Cronômetro no servidor).

## 3. Stack Tecnológica (JavaScript Puro)

### Frontend (Client)
*   **Framework:** Vite + React (JavaScript).
*   **UI Library:** TailwindCSS (para velocidade e visual moderno "Dark Mode").
*   **State:** Context API (simples e leve).
*   **Router:** React Router DOM.

### Backend (Server)
*   **Runtime:** Node.js.
*   **Framework:** Express.js (Leve, rápido, JS puro).
*   **Database:** MongoDB (Ideal para logs de views, missões, dados de usuários flexíveis).
*   **Auth:** JWT + Google OAuth 2.0 (Login social obrigatório).
*   **Job Queue:** Bull (Redis) - Para checar metas e limpar contadores diários.

## 4. Estrutura de Dados (MongoDB Draft)

```javascript
// User
{
  _id: "...",
  name: "João Motorista",
  youtubeChannelId: "UC123...",
  plan: "free" | "pro_10",
  credits: 50,
  dailyMissions: { watched: 3, subscribed: 1 },
  reputationScore: 98 // Human Score
}

// VideoMission
{
  authorId: "Ref(User)",
  youtubeVideoId: "xyz123",
  targetViews: 1000,
  currentViews: 240,
  priority: 1 // VIPs aparecem antes
}
```

## 5. Roteiro de Implementação

### Fase 1: Setup & Estrutura (Agora)
*   [x] Definir Arquitetura.
*   [ ] Hello World React + Express.
*   [ ] Configurar Tailwind.

### Fase 2: Autenticação & YouTube
*   [ ] Login com Google (Coletar ID do Canal).
*   [ ] Tela "Meus Vídeos" (Cadastrar vídeos).

### Fase 3: O "Feed" de Missões
*   [ ] Lista de vídeos para assistir.
*   [ ] Lógica de "Créditos" (Assistiu = Ganhou).

### Fase 4: Pagamento & Regras
*   [ ] Integração MP/Stripe (R$ 10).
*   [ ] Bloqueio se não cumprir 10/dia.
