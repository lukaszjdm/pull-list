# Pull List — vehicle availability dates and photos

This update retains the successful Chicago North-only inventory scan.

## GitHub changes

Replace the existing root `sync_yards.py`, `app.js`, `index.html`, and `styles.css` with the versions in this ZIP. Do not overwrite your `yard-inventory.json`, `yard-inventory.js`, or research data with the samples in this ZIP.

Run your existing GitHub Actions refresh workflow. It will populate `availableDate` (`YYYY-MM-DD`), `vehicleUrl` and `imageUrl` when each car's public listing contains a usable image. Other cars show no image, not a fabricated stock photo.

## Limits

Photos are hotlinked from public LKQ URLs; if these sites block third-party embedding, the photos will not display. This importer does not download or mirror car images. HTML image markup may differ between listings. The photo parser is defensive and falls back to no photo. The code has been tested on local HTML fixtures, not a full remote LKQ refresh.

The site is a GitHub Pages site. After GitHub Actions commits changed inventory JSON, ensure your Pages build is redeployed (e.g. via a Pages workflow or manual trigger) to reflect the latest data.
