$basePath = "c:\Users\niluf\Documents\4_Projects\GitHub\Obsdn_Vault\obsidian-vault-NexusVitae - Copy (2)\zData\6items"

$mapping = @{
    "ingre_fresh.json" = @("ingre_1_1leafy.json", "ingre_1_2vegfruit.json", "ingre_1_3ground.json", "ingre_1_5fruits.json", "ingre_2_2meat.json", "ingre_2_3milk_egg_co.json")
    "ingre_pantry.json" = @("ingre_1_4legumes.json", "ingre_1_6grains.json", "ingre_1_7nuts_seeds.json", "ingre_1_8dry_packs.json", "ingre_4_2backing_noodles.json", "ingre_2_1oil_sweet_base.json")
    "ingre_consumables.json" = @("ingre_3_1softdrinks.json", "ingre_3_2alcohol.json", "ingre_4_1prepared_.json", "ingre_5_4sweet.json", "ingre_5_5fix_tk.json")
    "item_household.json" = @("item_1_1cleaning.json")
    "item_personal.json" = @("item_2_1selfcare.json", "ingre_6_4supplements.json")
    "item_tech_office.json" = @("item_3_1arts.json")
    "item_leisure.json" = @("ingre_2_4pet.json")
}

$utf8WithBom = New-Object System.Text.UTF8Encoding $true

foreach ($target in $mapping.Keys) {
    $mergedContent = ""
    foreach ($source in $mapping[$target]) {
        $sourcePath = Join-Path $basePath $source
        if (Test-Path $sourcePath) {
            $content = [IO.File]::ReadAllText($sourcePath)
            $content = $content.Trim()
            if ($content.StartsWith("{")) { $content = $content.Substring(1) }
            if ($content.EndsWith("}")) { $content = $content.Substring(0, $content.Length - 1) }
            $content = $content.Trim()
            
            if ($content -ne "") {
                if ($mergedContent -ne "") { $mergedContent += " , `n" }
                $mergedContent += $content
            }
        } else {
            Write-Host "Warning: File not found: $sourcePath"
        }
    }
    
    $finalContent = "{`n" + $mergedContent + "`n}"
    $targetPath = Join-Path $basePath $target
    [IO.File]::WriteAllText($targetPath, $finalContent, $utf8WithBom)
    Write-Host "Created $target"
}

# Delete old files if successful
foreach ($sources in $mapping.Values) {
    foreach ($source in $sources) {
        $sourcePath = Join-Path $basePath $source
        if (Test-Path $sourcePath) {
            Remove-Item $sourcePath -Force
            Write-Host "Deleted $source"
        }
    }
}
