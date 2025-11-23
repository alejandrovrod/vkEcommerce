# PowerShell script to set up GitHub token for npm
# Run this script: .\setup-token.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Token Setup for npm" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$token = Read-Host "Enter your GitHub Personal Access Token (PAT)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Error: Token cannot be empty!" -ForegroundColor Red
    exit 1
}

# Set environment variable for current session
$env:GITHUB_TOKEN = $token

Write-Host ""
Write-Host "✓ Token set for current PowerShell session" -ForegroundColor Green
Write-Host ""
Write-Host "To make it permanent, add it to your system environment variables:" -ForegroundColor Yellow
Write-Host "  1. Open System Properties → Environment Variables" -ForegroundColor Yellow
Write-Host "  2. Add new User variable: GITHUB_TOKEN = $token" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or add this line to your PowerShell profile:" -ForegroundColor Yellow
Write-Host "  `$env:GITHUB_TOKEN = '$token'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Now you can run: npm install" -ForegroundColor Green



