# Pull List v13 — four-yard integration and arrival-date sorting

Upload only these files to the root of the GitHub repository: `sync_yards.py`, `app.js`, `index.html`. Keep existing research files, `seed.js`, `seed.json`, `yard-inventory.json`, `yard-inventory.js`, and styles.

Run the existing GitHub Actions refresh workflow afterwards.

* LKQ Chicago North, Chicago South, and Blue Island: all publicly paginated pages, with date and main-photo extraction retained.
* Summit: best-effort separate third-party inventory index from SalvageWatch, **not official Pick-n-Pull availability**. Its dates/photos are deliberately blank when not directly supported by the index. User should confirm availability with Pick-n-Pull.
* Both arrival-date sort orders put missing dates after dated vehicles. They apply across all selected yards.
* If a yard scan fails, its previous saved vehicles are retained and marked stale. Other yards still save successfully.
* This code has not been tested against a full live GitHub Actions run. Summit parser may need adjustment if SalvageWatch changes markup.
