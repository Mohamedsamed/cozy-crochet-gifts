const banner = document.querySelector('[data-consent-banner]');
const analyticsId = banner && banner.dataset.analyticsId;
const pinterestTagId = banner && banner.dataset.pinterestTagId;
const manageButton = document.querySelector('[data-consent-manage]');
const storageKey = 'cozy-crochet-gifts-tracking-consent';

function loadAnalytics() {
  if (!analyticsId || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', analyticsId);

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(analyticsId);
  document.head.append(script);
}

function loadPinterestTag() {
  if (!pinterestTagId || window.pintrk) return;
  !function(e) {
    if (!window.pintrk) {
      window.pintrk = function() {
        window.pintrk.queue.push(Array.prototype.slice.call(arguments));
      };
      const tracker = window.pintrk;
      tracker.queue = [];
      tracker.version = '3.0';
      const script = document.createElement('script');
      script.async = true;
      script.src = e;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }('https://s.pinimg.com/ct/core.js');
  window.pintrk('load', pinterestTagId);
  window.pintrk('page');
  window.pintrk('track', 'pagevisit');
}

function loadConfiguredTags() {
  loadAnalytics();
  loadPinterestTag();
}

if (banner && (analyticsId || pinterestTagId)) {
  try {
    const choice = localStorage.getItem(storageKey);
    if (choice === 'accepted') {
      loadConfiguredTags();
    } else if (!choice) {
      banner.hidden = false;
    }
  } catch {
    banner.hidden = false;
  }

  banner.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    try { localStorage.setItem(storageKey, 'accepted'); } catch {}
    banner.hidden = true;
    loadConfiguredTags();
  });

  banner.querySelector('[data-consent-reject]')?.addEventListener('click', () => {
    try { localStorage.setItem(storageKey, 'rejected'); } catch {}
    banner.hidden = true;
  });

  manageButton?.addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); } catch {}
    banner.hidden = false;
    banner.querySelector('[data-consent-accept]')?.focus();
  });
}

document.addEventListener('click', (event) => {
  const anchor = event.target.closest('[data-analytics-event]');
  if (!anchor) return;
  const details = {
    product_id: anchor.dataset.productId || undefined,
    destination: new URL(anchor.href).hostname,
    page_path: window.location.pathname,
  };
  window.dispatchEvent(new CustomEvent('store:analytics', {
    detail: { event: anchor.dataset.analyticsEvent, parameters: details },
  }));
  if (window.gtag) window.gtag('event', anchor.dataset.analyticsEvent, details);
  if (window.pintrk && anchor.dataset.analyticsEvent === 'purchase_click') {
    window.pintrk('track', 'initiatecheckout');
  }
});