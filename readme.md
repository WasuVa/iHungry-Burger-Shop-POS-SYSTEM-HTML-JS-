# iHungry — Burger Shop POS 🍔🎉

A colorful, lightweight point-of-sale frontend for a burger shop. Clean Bootstrap UI, custom styles, and a tiny script for basic UI behavior.

Badges
- 🚀 Status: Beta
- 🎨 UI: Bootstrap + custom CSS
- 🧩 Files: HTML, CSS, JS

Quick Links
- Project entry: [index.html](index.html)
- Add-order page: [oderadd.html](oderadd.html)
- Styles: [CSS/styles.css](CSS/styles.css), [CSS/bootstrap.css](CSS/bootstrap.css)
- Script: [Js/app.js](Js/app.js) — see function [`updateUptime`](Js/app.js)
- Images: [img/](img/)

What this repo contains
- A responsive POS-like UI with a navigation bar, menu cards, and footer — see [index.html](index.html).
- A simple "Add Order" form at [oderadd.html](oderadd.html).
- Visual polish in [CSS/styles.css](CSS/styles.css) including button effects (.pulse-button, .slide-button, .press-button).
- A small script in [Js/app.js](Js/app.js) that updates the runtime display via [`updateUptime`](Js/app.js) and the DOM element with id [`uptime`](index.html).

Highlights
- Modern Bootstrap layout with custom theme (dark footer, orange accent).
- Decorative cards for menu items (images in [img/]).
- Interactive UI elements:
  - "New Order" button: [`newOrderBtn`](index.html)
  - Live uptime display: [`#uptime`](index.html) updated by [`updateUptime`](Js/app.js)

How to run
1. Open [index.html](index.html) in a browser.
2. Optionally open [oderadd.html](oderadd.html) to test the order form.

Contribute
- Improve accessibility, add form handling, persist orders (localStorage or server).
- Suggested starter tasks:
  - Wire the "New Order" button (`newOrderBtn`) to open a modal or navigate to [oderadd.html](oderadd.html).
  - Validate and submit the form in [oderadd.html](oderadd.html) and store orders.

Credits
- Built with Bootstrap and custom CSS in [CSS/styles.css](CSS/styles.css).
- Tiny JS helper: [`updateUptime`](Js/app.js).

License
- Use as a learning/demo project. Add a license file if needed.

Enjoy and customize the flavors! 🌭🔥