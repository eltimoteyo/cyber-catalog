param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

$ErrorActionPreference = 'Stop'
$base = $BaseUrl.TrimEnd('/')

Write-Host "== Smoke Test: $base ==" -ForegroundColor Cyan

$checks = @(
  '/login',
  '/admin',
  '/tenant-admin/products',
  '/tenant-admin/categories',
  '/tenant-admin/settings',
  '/api/admin/audit'
)

$failed = @()

foreach ($path in $checks) {
  $url = "$base$path"
  try {
    $response = Invoke-WebRequest -Uri $url -Method GET -MaximumRedirection 5 -UseBasicParsing -TimeoutSec 30
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
      Write-Host "OK  $($response.StatusCode)  $url" -ForegroundColor Green
    } else {
      Write-Host "BAD $($response.StatusCode)  $url" -ForegroundColor Red
      $failed += "$($response.StatusCode) $url"
    }
  } catch {
    Write-Host "ERR ---  $url  :: $($_.Exception.Message)" -ForegroundColor Red
    $failed += "ERR $url"
  }
}

if ($failed.Count -gt 0) {
  Write-Host ''
  Write-Host 'Smoke test failed on:' -ForegroundColor Red
  $failed | ForEach-Object { Write-Host " - $_" }
  exit 1
}

Write-Host 'Smoke test passed.' -ForegroundColor Green
