# Run the original PHP web panel on loopback only. Press Ctrl+C to stop.
$ErrorActionPreference = 'Stop'
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$upstreamDir = Join-Path $projectDir 'upstream'
$webRoot = Join-Path $upstreamDir 'storm-web'
$phpExe = Join-Path $projectDir '.runtime/php-8.5.11/php.exe'

if (-not (Test-Path -LiteralPath (Join-Path $webRoot 'index.php'))) {
    throw 'Original code is missing. Run .\prepare-original.ps1 first.'
}
if (-not (Test-Path -LiteralPath $phpExe)) {
    throw 'Portable PHP is missing. Run .\prepare-original.ps1 first.'
}

Write-Host 'Original Storm-Breaker panel: http://127.0.0.1:2525/'
Write-Host 'Server is limited to this computer. Press Ctrl+C to stop.'
& $phpExe -S 127.0.0.1:2525 -t $webRoot
