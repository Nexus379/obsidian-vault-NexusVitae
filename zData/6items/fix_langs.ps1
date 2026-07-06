$basePath = "c:\Users\niluf\Documents\4_Projects\GitHub\Obsdn_Vault\obsidian-vault-NexusVitae - Copy (2)\zData\6items"
$utf8 = New-Object System.Text.UTF8Encoding($true)

$files = @(
    "item_household.json",
    "ingre_pantry.json",
    "ingre_consumables.json"
)

foreach ($file in $files) {
    $filePath = Join-Path $basePath $file
    $text = [IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $modified = $false

    # Household
    if ($text -match '"washing_soda"') {
        $text = [regex]::Replace($text, '(?s)"label"\s*:\s*"Reines Waschsoda \(Putzsoda\)"', '"label": "Washing Soda"')
        $text = [regex]::Replace($text, '(?s)"lang"\s*:\s*\{\s*"de": "Waschsoda", "en": "Washing Soda"\s*\}', '"lang": { "de": "Waschsoda", "en": "Washing Soda", "es": "Carbonato de sodio", "fr": "Cristaux de soude", "ru": "Кальцинированная сода", "ja": "炭酸ナトリウム", "zh": "洗涤碱", "fa": "سودا شستشو", "hi": "वाशिंग सोडा", "ar": "صودا الغسيل" }')
        
        $text = [regex]::Replace($text, '(?s)"label"\s*:\s*"Reine Zitronensäure"', '"label": "Citric Acid"')
        $text = [regex]::Replace($text, '(?s)"lang"\s*:\s*\{\s*"de": "Zitronensäure", "en": "Citric Acid"\s*\}', '"lang": { "de": "Zitronensäure", "en": "Citric Acid", "es": "Ácido cítrico", "fr": "Acide citrique", "ru": "Лимонная кислота", "ja": "クエン酸", "zh": "柠檬酸", "fa": "اسید سیتریک", "hi": "साइट्रिक एसिड", "ar": "حمض الستريك" }')
        
        $modified = $true
    }

    # Pantry
    if ($text -match '"baking_soda_diy"') {
        $text = [regex]::Replace($text, '(?s)"label"\s*:\s*"Kaiser Natron \(Baking Soda\)"', '"label": "Baking Soda"')
        $text = [regex]::Replace($text, '(?s)"lang"\s*:\s*\{\s*"de": "Natron", "en": "Baking Soda"\s*\}', '"lang": { "de": "Natron", "en": "Baking Soda", "es": "Bicarbonato", "fr": "Bicarbonate de soude", "ru": "Пищевая сода", "ja": "重曹", "zh": "小苏打", "fa": "جوش شیرین", "hi": "बेकिंग सोडा", "ar": "صودا الخبز" }')
        
        $text = [regex]::Replace($text, '(?s)"label"\s*:\s*"Apfelessig \(Naturtrüb\)"', '"label": "Apple Cider Vinegar"')
        $text = [regex]::Replace($text, '(?s)"lang"\s*:\s*\{\s*"de": "Apfelessig", "en": "Apple Cider Vinegar"\s*\}', '"lang": { "de": "Apfelessig", "en": "Apple Cider Vinegar", "es": "Vinagre de manzana", "fr": "Vinaigre de cidre", "ru": "Яблочный уксус", "ja": "リンゴ酢", "zh": "苹果醋", "fa": "سرکه سیب", "hi": "सेब का सिरका", "ar": "خل التفاح" }')
        
        $text = [regex]::Replace($text, '(?s)"label"\s*:\s*"Bio Kokosöl \(Nativ\)"', '"label": "Coconut Oil"')
        $text = [regex]::Replace($text, '(?s)"lang"\s*:\s*\{\s*"de": "Kokosöl", "en": "Coconut Oil"\s*\}', '"lang": { "de": "Kokosöl", "en": "Coconut Oil", "es": "Aceite de coco", "fr": "Huile de coco", "ru": "Кокосовое масло", "ja": "ココナッツオイル", "zh": "椰子油", "fa": "روغن نارگیل", "hi": "नारियल का तेल", "ar": "زيت جوز الهند" }')
        
        $text = [regex]::Replace($text, '(?s)"label"\s*:\s*"Roh-Honig \(Kaltgeschleudert\)"', '"label": "Raw Honey"')
        $text = [regex]::Replace($text, '(?s)"lang"\s*:\s*\{\s*"de": "Honig", "en": "Honey"\s*\}', '"lang": { "de": "Honig", "en": "Raw Honey", "es": "Miel cruda", "fr": "Miel brut", "ru": "Сырой мед", "ja": "生はちみつ", "zh": "生蜂蜜", "fa": "عسل خام", "hi": "कच्चा शहद", "ar": "عسل خام" }')
        
        $modified = $true
    }

    # Consumables
    if ($text -match '"chamomile_tea_diy"') {
        $text = [regex]::Replace($text, '(?s)"label"\s*:\s*"Bio Kamillentee"', '"label": "Chamomile Tea"')
        $text = [regex]::Replace($text, '(?s)"lang"\s*:\s*\{\s*"de": "Kamillentee", "en": "Chamomile Tea"\s*\}', '"lang": { "de": "Kamillentee", "en": "Chamomile Tea", "es": "Té de manzanilla", "fr": "Camomille", "ru": "Ромашковый чай", "ja": "カモミールティー", "zh": "洋甘菊茶", "fa": "چای بابونه", "hi": "कैमोमाइल चाय", "ar": "شاي البابونج" }')
        $modified = $true
    }

    if ($modified) {
        [IO.File]::WriteAllText($filePath, $text, $utf8)
    }
}
Write-Host "Languages and labels fixed."
