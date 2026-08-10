@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Instalando dependencias por primera vez...
  call npm install
  if errorlevel 1 (
    echo.
    echo No se pudieron instalar las dependencias.
    pause
    exit /b 1
  )
)

echo.
echo Iniciando Academia CHARME...
echo Abrir en el navegador: http://127.0.0.1:5173
echo.
call npm run dev
pause
