@echo off
setlocal

cd /d "%~dp0frontend\Kensan"
start /wait cmd /c "npm install"
start cmd /k "npm run dev --host"

cd /d "%~dp0backend"
start /wait cmd /c "npm install"
start cmd /k "npm run dev --host"

cd /d "%~dp0backend"
start /wait cmd /c "npm install"
start cmd /k "npm run api --host"
