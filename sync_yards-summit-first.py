#!/usr/bin/env python3
"""Read Chicago North LKQ inventory pages and save the result.

This follows the website's regular Next Page links (e.g. ?page=2), without
bypassing restrictions. Partial/failed runs do not replace prior snapshots.
"""
from __future__ import annotations
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
PATH = ROOT / 'yard-inventory.json'
JS_PATH = ROOT / 'yard-inventory.js'
YARDS = {
    'north': 'https://www.pyp.com/inventory/chicago-north-1581/',
    'south': 'https://www.pyp.com/inventory/chicago-south-1585/',
    'island': 'https://www.pyp.com/inventory/blue-island-1582/',
}
HEADERS = {'User-Agent': 'Mozilla/5.0 (compatible; PullListInventory/1.1; personal inventory reader)'}
VIN = re.compile(r'\b(?:VIN\s*)?([A-HJ-NPR-Z0-9]{17})\b', re.I)
ROW = re.compile(r'\bRow\s+([A-Za-z0-9-]+)', re.I)
SPACE = re.compile(r'\bSpace\s+([A-Za-z0-9-]+)', re.I)
SECTION = re.compile(r'\bSection\s+(.+?)\s*\|?\s*Row\b', re.I)
STOCK = re.compile(r'\b(158[125]-\d{4,})\b')
AVAILABLE = re.compile(r'\bAvailable\s*[:|]?\s*(\d{1,2}/\d{1,2}/\d{4})\b', re.I)
MAX_PAGES = 200   # Safety guard; hitting it is an error, not a successful full scan.
PAGE_DELAY_SECONDS = 0.3


def safe_image_url(value, base_url):
    """Only accept public HTTP(S) image URLs from the official LKQ host/CDN."""
    if not value or not isinstance(value, str):
        return ''
    value = value.strip().split(',')[0].strip()
    if value.startswith('data:') or value.startswith('blob:'):
        return ''
    # srcset values can have a width descriptor after the URL.
    value = value.split()[0] if value else ''
    url = urljoin(base_url, value)
    parsed = urlparse(url)
    if parsed.scheme not in ('https', 'http') or not parsed.netloc:
        return ''
    # URL is supplied by the public page, not user data; don't accept javascript URLs.
    if any(term in parsed.path.lower() for term in ('logo', 'icon', 'placeholder', 'spinner', 'loader', 'avatar', 'google')):
        return ''
    return url


def vehicle_image(h, base_url):
    """Use image elements inside the vehicle card, not unrelated page imagery."""
    # Cards vary in markup; choose the nearest wrapping element containing the
    # heading but NOT a second vehicle heading. Avoid selecting document-wide images.
    container = None
    for parent in h.parents:
        if getattr(parent, 'name', '') in ('body', 'html'):
            break
        if parent.name not in ('article', 'li', 'div', 'section'):
            continue
        if len(parent.find_all('h3')) == 1 and parent.find('img'):
            container = parent
            break
    if container is None:
        return ''
    for img in container.find_all('img'):
        for attribute in ('data-src', 'data-lazy-src', 'data-original', 'data-image', 'src', 'srcset', 'data-srcset'):
            candidate = safe_image_url(img.get(attribute), base_url)
            if candidate:
                return candidate
    for tag in container.find_all(['source']):
        candidate = safe_image_url(tag.get('srcset') or tag.get('data-srcset'), base_url)
        if candidate:
            return candidate
    return ''


def vehicle_url(h, base_url):
    """Vehicle heading normally links to its official listing detail page."""
    anchor = h.find('a', href=True) or h.find_parent('a', href=True)
    if not anchor:
        return ''
    candidate = urljoin(base_url, anchor['href'])
    parsed, base = urlparse(candidate), urlparse(base_url)
    if parsed.netloc != base.netloc or not parsed.path.startswith(base.path):
        return ''
    return candidate


def parse(html, yard):
    soup = BeautifulSoup(html, 'html.parser')
    vehicles, seen = [], set()
    for h in soup.find_all('h3'):
        title = ' '.join(h.stripped_strings)
        m = re.match(r'^(\d{4})\s+(.+)$', title)
        if not m:
            continue
        words = m.group(2).split()
        if len(words) < 2:
            continue
        special = ['MERCEDES-BENZ', 'LAND ROVER', 'ALFA ROMEO', 'ASTON MARTIN']
        remaining = ' '.join(words)
        special_make = next((x for x in special if remaining.upper().startswith(x + ' ')), None)
        if special_make:
            make = special_make.title()
            model = remaining[len(special_make):].strip()
        else:
            make = words[0].title()
            model = ' '.join(words[1:]).title()
        collected = []
        for node in h.next_elements:
            if node is h:
                continue
            if getattr(node, 'name', None) == 'h3':
                break
            if getattr(node, 'name', None) in ('script', 'style'):
                continue
            if isinstance(node, str) and node.strip():
                collected.append(node.strip())
            if len(collected) > 100:
                break
        block = ' '.join(collected)
        vin_match, stock_match = VIN.search(block), STOCK.search(block)
        vin = vin_match.group(1) if vin_match else ''
        stock = stock_match.group(1) if stock_match else ''
        if not vin and not stock:
            continue
        ident = stock or vin
        if ident in seen:
            continue
        seen.add(ident)
        row, space, section = ROW.search(block), SPACE.search(block), SECTION.search(block)
        date_match = AVAILABLE.search(block)
        available_date = ''
        if date_match:
            try:
                available_date = dt.datetime.strptime(date_match.group(1), '%m/%d/%Y').date().isoformat()
            except ValueError:
                pass
        source_url = vehicle_url(h, YARDS[yard])
        vehicles.append({
            'id': f'{yard}-{ident}', 'yard': yard, 'year': int(m.group(1)),
            'make': make, 'model': model,
            'row': row.group(1) if row else '',
            'space': space.group(1) if space else '',
            'section': section.group(1).strip(' |') if section else '',
            'stock': stock, 'vin': vin,
            'availableDate': available_date,
            'imageUrl': vehicle_image(h, YARDS[yard]),
            'vehicleUrl': source_url,
            'source': 'Official LKQ public inventory page',
            'sourceUrl': YARDS[yard],
        })
    return vehicles


def next_page(html, current_url, base_url):
    """Only follow the actual public 'Next Page' navigation on this yard path."""
    soup = BeautifulSoup(html, 'html.parser')
    base = urlparse(base_url)
    for a in soup.find_all('a', href=True):
        label = ' '.join(a.stripped_strings).lower()
        if 'next page' not in label:
            continue
        link = urljoin(current_url, a['href'])
        parsed = urlparse(link)
        if parsed.netloc != base.netloc or parsed.path.rstrip('/') != base.path.rstrip('/'):
            raise RuntimeError(f'Unexpected pagination destination: {link}')
        if not parse_qs(parsed.query).get('page'):
            raise RuntimeError(f'Next Page link has no page number: {link}')
        return link
    return None


def fetch_all_pages(yard, base_url, session=None, delay=PAGE_DELAY_SECONDS, max_pages=MAX_PAGES):
    session = session or requests.Session()
    page_url = base_url
    visited, unique = set(), {}
    count = 0
    while page_url:
        if page_url in visited:
            raise RuntimeError('Pagination loop detected')
        if count >= max_pages:
            raise RuntimeError(f'Reached safety limit of {max_pages} pages; existing snapshot retained')
        visited.add(page_url)
        response = session.get(page_url, headers=HEADERS, timeout=35)
        response.raise_for_status()
        cars = parse(response.text, yard)
        if not cars:
            # Some LKQ pages show a Next Page link even on the final
            # populated page. The following page can be an empty end marker.
            # Confirm it by requesting that page again before completing.
            if count == 0:
                raise RuntimeError(f'No vehicle cards on first page: {page_url}')
            time.sleep(1)
            verification = session.get(page_url, headers=HEADERS, timeout=35)
            verification.raise_for_status()
            cars = parse(verification.text, yard)
            if not cars:
                # LKQ may retain a Next Page link even on its empty final page.
                # Only treat an empty page as completion after multiple filled pages.
                if count < 2:
                    raise RuntimeError(f'Insufficient pages to verify end of inventory: {page_url}')
                print(f'{yard}: end of inventory at empty page {count+1}; keeping {len(unique)} vehicles', flush=True)
                break

        for car in cars:
            unique[car['stock'] or car['vin']] = car
        count += 1
        print(f'{yard}: page {count}, {len(cars)} cards, {len(unique)} unique total', flush=True)
        # A final batch containing fewer than the usual 25 cards is the end.
        # LKQ may still show a Next Page link pointing to an empty page.
        if len(cars) < 25:
            print(f'{yard}: final partial page reached ({len(cars)} cards)', flush=True)
            break
        page_url = next_page(response.text, page_url, base_url)
        if page_url and delay:
            time.sleep(delay)
    return list(unique.values()), count



# Summit's official ZIP/distance search (experimental parser, fails safely).
from summit_official import fetch_summit as fetch_official_summit
SUMMIT_SOURCE = 'https://www.picknpull.com/check-inventory/vehicle-search?distance=10&zip=60501'

def main():
    feed = json.loads(PATH.read_text()) if PATH.exists() else {'format': 'pull-list-yard-feed-v1', 'yards': {}}
    feed['format'] = 'pull-list-yard-feed-v1'
    now = dt.datetime.now(dt.timezone.utc).isoformat().replace('+00:00', 'Z')
    succeeded = 0
    # Summit: scan official public vehicle-search by make, not SalvageWatch.
    previous = feed.setdefault('yards', {}).get('summit', {})
    try:
        vehicles, searched_makes = fetch_official_summit(requests.Session(), HEADERS)
        # A very low count is likely a parser/search-coverage problem, not a real inventory change.
        if len(vehicles) < 800:
            raise RuntimeError(f'Only {len(vehicles)} Summit vehicles against ~1144 reference; refusing incomplete replacement')
        # The baseline was reported by the user, not independently verified.
        # Keep a partial label until site coverage can be validated.
        status = 'partial'
        feed['yards']['summit'] = {
            'status': status, 'checkedAt': now,
            'sourceUrl': SUMMIT_SOURCE,
            'message': f'Official Pick-n-Pull ZIP 60501 / 10-mile search: {len(vehicles)} recognized Summit vehicles across {searched_makes} make searches. Coverage not independently verified (previous reference ~1144).',
            'makeCount': searched_makes, 'vehicleCount': len(vehicles), 'vehicles': vehicles,
        }
        succeeded += 1
        print(f'summit: OFFICIAL IMPORT: {len(vehicles)} unique vehicles from {searched_makes} makes (reference ~1144)', flush=True)
    except Exception as exc:
        feed['yards']['summit'] = {
            **previous,
            'status': 'stale' if previous.get('vehicles') else 'unavailable',
            'sourceUrl': SUMMIT_SOURCE,
            'message': f'Official Summit import not verified ({str(exc)[:150]}); old records retained.'
        }
        print(f'summit: ERROR: {exc}', file=sys.stderr, flush=True)
    if '--summit-only' not in sys.argv:
        for yard, url in YARDS.items():
            old = feed.setdefault('yards', {}).get(yard, {})
            try:
                vehicles, pages = fetch_all_pages(yard, url)
                if not vehicles:
                    raise RuntimeError('No verified vehicles')
                feed['yards'][yard] = {
                    'status': 'partial', 'checkedAt': now, 'sourceUrl': url,
                    'message': f'Scanned {pages} populated publicly linked inventory pages ({len(vehicles)} unique vehicles). Availability may change; verify at the yard.',
                    'pageCount': pages, 'vehicleCount': len(vehicles), 'vehicles': vehicles,
                }
                succeeded += 1
                print(f'{yard}: COMPLETE PAGINATION: {pages} pages, {len(vehicles)} unique vehicles', flush=True)
            except Exception as exc:
                feed['yards'][yard] = {
                    **old, 'status': 'stale',
                    'message': f'Full-page scan failed: {str(exc)[:160]}. Older snapshot retained; do not assume this is a complete current inventory.',
                }
                print(f'{yard}: ERROR: {exc}', file=sys.stderr, flush=True)
    feed['generatedAt'] = now
    PATH.write_text(json.dumps(feed, indent=2, ensure_ascii=False) + '\n')
    JS_PATH.write_text('window.PULL_LIST_BUNDLED_YARDS = ' + json.dumps(feed, ensure_ascii=False, separators=(',', ':')) + ';\n')
    if not succeeded:
        raise SystemExit('No yard imports succeeded; previous snapshots retained. Inspect logs.')

if __name__ == '__main__':
    main()
