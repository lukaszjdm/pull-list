"""Read Pick-n-Pull's public vehicle-search API for Summit, Illinois.

Does not modify inventory files; sync_yards-summit-first.py handles persistence.
The API response schema may change. Fail safely and log diagnostics instead of
writing incomplete inventory. No cookies or credentials are needed.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
from urllib.parse import urlencode

API = 'https://www.picknpull.com/api/vehicle/search'
SOURCE = 'https://www.picknpull.com/check-inventory/vehicle-search?distance=10&zip=60501'
PARAMS = {'makeId': '', 'modelId': '', 'year': '', 'distance': '10', 'zip': '60501', 'language': 'english'}
YEAR_RX = re.compile(r'^(19\d{2}|20\d{2})$')
DATE_RX = re.compile(r'(?<!\d)(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?!\d)')
VIN_RX = re.compile(r'^[A-HJ-NPR-Z0-9]{17}$', re.I)
SUMMIT_RX = re.compile(r'\bsummit\b', re.I)


def flat_key(k):
    return re.sub(r'[^a-z0-9]', '', str(k).lower())


def value(obj, *keys):
    if not isinstance(obj, dict):
        return None
    mapped = {flat_key(k): v for k, v in obj.items()}
    for key in keys:
        v = mapped.get(flat_key(key))
        if v is not None and v != '':
            return v
    return None


def text(v):
    if v is None: return ''
    if isinstance(v, (str, int, float)): return str(v).strip()
    if isinstance(v, dict):
        for field in ('name', 'label', 'description', 'value', 'title', 'city'):
            t = text(value(v, field))
            if t: return t
    return ''


def first_text(rec, *keys):
    return text(value(rec, *keys))


def parse_date(v):
    s = text(v)
    if not s: return ''
    m = DATE_RX.search(s)
    if m:
        a, b, y = map(int, m.groups())
        try: return dt.date(y, a, b).isoformat()
        except ValueError: return ''
    try: return dt.date.fromisoformat(s[:10]).isoformat()
    except ValueError: return ''


def walk(obj, inherited=''):
    """Find plausible vehicle dictionaries at any depth of the API payload."""
    if isinstance(obj, list):
        for item in obj:
            yield from walk(item, inherited)
    elif isinstance(obj, dict):
        location = location_for(obj) or inherited
        if seems_vehicle(obj):
            yield obj, location
            return
        for item in obj.values():
            if isinstance(item, (list, dict)):
                yield from walk(item, location)


def location_for(obj):
    parts = []
    for k in ('yardName', 'yard', 'locationName', 'location', 'storeName', 'store', 'branchName', 'branch', 'city'):
        t = first_text(obj, k)
        if t: parts.append(t)
    # A location ID alone cannot prove a record is at Summit.
    return ' | '.join(parts)


def seems_vehicle(rec):
    y = first_text(rec, 'year', 'vehicleYear', 'modelYear', 'yr')
    make = first_text(rec, 'makeName', 'make', 'vehicleMake', 'manufacturer')
    model = first_text(rec, 'modelName', 'model', 'vehicleModel')
    title = first_text(rec, 'vehicleName', 'vehicleDescription', 'vehicle', 'description', 'title')
    if not (y and make and model) and title:
        m = re.match(r'^\s*((?:19|20)\d{2})\s+(\S+)\s+(.+)', title)
        if m: y, make, model = m.groups()
    return bool(YEAR_RX.fullmatch(y) and make and model)


def image_url(v):
    if isinstance(v, list):
        for i in v:
            ans = image_url(i)
            if ans: return ans
        return ''
    if isinstance(v, dict):
        return image_url(value(v, 'url', 'imageUrl', 'photoUrl', 'src', 'fullUrl', 'originalUrl'))
    s = text(v)
    if s.startswith('//'): s = 'https:' + s
    if s.startswith('/'): s = 'https://www.picknpull.com' + s
    if s.startswith(('https://', 'http://')): return s
    return ''


def normalize(rec, loc):
    year = first_text(rec, 'year', 'vehicleYear', 'modelYear', 'yr')
    make = first_text(rec, 'makeName', 'make', 'vehicleMake', 'manufacturer')
    model = first_text(rec, 'modelName', 'model', 'vehicleModel')
    title = first_text(rec, 'vehicleName', 'vehicleDescription', 'vehicle', 'description', 'title')
    if not (year and make and model):
        m = re.match(r'^\s*((?:19|20)\d{2})\s+(\S+)\s+(.+)', title)
        if m: year, make, model = m.groups()
    if not YEAR_RX.fullmatch(year): return None
    vin = first_text(rec, 'vin', 'vinNumber', 'vehicleVin').upper()
    if not VIN_RX.fullmatch(vin): vin = ''
    stock = first_text(rec, 'stockNumber', 'stock', 'inventoryNumber', 'vehicleStockNumber')
    api_id = first_text(rec, 'vehicleId', 'inventoryId', 'inventoryID', 'vehicleInventoryId', 'id')
    row = first_text(rec, 'row', 'rowNumber', 'yardRow', 'rowLocation')
    arrival = parse_date(value(rec, 'setDate', 'dateSet', 'arrivalDate', 'availableDate', 'dateAdded', 'dateInYard', 'dateReceived'))
    photo = image_url(value(rec, 'imageUrl', 'photoUrl', 'primaryImage', 'mainImage', 'thumbnailUrl', 'photos', 'images', 'vehicleImage'))
    url = first_text(rec, 'vehicleUrl', 'detailUrl', 'url', 'link')
    if url.startswith('/'): url = 'https://www.picknpull.com' + url
    if url and not url.startswith('https://www.picknpull.com/'): url = ''
    # Hash the complete record when no stable identifier is offered; this avoids
    # collapsing two same-year/model vehicles placed in the same row on one day.
    ident = api_id or stock or vin or hashlib.sha256(json.dumps(rec, sort_keys=True, default=str).encode()).hexdigest()[:24]
    return {'id': 'summit-' + ident, 'yard': 'summit', 'year': int(year),
            'make': make, 'model': model, 'row': row, 'space': '', 'section': '',
            'stock': stock, 'vin': vin, 'availableDate': arrival, 'imageUrl': photo,
            'vehicleUrl': url, 'source': 'Official Pick-n-Pull vehicle API', 'sourceUrl': SOURCE}


def describe_payload(obj):
    if isinstance(obj, dict):
        return f'JSON object; top-level keys: {list(obj)[:20]}'
    if isinstance(obj, list): return f'JSON array with {len(obj)} top-level entries'
    return f'JSON type: {type(obj).__name__}'


def fetch_summit(session, headers, delay=0):
    """Match existing sync_yards.py signature; returns (vehicles, make_count)."""
    request_headers = dict(headers or {})
    request_headers['Accept'] = 'application/json, text/plain, */*'
    response = session.get(API, params=PARAMS, headers=request_headers, timeout=60)
    response.raise_for_status()
    try:
        payload = response.json()
    except ValueError as exc:
        raise RuntimeError(f'API HTTP {response.status_code} did not return JSON: {response.text[:120]!r}') from exc
    print(f'summit: official API HTTP {response.status_code}; {len(response.content)} bytes; {describe_payload(payload)}', flush=True)
    matches = list(walk(payload))
    labels = sorted({loc[:100] for _,loc in matches if loc})
    print(f'summit: {len(matches)} vehicle-shaped records; locations: {labels[:14]}', flush=True)
    if not matches:
        sample = []
        def sample_keys(v, depth=0):
            if len(sample) >= 6 or depth > 5: return
            if isinstance(v, dict):
                sample.append(list(v)[:18])
                for child in v.values(): sample_keys(child, depth+1)
            elif isinstance(v, list) and v: sample_keys(v[0], depth+1)
        sample_keys(payload)
        raise RuntimeError(f'API data structure not recognized. Key samples: {sample}')
    summit = [(rec, loc) for rec,loc in matches if SUMMIT_RX.search(loc)]
    if not summit:
        sample = [list(rec)[:20] for rec,_ in matches[:2]]
        raise RuntimeError(f'Found {len(matches)} vehicles but none positively linked to Summit. Vehicle key samples: {sample}; locations: {labels[:10]}')
    unique = {}
    for rec, loc in summit:
        car = normalize(rec, loc)
        if car: unique[car['id']] = car
    cars = list(unique.values())
    dated = sum(bool(c['availableDate']) for c in cars)
    photos = sum(bool(c['imageUrl']) for c in cars)
    print(f'summit: parsed {len(cars)} unique Summit vehicles; {dated} set dates, {photos} photos; reference ~1144', flush=True)
    return cars, 0
