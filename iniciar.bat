@echo off
title Ben 10 Collector Launcher
echo ====================================================
echo   VERIFICANDO SERVICIOS DE BASE DE DATOS (LARAGON)...
echo ====================================================

:: Comprobar si Laragon ya se esta ejecutando en los procesos de Windows
tasklist /nh /fi "imagename eq laragon.exe" | find /i "laragon.exe" >nul
if %errorlevel% neq 0 (
    echo Laragon no esta activo. Iniciando Laragon...
    if exist "C:\laragon\laragon.exe" (
        start "" "C:\laragon\laragon.exe"
        :: Esperar 3 segundos para permitir que MySQL cargue sus servicios
        timeout /t 3 /nobreak >nul
    ) else (
        echo [ADVERTENCIA] No se encontro Laragon en C:\laragon\laragon.exe. Asegurate de iniciar tu base de datos MySQL manualmente.
    )
) else (
    echo Laragon ya se esta ejecutando.
)

echo.
echo ====================================================
echo   INICIANDO SERVIDOR OMNITRIX UNIVERSE...
echo ====================================================

:: Iniciar el servidor de desarrollo de Django en una ventana independiente
start "Servidor Django" cmd /k "python manage.py runserver"

:: Esperar 2 segundos para permitir que el servidor se levante por completo
timeout /t 2 /nobreak >nul

:: Abrir la aplicacion web en Google Chrome
echo Abriendo la aplicacion en Google Chrome...
start chrome http://127.0.0.1:8000/

exit
