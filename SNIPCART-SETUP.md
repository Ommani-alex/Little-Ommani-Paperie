# Turn on your cart

The site is now set up so your Snipcart public API key lives in **one place only**:

`snipcart-config.js`

## Do this before testing

1. Sign into Snipcart.
2. Copy your **Public API key** from your Snipcart dashboard. Do **not** use a secret API key.
3. Open `snipcart-config.js` and replace:

```js
publicApiKey: "PASTE_YOUR_SNIPCART_PUBLIC_API_KEY_HERE",
```

with your actual public key.

4. In Snipcart, set your **Default Website Domain** to:

```text
https://littleommani.com
```

5. Upload the updated website files to the root of your GitHub repository.
6. Wait for GitHub Pages to finish publishing, then test on `https://littleommani.com`.

## Before taking real orders

- Set up your payment gateway in Snipcart.
- Configure shipping rates.
- Configure sales-tax rules as appropriate for your business.
- Change Snipcart from Test mode to Live mode only after you complete a successful test order.

## Why this file matters

Do not replace `snipcart-config.js` when you upload later website updates. It contains your store connection. Future site edits should preserve it.
