Write-Host "🚀 INICIANDO DRIVERFOLLOW (MODO RESGATE)..." -ForegroundColor Green

# 1. Check Node
$nodeVersion = node -v
Write-Host "✅ Node detectado: $nodeVersion" -ForegroundColor Yellow

# 2. Setup Client
Write-Host "`n📦 Instalando Frontend (Client)... Isso pode demorar 1-2 minutos." -ForegroundColor Cyan
cd client
if (!(Test-Path "node_modules")) {
    npm install
}
else {
    Write-Host "   (node_modules já existe, pulando install completo...)"
}

# Verifica se vite existe
if (!(Test-Path "node_modules/.bin/vite.cmd")) {
    Write-Host "⚠️  Vite não encontrado! Forçando reinstalação..." -ForegroundColor Red
    npm install vite @vitejs/plugin-react react react-dom -D
}
cd ..

# 3. Setup Server
Write-Host "`n⚙️  Instalando Backend (Server)..." -ForegroundColor Cyan
cd server
# Force install because package.json was missing before
npm install
cd ..

# 4. Start
Write-Host "`n🔥 TUDO PRONTO! Iniciando Servidores..." -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173"
Write-Host "   Backend:  http://localhost:5000"

# Run securely
if ($IsWindows) {
    Start-Process -FilePath "cmd" -ArgumentList "/c npm start --prefix server" -NoNewWindow
    Start-Process -FilePath "cmd" -ArgumentList "/c cd client && npx vite --host --port 5173" -NoNewWindow
}
else {
    npx concurrently "npm start --prefix server" "npm run dev --prefix client"
}

