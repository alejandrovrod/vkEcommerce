# Script to check and set GITHUB_TOKEN
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Token Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check current session
$sessionToken = $env:GITHUB_TOKEN
if ($sessionToken) {
    Write-Host "Token found in current session" -ForegroundColor Green
    Write-Host "  Value: $($sessionToken.Substring(0, [Math]::Min(10, $sessionToken.Length)))..." -ForegroundColor Gray
} else {
    Write-Host "No token in current session" -ForegroundColor Red
}

Write-Host ""

# Check user environment variables
$userToken = [System.Environment]::GetEnvironmentVariable('GITHUB_TOKEN', 'User')
if ($userToken) {
    Write-Host "Token found in User environment variables" -ForegroundColor Green
    Write-Host "  Value: $($userToken.Substring(0, [Math]::Min(10, $userToken.Length)))..." -ForegroundColor Gray
} else {
    Write-Host "No token in User environment variables" -ForegroundColor Red
}

Write-Host ""

# Check machine environment variables
$machineToken = [System.Environment]::GetEnvironmentVariable('GITHUB_TOKEN', 'Machine')
if ($machineToken) {
    Write-Host "Token found in System environment variables" -ForegroundColor Green
    Write-Host "  Value: $($machineToken.Substring(0, [Math]::Min(10, $machineToken.Length)))..." -ForegroundColor Gray
} else {
    Write-Host "No token in System environment variables" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "To set the token:" -ForegroundColor Cyan
Write-Host "  For this session only:" -ForegroundColor Yellow
Write-Host '    $env:GITHUB_TOKEN = "your_token_here"' -ForegroundColor White
Write-Host ""
Write-Host "  Permanently (User):" -ForegroundColor Yellow
Write-Host '    [System.Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "your_token_here", "User")' -ForegroundColor White
Write-Host ""
Write-Host "  Or use the setup script:" -ForegroundColor Yellow
Write-Host "    .\setup-token.ps1" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
