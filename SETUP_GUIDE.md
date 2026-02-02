# 🚀 DRIVERFOLLOW: GUIA DE INSTALAÇÃO LOCAL

O projeto está configurado. Siga estes passos simples para rodar:

### 1. Pré-requisitos
- Tenha o **Node.js** instalado.
- Tenha o **MongoDB** instalado e rodando em `localhost:27017` (ou configure `.env` no server).

### 2. Instalação Automática
Abra o terminal na pasta raiz e rode:

```bash
npm install
npm run install:all
```

### 3. Popular Banco de Dados (Seed)
Para criar os primeiros vídeos e usuários de teste:

```bash
node server/seed.js
```
*(Se der erro de conexão, verifique se seu MongoDB está ligado!)*

### 4. Rodar o Projeto
Para iniciar Frontend (Porta 5173) e Backend (Porta 5000) juntos:

```bash
npm start
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Credenciais de Teste (Criadas pelo Seed)
O sistema vai usar um `Mock User ID` automaticamente, então você entra logado como "Carlos Motorista".
Para simular outros usuários, edite o header `x-mock-user-id` nas chamadas do Frontend.
