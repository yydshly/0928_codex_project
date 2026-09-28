# Stop only this project's loopback PHP server, if it is running.
$ErrorActionPreference = 'Stop'
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$expectedPhp = [System.IO.Path]::GetFullPath((Join-Path $projectDir '.runtime/php-8.5.11/php.exe'))
$expectedWebRoot = [System.IO.Path]::GetFullPath((Join-Path $projectDir 'upstream/storm-web'))
$listener = Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 2525 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $listener) {
    Write-Host 'Original local server is not running.'
    exit 0
}

$serverProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)"
if (-not $serverProcess -or $serverProcess.ExecutablePath -ne $expectedPhp -or $serverProcess.CommandLine -notlike "*$expectedWebRoot*") {
    throw 'Port 2525 belongs to a different process. No process was stopped.'
}

Stop-Process -Id $listener.OwningProcess
Write-Host 'Original local server stopped.'
