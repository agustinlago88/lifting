(function () {
  var LOCK_MS = 1500;
  var lastFire = 0;

  function procedimiento() {
    var p = (location.hostname + location.pathname).toLowerCase();
    if (p.indexOf('rino') > -1) return 'Rinoplastia';
    if (p.indexOf('endoscopico') > -1) return 'Lifting endoscopico';
    if (p.indexOf('deep-plane') > -1) return 'Deep Plane Facelift';
    return 'Lifting facial';
  }

  function nuevoId() {
    return 'wa-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  }

  document.addEventListener('click', function (e) {
    var nodo = e.target;
    if (!nodo || typeof nodo.closest !== 'function') nodo = nodo.parentElement;
    if (!nodo) return;

    var link = nodo.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="tel:"]');
    if (!link) return;

    var ahora = Date.now();
    if (ahora - lastFire < LOCK_MS) return;
    lastFire = ahora;

    if (typeof fbq !== 'function') return;

    var esTelefono = link.getAttribute('href').indexOf('tel:') === 0;

    fbq('track', 'Contact', {
      content_name: procedimiento(),
      content_category: esTelefono ? 'telefono' : 'whatsapp',
      source_button: link.getAttribute('data-ref') || 'sin-ref'
    }, { eventID: nuevoId() });
  }, true);
})();
