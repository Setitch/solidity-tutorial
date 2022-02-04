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

yarn
npm install -g @remix-project/remixd

Write-Host "Downloading Solitidy compiler in docker" -ForegroundColor blue
docker run ethereum/solc:stable solc --version

Write-Host "Starting Ganache with 10 accounts" -ForegroundColor blue
docker run --detach --publish 8545:8545 --publish 7545:7545 trufflesuite/ganache:rc --wallet.accounts="0x1bdf6a095ec24e5598afc92b8c9379f4c590faaf5f20221010fb702c984ceb75,100000000000000000000" --wallet.accounts="0x5360d7f60479ca253f00964def070c429fa4e6b6bca45ba3c968d54448218f02,1000000000000000000000" --wallet.accounts="0xafc344a84a454f14e14eae38035fefc83f78c2749c58f5de8af903a74e33817f,10000000000000000000000" --wallet.accounts="0xab681678ed875fe5bf9c57fc4e27322da9ccbb968123eb2175e7adcf2b7d9617,1000000000000000000" --wallet.accounts="0x62e64058be345d819c35074b78774451c887d343419855409c0d51b9177abee7,10000000000000000000" --wallet.accounts="0x5d2a85070f63a018e2bb10f3d1c63a6133494b5b1ee48b63e1bd237f8cb6f5da,500000000000000000000" --wallet.accounts="0x33031ec899f955b8796c1eec8eef108ba6c992ed74835c3cced3329cfa919523,5000000000000000000000" --wallet.accounts="0xd1e669031852528eb6971d0eaa6182097e6acf0f057f9cfc71bd7a3139c59bf7,50000000000000000000000" --wallet.accounts="0xbd395c8c3193c2c4f859afef3142a4d7d08df46faf966820b5b130c2fa6fdb71,65536000000000000000000" --chain.networkId 1337 --chain.chainId 1337

Write-Host "Starting Remix"  -ForegroundColor blue
docker pull remixproject/remix-ide:remix_live
docker run -d -p 8080:80 remixproject/remix-ide:remix_live

Write-Host ("Install Truffle - To make life swetter....😉")
npm install truffle -g
Write-Host ("Open Remix IDE")
open http://localhost:8080/
Write-Host ("Starting Remixd - local remix directories access point") -ForegroundColor blue
Write-Host ("TO CLOSE - JUST CTRL+C") -ForegroundColor red -BackgroundColor white
$dir = (Get-ScriptDirectory) + "/solidity"
Write-Host ("Install remixd")
npm install -g @remix-project/remixd
Write-Host ("Remixd shared directory: " + ($dir))  -ForegroundColor blue
remixd -s $dir --remix-ide http://localhost:8080/
