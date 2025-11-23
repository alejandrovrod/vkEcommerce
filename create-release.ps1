# Script para crear un release en GitHub
# Uso: .\create-release.ps1 -Version "0.1.0" -Token "tu_token_aqui"

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string]$Token = $env:GITHUB_TOKEN
)

if (-not $Token) {
    Write-Host "Error: Se requiere un token de GitHub." -ForegroundColor Red
    Write-Host "Puedes:" -ForegroundColor Yellow
    Write-Host "1. Configurar la variable de entorno: `$env:GITHUB_TOKEN = 'tu_token'" -ForegroundColor Yellow
    Write-Host "2. O pasar el token como parámetro: .\create-release.ps1 -Version '$Version' -Token 'tu_token'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para crear un token:" -ForegroundColor Cyan
    Write-Host "1. Ve a: https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "2. Crea un nuevo token (classic) con el scope 'repo'" -ForegroundColor Cyan
    exit 1
}

$owner = "alejandrovrod"
$repo = "vkEcommerce"
$tag = "v$Version"
$title = "v$Version"
$body = @"
## Initial Release

First public release of vkecomblocks packages:

- @alejandrovrod/blocks-core@$Version
- @alejandrovrod/blocks-react@$Version
- @alejandrovrod/blocks-vue@$Version
- @alejandrovrod/blocks-angular@$Version

### Installation

See [docs/INSTALLATION.md](https://github.com/$owner/$repo/blob/master/docs/INSTALLATION.md) for installation instructions.
"@

$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}

$bodyJson = @{
    tag_name = $tag
    name = $title
    body = $body
    draft = $false
    prerelease = $false
} | ConvertTo-Json

Write-Host "Creando release $tag..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/releases" `
        -Method Post `
        -Headers $headers `
        -Body $bodyJson `
        -ContentType "application/json"
    
    Write-Host "✅ Release creado exitosamente!" -ForegroundColor Green
    Write-Host "URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "El workflow de GitHub Actions se ejecutará automáticamente para publicar los paquetes." -ForegroundColor Yellow
    Write-Host "Puedes ver el progreso en: https://github.com/$owner/$repo/actions" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error al crear el release:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    exit 1
}






