// MailerLite handles the newsletter form.

// Live cart progress toward the sticker-sheet mix & match and free shipping.
// Reads Snipcart's own cart totals (which already reflect the dashboard
// discount rule) so this never has to duplicate that pricing logic.
(function () {
  var el = document.getElementById('cart-progress');
  if (!el) return;

  var SHEET_CATEGORY = 'Sticker Sheets';
  var SHEET_GOAL = 4;
  var FREE_SHIPPING_THRESHOLD = 35;
  var renderCount = 0;

  function formatMoney(amount) {
    return '$' + amount.toFixed(2);
  }

  // Snipcart's cart object shape has varied across integration examples
  // (a plain array vs. a { count, items } wrapper), so accept either
  // instead of assuming one and silently rendering nothing.
  function getItems(cart) {
    if (!cart || !cart.items) return [];
    if (Array.isArray(cart.items)) return cart.items;
    if (Array.isArray(cart.items.items)) return cart.items.items;
    return [];
  }

  function render(cart) {
    renderCount += 1;
    var items = getItems(cart);
    console.log('[cart-progress] render #' + renderCount + ' — item count:', items.length, '— cart:', cart);

    if (!items.length) {
      el.hidden = true;
      el.textContent = '';
      console.log('[cart-progress] render #' + renderCount + ' — hiding widget (no items detected)');
      return;
    }

    var sheetCount = 0;
    items.forEach(function (item) {
      var categories = item.categories || item.categoryNames || [];
      if (categories.indexOf(SHEET_CATEGORY) !== -1) {
        sheetCount += item.quantity || 0;
      }
    });

    var subtotal = typeof cart.subtotal === 'number' ? cart.subtotal
      : typeof cart.total === 'number' ? cart.total
      : typeof cart.grandTotal === 'number' ? cart.grandTotal
      : 0;

    var parts = [];

    if (sheetCount > 0 && sheetCount < SHEET_GOAL) {
      var sheetsToGo = SHEET_GOAL - sheetCount;
      parts.push('Add ' + sheetsToGo + ' more sticker sheet' + (sheetsToGo === 1 ? '' : 's') + ' for the 4-for-$28 mix & match');
    } else if (sheetCount >= SHEET_GOAL) {
      parts.push('Mix & match pricing applied ✦');
    }

    if (subtotal < FREE_SHIPPING_THRESHOLD) {
      parts.push(formatMoney(FREE_SHIPPING_THRESHOLD - subtotal) + ' more for free U.S. shipping');
    } else {
      parts.push('Free U.S. shipping unlocked ✦');
    }

    el.hidden = false;
    el.textContent = parts.join(' · ');
    console.log('[cart-progress] render #' + renderCount + ' — showing widget:', el.textContent);
  }

  document.addEventListener('snipcart.ready', function () {
    console.log('[cart-progress] snipcart.ready fired');
    if (window.Snipcart && Snipcart.store) {
      render(Snipcart.store.getState().cart);
    }
    // 'cart.ready' fires once Snipcart has finished loading the persisted
    // cart (the initial store snapshot above can be read before that
    // finishes); 'cart.updated' fires on every later change.
    Snipcart.events.on('cart.ready', render);
    Snipcart.events.on('cart.updated', render);
  });
})();
