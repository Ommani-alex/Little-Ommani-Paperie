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

    // cart.total / cart.grandTotal include shipping, which must never count
    // toward the free-shipping threshold - only read merchandise subtotal.
    var subtotal = typeof cart.subtotal === 'number' ? cart.subtotal
      : (cart.items && typeof cart.items.subtotal === 'number') ? cart.items.subtotal
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

    function readCurrentCart() {
      if (window.Snipcart && Snipcart.store) {
        render(Snipcart.store.getState().cart);
      }
    }

    readCurrentCart();

    // A persisted cart can still be loading into Snipcart's store right
    // after 'snipcart.ready' fires, and by the time our event listeners
    // below are attached, Snipcart may have already finished doing that
    // without us catching the moment - so poll a few times as a safety
    // net instead of relying on catching one specific event in time.
    var pollCount = 0;
    var pollId = setInterval(function () {
      pollCount += 1;
      readCurrentCart();
      if (pollCount >= 6) clearInterval(pollId);
    }, 500);

    // Also subscribe directly to Snipcart's store, which should notify on
    // every state change (cart hydration, item added/removed, etc.) - more
    // reliable than depending on specific named events firing after we
    // start listening.
    if (window.Snipcart && Snipcart.store && typeof Snipcart.store.subscribe === 'function') {
      Snipcart.store.subscribe(readCurrentCart);
    }

    Snipcart.events.on('cart.ready', render);
    Snipcart.events.on('cart.updated', render);
  });
})();

// GA4 ecommerce events. view_item fires immediately from the small
// window.gaItem data block each product page defines. The rest hook into
// Snipcart's events, same pattern as the cart-progress widget above.
(function () {
  function gtagReady() {
    return typeof window.gtag === 'function';
  }

  function toGaItem(item) {
    var categories = item.categories || item.categoryNames || [];
    return {
      item_id: item.id || item.uniqueId,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      item_category: categories[0] || undefined
    };
  }

  // Same defensive shape-handling as the cart-progress widget - Snipcart's
  // item list has shown up as both a plain array and a {count, items}
  // wrapper depending on context.
  function getItems(source) {
    if (!source || !source.items) return [];
    if (Array.isArray(source.items)) return source.items;
    if (Array.isArray(source.items.items)) return source.items.items;
    return [];
  }

  if (window.gaItem && gtagReady()) {
    gtag('event', 'view_item', {
      currency: 'USD',
      value: window.gaItem.price,
      items: [window.gaItem]
    });
  }

  document.addEventListener('snipcart.ready', function () {
    if (!gtagReady()) return;

    Snipcart.events.on('item.added', function (item) {
      var gaItem = toGaItem(item);
      console.log('[ga4-ecommerce] add_to_cart:', gaItem, '— raw item:', item);
      gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: (item.price || 0) * (item.quantity || 1),
        items: [gaItem]
      });
    });

    // Snipcart's public API doesn't expose a distinct "checkout step
    // started" event, so this uses 'cart.opened' as the closest available
    // proxy - it fires when the cart drawer opens, not specifically when
    // the Checkout button inside it is clicked. Treat begin_checkout data
    // as "engaged with cart," not a precise checkout-step funnel.
    Snipcart.events.on('cart.opened', function (cart) {
      var items = getItems(cart);
      if (!items.length) return;
      var subtotal = typeof cart.subtotal === 'number' ? cart.subtotal : (cart.total || 0);
      console.log('[ga4-ecommerce] begin_checkout (cart opened):', items);
      gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: subtotal,
        items: items.map(toGaItem)
      });
    });

    Snipcart.events.on('cart.confirmed', function (order) {
      console.log('[ga4-ecommerce] raw order object from Snipcart on cart.confirmed:', order);
      var items = getItems(order);
      gtag('event', 'purchase', {
        transaction_id: order.invoiceNumber || order.token || String(Date.now()),
        currency: order.currency || 'USD',
        value: order.total,
        items: items.map(toGaItem)
      });
      console.log('[ga4-ecommerce] purchase event sent for transaction:', order.invoiceNumber || order.token);
    });
  });
})();
