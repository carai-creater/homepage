@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   CRAai - ローカルサーバー起動
echo ========================================
echo.

REM Python を探す
set "PYCMD="
where py >nul 2>nul && set "PYCMD=py"
if not defined PYCMD where python >nul 2>nul && set "PYCMD=python"

if not defined PYCMD (
  echo [エラー] Python が見つかりません。
  echo Cursor のターミナルで以下を実行してください:
  echo   cd %~dp0
  echo   python -m http.server 8080
  echo.
  echo その後ブラウザで http://localhost:8080/ を開いてください。
  pause
  exit /b 1
)

echo サーバーを起動しています...
echo.

REM 別窓でサーバー起動（窓タイトルとコマンドの引用を正しく分離）
start "CRAaiServer" cmd /k "cd /d ""%~dp0"" && %PYCMD% -m http.server 8080"

timeout /t 2 /nobreak >nul

echo ブラウザを開きます
start "" "http://localhost:8080/"

echo.
echo ★「CRAaiServer」と書いた窓が開いています。その窓は閉じないでください★
echo   その窓に "Serving HTTP on ... port 8080" と出ていれば成功です。
echo.
echo まだ表示されない場合は、ブラウザで直接入力:
echo   http://localhost:8080/
echo ========================================
pause
