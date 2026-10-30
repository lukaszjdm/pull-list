#!/usr/bin/env python3
"""Pull List UI patch: single profit figure on vehicle cards + bottom pager.

Place alongside app.js, index.html, and styles.css, then run:
    python3 apply_pull_list_ui_fixes.py

This makes display/navigation changes only; it does not change profit calculations
or vehicle/parts data. The changes are compatible with the Oct 30 model fixes.
"""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
FILES = {name: ROOT / name for name in ("app.js", "index.html", "styles.css")}


def replace_once(src: str, old: str, new: str, title: str) -> str:
    count = src.count(old)
    if count != 1:
        raise RuntimeError(f"{title}: expected 1 match, found {count}; files left unchanged")
    return src.replace(old, new, 1)


def main() -> None:
    for name, path in FILES.items():
        if not path.is_file():
            raise FileNotFoundError(f"Missing {name}; place script beside app.js and index.html")

    original = {name: path.read_text(encoding="utf-8") for name, path in FILES.items()}
    app = original["app.js"]
    html = original["index.html"]
    css = original["styles.css"]

    markers = [
        "prevButtonBottom" in app,
        'id="prevPageBottom"' in html,
        ".pagerbar-bottom{" in css,
    ]
    if all(markers) and "Potential profit · Verify fitment" not in app:
        print("UI patch was already applied. No changes needed.")
        return
    if any(markers):
        raise RuntimeError("Some UI changes are already present; aborting to avoid duplicate controls")

    # Hide only the secondary value on vehicle cards. Keep potentialProfit()
    # for other code paths, calculations, and the vehicle detail view.
    app = replace_once(
        app,
        "   const potential = potentialProfit(car);\n",
        "",
        "Remove extra vehicle-card profit binding",
    )
    app = replace_once(
        app,
        '''<div class="value" style="margin-top:10px;font-size:1.1rem">
  ${potential === null ? '—' : money(potential)}
</div>

<small>
  Potential profit · Verify fitment
</small>


''',
        "",
        "Remove extra vehicle-card profit HTML",
    )

    # Reuse the existing paging state; both bars must always agree.
    app = replace_once(
        app,
        "  const pageSummary = document.getElementById('pageSummary');",
        """  const pageSummary = document.getElementById('pageSummary');
  const prevButtonBottom = document.getElementById('prevPageBottom');
  const nextButtonBottom = document.getElementById('nextPageBottom');
  const pageIndicatorBottom = document.getElementById('pageIndicatorBottom');
  const pageSummaryBottom = document.getElementById('pageSummaryBottom');""",
        "Add bottom pagination DOM references",
    )
    app = replace_once(
        app,
        """    !pageIndicator ||
    !pageSummary
  ) {""",
        """    !pageIndicator ||
    !pageSummary ||
    !prevButtonBottom ||
    !nextButtonBottom ||
    !pageIndicatorBottom ||
    !pageSummaryBottom
  ) {""",
        "Validate bottom pagination controls",
    )
    app = replace_once(
        app,
        """    pageIndicator.textContent =
      `Page ${currentPage} of ${totalPages}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;""",
        """    pageIndicator.textContent =
      `Page ${currentPage} of ${totalPages}`;
    pageIndicatorBottom.textContent = pageIndicator.textContent;
    pageSummaryBottom.textContent = pageSummary.textContent;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;
    prevButtonBottom.disabled = prevButton.disabled;
    nextButtonBottom.disabled = nextButton.disabled;""",
        "Sync top and bottom pagination display",
    )
    app = replace_once(
        app,
        """  console.log(
    '[Pull List] Mobile pagination loaded.',""",
        """  // Both sets of pagination buttons use the same state and behavior.
  prevButtonBottom.onclick = prevButton.onclick;
  nextButtonBottom.onclick = nextButton.onclick;

  console.log(
    '[Pull List] Mobile pagination loaded.',""",
        "Wire bottom Previous/Next buttons",
    )

    html = replace_once(
        html,
        '''      <!-- ONLY CURRENT PAGE'S VEHICLE CARDS ARE RENDERED -->
      <div class="cargrid" id="vehicles"></div>''',
        '''      <!-- ONLY CURRENT PAGE'S VEHICLE CARDS ARE RENDERED -->
      <div class="cargrid" id="vehicles"></div>

      <!-- BOTTOM PAGINATION -->
      <div class="pagerbar pagerbar-bottom" role="navigation" aria-label="Bottom vehicle pagination">
        <div class="pager-summary" id="pageSummaryBottom" aria-live="polite">
          Loading vehicles...
        </div>
        <div class="pager-controls">
          <button class="btn" id="prevPageBottom" type="button" disabled>
            ← Previous
          </button>
          <span class="pager-page" id="pageIndicatorBottom" aria-live="polite">
            Page 1 of 1
          </span>
          <button class="btn" id="nextPageBottom" type="button" disabled>
            Next →
          </button>
        </div>
      </div>''',
        "Add pagination below the vehicle list",
    )

    css = replace_once(
        css,
        ".pagerbar label{",
        ".pagerbar-bottom{\n  margin-top:14px;\n}\n\n.pagerbar label{",
        "Add spacing above bottom pager",
    )

    # Bust the browser's JS/CSS cache when GitHub Pages publishes new code.
    html, js_count = re.subn(
        r'(<script src="app\.js\?v=)[^"\s]+',
        r'\g<1>20261030-ui-fixes',
        html,
    )
    if js_count != 1:
        raise RuntimeError(f"Expected one versioned app.js script; found {js_count}")
    html, css_count = re.subn(
        r'(<link href="styles\.css)(?:\?v=[^"\s]+)?(" rel="stylesheet"/>)',
        r'\g<1>?v=20261030-ui-fixes\g<2>',
        html,
    )
    if css_count != 1:
        raise RuntimeError(f"Expected one styles.css stylesheet; found {css_count}")

    # Check all new IDs match the JavaScript before touching any files.
    for id_name in ("prevPageBottom", "nextPageBottom", "pageIndicatorBottom", "pageSummaryBottom"):
        if f'id="{id_name}"' not in html or f"getElementById('{id_name}')" not in app:
            raise RuntimeError(f"Missing bottom pager wiring: {id_name}")
    if "Potential profit · Verify fitment" in app:
        raise RuntimeError("Secondary profit display was not fully removed")

    for name, new_content in (("app.js", app), ("index.html", html), ("styles.css", css)):
        FILES[name].write_text(new_content, encoding="utf-8")
        print(f"Updated {name}")
    print("Done. Commit and push app.js, index.html, and styles.css to publish.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
