
#!/usr/bin/env python3
"""Collect vehicles from all publicly linked LKQ inventory pages."""

import datetime as dt
import json
import pathlib
import re
import sys
import time
from urllib.parse import urljoin, urlparse, parse_qs

import requests
from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parent
PATH = ROOT / "yard-inventory.json"
JS_PATH = ROOT / "yard-inventory.js"

YARDS = {
    "north": "https://www.pyp.com/inventory/chicago-north-1581/",
    "south": "https://www.pyp.com/inventory/chicago-south-1585/",
    "island": "https://www.pyp.com/inventory/blue-island-1582/",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PullListInventory/1.1)"
}

VIN = re.compile(r"\b(?:VIN\s*)?([A-HJ-NPR-Z0-9]{17})\b", re.I)
ROW = re.compile(r"\bRow\s+([A-Za-z0-9-]+)", re.I)
SPACE = re.compile(r"\bSpace\s+([A-Za-z0-9-]+)", re.I)
SECTION = re.compile(r"\bSection\s+(.+?)\s*\|?\s*Row\b", re.I)
STOCK = re.compile(r"\b(158[125]-\d{4,})\b")

MAX_PAGES = 200
PAGE_DELAY_SECONDS = 0.3


def parse(html, yard):
    soup = BeautifulSoup(html, "html.parser")
    vehicles = []
    seen = set()

    for h in soup.find_all("h3"):
        title = " ".join(h.stripped_strings)
        match = re.match(r"^(\d{4})\s+(.+)$", title)

        if not match:
            continue

        words = match.group(2).split()

        if len(words) < 2:
            continue

        special_makes = [
            "MERCEDES-BENZ",
            "LAND ROVER",
            "ALFA ROMEO",
            "ASTON MARTIN",
        ]

        remaining = " ".join(words)
        special_make = next(
            (
                name for name in special_makes
                if remaining.upper().startswith(name + " ")
            ),
            None
        )

        if special_make:
            make = special_make.title()
            model = remaining[len(special_make):].strip()
        else:
            make = words[0].title()
            model = " ".join(words[1:]).title()

        collected = []

        for node in h.next_elements:
            if node is h:
                continue

            if getattr(node, "name", None) == "h3":
                break

            if getattr(node, "name", None) in ("script", "style"):
                continue

            if isinstance(node, str) and node.strip():
                collected.append(node.strip())

            if len(collected) > 100:
                break

        block = " ".join(collected)

        vin_match = VIN.search(block)
        stock_match = STOCK.search(block)

        vin = vin_match.group(1) if vin_match else ""
        stock = stock_match.group(1) if stock_match else ""

        if not vin and not stock:
            continue

        ident = stock or vin

        if ident in seen:
            continue

        seen.add(ident)

        row_match = ROW.search(block)
        space_match = SPACE.search(block)
        section_match = SECTION.search(block)

        vehicles.append({
            "id": f"{yard}-{ident}",
            "yard": yard,
            "year": int(match.group(1)),
            "make": make,
            "model": model,
            "row": row_match.group(1) if row_match else "",
            "space": space_match.group(1) if space_match else "",
            "section": (
                section_match.group(1).strip(" |")
                if section_match else ""
            ),
            "stock": stock,
            "vin": vin,
            "source": "Official LKQ public inventory page",
            "sourceUrl": YARDS[yard],
        })

    return vehicles


def next_page(html, current_url, base_url):
    """Follow only the official Next Page navigation."""

    soup = BeautifulSoup(html, "html.parser")
    base = urlparse(base_url)

    for link in soup.find_all("a", href=True):
        label = " ".join(link.stripped_strings).lower()

        if "next page" not in label:
            continue

        url = urljoin(current_url, link["href"])
        parsed = urlparse(url)

        if (
            parsed.netloc != base.netloc
            or parsed.path.rstrip("/") != base.path.rstrip("/")
        ):
            raise RuntimeError(
                f"Unexpected pagination destination: {url}"
            )

        if not parse_qs(parsed.query).get("page"):
            raise RuntimeError(
                f"Next Page link has no page number: {url}"
            )

        return url

    return None


def fetch_all_pages(yard, base_url):
    session = requests.Session()
    page_url = base_url

    visited = set()
    unique = {}
    page_count = 0

    while page_url:
        if page_url in visited:
            raise RuntimeError("Pagination loop detected")

        if page_count >= MAX_PAGES:
            raise RuntimeError(
                f"Reached {MAX_PAGES}-page safety limit"
            )

        visited.add(page_url)

        response = session.get(
            page_url,
            headers=HEADERS,
            timeout=35
        )

        response.raise_for_status()

        cars = parse(response.text, yard)

        if not cars:
            raise RuntimeError(
                f"No vehicle cards on page {page_count + 1}: "
                f"{page_url}"
            )

        for car in cars:
            unique[car["stock"] or car["vin"]] = car

        page_count += 1

        print(
            f"{yard}: page {page_count}, "
            f"{len(cars)} cards, "
            f"{len(unique)} unique total",
            flush=True
        )

        page_url = next_page(
            response.text,
            page_url,
            base_url
        )

        if page_url:
            time.sleep(PAGE_DELAY_SECONDS)

    return list(unique.values()), page_count


def main():
    if PATH.exists():
        feed = json.loads(PATH.read_text(encoding="utf-8"))
    else:
        feed = {
            "format": "pull-list-yard-feed-v1",
            "yards": {}
        }

    feed["format"] = "pull-list-yard-feed-v1"

    now = (
        dt.datetime.now(dt.timezone.utc)
        .isoformat()
        .replace("+00:00", "Z")
    )

    succeeded = 0

    for yard, url in YARDS.items():
        old = feed.setdefault("yards", {}).get(yard, {})

        try:
            vehicles, pages = fetch_all_pages(yard, url)

            if not vehicles:
                raise RuntimeError("No verified vehicles")

            feed["yards"][yard] = {
                "status": "partial",
                "checkedAt": now,
                "sourceUrl": url,
                "message": (
                    f"Scanned all {pages} publicly linked "
                    f"inventory pages "
                    f"({len(vehicles)} unique vehicles). "
                    f"Availability may change."
                ),
                "pageCount": pages,
                "vehicleCount": len(vehicles),
                "vehicles": vehicles,
            }

            succeeded += 1

            print(
                f"{yard}: COMPLETE PAGINATION: "
                f"{pages} pages, "
                f"{len(vehicles)} unique vehicles",
                flush=True
            )

        except Exception as exc:
            feed["yards"][yard] = {
                **old,
                "status": "stale",
                "message": (
                    f"Full-page scan failed: "
                    f"{str(exc)[:160]}. "
                    f"Older snapshot retained."
                ),
            }

            print(
                f"{yard}: ERROR: {exc}",
                file=sys.stderr,
                flush=True
            )

    feed["yards"].setdefault("summit", {
        "status": "unavailable",
        "checkedAt": None,
        "sourceUrl": None,
        "message": "Summit inventory not yet integrated.",
        "vehicles": [],
    })

    feed["generatedAt"] = now

    PATH.write_text(
        json.dumps(feed, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )

    JS_PATH.write_text(
        "window.PULL_LIST_BUNDLED_YARDS = "
        + json.dumps(
            feed,
            ensure_ascii=False,
            separators=(",", ":")
        )
        + ";\n",
        encoding="utf-8"
    )

    if not succeeded:
        raise SystemExit(
            "All LKQ page scans failed; "
            "previous snapshots retained."
        )


if __name__ == "__main__":
    main()
