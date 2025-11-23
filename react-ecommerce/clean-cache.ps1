# Script para limpiar la caché de Vite y reinstalar dependencias
Write-Host "Limpiando caché de Vite..." -ForegroundColor Yellow

# Eliminar caché de Vite
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Caché de Vite eliminada" -ForegroundColor Green
} else {
    Write-Host "No hay caché de Vite" -ForegroundColor Gray
}

# Eliminar dist
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ Carpeta dist eliminada" -ForegroundColor Green
}

Write-Host ""
Write-Host "Reconstruyendo paquetes..." -ForegroundColor Yellow
cd ..\packages\blocks-core
npm run build
cd ..\blocks-react
npm run build

Write-Host ""
Write-Host "✓ Paquetes reconstruidos" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes ejecutar: npm run dev" -ForegroundColor Cyan

