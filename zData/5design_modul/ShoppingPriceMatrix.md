> [!info] Shopping Strategy Matrix
> | Mode | Vendor | Price |
> | :--- | :--- | ---: |
> | Preferred | `INPUT[text:pref_vendor]` | `INPUT[number:pref_price]` |
> | Cheap | `INPUT[text:vendor_cheap]` | `INPUT[number:price_cheap]` |
> | Best Value | `INPUT[text:vendor_value]` | `INPUT[number:price_value]` |
> | Organic Cheap | `INPUT[text:vendor_pure_cheap]` | `INPUT[number:price_pure_cheap]` |
> | Organic / Best | `INPUT[text:vendor_pure]` | `INPUT[number:price_pure]` |
> | Market | `INPUT[text:vendor_market]` | `INPUT[number:price_market]` |
>
> Current finance unit price: `VIEW[{unit_price}]`
> `BUTTON[apply-shopping-price]`
