param(
  [Parameter(Mandatory = $true)][string]$AgentPath,
  [Parameter(Mandatory = $true)][string]$LaunchExportPath,
  [Parameter(Mandatory = $true)][string]$CallbackUrl
)

$serviceName = "AVRAIBusinessNodeAgent"
$statePath = Join-Path (Split-Path -Parent $AgentPath) "node-state.json"
$arguments = "--launch-export `"$LaunchExportPath`" --callback-url `"$CallbackUrl`" --service --state-path `"$statePath`" --heartbeat-interval 60"
$binaryPath = "`"$AgentPath`" $arguments"

if (Get-Service -Name $serviceName -ErrorAction SilentlyContinue) {
  Stop-Service -Name $serviceName -ErrorAction SilentlyContinue
  sc.exe delete $serviceName | Out-Null
}

New-Service `
  -Name $serviceName `
  -DisplayName "AVRAI Business Node Agent" `
  -BinaryPathName $binaryPath `
  -StartupType Automatic

Start-Service -Name $serviceName
Write-Host "Installed and started $serviceName"
