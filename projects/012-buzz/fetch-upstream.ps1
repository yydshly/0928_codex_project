# Downloads the fixed upstream revision for local research. The source is
# intentionally ignored by this repository to avoid copying the full project.
$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$revision = 'ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43'
$expectedSha256 = '87062D975ABD224F159500A33D3369195D2DC8AFB11832BEAABA0F194D1C557B'
$archive = Join-Path $projectRoot 'buzz-upstream.zip'
$extractRoot = Join-Path $projectRoot '_extract'
$source = Join-Path $projectRoot 'upstream'

if (Test-Path -LiteralPath $source) {
    throw "Source directory already exists: $source"
}
if (Test-Path -LiteralPath $extractRoot) {
    throw "Extraction directory already exists: $extractRoot"
}
if (-not (Test-Path -LiteralPath $archive)) {
    Invoke-WebRequest -Uri "https://codeload.github.com/block/buzz/zip/$revision" -OutFile $archive
}
$actualSha256 = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash
if ($actualSha256 -ne $expectedSha256) {
    throw "Archive SHA-256 mismatch. Expected $expectedSha256; got $actualSha256"
}
Expand-Archive -LiteralPath $archive -DestinationPath $extractRoot
$extracted = Join-Path $extractRoot "buzz-$revision"
if (-not (Test-Path -LiteralPath $extracted)) {
    throw "Expected upstream folder is missing: $extracted"
}
$verifiedExtracted = [System.IO.Path]::GetFullPath($extracted)
$verifiedSource = [System.IO.Path]::GetFullPath($source)
$rootPrefix = $projectRoot.TrimEnd('\') + '\'
if (-not $verifiedExtracted.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -or
    -not $verifiedSource.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Source paths must remain inside this project directory.'
}
Move-Item -LiteralPath $verifiedExtracted -Destination $verifiedSource
Write-Host "Buzz source ready at $verifiedSource ($revision)"
