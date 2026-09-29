param([switch]$PackageOnly)
$ErrorActionPreference = 'Stop'
$upstream = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../upstream'))
$desktop = Join-Path $upstream 'desktop'
$native = Join-Path $desktop 'src-tauri'
$output = Join-Path $upstream 'runtime/BuzzZh'
if (-not $PackageOnly) {
    node (Join-Path $PSScriptRoot 'localize.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Localization failed.' }
    node (Join-Path $PSScriptRoot 'prepare-windows-build.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Native build preparation failed.' }
    Push-Location $desktop
    try {
        pnpm exec tsc --noEmit
        if ($LASTEXITCODE -ne 0) { throw 'Typecheck failed.' }
        pnpm exec vite build
        if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }
    } finally { Pop-Location }
    $env:RUSTUP_TOOLCHAIN = 'stable'
    $env:CARGO_PROFILE_DEV_DEBUG = '0'
    $env:CARGO_PROFILE_DEV_INCREMENTAL = 'false'
    $env:TAURI_CONFIG = '{"bundle":{"externalBin":[]}}'
    Push-Location $native
    try {
        cargo build --locked --bin buzz-desktop --features tauri/custom-protocol
        if ($LASTEXITCODE -ne 0) { throw 'Desktop build failed.' }
    } finally { Pop-Location }
}
New-Item -ItemType Directory -Path $output -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $native 'target/debug/buzz-desktop.exe') -Destination $output
Get-ChildItem (Join-Path $native 'target/debug') -Filter '*.dll' | Copy-Item -Destination $output
foreach ($name in @('buzz.exe','buzz-acp.exe','buzz-agent.exe','buzz-dev-mcp.exe','git-credential-nostr.exe')) {
    Copy-Item -LiteralPath (Join-Path $upstream "runtime/BuzzApp/$name") -Destination $output
}
Copy-Item -LiteralPath (Join-Path $upstream 'LICENSE') -Destination (Join-Path $output 'UPSTREAM-LICENSE.txt')
$manifest = [ordered]@{
    edition = 'Local Simplified Chinese research build; not an official Block release'
    upstreamCommit = 'ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43'
    buildProfile = 'dev with tauri/custom-protocol (embedded frontend)'
    sidecars = 'official desktop-v0.5.25 Windows release'
    executableSha256 = (Get-FileHash (Join-Path $output 'buzz-desktop.exe') -Algorithm SHA256).Hash
}
$manifest | ConvertTo-Json | Set-Content (Join-Path $output 'build-info.json') -Encoding utf8
Write-Host "Chinese desktop is ready: $output"
