function createTexasMessageElement({ inline = false } = {}) {
  console.log(`[TexasBanner] Creating message element. Inline: ${inline}`);

  const wrapper = document.createElement('div');
  wrapper.id = 'ivy-texas-banner';
  wrapper.innerHTML = `
    <div style="font-size: 20px;">🎉</div>
    <div style="flex: 1;">
      <strong style="font-size: 16.5px;">Shipping to Texas?</strong><br>
      Get your sales tax back in <strong>IndyVogue eGift Card</strong> within <strong>10 days</strong> of delivery.
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
    borderRadius: inline ? '10px' : '0 0 10px 10px',
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
    lineHeight: '1.5',
  });

  return wrapper;
}

function showTexasMessage() {
  const inlineTarget = document.getElementById('ivy-texas-egift-message');
  const isInline = !!inlineTarget;

  // Only suppress top banner if dismissed
  if (!isInline && localStorage.getItem('ivyTexasBannerDismissed') === 'true') {
    console.log('[TexasBanner] Top banner dismissed previously. Skipping display.');
    return;
  }

  const banner = createTexasMessageElement({ inline: isInline });

  if (isInline) {
    console.log('[TexasBanner] Showing inline message.');
    inlineTarget.style.display = 'block';
    inlineTarget.appendChild(banner);
  } else {
    console.log('[TexasBanner] Showing top floating banner.');
    document.body.style.paddingTop = '70px';
    document.body.prepend(banner);

    document.getElementById('ivy-texas-close')?.addEventListener('click', function () {
      console.log('[TexasBanner] Top banner dismissed by user.');
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
      console.log('[TexasBanner] User is from Texas (cached). Showing banner.');
      showTexasMessage();
    } else {
      console.log('[TexasBanner] User not in Texas (cached). No banner.');
    }
  } else {
    console.log('[TexasBanner] Fetching geo data...');
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        console.log('[TexasBanner] Geo fetched:', data);
        localStorage.setItem(geoKey, JSON.stringify(data));
        if (isTexas(data)) {
          console.log('[TexasBanner] User is from Texas (fresh). Showing banner.');
          showTexasMessage();
        } else {
          console.log('[TexasBanner] User not in Texas. No banner.');
        }
      })
      .catch((err) => console.warn('[TexasBanner] Geo fetch failed:', err));
  }
})();
