function Get-ScriptDirectory
{
    $Invocation = (Get-Variable MyInvocation -Scope 1).Value;
    if($Invocation.PSScriptRoot)
    {
        $Invocation.PSScriptRoot;
    }
    Elseif($Invocation.MyCommand.Path)
    {
        Split-Path $Invocation.MyCommand.Path
    }
    else
    {
        $Invocation.InvocationName.Substring(0,$Invocation.InvocationName.LastIndexOf("\"));
    }
}

echo off

Write-Host "Downloading Solitidy compiler in docker" -ForegroundColor blue
docker run ethereum/solc:stable solc --version

Write-Host "Starting Remix"  -ForegroundColor blue
docker pull remixproject/remix-ide:remix_live
docker run -d -p 8080:80 remixproject/remix-ide:remix_live

Write-Host ("Starting Remixd - local remix directories access point") -ForegroundColor blue
$dir = (Get-ScriptDirectory) + "/solidity"
Write-Host ("Remixd shared directory: " + ($dir))  -ForegroundColor blue
Write-Host ("TO CLOSE - JUST CTRL+C") -ForegroundColor red -BackgroundColor white
remixd -s $dir --remix-ide http://localhost:8080/ 
