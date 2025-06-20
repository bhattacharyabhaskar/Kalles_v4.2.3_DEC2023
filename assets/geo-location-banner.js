function createTexasMessageElement({ inline = false } = {}) {
  console.log(`[TexasBanner] Creating message element. Inline: ${inline}`);

  const wrapper = document.createElement('div');
  wrapper.id = 'ivy-texas-banner';
  wrapper.innerHTML = `
  <div style="flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; font-size: 15.5px; line-height: 1.3; text-align: center;">
      <strong style="font-size: 16.5px;">Shipping to Texas?</strong>
      Get your sales tax back in <strong>IndyVogue eGift Card</strong> within <strong>10 days</strong> of delivery.
    </div>
    ${!inline ? `
    <button id="ivy-texas-close" aria-label="Close" style="
      background: transparent;
      border: none;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      cursor: pointer;
      margin-left: 6px;
      align-self: center;
    ">&times;</button>` : ''}
  `;

  Object.assign(wrapper.style, {
    background: '#bf5700',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: inline ? '10px' : '0 0 10px 10px',
    fontSize: '14.5px',
    fontWeight: '500',
    border: '1px solid #e5d28c',
    borderBottom: '2px solid #e3b43f',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: '9999',
    position: inline ? 'relative' : 'fixed',
    top: inline ? '' : '0',
    left: inline ? '' : '0',
    width: inline ? 'auto' : '100%',
    lineHeight: '1',
  });

  return wrapper;
}

function showTexasMessage() {
  const inlineTarget = document.getElementById('ivy-texas-egift-message');
  const isInline = !!inlineTarget;

  // Only suppress top banner if dismissed
  if (!isInline && sessionStorage.getItem('ivyTexasBannerDismissed') === 'true') {
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
      sessionStorage.setItem('ivyTexasBannerDismissed', 'true');
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
    geoData = JSON.parse(sessionStorage.getItem(geoKey));
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
        sessionStorage.setItem(geoKey, JSON.stringify(data));
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
