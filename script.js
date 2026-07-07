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

  function formatMoney(amount) {
    return '$' + amount.toFixed(2);
  }

  function render(cart) {
    var items = (cart && cart.items && cart.items.items) || [];

    if (!items.length) {
      el.hidden = true;
      el.textContent = '';
      return;
    }

    var sheetCount = 0;
    items.forEach(function (item) {
      var categories = item.categories || [];
      if (categories.indexOf(SHEET_CATEGORY) !== -1) {
        sheetCount += item.quantity || 0;
      }
    });

    var subtotal = typeof cart.subtotal === 'number' ? cart.subtotal : (cart.total || 0);
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
  }

  document.addEventListener('snipcart.ready', function () {
    if (window.Snipcart && Snipcart.store) {
      render(Snipcart.store.getState().cart);
    }
    Snipcart.events.on('cart.updated', render);
  });
})();
