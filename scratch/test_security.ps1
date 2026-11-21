$ErrorActionPreference = 'Stop'
# Base URL of the local dev server
$base = 'http://localhost:3000'

Write-Host "--- Security Endpoint Tests ---"

# Helper to perform request and check status code
function Get-StatusCode($response) {
  if ($response -match "HTTP/[0-9\.]+ ([0-9]{3})") {
    return $Matches[1]
  }
  return $null
}

# 1. Unauthenticated access to admin stats (should be 401)
$resp = curl.exe -i -s "$base/api/stats" -X GET
$code = Get-StatusCode $resp
if ($code -eq '401') { Write-Host "PASS: Unauthenticated stats returned 401" } else { Write-Host "FAIL: Expected 401, got $code" }

# 2. Login as admin (default credentials admin/admin123)
$login = curl.exe -i -s -X POST "$base/api/auth/login/route" -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' -c cookies.txt
$code = Get-StatusCode $login
if ($code -eq '200') { Write-Host "PASS: Login succeeded" } else { Write-Host "FAIL: Login failed with $code" }

# 3. Authenticated access to admin stats (should be 200)
$auth = curl.exe -i -s -X GET "$base/api/stats" -b cookies.txt
$code = Get-StatusCode $auth
if ($code -eq '200') { Write-Host "PASS: Authenticated stats accessible" } else { Write-Host "FAIL: Auth access returned $code" }

# 4. Rate limit test on login (6 rapid attempts with wrong password)
Write-Host "Testing login rate limit"
$ratePassed = $false
for ($i=1; $i -le 6; $i++) {
  $r = curl.exe -i -s -X POST "$base/api/auth/login/route" -H "Content-Type: application/json" -d '{"username":"admin","password":"wrong"}' -c cookies.txt
  $code = Get-StatusCode $r
  if ($code -eq '429') { Write-Host "PASS: Rate limit triggered on attempt $i"; $ratePassed = $true; break }
}
if (-not $ratePassed) { Write-Host "FAIL: Rate limit not triggered" }

# 5. Logout
$logout = curl.exe -i -s -X POST "$base/api/auth/logout/route" -b cookies.txt -c cookies.txt
$code = Get-StatusCode $logout
if ($code -eq '200') { Write-Host "PASS: Logout succeeded" } else { Write-Host "FAIL: Logout failed with $code" }

# 6. Access after logout (should be 401)
$post = curl.exe -i -s -X GET "$base/api/stats" -b cookies.txt
$code = Get-StatusCode $post
if ($code -eq '401') { Write-Host "PASS: Post-logout access denied" } else { Write-Host "FAIL: Post-logout returned $code" }

Write-Host "--- Tests Completed ---"
