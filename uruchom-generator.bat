@echo off
cd /d "%~dp0"

REM Najpierw próbujemy uruchomić generator przez standardowe polecenia Pythona.
py generate.py 2>nul
if %errorlevel% equ 0 goto koniec

python generate.py 2>nul
if %errorlevel% equ 0 goto koniec

REM Awaryjnie używamy lokalnego Pythona dostępnego w środowisku Codex na tym komputerze.
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" generate.py
  goto koniec
)

echo Nie znaleziono Pythona. Zainstaluj Python albo uruchom generator z dostepnego srodowiska Python.

:koniec
pause
