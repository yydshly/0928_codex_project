# Fetch the studied upstream revision and an official portable PHP runtime.
# Both downloads stay inside this project and are ignored by Git.
$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$upstreamDir = Join-Path $projectDir 'upstream'
$runtimeDir = Join-Path $projectDir '.runtime'
$phpDir = Join-Path $runtimeDir 'php-8.5.11'
$phpZip = Join-Path $runtimeDir 'php-8.5.11.zip'
$revision = '4d7235104870ec0224f445fd905c98f22a105426'
$phpUrl = 'https://downloads.php.net/~windows/releases/archives/php-8.5.11-nts-Win32-vs17-x64.zip'
$phpSha256 = '0ea96e0d2b9b737a6036f05cf4e95c49313faa6d0f27bd97edb2742503f0c043'

if (-not (Test-Path -LiteralPath $upstreamDir)) {
    & git clone --depth 1 https://github.com/ultrasecurity/Storm-Breaker.git $upstreamDir
    if ($LASTEXITCODE -ne 0) { throw 'Could not clone the original repository.' }
    $clonedRevision = (& git -C $upstreamDir rev-parse HEAD).Trim()
    if ($clonedRevision -ne $revision) {
        & git -C $upstreamDir fetch --depth 1 origin $revision
        if ($LASTEXITCODE -ne 0) { throw 'Could not fetch the studied revision.' }
        & git -C $upstreamDir checkout --detach $revision
        if ($LASTEXITCODE -ne 0) { throw 'Could not check out the studied revision.' }
    }
}

$currentRevision = (& git -C $upstreamDir rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $currentRevision -ne $revision) {
    throw "Existing upstream checkout is not the studied revision ($revision). Preserve local work and inspect it before continuing."
}
Write-Host "Original code ready: $currentRevision"

if (-not (Test-Path -LiteralPath (Join-Path $phpDir 'php.exe'))) {
    New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
    if (-not (Test-Path -LiteralPath $phpZip)) {
        Write-Host 'Downloading the official portable PHP 8.5.11 package...'
        $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
        if ($curl) {
            & $curl.Source --location --fail --silent --show-error --output $phpZip $phpUrl
            if ($LASTEXITCODE -ne 0) { throw 'Could not download the PHP archive.' }
        } else {
            Invoke-WebRequest -Uri $phpUrl -OutFile $phpZip
        }
    }
    $actualHash = (Get-FileHash -LiteralPath $phpZip -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actualHash -ne $phpSha256) {
        throw "PHP archive checksum differs from the official release: $actualHash. Do not run this archive."
    }
    Expand-Archive -LiteralPath $phpZip -DestinationPath $phpDir -Force
}

& (Join-Path $phpDir 'php.exe') --version
if ($LASTEXITCODE -ne 0) { throw 'Portable PHP could not start on this computer.' }
Write-Host 'Preparation complete. Run .\run-original.ps1 to start the original local web panel.'
