## Open-from-ZIP fix (v9)

When opening `index.html` as `file://`, browsers usually block `fetch('yard-inventory.json')`. This release includes `yard-inventory.js` containing the SAME partial snapshot, so the list renders offline even without a server. It is NOT live and not a complete yard inventory. Opening the HTML from a different directory without the other files still breaks the page.

When hosted over HTTP(S), the site tries `yard-inventory.json`, falling back to bundled snapshot only if that request fails. The existing Python/GitHub Actions workflow must be deployed and verified independently for daily updates. Refresh in the browser does not scrape LKQ.

# Pull List v8 — LKQ public-page importer (BETA)

The included `yard-inventory.json` is a **limited official-page sample**, captured 2026-10-25. It is NOT a full yard inventory. Rows and VINs were taken from pages visible in the public search result; the app labels them partial.

## Make daily refreshing work
1. Upload this entire folder (including `.github/workflows/refresh-yards.yml`) to a new GitHub repository.
2. In GitHub repository Settings > Actions > General set workflow permissions to **Read and write permissions**, if needed for automatic commits.
3. Open Actions > Refresh public LKQ vehicle pages > Run workflow. Confirm the new `yard-inventory.json` was committed.
4. Publish the website files through GitHub Pages / Netlify / another static site host. It will load `yard-inventory.json` and display its timestamp. For GitHub Pages, the repository root or deployed directory must contain the feed alongside index.html.
5. GitHub Actions runs daily (schedule timing may vary). The website refresh button **reloads the published snapshot**, not the original LKQ website.

**Limitations:** LKQ's public HTML may expose only a small subset (such as last-chance cars), or change its structure. This importer never calls an internal/private endpoint and never claims the result is complete. It marks failures as stale. Summit is **not connected** because an authoritative public full inventory export/API has not been verified. No live service exists until the hosted scheduled workflow is activated and validated. The browser cannot directly scrape third-party pages due to CORS.

Research recommendations remain separate from yard inventories, matched by make/model/year. Match quality is only approximate and does not confirm trims or actual parts on each vehicle.
