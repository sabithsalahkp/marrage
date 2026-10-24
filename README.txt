WEDDING JOURNAL — FANTASY PHOTO EDITION
=======================================

HOW TO OPEN
-----------
Open index.html in Chrome, Safari or Edge, or upload this folder's contents to
GitHub and deploy them to Cloudflare Pages.

CUSTOMISE THE WEDDING
---------------------
Open script.js. At the top, update WEDDING with:
- bride and groom names
- date in ISO format with a +05:30 timezone offset
- city and displayed time

IMAGES
------
assets/wedding-couple.webp is the included photorealistic sample portrait.
assets/wedding-venue.webp is the included photorealistic garden scene.
Both are local WebP assets (not SVG illustrations). They are generated sample
imagery rather than photographs of a real couple or real wedding venue.
To use the actual couple and venue photographs, replace the two files with
appropriately cropped images, keeping the same file names.

The original photo-upload control is inside the "Create a keepsake" panel.
It allows a JPG, PNG, WEBP or AVIF up to 15MB and downloads a 1080 x 1350 PNG.
An uploaded photo is processed in the visitor's browser, not on a server.

WHAT WORKS
----------
- Mobile / desktop invitation page
- Wedding countdown
- Save-the-date .ics calendar export
- Wishes form & device-local guest wish history
- Keepsake photo upload, zoom, personal signature, PNG download
- Local photo assets that do not need a remote photo service

IMPORTANT
---------
Guest wishes are stored in the local browser ONLY. To let different guests
see everyone's wishes, add Supabase or another database/backend.
Google Fonts require internet access; local fallback fonts are provided.
No payments, login or external APIs are required.

FILES
-----
index.html       Main single-page website
styles.css       Original layout and interactive component styles
fantasy.css      Photography-first fantasy wedding theme
script.js        Wedding configuration, interactions and PNG export
assets/          WebP photography-style samples and PNG favicon
