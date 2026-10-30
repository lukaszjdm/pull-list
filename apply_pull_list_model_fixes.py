#!/usr/bin/env python3
"""Apply conservative model/generation and related-parts matching fixes.

Usage (from your Pull List repo folder):
    py apply_pull_list_model_fixes.py
Or:
    python apply_pull_list_model_fixes.py /path/to/repo

Creates app.js.bak and index.html.bak before editing. Does not change seed.json,
generations.json, or confirmed part fitment/profit calculations.
"""
from pathlib import Path
import shutil
import sys

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path.cwd()
APP = ROOT / 'app.js'
HTML = ROOT / 'index.html'


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if source.count(old) != 1:
        raise RuntimeError(f'{label}: expected one original code block; found {source.count(old)}. No files were changed.')
    return source.replace(old, new, 1)


def patch_app(source: str) -> str:
    if 'window.PLGenerationAudit = async () =>' in source and 'window.PLRelatedCount = car =>' in source:
        print('app.js already contains the model-variant fixes.')
        return source

    start = source.find('  function generationFor(car) {')
    end = source.find('  function decodedEngine(d, car) {', start)
    if start < 0 or end < 0:
        raise RuntimeError('Could not locate the generationFor block; app.js was not modified.')
    if source.count('  function generationFor(car) {') != 1:
        raise RuntimeError('Multiple generationFor functions found; refusing an ambiguous edit.')

    generation_block = r'''  // Match exact models first, then drivetrain-name variants, then known
  // model families. Never guess a label when catalog entries conflict.
  function generationKeys(make, model) {
    const mk = normalize(make);
    const exact = normalize(model);
    const family = exact.replace(
      /(?:quattro|xdrive|4matic|awd|fwd|rwd|4wd|2wd)$/, ''
    );
    const keys = [exact, family];

    if (mk === 'chevrolet' &&
        /^(express|suburban|avalanche)(?:1500|2500|3500)$/.test(family)) {
      keys.push(family.replace(/(?:1500|2500|3500)$/, ''));
    }
    if (mk === 'gmc' &&
        /^(savana|yukonxl)(?:1500|2500|3500)$/.test(family)) {
      keys.push(family.replace(/(?:1500|2500|3500)$/, ''));
    }
    if (mk === 'ford' && /^e[123]50(?:econoline)?clubwagon$/.test(family)) {
      keys.push(family.replace(/(?:econoline)?clubwagon$/, 'econoline'));
    }
    if (mk === 'chevrolet' && family === 'aveo5') keys.push('aveo');
    if (mk === 'chevrolet' && family === 'capriceclassic') keys.push('caprice');
    if (mk === 'chevrolet' && family === 'silverado1500hd') keys.push('silverado1500');
    if (mk === 'cadillac' && family === 'ctssportwagon') keys.push('cts');
    if (mk === 'subaru' && family === 'xvcrosstrek') keys.push('crosstrek');

    return [...new Set(keys.filter(Boolean))];
  }

  function generationFor(car) {
    const year = Number(car.year);
    const make = normalize(car.make);

    for (const model of generationKeys(car.make, car.model)) {
      const matches = generationData.filter(g =>
        normalize(g.make) === make &&
        normalize(g.model) === model &&
        year >= Number(g.startYear) &&
        year <= Number(g.endYear)
      );

      if (!matches.length) continue;

      const unique = new Map(matches.map(g => [
        [g.label, g.startYear, g.endYear].join('|'), g
      ]));

      if (unique.size === 1) {
        const g = [...unique.values()][0];
        const label = String(g.label || '').replace(
          /^([A-Za-z0-9]+)\s+generation\s*\/\s*\1$/i, '$1'
        );
        return `${label} (${g.startYear}–${g.endYear})`;
      }
      break;
    }

    return valid(car.generation) || '';
  }

  window.PLGenerationFor = generationFor;

  // Run PLGenerationAudit() in your browser Console to see remaining gaps.
  window.PLGenerationAudit = async () => {
    await loadGenerations();
    const seen = new Set();
    const missing = [];

    for (const car of allCars()) {
      if (!car || !car.make || !car.model || !Number(car.year)) continue;
      const key = [car.year, normalize(car.make),
        normalize(car.model)].join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      if (!generationFor(car)) {
        missing.push({
          year: car.year, make: car.make, model: car.model,
          source: car.demo ? 'Research' : 'Yard inventory'
        });
      }
    }

    console.log('[Pull List] Generation audit:', {
      vehicleGroups: seen.size,
      generationCatalog: generationData.length,
      missingGeneration: missing.length
    });
    console.table(missing);
    return missing;
  };

'''
    source = source[:start] + generation_block + source[end:]

    source = replace_once(source, "const cleanModel=m=>String(m||'').toLowerCase().replace(/\\b(super duty|sd|sedan|coupe|classic)\\b/g,'').replace(/[^a-z0-9]/g,'');", "const cleanModel=m=>String(m||'').toLowerCase().replace(/\\b(super duty|sd)\\b/g,'').replace(/[^a-z0-9]/g,'');", 'Respect distinct sedan/coupe/Classic models')
    source = replace_once(source, "const similarModel=(a,b)=>{let x=cleanModel(a),y=cleanModel(b);return x===y||(['f250','f350','mazda6','ram1500','silverado1500'].includes(x)&&y.startsWith(x))};", 'const similarModel=(a,b)=>cleanModel(a)===cleanModel(b);', 'Do not treat prefixes as confirmed fitment')
    source = replace_once(source, "const carParts = c => {\n  const index = getPartIndex();\n  const make = String(c.make).trim().toLowerCase();\n  const model = cleanModel(c.model);\n\n  const candidates = [\n    ...(index.get(make + '|' + model) || [])\n  ];\n\n  for (const prefix of [\n    'f250', 'f350', 'mazda6',\n    'ram1500', 'silverado1500'\n  ]) {\n    if (model !== prefix && model.startsWith(prefix)) {\n      candidates.push(\n        ...(index.get(make + '|' + prefix) || [])\n      );\n    }\n  }\n\n  return candidates.filter(p => match(p, c));\n};", "const carParts = c => {\n  const index = getPartIndex();\n  const make = String(c.make).trim().toLowerCase();\n  const model = cleanModel(c.model);\n\n  // Keep profit rankings grounded in the exact researched model/year.\n  // Different versions are separately listed as VERIFY-only leads.\n  return (index.get(make + '|' + model) || [])\n    .filter(p => match(p, c));\n};", 'Keep version matches out of direct profit calculations')

    source = replace_once(source, 'const profit=p=>', '''const browsePartSummary = car => {
  const count = carParts(car).length;
  if (count) return count + ' recommended parts';
  const leads = typeof window.PLRelatedCount === 'function'
    ? window.PLRelatedCount(car) : 0;
  return leads
    ? '0 exact parts · ' + leads + ' related leads (VERIFY)'
    : '0 matching research parts';
};
const profit=p=>''', 'Browse summary helper')
    source = replace_once(source, '${safe(c.year)} ${safe(c.make)} ${safe(c.model)}</div><small>${safe(c.demo?', '${safe(c.year)} ${safe(c.make)} ${safe(c.model)}</div>${window.PLGenerationFor?.(c)?`<small class="car-generation">${safe(window.PLGenerationFor(c))}</small>`:\'\'}<small>${safe(c.demo?', 'Browse generation display')

    source = replace_once(source,
        '<small>${carParts(c).length} recommended parts</small>',
        '<small>${safe(browsePartSummary(c))}</small>',
        'Browse summary display')

    source = replace_once(source,
        "  const root = value =>\n    clean(value).replace(/(?:quattro|xdrive)$/, '');",
        '''  // Only use expanded vehicle families for VERIFY-only research leads.
  // These do NOT affect exact matches, part rankings or profit calculations.
  const root = value =>
    clean(value).replace(
      /(?:quattro|xdrive|4matic|awd|fwd|rwd|4wd|2wd|hybrid)$/, ''
    );''',
        'Related-model root normalization')

    source = replace_once(source, '  function openDB() {', '''  function familyAliases(make, model) {
    const key = clean(model);
    const result = [];

    if (make === 'chevrolet' &&
        /^(express|suburban|avalanche)(?:1500|2500|3500)$/.test(key)) {
      result.push(key.replace(/(?:1500|2500|3500)$/, ''));
    }
    if (make === 'gmc' &&
        /^(savana|yukonxl)(?:1500|2500|3500)$/.test(key)) {
      result.push(key.replace(/(?:1500|2500|3500)$/, ''));
    }
    if (make === 'chevrolet' && key === 'silverado1500hd') {
      result.push('silverado1500');
    }
    if (make === 'ford' && /^e[123]50(?:econoline)?clubwagon$/.test(key)) {
      result.push(key.replace(/(?:econoline)?clubwagon$/, 'econoline'));
    }
    if (make === 'chevrolet' && key === 'aveo5') result.push('aveo');
    if (make === 'chevrolet' && key === 'capriceclassic') result.push('caprice');
    if (make === 'cadillac' && key === 'ctssportwagon') result.push('cts');
    if (make === 'subaru' && key === 'xvcrosstrek') result.push('crosstrek');
    if (make === 'bmw' && /^3[0-9]{2}xi$/.test(key)) {
      result.push(key.replace(/xi$/, 'i'));
    }

    return result;
  }

  function openDB() {''', 'Additional related-model aliases')

    source = replace_once(source,
        '      ...(aliases[mk]?.[clean(car.model)] || [])\n',
        '      ...(aliases[mk]?.[clean(car.model)] || []),\n      ...familyAliases(mk, car.model)\n',
        'Related-model allowed keys')

    source = replace_once(source, '  loadGenerations();\n\n  console.log(', '  loadGenerations().then(() => renderBrowse());\n\n  console.log(', 'Re-render browse after generation load')

    source = replace_once(source, '  const previousDetail = renderDetail;', '''  // Zero-exact-match cards may show these separately labeled leads.
  window.PLRelatedCount = car => relatedParts(car).length;

  const previousDetail = renderDetail;''', 'Related-lead counter')

    for item in ('PLGenerationAudit', 'PLRelatedCount', 'familyAliases', '0 exact parts ·'):
        if item not in source:
            raise RuntimeError('Patched source failed a required check: ' + item)
    return source


def patch_html(source: str) -> str:
    # Force browsers to fetch the updated app.js instead of the old cached file.
    import re
    updated, count = re.subn(r'app\.js\?v=[A-Za-z0-9_-]+', 'app.js?v=20261030-model-fix', source)
    if count != 1:
        raise RuntimeError('Could not locate the single app.js cache/version tag in index.html')
    return updated


def main() -> None:
    if not APP.is_file() or not HTML.is_file():
        raise SystemExit('Place this script inside the Pull List repository next to app.js and index.html, or pass the repository folder path.')
    original_app = APP.read_text(encoding='utf-8')
    original_html = HTML.read_text(encoding='utf-8')
    updated_app = patch_app(original_app)
    updated_html = patch_html(original_html)

    if updated_app == original_app and updated_html == original_html:
        print('Already up to date; nothing changed.')
        return

    if updated_app != original_app:
        shutil.copy2(APP, APP.with_name('app.js.bak'))
        APP.write_text(updated_app, encoding='utf-8')
    if updated_html != original_html:
        shutil.copy2(HTML, HTML.with_name('index.html.bak'))
        HTML.write_text(updated_html, encoding='utf-8')

    print('Patched app.js and updated index.html cache version.')
    print('Backups: app.js.bak, index.html.bak (for changed files).')
    print('Commit and push app.js and index.html to publish the fix.')
    print('Then refresh the site and check the Console: PLGenerationAudit() and PLFullAudit().')


if __name__ == '__main__':
    main()
