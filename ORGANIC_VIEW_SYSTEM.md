# 🎯 Sistema de Visualização Orgânica - TubeDrivers

## O QUE É ISSO NA PRÁTICA?

Este sistema faz com que os motoristas da comunidade assistam aos vídeos uns dos outros de forma que o **YouTube reconheça como visualizações REAIS e LEGÍTIMAS**, evitando que os canais sejam penalizados ou desmonetizados.

---

## FLUXO REAL (Sem Simulação)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. MOTORISTA A adiciona seu vídeo do YouTube na plataforma      │
│    - Vídeo é salvo no MongoDB (collection: videos)              │
│    - Status: "active", targetViews: 1000 (ou quanto quiser)     │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. MOTORISTA B entra na plataforma e pede uma "missão"          │
│    - Sistema busca vídeos que:                                  │
│      * NÃO são do próprio usuário B                             │
│      * Ainda precisam de views (completedViews < targetViews)   │
│      * B não assistiu 4x esta semana                            │
│      * B não assistiu nas últimas 24h (cooldown)                │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Sistema gera BLUEPRINT ORGÂNICO único para B                 │
│    - Define ponto de entrada (não sempre do início)             │
│    - Define comportamentos humanos (pause, seek, etc)           │
│    - Define engajamentos aleatórios (like 15%, comment 10%)     │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. B clica em "INICIAR MISSÃO"                                  │
│    - Abre o vídeo REAL no YouTube (nova aba)                    │
│    - URL inclui timestamp de início (ex: youtube.com?t=120)     │
│    - B assiste o vídeo REAL seguindo as instruções              │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. B finaliza a missão após assistir o tempo mínimo             │
│    - Sistema valida: watchTime >= 30s ou 50% do vídeo           │
│    - Registra ViewSession no MongoDB com todos os dados         │
│    - Incrementa completedViews do vídeo de A                    │
│    - Calcula score orgânico (0-100)                             │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. RESULTADO REAL                                               │
│    - O YouTube contabiliza a visualização de B como ORGÂNICA    │
│    - Watch time de A aumenta no YouTube Analytics               │
│    - Engajamentos (likes/comments) são REAIS no YouTube         │
└─────────────────────────────────────────────────────────────────┘
```

---

## REGRAS DE VISUALIZAÇÃO ORGÂNICA (Implementadas)

### 1. ROTATIVIDADE SEMANAL
Cada usuário pode ver o MESMO vídeo no máximo 4 vezes por semana:
- Segunda: 1ª visita (Descoberta)
- Quarta: 2ª visita (Interesse)
- Sexta: 3ª visita (Retenção)
- Domingo: 4ª visita (Fã)

**Por quê?** O YouTube detecta quando o mesmo usuário assiste ao mesmo vídeo repetidamente em loop. Com esta rotatividade, parece natural.

### 2. COOLDOWN DE 24 HORAS
Entre cada visualização do mesmo vídeo, deve haver pelo menos 24 horas.

**Por quê?** Um humano real não assiste ao mesmo vídeo várias vezes no mesmo dia.

### 3. PONTO DE ENTRADA POR VISITA
Cada visita tem um ponto de entrada específico:

| Visita | Ponto de Entrada | Descrição |
|--------|------------------|-----------|
| 1ª     | **INÍCIO (0-10s)** | Descoberta - assiste do começo |
| 2ª     | **ALEATÓRIO (20-70%)** | Voltou para rever uma parte |
| 3ª     | **MEIO (40-60%)** | Assiste do meio até o final |
| 4ª     | **INÍCIO (0s)** | Assiste COMPLETO do início ao fim |

**Por quê?** Usuários reais não assistem sempre do início. Variar o ponto de entrada simula comportamento natural.

### 4. ENGAJAMENTO PROGRESSIVO
A chance de engajamento aumenta com as visitas:
| Visita | Inscrição | Like | Comentário | Compartilhar |
|--------|-----------|------|------------|--------------|
| 1ª     | ❌ 0%     | ❌ 0%  | ❌ 0%      | ❌ 0%        |
| 2ª     | ✅ **60%**| 40%  | 0%         | 0%           |
| 3ª     | ✅ **80%**| 70%  | 30%        | 15%          |
| 4ª     | ✅ **100%**| ✅ **100%**| ✅ **100%** | 40%     |

**Por quê?**
- **1ª visita:** Apenas assiste - descoberta do canal
- **2ª visita:** SE INSCREVE (60%) + talvez curta (40%)
- **3ª visita:** Alta chance de tudo, reforça inscrição
- **4ª visita:** TUDO OBRIGATÓRIO (assiste completo + like + inscrição + comentário)

### 5. WATCH TIME MÍNIMO
- Vídeos < 60s: Assistir pelo menos 50%
- Vídeos >= 60s: Assistir pelo menos 30 segundos

**Por quê?** O YouTube só conta visualização se assistir pelo menos 30s ou uma porcentagem significativa.

---

## CÁLCULO: TEMPO PARA MONETIZAR

### Cenário Básico (vídeos de 7 min)
```
Por rodada:
  1.000 motoristas × 7 min = 7.000 minutos = 116 horas

Para 4.000 horas:
  4.000 ÷ 116 = 35 rodadas

Com 4 rodadas/semana:
  35 ÷ 4 = ~9 semanas = ~2 MESES
```

### 🚀 Cenário Otimizado (vídeos de 30-50 min + postar a cada 2 dias)
```
Por rodada (vídeo de 40 min):
  1.000 motoristas × 40 min = 40.000 minutos = 666 horas

Com 6 vídeos ativos (postando a cada 2 dias):
  6 vídeos × 666 horas = 4.000 horas

Tempo para monetizar:
  5-7 DIAS! 🔥
```

### Tabela Comparativa

| Cenário | Vídeos | Duração | Tempo para 4.000h |
|---------|--------|---------|-------------------|
| Básico | 1 | 7 min | ~2 meses |
| Médio | 3 | 15 min | ~3 semanas |
| **Otimizado** | **6** | **40 min** | **5-7 dias** |

### Dicas para Monetizar Mais Rápido
1. **Vídeos mais longos** (30-50 minutos)
2. **Postar a cada 2 dias** (mais vídeos ativos)
3. **Convidar mais motoristas** (mais views por rodada)

---

## BANCO DE DADOS (MongoDB)

### Collection: `videos`
```javascript
{
  _id: ObjectId,
  user: ObjectId, // Dono do vídeo
  youtubeVideoId: "K7zBNQOXIE8", // ID real do YouTube
  title: "Viagem pela BR-101",
  duration: "PT12M30S", // 12 minutos e 30 segundos
  targetViews: 1000, // Meta de visualizações
  completedViews: 523, // Visualizações já completadas
  status: "active" // active | completed | paused
}
```

### Collection: `viewsessions`
```javascript
{
  _id: ObjectId,
  viewer: ObjectId, // Quem assistiu
  video: ObjectId, // Qual vídeo
  videoOwner: ObjectId, // Dono do vídeo
  
  watchTimeSeconds: 450, // 7.5 minutos assistidos
  startedAtSecond: 30, // Começou aos 30s
  endedAtSecond: 480, // Terminou aos 8min
  
  entryType: "recommendation", // Como "encontrou" o vídeo
  
  engagements: {
    liked: true,
    commented: false,
    shared: false,
    subscribed: false
  },
  
  humanBehaviors: [
    { action: "pause", timestamp: 120 },
    { action: "seek", timestamp: 240 }
  ],
  
  isOrganic: true,
  organicScore: 85, // 0-100
  
  weeklyViewNumber: 2, // 2ª vez esta semana
  weekStart: ISODate("2026-02-02"),
  viewedAt: ISODate("2026-02-03T10:30:00Z")
}
```

---

## O QUE NÃO É SIMULAÇÃO / MOCK

| O que é REAL | O que acontece |
|--------------|----------------|
| Vídeo do YouTube | Abre o YouTube real em nova aba |
| Visualização | O usuário REALMENTE assiste ao vídeo |
| Like/Comentário | O usuário REALMENTE curte/comenta no YouTube |
| Watch Time | O YouTube REALMENTE conta o tempo assistido |
| Inscrição | O usuário REALMENTE se inscreve no canal |

---

## PRÓXIMOS PASSOS PARA PRODUÇÃO

1. **Configurar MongoDB Atlas** (banco de dados na nuvem)
2. **Deploy do servidor** (Render, Railway, etc)
3. **Deploy do cliente** (Vercel, Netlify, etc)
4. **Adicionar vídeos reais** dos motoristas
5. **Convidar motoristas** para a plataforma
