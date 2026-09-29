param([switch]$ServicesOnly, [switch]$English)
$ErrorActionPreference = 'Stop'
$upstream = Join-Path $PSScriptRoot 'upstream'
$runtime = Join-Path $upstream 'runtime'
$pgBin = 'D:\software\postsql\bin'

function Test-LocalPort([int]$port) {
    $client = [Net.Sockets.TcpClient]::new()
    try { return $client.ConnectAsync('127.0.0.1', $port).Wait(300) -and $client.Connected }
    catch { return $false }
    finally { $client.Dispose() }
}

if (-not (Test-Path (Join-Path $upstream '.env'))) { throw 'Local runtime has not been configured. See runtime.md.' }
foreach ($line in Get-Content (Join-Path $upstream '.env')) {
    if ($line -match '^([A-Z_][A-Z_0-9]*)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
if (-not (Test-LocalPort 55432)) {
    $pgData = Join-Path $runtime 'postgres'
    $pgLog = Join-Path $runtime 'postgres.log'
    $pgStart = Start-Process -FilePath (Join-Path $pgBin 'pg_ctl.exe') -ArgumentList @('start', '-D', "`"$pgData`"", '-l', "`"$pgLog`"", '-o', '"-h 127.0.0.1 -p 55432"') -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtime 'pg-start.log') -RedirectStandardError (Join-Path $runtime 'pg-start-error.log')
    if (-not $pgStart.WaitForExit(15000) -or $pgStart.ExitCode -ne 0) { throw 'PostgreSQL did not start. Check runtime/postgres.log.' }
}
if (-not (Test-LocalPort 6379)) {
    $redisDir = Join-Path $runtime 'redis\Redis-7.2.16-Windows-x64-msys2'
    Start-Process -FilePath (Join-Path $redisDir 'redis-server.exe') -ArgumentList '--bind 127.0.0.1 --port 6379 --protected-mode yes' -WorkingDirectory $redisDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtime 'redis.log') -RedirectStandardError (Join-Path $runtime 'redis-error.log')
}
if (-not (Test-LocalPort 9000)) {
    $env:MINIO_ROOT_USER = 'buzz_dev'
    $env:MINIO_ROOT_PASSWORD = 'buzz_dev_secret'
    $data = Join-Path $runtime 'minio-data'
    Start-Process -FilePath (Join-Path $runtime 'minio.exe') -ArgumentList @('server', "`"$data`"", '--address', '127.0.0.1:9000', '--console-address', '127.0.0.1:9001') -WorkingDirectory $runtime -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtime 'minio.log') -RedirectStandardError (Join-Path $runtime 'minio-error.log')
}
for ($attempt = 0; $attempt -lt 20; $attempt++) {
    if ((Test-LocalPort 6379) -and (Test-LocalPort 9000)) { break }
    Start-Sleep -Milliseconds 500
}
if (-not (Test-LocalPort 3000)) {
    Start-Process -FilePath (Join-Path $upstream 'target\debug\buzz-relay.exe') -WorkingDirectory $upstream -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtime 'relay.log') -RedirectStandardError (Join-Path $runtime 'relay-error.log')
}
$ready = $false
for ($attempt = 0; $attempt -lt 20; $attempt++) {
    try { $health = Invoke-RestMethod 'http://127.0.0.1:8080/_readiness' -TimeoutSec 1; if ($health.status -eq 'ready') { $ready = $true; break } } catch { }
    Start-Sleep -Milliseconds 500
}
if (-not $ready) { throw 'Buzz relay is not ready. Check upstream/runtime/relay-error.log.' }
Write-Host 'Buzz local services are ready.'
if (-not $ServicesOnly) {
    $appDir = Join-Path $runtime $(if ($English) { 'BuzzApp' } else { 'BuzzZh' })
    $app = Join-Path $appDir 'buzz-desktop.exe'
    if (-not (Test-Path $app)) { throw 'The selected desktop build is missing. See localization/README.md.' }
    $env:BUZZ_RELAY_URL = 'ws://127.0.0.1:3000'
    Remove-Item Env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS -ErrorAction SilentlyContinue
    Start-Process -FilePath $app -WorkingDirectory $appDir
}
