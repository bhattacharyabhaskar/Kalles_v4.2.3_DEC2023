function createTexasMessageElement({ inline = false } = {}) {
  const wrapper = document.createElement('div');
  wrapper.id = 'ivy-texas-banner';
  wrapper.innerHTML = `
    <div style="font-size: 20px;">🎉</div>
    <div style="flex: 1;">
      <strong style="font-size: 16.5px;">Shipping to Texas?</strong><br>
      Get Your Sales Tax back in <strong>IndyVogue eGift Card</strong> within <strong>10 days</strong> of delivery.
    </div>
    ${!inline ? `
    <button id="ivy-texas-close" aria-label="Close" style="
      background: transparent;
      border: none;
      font-size: 22px;
      font-weight: bold;
      color: #3d1f00;
      cursor: pointer;
      margin-left: 6px;
      align-self: start;
    ">&times;</button>` : ''}
  `;

  Object.assign(wrapper.style, {
    background: '#fff4c2',
    color: '#3d1f00',
    padding: '14px 20px',
    borderRadius: '0 0 10px 10px',
    fontSize: '15.8px',
    fontWeight: '500',
    borderBottom: '2px solid #e3b43f',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    zIndex: '9999',
    position: inline ? 'relative' : 'fixed',
    top: inline ? '' : '0',
    left: inline ? '' : '0',
    width: inline ? 'auto' : '100%',
  });

  return wrapper;
}

function showTexasMessage() {
  if (localStorage.getItem('ivyTexasBannerDismissed') === 'true') {
    return;
  }

  const inlineTarget = document.getElementById('ivy-texas-egift-message');
  const isInline = !!inlineTarget;

  const banner = createTexasMessageElement({ inline: isInline });

  if (isInline) {
    console.log('[TexasBanner] Appending banner to inline target.');
    inlineTarget.style.display = 'block';
    inlineTarget.appendChild(banner);
  } else {
    document.body.style.paddingTop = '70px';
    document.body.prepend(banner);

    document.getElementById('ivy-texas-close')?.addEventListener('click', function () {
      localStorage.setItem('ivyTexasBannerDismissed', 'true');
      banner.remove();
      document.body.style.paddingTop = null;
    });
  }
}

(function () {
  const geoKey = 'ivyGeoData';
  let geoData;

  const isTexas = (data) =>
    data?.region === 'Texas' &&
    data?.region_code === 'TX' &&
    data?.country === 'US';

  try {
    geoData = JSON.parse(localStorage.getItem(geoKey));
    console.log('[TexasBanner] Cached geo data found:', geoData);
  } catch {
    geoData = null;
    console.warn('[TexasBanner] Error parsing cached geo data.');
  }

  if (geoData) {
    if (isTexas(geoData)) {
      showTexasMessage();
    } 
  } else {
    console.log('[TexasBanner] No cached geo data. Fetching from ipapi...');
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(geoKey, JSON.stringify(data));
        if (isTexas(data)) {
          showTexasMessage();
        }
      })
      .catch((err) => console.warn('[TexasBanner] Geo fetch failed:', err));
  }
})();
