@echo off
title Android Emulator - Pixel 9 Pro
echo ========================================================
echo Launching Android Emulator with Hardware GPU Accel...
echo ========================================================
cd /d "%LOCALAPPDATA%\Android\Sdk\emulator"
emulator.exe -avd Pixel_9_Pro -gpu host
pause
