# Pull List v10 — publishing and daily refresh

**This ZIP is deployment-ready but is not already deployed.** The LKQ feed remains a **partial** public-page snapshot: the existing importer cannot prove it captured the full yard inventory. Summit official search is linked, but no full Summit importer has been validated.

## Publish using GitHub (no command line required)

1. Create a GitHub account if needed and create a new **public** repository named `pull-list`. Since it is public, anyone can inspect repository data; avoid placing private notes in `seed.json` or other files.
2. Use **Add file > Upload files** to upload **the contents of this ZIP's `pull-list` folder**, not the enclosing folder. Note: GitHub's browser upload may not include hidden `.github` files: create `.github/workflows/refresh-yards.yml` manually using the editor if needed.
3. Under **Settings > Pages**, choose **Deploy from a branch**, **main**, and **/(root)**, then Save. The resulting site URL follows `https://YOUR-USERNAME.github.io/pull-list/`.
4. Under **Settings > Actions > General**, set workflow permissions to **Read and write permissions**.
5. Under **Actions**, open **Refresh partial LKQ inventory snapshot** and select **Run workflow**. Check the output and confirm that both `yard-inventory.json` and `yard-inventory.js` were committed.
6. Visit your site, choose a yard, and verify the displayed check timestamp and count against the official inventory before relying on it. The workflow runs daily at 10:17 UTC but GitHub may delay schedules.

### Status definitions
- **partial:** vehicle cards extracted from the official public HTML; full coverage NOT verified.
- **stale:** last refresh failed; older observations kept. Do not assume vehicles are still present.
- **unavailable:** no usable validated official feed available.

### Important technical limitation
The LKQ webpages currently provide some car cards directly in HTML; they may show only last-chance stock and not the full searchable inventory. The included script does **not** circumvent access restrictions or internal API authentication. The Summit link is the official search, not a synchronised local inventory. Do not treat partial counts as yard totals.

### Local testing (optional)
`python -m pip install -r requirements.txt`
`python scripts/sync_yards.py`
`python -m http.server 8000`
Visit http://localhost:8000/

Opening index.html directly still shows the bundled **partial** snapshot, never a live feed. The refresh button reads the hosted snapshot, not LKQ itself.
