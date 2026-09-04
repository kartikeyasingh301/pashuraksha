# This script writes all remaining PashuSuraksha files
$base = 'C:\Users\KARTIKEYA\.gemini\antigravity\scratch\pashusuraksha\client'

function W($path, $content) {
    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "OK: $path"
}

# ReportForm.jsx - written in small chunks then joined
$rf = @()
$rf += 'import { useState, useCallback } from ''react'';'
$rf += 'import Layout from ''../../components/Layout.jsx'';'
$rf += 'import { useAuth } from ''../../contexts/AuthContext.jsx'';'
$rf += 'import { useSyncContext } from ''../../contexts/SyncContext.jsx'';'
$rf += 'import { useLocation } from ''../../hooks/useLocation.js'';'
$rf += 'import { apiPost } from ''../../api/client.js'';'
$rf += 'import { addToQueue } from ''../../sync/syncManager.js'';'
$rf += ''
$rf += 'const SPECIES_LIST = [''Cattle'', ''Buffalo'', ''Sheep'', ''Goat'', ''Pig'', ''Poultry'', ''Dog'', ''Other''];'
$rf += 'const SYNDROME_LIST = [''FMD'', ''PPR'', ''BQ'', ''Anthrax'', ''Rabies'', ''Brucellosis'', ''Theileriosis'', ''Lumpy Skin Disease'', ''HPAI'', ''Other''];'
$rf += 'const SYMPTOM_LIST = [''Fever'', ''Lameness'', ''Blisters/Ulcers'', ''Respiratory distress'', ''Neurological signs'', ''Diarrhea'', ''Sudden death'', ''Abortion'', ''Swelling'', ''Loss of appetite''];'
W "$base\src\pages\farmer\ReportForm_part1.js" ($rf -join "
")
Write-Host "Part 1 done"
