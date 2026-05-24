@echo off
setlocal
set "NODE=C:\Users\domin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE%" (
  echo Nie znaleziono Node.js w pakiecie Codex.
  pause
  exit /b 1
)
"%NODE%" "%~dp0aktualizuj-produkty.js"
pause
