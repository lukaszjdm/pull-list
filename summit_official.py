"""Experimental official Pick-n-Pull Summit inventory reader.

The public search HTML is scanned by make, filtered to the Summit section, and
saved only if plausible. The site may change markup. Never represent a partial
scan as complete inventory.
"""
from __future__ import annotations
import datetime as dt
import hashlib
import re
import time
from urllib.parse import urljoin
from bs4 import BeautifulSoup

BASE = 'https://www.picknpull.com'
SEARCH = BASE + '/check-inventory/vehicle-search'
PARAMS = {'distance':'10', 'zip':'60501'}
DATE = re.compile(r'\bSet\s*:?\s*(\d{1,2}/\d{1,2}/\d{4})\b', re.I)
ROW = re.compile(r'\bRow\s*:?\s*([A-Za-z0-9-]+)\b', re.I)
YEAR = re.compile(r'^(19\d{2}|20\d{2})\s+(.+)$')
SUMMIT = re.compile(r'Pick\s*[- ]\s*n\s*[- ]\s*Pull\s*[- ]\s*Summit', re.I)


def make_options(soup):
    result = {}
    for select in soup.find_all('select'):
        attr = ' '.join([str(select.get('name','')), str(select.get('id',''))]).lower()
        if 'make' not in attr: continue
        for option in select.find_all('option'):
            val = (option.get('value') or '').strip()
            label = option.get_text(' ', strip=True)
            if val and val != '0' and val.isdigit() and label and 'select' not in label.lower():
                result[val] = label
    return result


def safe_photo(tag):
    if not tag: return ''
    for a in ('data-src', 'data-original','src','srcset'):
        v = (tag.get(a) or '').strip()
        if not v: continue
        v = v.split(',')[0].split()[0]
        url = urljoin(BASE, v)
        if url.startswith('https://') and not any(x in url.lower() for x in ('logo','placeholder','spinner','icon')):
            return url
    return ''


def parse_results(html):
    """Extract vehicle labels after the exact Summit heading only.

    Result records may be divs rather than articles; isolate an image and its
    nearest row/date wrapper, avoiding other-yard or unrelated vehicle records.
    """
    soup = BeautifulSoup(html, 'html.parser')
    found = []
    summit = False
    for el in soup.find_all(True):
        # Treat a standalone heading as a yard section boundary.
        if el.name in ('h2','h3','h4','h5'):
            t = el.get_text(' ', strip=True)
            if re.search(r'Pick\s*[- ]\s*n\s*[- ]\s*Pull', t, re.I):
                summit = bool(SUMMIT.search(t))
        if not summit or el.name != 'img': continue
        title = (el.get('alt') or '').strip()
        m = YEAR.match(title)
        if not m: continue
        parent = el
        text = ''
        for _ in range(5):
            parent = parent.parent
            if parent is None or parent.name in ('body', 'html'): break
            text = parent.get_text(' ', strip=True)
            if DATE.search(text) and ROW.search(text) and len(text) < 450:
                break
        else:
            continue
        dm, rm = DATE.search(text), ROW.search(text)
        if not dm or not rm or len(text) > 450: continue
        try:
            date = dt.datetime.strptime(dm.group(1), '%m/%d/%Y').date().isoformat()
        except ValueError: continue
        make_model = m.group(2).strip()
        # Use single-make search pages to disambiguate unusual make names later.
        make, _, model = make_model.partition(' ')
        if not model: continue
        link = el.find_parent('a',href=True)
        url = urljoin(BASE,link.get('href','')) if link else ''
        if url and not url.startswith(BASE+'/'): url = ''
        key = url or '|'.join([str(m.group(1)),make_model,rm.group(1),date])
        # Rows and dates are not unique if two matching cars arrive together.
        # Cannot guarantee deduplication in the absence of vehicle IDs.
        digest = hashlib.sha1(key.encode()).hexdigest()[:16]
        found.append(dict(id='summit-'+digest, yard='summit', year=int(m.group(1)), make=make,
            model=model, row=rm.group(1), space='', section='', stock='', vin='',
            availableDate=date, imageUrl=safe_photo(el), vehicleUrl=url,
            source='Official Pick-n-Pull website', sourceUrl=SEARCH+'?distance=10&zip=60501'))
    return found


def fetch_summit(session, headers, delay=0.4):
    """Try unfiltered official Summit results FIRST; make searches are fallback.

    ZIP 60501 / 10 miles may already show every vehicle without specifying
    make. Do not require a make dropdown that is often hydrated by JavaScript.
    """
    response = session.get(SEARCH, params=PARAMS, headers=headers, timeout=40)
    response.raise_for_status()
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    text = soup.get_text(' ', strip=True)
    unfiltered = parse_results(html)
    reported = re.findall(r'Displaying\s+([\d,]+)\s+vehicles?', text, re.I)
    print(
        f'summit: direct ZIP search HTTP {response.status_code}; '
        f'HTML {len(html)} bytes; parsed {len(unfiltered)} Summit vehicles; '
        f'page counts: {reported[:8] or "not present"}',
        flush=True
    )
    if len(unfiltered) >= 800:
        print('summit: using unfiltered official inventory; no make search needed', flush=True)
        return unfiltered, 0

    # The HTML may have vehicle cards but different heading markup; report
    # structural clues rather than immediately failing on missing make options.
    headings = [h.get_text(' ', strip=True)[:90] for h in soup.find_all(['h2', 'h3', 'h4', 'h5'])]
    pictures = [im.get('alt','')[:65] for im in soup.find_all('img') if YEAR.match(im.get('alt','').strip())]
    print(f'summit: headings sample: {headings[:14]}', flush=True)
    print(f'summit: vehicle-photo alt sample: {pictures[:5]} (total {len(pictures)})', flush=True)
    print(f'summit: Summit text present: {bool(SUMMIT.search(text))}', flush=True)

    options = make_options(soup)
    if not options:
        raise RuntimeError(
            f'No server-rendered make dropdown; direct search recognized '
            f'{len(unfiltered)} Summit cars. Send summit: diagnostic lines. '
            'The make control may be loaded by JavaScript.'
        )

    print(f'summit: discovered {len(options)} make options; trying make-by-make fallback', flush=True)
    unique = {v['id']: v for v in unfiltered}
    for i, (code, make_name) in enumerate(options.items(), 1):
        r = session.get(SEARCH, params={**PARAMS, 'make':code, 'model':'0'}, headers=headers, timeout=40)
        r.raise_for_status()
        vehicles = parse_results(r.text)
        for v in vehicles:
            v['make'] = make_name
            unique[v['id']] = v
        print(f'summit: make {i}/{len(options)} {make_name}: {len(vehicles)}; {len(unique)} unique', flush=True)
        if delay:
            time.sleep(delay)
    if not unique:
        raise RuntimeError('No Summit cars parsed; old snapshot retained')
    return list(unique.values()), len(options)
