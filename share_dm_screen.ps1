# Curse of Strahd DM Screen & Player Sheet Local Wi-Fi Sharing Server
Write-Host "===============================================================" -ForegroundColor Red
Write-Host "  🦇 CURSE OF STRAHD — INTERACTIVE DM SCREEN & SHEET SERVER 🦇" -ForegroundColor Yellow
Write-Host "===============================================================" -ForegroundColor Red

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -match '^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)' -and 
    $_.InterfaceAlias -notmatch 'vEthernet|VirtualBox|VMware|Loopback'
} | Select-Object -First 1).IPAddress

if (-not $localIP) {
    $localIP = "localhost"
}

$port = 8080
$campaignDir = $PSScriptRoot

Write-Host "`n📡 SERVER IS READY! Connect your devices on the same Wi-Fi:`n" -ForegroundColor Green
Write-Host "📱 [Portal Hub]  👉 http://$($localIP):$port/index.html" -ForegroundColor Magenta
Write-Host "🛡️ [DM Screen]   👉 http://$($localIP):$port/DM_SCREEN.html" -ForegroundColor Yellow
Write-Host "`n📁 Serving Folder: $campaignDir" -ForegroundColor DarkGray
Write-Host "===============================================================" -ForegroundColor Red
Write-Host "💡 Tip: Bookmark the links above on your Phone, Tablet, or iPad!" -ForegroundColor White
Write-Host "Press [Ctrl + C] in this window to stop the server.`n" -ForegroundColor DarkGray

python -m http.server $port --directory "$campaignDir"
