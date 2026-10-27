
/* ============================================
   PULL LIST — SCAN VIN
   Camera barcode scanner + manual entry
   VIN decoding + inventory + parts matching
   ============================================ */

(() => {
  'use strict';

  if (document.getElementById('scanVinScreen')) return;

  const norm = v =>
    String(v ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;

  const $scan = id => document.getElementById(id);

  let scannerControls = null;
  let scanStarting = false;
  let searchToken = 0;
  let recent = [];

  const recentKey = 'pulllist-recent-vins-v1';

  try {
    recent = JSON.parse(
      localStorage.getItem(recentKey) || '[]'
    );
  } catch {
    recent = [];
  }

  if (!Array.isArray(recent)) recent = [];

  // ============================================
  // CREATE SCANNER SCREEN
  // ============================================

  const screen = document.createElement('section');

  screen.id = 'scanVinScreen';
  screen.className = 'screen';
  screen.hidden = true;

  screen.innerHTML = `
    <div class="sectionheading">
      <h1>Scan VIN</h1>
    </div>

    <p class="muted">
      Scan a vehicle's VIN barcode or enter its
      17-character VIN. Find the car in your yards
      or get model/year parts recommendations.
    </p>

    <div class="panel" style="display:grid;gap:14px">

      <div class="buttonrow">
        <button
          class="btn primary"
          id="scanStart"
          type="button"
        >
          Start camera scanner
        </button>

        <button
          class="btn"
          id="scanStop"
          type="button"
          hidden
        >
          Stop camera
        </button>
      </div>

      <div
        id="scanCameraBox"
        hidden
        style="
          position:relative;
          overflow:hidden;
          border-radius:12px;
          background:#111;
          min-height:180px;
        "
      >
        <video
          id="scanVideo"
          autoplay
          muted
          playsinline
          style="
            display:block;
            width:100%;
            max-height:320px;
            object-fit:cover;
          "
        ></video>

        <div
          style="
            pointer-events:none;
            position:absolute;
            inset:22% 8%;
            border:2px solid #78dbaa;
            border-radius:12px;
          "
        ></div>
      </div>

      <form
        id="scanForm"
        style="display:grid;gap:10px"
      >
        <label for="scanVinInput">
          Vehicle identification number
        </label>

        <input
          id="scanVinInput"
          type="text"
          inputmode="text"
          maxlength="17"
          autocomplete="off"
          spellcheck="false"
          placeholder="Enter 17-character VIN"
          style="text-transform:uppercase"
          required
        />

        <button class="btn primary" type="submit">
          Find vehicle &amp; parts
        </button>
      </form>

      <small
        class="muted"
        id="scanStatus"
        role="status"
        aria-live="polite"
      >
        Camera access requires HTTPS and permission.
        Barcode scanning requires an internet connection.
      </small>
    </div>

    <div
      id="scanResults"
      aria-live="polite"
    ></div>

    <div class="panel" style="margin-top:18px">
      <h3>Recent scans</h3>
      <div id="scanRecent"></div>
    </div>
  `;

  document.querySelector('main').appendChild(screen);

  // ============================================
  // ADD NAVIGATION TAB
  // ============================================

  const scanNav = document.createElement('button');

  scanNav.type = 'button';
  scanNav.dataset.nav = 'scanVinScreen';

  scanNav.innerHTML = `
    ▣ <span>Scan VIN</span>
  `;

  const partsNav = document.querySelector(
    'nav [data-nav="database"]'
  );

  if (partsNav) {
    partsNav.before(scanNav);
  } else {
    document.querySelector('nav')?.appendChild(scanNav);
  }

  // Add shortcut to main inventory page.

  const shortcut = document.createElement('button');

  shortcut.type = 'button';
  shortcut.className = 'btn primary';
  shortcut.textContent = '▣ Scan VIN';

  const actions = document.querySelector(
    '#browse .controls .buttonrow'
  );

  if (actions) actions.prepend(shortcut);

  // ============================================
  // STYLING
  // ============================================

  const css = document.createElement('style');

  css.textContent = `
    #scanVinScreen h1 {
      margin:4px 0 8px;
    }

    #scanVinScreen .pl-scan-card {
      border:1px solid var(--line);
      border-radius:12px;
      padding:14px;
      margin:12px 0;
      background:var(--panel);
    }

    #scanVinScreen .pl-scan-row {
      display:flex;
      justify-content:space-between;
      gap:12px;
      padding:7px 0;
      border-bottom:1px solid var(--line);
      flex-wrap:wrap;
    }

    #scanVinScreen .pl-scan-row strong {
      color:var(--ink);
      overflow-wrap:anywhere;
    }

    #scanVinScreen .pl-scan-row span {
      color:var(--muted);
    }

    #scanVinScreen .pl-scan-part {
      border-top:1px solid var(--line);
      padding:12px 0;
      display:grid;
      gap:5px;
    }

    #scanVinScreen .pl-scan-part strong {
      color:var(--ink);
    }

    #scanVinScreen .pl-scan-status {
      font-size:12px;
      color:var(--muted);
    }

    #scanVinScreen .pl-scan-actions {
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:8px;
    }

    #scanVinScreen input {
      width:100%;
      box-sizing:border-box;
    }

    #scanVinScreen #scanRecent .btn {
      margin:4px 5px 4px 0;
    }

    @media(max-width:600px) {
      nav button[data-nav="scanVinScreen"] {
        font-size:12px;
      }

      #scanVinScreen .pl-scan-card {
        padding:11px;
      }
    }
  `;

  document.head.appendChild(css);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const status = message => {
    $scan('scanStatus').textContent = message;
  };

  const safeText = value => safe(String(value ?? ''));

  const row = (label, value) => {
    if (!value) return '';

    return `
      <div class="pl-scan-row">
        <span>${safeText(label)}</span>
        <strong>${safeText(value)}</strong>
      </div>
    `;
  };

  const fmtMoney = n => money(Number(n));

  const cleanVin = text =>
    String(text ?? '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');

  const findVin = text => {
    const raw = cleanVin(text);

    if (vinPattern.test(raw)) return raw;

    const matches =
      raw.match(/[A-HJ-NPR-Z0-9]{17}/g) || [];

    return matches.find(
      v => vinPattern.test(v)
    ) || '';
  };

  // ============================================
  // CAMERA SCANNER
  // ============================================

  function stopCamera() {
    const controls = scannerControls;
    scannerControls = null;

    if (controls) {
      try {
        controls.stop();
      } catch {}
    }

    const video = $scan('scanVideo');

    if (video?.srcObject) {
      for (const track of video.srcObject.getTracks()) {
        track.stop();
      }

      video.srcObject = null;
    }

    $scan('scanCameraBox').hidden = true;
    $scan('scanStop').hidden = true;
    $scan('scanStart').disabled = false;

    scanStarting = false;
  }

  async function startCamera() {
    if (scanStarting || scannerControls) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      status(
        'This browser cannot access the camera. ' +
        'Enter the VIN manually.'
      );
      return;
    }

    scanStarting = true;

    $scan('scanStart').disabled = true;
    $scan('scanStop').hidden = false;
    $scan('scanCameraBox').hidden = false;

    status('Loading VIN barcode scanner…');

    try {
      // ZXing supports common vehicle barcode formats,
      // including PDF417 where supported by the label.

      if (!window.ZXingBrowser) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');

          script.src =
            'https://unpkg.com/@zxing/browser@0.1.5';

          script.onload = resolve;

          script.onerror = () => reject(
            new Error('Scanner library could not load')
          );

          document.head.appendChild(script);
        });
      }

      if (
        !$scan('scanCameraBox') ||
        $scan('scanCameraBox').hidden
      ) return;

      if (!window.ZXingBrowser?.BrowserMultiFormatReader) {
        throw new Error('Scanner library unavailable');
      }

      const reader =
        new window.ZXingBrowser.BrowserMultiFormatReader();

      status(
        'Point the rear camera at the VIN barcode. ' +
        'Hold steady.'
      );

      scannerControls = await reader.decodeFromConstraints(
        {
          video: {
            facingMode: {
              ideal: 'environment'
            }
          },
          audio: false
        },
        $scan('scanVideo'),
        result => {
          if (!result) return;

          const vin = findVin(result.getText());

          if (!vin) return;

          stopCamera();

          $scan('scanVinInput').value = vin;

          lookup(vin);
        }
      );

    } catch (error) {
      status(
        'Camera scanner unavailable: ' +
        (error?.message || 'unknown error') +
        '. Enter VIN manually.'
      );

      stopCamera();

    } finally {
      scanStarting = false;
    }
  }

  // ============================================
  // RECENT SCANS
  // ============================================

  function updateRecent(vin) {
    recent = [
      vin,
      ...recent.filter(v => v !== vin)
    ].slice(0, 8);

    try {
      localStorage.setItem(
        recentKey,
        JSON.stringify(recent)
      );
    } catch {}

    renderRecent();
  }

  function renderRecent() {
    const target = $scan('scanRecent');

    target.replaceChildren();

    if (!recent.length) {
      target.textContent = 'No scans yet.';
      return;
    }

    for (const vin of recent) {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'btn';
      button.textContent = vin;

      button.onclick = () => {
        $scan('scanVinInput').value = vin;
        lookup(vin);
      };

      target.appendChild(button);
    }
  }

  // ============================================
  // NHTSA VIN DECODER
  // ============================================

  async function decode(vin) {
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      12000
    );

    try {
      const url =
        'https://vpic.nhtsa.dot.gov/api/vehicles/' +
        'DecodeVinValues/' +
        encodeURIComponent(vin) +
        '?format=json';

      const res = await fetch(
        url,
        { signal: controller.signal }
      );

      if (!res.ok) {
        throw new Error('NHTSA HTTP ' + res.status);
      }

      return (await res.json()).Results?.[0] || null;

    } finally {
      clearTimeout(timeout);
    }
  }

  // ============================================
  // PART RECOMMENDATIONS
  // ============================================

  function leadMarkup(parts) {
    if (!parts.length) {
      return `
        <p class="muted">
          No recommendations for this year and model
          in your current parts database.
        </p>
      `;
    }

    const groups = [
      [
        'general',
        'Top estimated profit · General (5+ sold comparisons)',
        p => p.group === 'general' &&
          num(p.soldCount) >= 5
      ],
      [
        'fitment',
        'Potential profit · Verify fitment',
        p => p.group === 'fitment'
      ],
      [
        'thin',
        'Other leads · Thin / limited evidence',
        p => p.group === 'thin' ||
          (
            p.group === 'general' &&
            num(p.soldCount) < 5
          )
      ]
    ];

    return groups.map(([, label, test]) => {
      const arr = parts
        .filter(test)
        .sort((a, b) => profit(b) - profit(a))
        .slice(0, 12);

      if (!arr.length) return '';

      return (
        '<h3>' + safeText(label) + '</h3>' +
        arr.map(p => {
          const search = String(
            p.searchTitle ||
            [p.make, p.model, p.name].join(' ')
          )
            .replace(
              /\s*\(\s*For\s*:\s*[^)]*\)/gi,
              ''
            )
            .trim();

          const ebay =
            'https://www.ebay.com/sch/i.html?_nkw=' +
            encodeURIComponent(search) +
            '&LH_Sold=1&LH_Complete=1';

          return `
            <div class="pl-scan-part">
              <strong>${safeText(p.name)}</strong>

              <span>
                ${fmtMoney(profit(p))} est. net
                · ${safeText(p.soldCount ?? 0)} sold comps
                · ${safeText(p.startYear)}–${safeText(p.endYear)}
              </span>

              <a
                href="${safeText(ebay)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check eBay sold listings ↗
              </a>
            </div>
          `;
        }).join('')
      );
    }).join('');
  }

  // ============================================
  // FIND VIN + INVENTORY + PARTS
  // ============================================

  async function lookup(input) {
    const vin = cleanVin(input);

    if (!vinPattern.test(vin)) {
      status(
        'Enter a valid 17-character VIN. ' +
        'Letters I, O and Q are not permitted.'
      );
      return;
    }

    stopCamera();

    const token = ++searchToken;

    updateRecent(vin);

    status('Checking yard VINs and decoding vehicle…');

    $scan('scanResults').innerHTML = `
      <div class="pl-scan-card">
        Searching…
      </div>
    `;

    // Find exact VIN in the loaded yard inventory.

    const exact = allCars().filter(c =>
      cleanVin(c.vin) === vin && !c.demo
    );

    let data = null;
    let decodeError = '';

    try {
      data = await decode(vin);
    } catch (error) {
      decodeError =
        error?.message || 'decode unavailable';
    }

    if (token !== searchToken) return;

    const reference = exact[0];

    const year =
      Number(data?.ModelYear) ||
      Number(reference?.year) ||
      0;

    const make =
      data?.Make || reference?.make || '';

    const model =
      data?.Model || reference?.model || '';

    const car = { year, make, model };

    let recommendations =
      year && make && model
        ? carParts(car)
        : [];

    // Fall back to our inventory naming if needed.

    if (!recommendations.length && reference) {
      recommendations = carParts(reference);
    }

    const title =
      year && make && model
        ? `${year} ${make} ${model}`
        : 'Vehicle not identified';

    const best = recommendations
      .filter(p =>
        p.group === 'general' &&
        num(p.soldCount) >= 5
      )
      .map(profit);

    const verify = recommendations
      .filter(p => p.group === 'fitment')
      .map(profit);

    const high = list =>
      list.length
        ? fmtMoney(Math.max(...list))
        : '—';

    const engine = [
      data?.EngineCylinders &&
        data.EngineCylinders + ' Cyl',

      Number(data?.DisplacementL) > 0 &&
        Number(data.DisplacementL).toFixed(2) + 'L'
    ]
      .filter(Boolean)
      .join(', ');

    // Display result.

    $scan('scanResults').innerHTML = `
      <div class="pl-scan-card">

        <h2>${safeText(title)}</h2>

        ${row('VIN', vin)}
        ${row('Trim', data?.Trim)}
        ${row('Body', data?.BodyClass || reference?.body)}
        ${row('Engine', engine || reference?.engine)}
        ${row(
          'Drivetrain',
          data?.DriveType || reference?.drivetrain
        )}
        ${row(
          'Fuel',
          data?.FuelTypePrimary || reference?.fuel
        )}

        ${
          exact.length
            ? `
              <h3>Exact VIN match in yard inventory</h3>

              ${exact.map(c =>
                row(
                  YARDS[c.yard]?.name || c.yard,
                  'Row ' + (c.row || '—') +
                  ' · Space ' + (c.space || '—')
                )
              ).join('')}
            `
            : `
              <p class="pl-scan-status">
                No exact VIN match in the current yard
                inventory. Recommendations below are
                model/year leads, not confirmation
                that this vehicle is in a yard.
              </p>
            `
        }

        ${
          decodeError
            ? `
              <p class="pl-scan-status">
                NHTSA decode unavailable:
                ${safeText(decodeError)}
              </p>
            `
            : ''
        }

        <div class="pl-scan-row">
          <span>Top estimated profit (general)</span>
          <strong>${high(best)}</strong>
        </div>

        <div class="pl-scan-row">
          <span>Potential profit (verify fitment)</span>
          <strong>${high(verify)}</strong>
        </div>

        <p class="pl-scan-status">
          ${recommendations.length}
          model/year recommendations.

          Check exact equipment, OEM numbers and current
          sold prices before pulling.
        </p>

        ${leadMarkup(recommendations)}

      </div>
    `;

    status('VIN lookup complete.');
  }

  // ============================================
  // BUTTONS + EVENT HANDLERS
  // ============================================

  scanNav.addEventListener(
    'click',
    () => nav('scanVinScreen')
  );

  shortcut.onclick = () => nav('scanVinScreen');

  $scan('scanStart').onclick = startCamera;

  $scan('scanStop').onclick = () => {
    stopCamera();
    status('Scanner stopped.');
  };

  $scan('scanForm').onsubmit = event => {
    event.preventDefault();
    lookup($scan('scanVinInput').value);
  };

  $scan('scanVinInput').addEventListener(
    'input',
    event => {
      event.target.value = event.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 17);
    }
  );

  // Stop the camera when navigating away.

  new MutationObserver(() => {
    if (screen.hidden) stopCamera();
  }).observe(
    screen,
    {
      attributes: true,
      attributeFilter: ['hidden']
    }
  );

  renderRecent();

  console.log(
    '[Pull List] Scan VIN tab installed.'
  );

})();
