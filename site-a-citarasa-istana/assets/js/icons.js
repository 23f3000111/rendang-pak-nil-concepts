/* Inline SVG sprite. Load as the first thing inside <body> so <use href="#i-..."> resolves on first paint.
   Brand shapes: "arch" is the scalloped Warisan x PakNil badge, "anise" is a star anise for marquees. */
(function () {
  const stroke = (id, body) =>
    `<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`;

  const icons = {
    'i-bag': '<path d="M5.5 7.5h13l-1.1 12.5H6.6L5.5 7.5Z"/><path d="M9 7.5a3 3 0 0 1 6 0"/>',
    'i-search': '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
    'i-globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.6 3.7 5.6 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.6-3.7-9S9.6 5.6 12 3Z"/>',
    'i-close': '<path d="M6 6l12 12M18 6 6 18"/>',
    'i-arrow': '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    'i-arrow-left': '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
    'i-chevron': '<path d="m6 9 6 6 6-6"/>',
    'i-play': '<path d="M8 5.2v13.6L19 12 8 5.2Z" fill="currentColor"/>',
    'i-pause': '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    'i-chili': '<path d="M16.6 2.8c0 1.6.6 2.7 2 3.3"/><path d="M18.9 6.4c-1.7-1.3-4-.8-5.1 1-1.1 1.8-1.5 4.1-3 6.2-1.4 2-3.4 3.6-6.3 4.9 4.7 1 9.6-.4 12.6-3.6 2.5-2.7 3.4-6.4 1.8-8.5Z"/>',
    'i-clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    'i-users': '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c0-3.2 2.5-5.6 5.5-5.6s5.5 2.4 5.5 5.6"/><path d="M15.5 5.6a3.1 3.1 0 0 1 0 5.9M17.5 14.3c1.9.7 3 2.6 3 5.2"/>',
    'i-check': '<path d="m5 12.5 4.3 4.3L19 7"/>',
    'i-plus': '<path d="M12 5v14M5 12h14"/>',
    'i-minus': '<path d="M5 12h14"/>',
    'i-whatsapp': '<path d="M4.2 19.8 5.4 16A8.2 8.2 0 1 1 8.4 19l-4.2.8Z"/><path d="M9.3 8.4c-.2 2.9 2.9 6.3 6.2 6.3l.9-1.5-1.8-1-.9.8c-.9-.4-2-1.5-2.4-2.4l.8-.9-1-1.8-1.8.5Z"/>',
    'i-pin': '<path d="M12 21s-6.8-6-6.8-11.1a6.8 6.8 0 1 1 13.6 0C18.8 15 12 21 12 21Z"/><circle cx="12" cy="9.8" r="2.4"/>',
    'i-star': '<path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17.1 6.6 20l1.1-6.1-4.5-4.3 6.1-.8L12 3.2Z" fill="currentColor" stroke="none"/>',
    'i-leaf': '<path d="M5 19.5C4.6 10.8 10 5 19.6 4.4 19.8 13.5 14.4 19.6 5 19.5Z"/><path d="M5 19.5 14 10.5"/>',
    'i-store': '<path d="M4 9.5 5.5 4.5h13L20 9.5M4 9.5h16M4 9.5c0 1.6 1.2 2.8 2.7 2.8S9.3 11.1 9.3 9.5c0 1.6 1.2 2.8 2.7 2.8s2.7-1.2 2.7-2.8c0 1.6 1.2 2.8 2.6 2.8S20 11.1 20 9.5M5.5 12.2V20h13v-7.8M10 20v-4.5h4V20"/>',
    'i-truck': '<path d="M3 6.5h11v9.5H3zM14 9.5h3.8l3.2 3.3v3.2h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    'i-shield': '<path d="M12 3.2 5 6v5.8c0 4.4 2.9 7.6 7 9 4.1-1.4 7-4.6 7-9V6l-7-2.8Z"/><path d="m9 12 2.1 2.1L15.2 10"/>',
    'i-download': '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    'i-calendar': '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    'i-lock': '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
    'i-refresh': '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.6h-4.6"/>',
    'i-menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'i-phone': '<path d="M5.2 4h3.6l1.8 4.5-2.3 1.4a10.6 10.6 0 0 0 5.8 5.8l1.4-2.3 4.5 1.8v3.6a1.2 1.2 0 0 1-1.2 1.2C10.2 19.6 4.4 13.8 4 5.2A1.2 1.2 0 0 1 5.2 4Z"/>',
    'i-mail': '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m4 7.5 8 5.8 8-5.8"/>',
    'i-send': '<path d="M4 11.5 20 4l-5.5 16-3-7-7.5-1.5Z"/><path d="m11.5 13 3.5-3.5"/>',
    'i-flame': '<path d="M12 21c-3.9 0-6.5-2.5-6.5-5.9 0-3.3 2.6-5.3 3.6-8.1 2.5 1.6 3.3 3.7 3.3 5.4 1-.7 1.6-1.8 1.8-3 2.3 1.8 4.3 3.9 4.3 6 0 3.2-2.5 5.6-6.5 5.6Z"/>',
    'i-snowflake': '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9.5 4.5 2.5 2 2.5-2M9.5 19.5l2.5-2 2.5 2M4 10.6l3-.6-.6-3M20 13.4l-3 .6.6 3M4 13.4l3 .6-.6 3M20 10.6l-3-.6.6-3"/>',
    'i-heart': '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"/>',
    'i-moon': '<path d="M15.5 3.8A8.5 8.5 0 1 0 20.2 15 6.8 6.8 0 0 1 15.5 3.8Z"/>',
    'i-wok': '<path d="M3 11h18c-.6 4.4-4.4 7.5-9 7.5S3.6 15.4 3 11Z"/><path d="M21 11l2-1.5M8.5 7.5c.4-1 1.4-1.6 1.4-3M12.5 7.5c.4-1 1.4-1.6 1.4-3"/>',
    'i-microwave': '<rect x="2.5" y="5" width="19" height="13.5" rx="2"/><rect x="5" y="7.5" width="10" height="8.5" rx="1"/><path d="M18 8.5v.01M18 11v.01M18 13.5h.01"/>',
    'i-box': '<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4v-9Z"/><path d="m3.5 7.5 8.5 4 8.5-4M12 11.5v9"/>',
    'i-tag': '<path d="M3.5 12.2V4h8.2l8.8 8.8-8.2 8.2-8.8-8.8Z"/><circle cx="8" cy="8.5" r="1.4"/>',
    'i-bowl': '<path d="M3 11.5h18a9 9 0 0 1-18 0Z"/><path d="M8.5 8c0-1.4.9-1.8.9-3.3M12 8c0-1.4.9-1.8.9-3.3M15.5 8c0-1.4.9-1.8.9-3.3"/>',
    'i-file': '<path d="M6.5 3h7.5l4 4v14H6.5V3Z"/><path d="M14 3v4h4M9.5 12h5M9.5 15.5h5"/>',
    'i-info': '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    'i-wallet': '<rect x="3" y="6" width="18" height="13" rx="2.2"/><path d="M16 12.5h2.2M3 9.5h18"/>',
    'i-bank': '<path d="M3.5 9.5 12 4l8.5 5.5h-17ZM5.5 10v7.5M9.8 10v7.5M14.2 10v7.5M18.5 10v7.5M3.5 20h17"/>',
    'i-card': '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3 10h18M7 15h4"/>',
    'i-qr': '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2.5v2.5H14zM19.5 14v.01M14 19.5h.01M17 17h3v3h-3"/>',
    'i-sparkle': '<path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z"/><path d="M19 3.5v3M17.5 5h3"/>',
    'i-gift': '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5C10.5 5 7.5 4.6 7.2 6.4 7 8 9.5 8.5 12 8.5ZM12 8.5c1.5-3.5 4.5-3.9 4.8-2.1.2 1.6-2.3 2.1-4.8 2.1Z"/>',
    'i-repeat': '<path d="M4 12a6 6 0 0 1 6-6h8.5M15.5 3l3 3-3 3M20 12a6 6 0 0 1-6 6H5.5M8.5 21l-3-3 3-3"/>',
    'i-user': '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.6-3.6 3.5-5.8 7-5.8s6.4 2.2 7 5.8"/>',
    'i-logout': '<path d="M14 4.5h4.5v15H14M10 8.5 6.5 12l3.5 3.5M6.5 12H15"/>',
    'i-volume': '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    'i-mute': '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>'
  };
  const brand = {
    'i-facebook': '<path d="M14 8.5h2.5V5H14c-2.2 0-3.6 1.6-3.6 3.8V11H8v3.4h2.4V21h3.5v-6.6h2.6l.5-3.4h-3.1V9.2c0-.4.3-.7.6-.7Z" fill="currentColor"/>',
    'i-instagram': '<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/>',
    'i-tiktok': '<path d="M14.6 3h3c.2 1.9 1.5 3.4 3.4 3.6v3a6.6 6.6 0 0 1-3.4-1.1v6.3a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.1a2.8 2.8 0 1 0 1.9 2.6V3Z" fill="currentColor"/>'
  };

  /* the Warisan cartouche: scalloped crown top and bottom, waisted sides */
  const cartouche = 'M0-48C6-48 8-42 14-40.5 20-39 24-41.5 30-40.5 38-39 42-34 42-28 42-22 46-18 46-12V12C46 18 42 22 42 28 42 34 38 39 30 40.5 24 41.5 20 39 14 40.5 8 42 6 48 0 48S-8 42-14 40.5C-20 39-24 41.5-30 40.5-38 39-42 34-42 28-42 22-46 18-46 12V-12C-46-18-42-22-42-28-42-34-38-39-30-40.5-24-41.5-20-39-14-40.5-8-42-6-48 0-48Z';
  const petal = (n, r, rx, ry) => Array.from({ length: n }, (_, i) =>
    `<ellipse cx="0" cy="${-r}" rx="${rx}" ry="${ry}" transform="rotate(${((360 / n) * i).toFixed(2)})"/>`).join('');

  let sprite = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true">';
  for (const [id, body] of Object.entries(icons)) sprite += stroke(id, body);
  for (const [id, body] of Object.entries(brand)) sprite += `<symbol id="${id}" viewBox="0 0 24 24">${body}</symbol>`;
  sprite += `<symbol id="arch" viewBox="-50 -50 100 100"><path fill="currentColor" d="${cartouche}"/></symbol>`;
  sprite += `<symbol id="arch-line" viewBox="-50 -50 100 100"><path fill="none" stroke="currentColor" stroke-width="2.2" d="${cartouche}" transform="scale(.86)"/></symbol>`;
  sprite += `<symbol id="anise" viewBox="-50 -50 100 100"><g fill="currentColor">${petal(8, 24, 8.5, 22)}</g><circle r="9" fill="currentColor" opacity=".6"/></symbol>`;
  sprite += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);
})();
