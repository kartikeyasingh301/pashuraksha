param([string]$path, [string]$b64)
$bytes = [System.Convert]::FromBase64String($b64)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Written: $path"
