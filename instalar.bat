@echo off
title Ben 10 Collector - Instalador de Requisitos
echo ====================================================
echo   INSTALANDO LIBRERIAS Y COMPONENTES NECESARIOS
echo ====================================================

:: Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no esta instalado en este sistema.
    echo Por favor, instala Python de la pagina oficial (https://www.python.org/downloads/)
    echo y asegurate de marcar la casilla "Add Python to PATH" durante la instalacion.
    echo.
    pause
    exit
)

echo Python detectado correctamente.
echo Iniciando instalacion de dependencias...
echo.

:: Actualizar pip e instalar dependencias
python -m pip install --upgrade pip
python -m pip install django pymysql

echo.
echo ====================================================
echo   INSTALACION COMPLETADA CON EXITO
echo ====================================================
echo Ya puedes iniciar la aplicacion haciendo doble clic en "iniciar.bat".
echo.
pause
