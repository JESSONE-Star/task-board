@echo off
chcp 65001 >nul
set "ROOT=%~dp0"
set "PATH=%ROOT%.tools\node\node-v26.13.0-win-x64;%PATH%"
cd /d "%ROOT%"
title 任务看板 - Vite 服务器
echo ==========================================
echo   任务看板 - Vite 开发服务器
echo   访问地址：http://localhost:8085
echo   关闭此窗口即停止服务器
echo ==========================================
echo.
call npx vite --host 0.0.0.0 --port 8085
pause