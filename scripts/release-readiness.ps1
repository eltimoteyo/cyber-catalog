$ErrorActionPreference = 'Stop'

Write-Host '== Release Readiness ==' -ForegroundColor Cyan

Write-Host '[1/4] Running critical lint gate...' -ForegroundColor Yellow
npm run lint:critical
if ($LASTEXITCODE -ne 0) {
  throw 'Critical lint gate failed.'
}

Write-Host '[2/4] Running CI build gate...' -ForegroundColor Yellow
npm run build:ci
if ($LASTEXITCODE -ne 0) {
  throw 'Build gate failed.'
}

Write-Host '[3/4] Scanning tracked files for accidental secrets...' -ForegroundColor Yellow
$trackedFiles = git ls-files
$trackedContent = $trackedFiles | ForEach-Object { $_ }

$patterns = @(
  'AIza[0-9A-Za-z_-]{20,}',
  'BEGIN PRIVATE KEY',
  'FIREBASE_ADMIN_PRIVATE_KEY\\s*=\\s*[^\s]+'
)

$matches = @()
foreach ($pattern in $patterns) {
  $result = git grep -nE $pattern -- $trackedContent 2>$null
  if ($LASTEXITCODE -eq 0 -and $result) {
    $matches += $result
  }
}

if ($matches.Count -gt 0) {
  Write-Host 'Potential secrets found in tracked files:' -ForegroundColor Red
  $matches | Sort-Object -Unique | ForEach-Object { Write-Host $_ }
  throw 'Secret scan failed.'
}

Write-Host '[4/4] Verifying required production env placeholders are not left unresolved in template...' -ForegroundColor Yellow
$template = Get-Content '.env.local.example' -Raw
$required = @(
  'FIREBASE_ADMIN_PROJECT_ID=',
  'FIREBASE_ADMIN_CLIENT_EMAIL=',
  'FIREBASE_ADMIN_PRIVATE_KEY=',
  'NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY='
)

foreach ($key in $required) {
  if ($template -notmatch [regex]::Escape($key)) {
    throw "Missing expected key in .env.local.example: $key"
  }
}

Write-Host 'Release readiness checks passed.' -ForegroundColor Green
