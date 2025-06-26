function createTexasMessageElement({ inline = false } = {}) {
  const wrapper = document.createElement('div');
  wrapper.id = 'ivy-texas-banner';

  wrapper.innerHTML = `
    <div style="flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; font-size: 15.5px; line-height: 1.3; text-align: center;">
      <strong style="font-size: 16px;">Shipping to Texas?</strong>
      Get your sales tax back in <strong style="color: inherit;">IndyVogue eGift Card</strong> within <strong style="color: inherit;">10 days</strong> of delivery.
    </div>
    ${!inline ? `
      <button id="ivy-texas-close" aria-label="Close" style="
        background: transparent;
        border: none;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        margin-left: 4px;
        align-self: center;
      ">&times;</button>` : ''}
  `;

  Object.assign(wrapper.style, {
    background: '#bf5700',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: inline ? '8px' : '0 0 8px 8px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #e5d28c',
    borderBottom: '2px solid #e3b43f',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: '9999',
    position: inline ? 'relative' : 'fixed',
    top: inline ? '' : '0',
    left: inline ? '' : '0',
    width: inline ? 'auto' : '100%',
    lineHeight: '1.4',
  });

  return wrapper;
}

function showTexasMessage() {
  const inlineTarget = document.getElementById('ivy-texas-egift-message');
  const isInline = !!inlineTarget;

  if (!isInline && sessionStorage.getItem('ivyTexasBannerDismissed') === 'true') {
    return;
  }

  const banner = createTexasMessageElement({ inline: isInline });

  if (isInline) {
    inlineTarget.style.display = 'block';
    inlineTarget.appendChild(banner);
  } else {
    document.body.prepend(banner);

    document.getElementById('ivy-texas-close')?.addEventListener('click', function () {
      sessionStorage.setItem('ivyTexasBannerDismissed', 'true');
      banner.remove();
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
  } catch {
    geoData = null;
  }

  function triggerGeoCheck() {
    if (geoData) {
      if (isTexas(geoData)) showTexasMessage();
    } else {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          sessionStorage.setItem(geoKey, JSON.stringify(data));
          if (isTexas(data)) showTexasMessage();
        })
        .catch((err) => console.warn('[TexasBanner] Geo fetch failed:', err));
    }
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(triggerGeoCheck);
  } else {
    setTimeout(triggerGeoCheck, 300);
  }
})();
