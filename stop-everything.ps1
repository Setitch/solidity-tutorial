$r=docker ps -q --filter ancestor=remixproject/remix-ide:remix_live
if (-not ([string]::IsNullOrEmpty($r)))
{
	Write-Host "Stoping Remix"  -ForegroundColor blue
	docker stop $r
}
