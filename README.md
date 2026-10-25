# Pull List — first working prototype

Mobile-friendly static website focused on four Illinois yards. Open `index.html` in your browser or deploy this folder on Netlify, Vercel, or GitHub Pages as a static site. No build step required.

## Included
- Yard picker: LKQ Chicago North, Chicago South, Blue Island, Pick-n-Pull Summit, all yards and separate Mazda6 demo
- 21 imported 2016 Mazda6 recommendations, separated by general, thin evidence, and fitment verification
- Vehicle search, year filter, sort by row or estimated net profit
- Part editor (selling price, yard cost, shipping, year range, trim, pull time, notes)
- Profit calculator (sale price less yard price, shipping and adjustable percentage fee / other costs)
- eBay sold listings per part, customizable search query
- Manual vehicle addition and CSV import, JSON part import, backup export and restore, two-tap removal
- Dark mode, local storage, NHTSA VIN decoding if online

## Not included yet
- Live inventory scraping or daily refresh, automatic LKQ pricing, Summit inventory URL, barcode/OCR camera-based VIN scanning, hosted multi-device sync, eBay sold price automation. Requires backend or further integration.
- Seeded sale prices are unverified and should be edited after checking actual eBay sold listings. Pull times are placeholders (moderate) until verified by the user.

## Yard CSV
Headers: `yard,year,make,model,row,vin,trim,engine,body`.
The yard column may be `north`, `south`, `island`, or `summit`, or the full displayed yard name. If your CSV omits `yard`, select a specific yard before importing.

Example: `north,2016,Mazda,Mazda6,12,JM1GJ1U51G1409961,Sport,2.5L,Sedan`

## JSON imports
Accepts Scrap Solutions-style recommendations JSON (requires vehicle `query` field, or entries with make/model) or Pull List-formatted arrays. Import only data you have the right to reuse. Duplicate imports are not automatically merged; review imports before repeating.

## Data safety
Data is saved in your current browser's localStorage, not to the server. Clearing browser site data or switching devices loses edits unless you export and restore a backup. VIN lookup makes an outbound request to the U.S. NHTSA vPIC API. Everything else works locally.


Version 3 adds a 2012 Audi A6 C7 sample vehicle and 21 recommendations, alongside the Mazda6. The site merges Audi seed records into existing local storage. Live yards remain unconnected.

Version 4: third sample vehicle, 2011 Ford F-250 SD 6.2L (20 recommendations). Three total demo vehicles, 61 recommendation records. Added basic import duplicate checks. Not connected to yard inventory.


Version 6: removed featured vehicle panels. 90 unique research vehicles (88 VINs in latest batch plus 2 originals), preserving prior edits under same origin. 1,200+ part leads imported. Not live yard inventory.

Version 7: 157 VIN-level research records (including originals); 850 newly added part leads; detail view VIN, generation, trim, body, engine, fuel, drivetrain, transmission. Missing fields not inferred.
