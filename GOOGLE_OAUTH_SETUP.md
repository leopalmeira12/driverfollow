# 🔐 Guia de Configuração do Google OAuth

Este guia mostra como configurar a autenticação Google para o TubeDrivers.

## Passo 1: Acessar o Google Cloud Console

1. Acesse: **https://console.cloud.google.com/**
2. Faça login com sua conta Google

## Passo 2: Criar um Novo Projeto

1. Clique no seletor de projeto (canto superior esquerdo)
2. Clique em **"Novo Projeto"**
3. Nome do projeto: `TubeDrivers`
4. Clique em **Criar**

## Passo 3: Configurar a Tela de Consentimento OAuth

1. No menu lateral, vá em: **APIs e Serviços** → **Tela de consentimento OAuth**
2. Selecione **Externo** e clique em **Criar**
3. Preencha:
   - **Nome do aplicativo:** TubeDrivers
   - **Email de suporte ao usuário:** seu email
   - **Logo do aplicativo:** (opcional)
4. Em **Domínios autorizados**, deixe vazio por enquanto (para localhost)
5. Em **Informações de contato do desenvolvedor**, coloque seu email
6. Clique em **Salvar e Continuar**

### Escopos (Permissões)
1. Clique em **Adicionar ou remover escopos**
2. Adicione estes escopos:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
   - `./auth/youtube.readonly` (para pegar info do canal)
3. Clique em **Atualizar** → **Salvar e Continuar**

### Usuários de teste (enquanto em desenvolvimento)
1. Adicione seu próprio email como usuário de teste
2. Clique em **Salvar e Continuar**

## Passo 4: Criar Credenciais OAuth 2.0

1. No menu lateral: **APIs e Serviços** → **Credenciais**
2. Clique em **+ Criar Credenciais** → **ID do cliente OAuth**
3. Tipo de aplicativo: **Aplicativo da Web**
4. Nome: `TubeDrivers Web Client`
5. **Origens JavaScript autorizadas:**
   - `http://localhost:5173`
   - `http://localhost:5000`
6. **URIs de redirecionamento autorizados:**
   - `http://localhost:5000/api/auth/google/callback`
7. Clique em **Criar**

## Passo 5: Copiar as Credenciais

Após criar, você verá:
- **ID do cliente:** `xxxxxxxxxxxxx.apps.googleusercontent.com`
- **Chave secreta do cliente:** `GOCSPX-xxxxxxxxxxxxxxxxx`

**Guarde essas informações!**

## Passo 6: Habilitar a YouTube Data API

1. No menu: **APIs e Serviços** → **Biblioteca**
2. Pesquise por `YouTube Data API v3`
3. Clique nela e depois em **Habilitar**

## Passo 7: Configurar no Projeto

1. No servidor, crie ou edite o arquivo `.env`:

```bash
# Navegue até a pasta server
cd server

# Copie o exemplo
copy .env.example .env

# Edite o .env com suas credenciais
```

2. Abra `server/.env` e preencha:

```env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=sua_chave_secreta_aqui
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

## Passo 8: Reiniciar o Servidor

```bash
# Na raiz do projeto
npm start
```

## Passo 9: Testar

1. Acesse `http://localhost:5173/login`
2. Clique em **Continuar com Google**
3. Faça login com um email de teste
4. Você será redirecionado para o dashboard!

---

## ⚠️ Notas Importantes

### Em Produção:
- Troque `localhost` pelo seu domínio real
- Adicione o domínio na lista de domínios autorizados
- Submeta o app para verificação do Google (para uso público)

### Solução de Problemas:

| Erro | Solução |
|------|---------|
| "redirect_uri_mismatch" | Verifique se a URI no Google Cloud está exatamente igual à do .env |
| "access_blocked" | Adicione seu email como usuário de teste |
| "invalid_client" | Verifique se o Client ID e Secret estão corretos |

---

## 📌 Resumo das Credenciais Necessárias

```
GOOGLE_CLIENT_ID=     # Seu ID do cliente OAuth
GOOGLE_CLIENT_SECRET= # Sua chave secreta
GOOGLE_REDIRECT_URI=  # http://localhost:5000/api/auth/google/callback
FRONTEND_URL=         # http://localhost:5173
```
