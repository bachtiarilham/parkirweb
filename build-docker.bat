@echo off
echo ==============================================
echo  Building SvelteKit Web Docker Image
echo ==============================================
docker build -t ghcr.io/bachtiarilham/park-server-web:latest .

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gagal melakukan docker build!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ==============================================
echo  Exporting Image to DockerExternal for PC 2...
echo ==============================================
docker save -o D:\Workdir\DockerExternal\Park-Server\park-server-web.tar ghcr.io/bachtiarilham/park-server-web:latest

echo.
echo ==============================================
echo  Selesai! Image park-server-web.tar tersimpan di:
echo  D:\Workdir\DockerExternal\Park-Server\park-server-web.tar
echo.
echo  Di PC 2 cukup jalankan:
echo  docker load -i park-server-web.tar
echo  docker compose up -d
echo ==============================================
pause
