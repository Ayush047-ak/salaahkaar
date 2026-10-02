Write-Host "🚀 Setting up Salaahkaar Monorepo on Windows..." -ForegroundColor Cyan

If (-Not (Test-Path .env)) {
    Write-Host "📄 Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

Write-Host "📦 Installing root and workspace npm packages..." -ForegroundColor Yellow
npm install

Write-Host "🐍 Setting up Python virtual environment for Geospatial service..." -ForegroundColor Yellow
Set-Location services/geospatial
If (-Not (Test-Path .venv)) {
    python -m venv .venv
}
& .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Set-Location ../..

Write-Host "✅ Setup completed successfully! Run 'npm run dev' to start." -ForegroundColor Green
