@echo off
title Ben 10 Collector Launcher
echo ====================================================
echo   VERIFICANDO BASE DE DATOS...
echo ====================================================

:: Comprobar si Laragon está activo (solo si existe en la ruta por defecto)
if exist "C:\laragon\laragon.exe" (
    tasklist /nh /fi "imagename eq laragon.exe" | find /i "laragon.exe" >nul
    if %errorlevel% neq 0 (
        echo Iniciando base de datos Laragon...
        start "" "C:\laragon\laragon.exe"
        timeout /t 3 /nobreak >nul
    ) else (
        echo Base de datos Laragon ya esta activa.
    )
) else (
    echo Laragon no detectado. Se utilizara Base de Datos local SQLite (sin Laragon).
)

:: Aplicar migraciones necesarias
echo Aplicando migraciones de Base de Datos...
python manage.py migrate --noinput

echo.
echo ====================================================
echo   INICIANDO SERVIDOR OMNITRIX UNIVERSE...
echo ====================================================

:: Iniciar el servidor de desarrollo de Django en segundo plano
start "Servidor Django" cmd /k "python manage.py runserver"

:: Esperar a que el servidor se levante
timeout /t 2 /nobreak >nul

:: Abrir la aplicación en el navegador por defecto
echo Abriendo la aplicacion en el navegador...
start http://127.0.0.1:8000/

exit
