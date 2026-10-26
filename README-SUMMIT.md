# Summit official-search integration (experimental)

Files to upload **to the repository root**:
- `sync_yards.py` (replaces existing root script)
- `summit_official.py` (new file)

Do not overwrite `app.js`, `index.html`, `seed.js`, research files, or your inventory files.

Run your existing GitHub Actions `Refresh partial LKQ inventory snapshot` workflow after committing both files. Requirements are unchanged (`requests` and `beautifulsoup4`). This job scans all three LKQ yards and then searches Pick-n-Pull by make using ZIP `60501` and `distance=10`; it extracts ONLY results under the Summit heading. All results are marked as official Pick-n-Pull source with `Set` date and first image when present.

**Important limitation**: The Pick-n-Pull live HTML cannot be fetched for raw-markup testing in this environment, so the Summit parser is **experimental**, tested against synthetic HTML, not yet validated live. It may fail to find make controls or car images or may encounter client-rendered results. It is designed to retain prior inventory on failure and write an `ERROR` log; LKQ inventories still save normally. It rejects Summit counts below 800, since the user reported ~1144 as a recent baseline. Counts are expected to fluctuate and 800 is a safety threshold, not a claim of completion. A count above 800 does not prove complete coverage either. If import fails, send the `summit: ...` lines from the GitHub Actions run so the parser can be adapted based on the actual response.

If the run succeeds, verify `yard-inventory.json` under `yards.summit.vehicleCount` and `yards.summit.vehicles[0]`, and check your published site after Pages deployment.
