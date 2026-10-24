/*
  WEDDING DETAILS — edit these five fields to personalise the whole website.
  Date/time includes India's time-zone offset (+05:30).
*/
const WEDDING = {
  bride: 'Aanya',
  groom: 'Aarav',
  date: '2027-02-14T17:30:00+05:30',
  city: 'Kozhikode, Kerala',
  timeLabel: '5:30 PM onwards'
};

const SAMPLE_PHOTO = 'assets/wedding-couple.webp'; // Photo-style local sample; no remote loading needed
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const weddingDate = new Date(WEDDING.date);
const dateLabel = new Intl.DateTimeFormat('en-IN', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'}).format(weddingDate);
const weekday = new Intl.DateTimeFormat('en-IN', {weekday: 'long', timeZone: 'Asia/Kolkata'}).format(weddingDate);
const day = new Intl.DateTimeFormat('en-IN', {day: '2-digit', timeZone: 'Asia/Kolkata'}).format(weddingDate);
const month = new Intl.DateTimeFormat('en-IN', {month: 'long', timeZone: 'Asia/Kolkata'}).format(weddingDate);
const year = new Intl.DateTimeFormat('en-IN', {year: 'numeric', timeZone: 'Asia/Kolkata'}).format(weddingDate);

$$('[data-bride]').forEach(el => el.textContent = WEDDING.bride);
$$('[data-groom]').forEach(el => el.textContent = WEDDING.groom);
$$('[data-city]').forEach(el => el.textContent = WEDDING.city);
$('[data-hero-date]').textContent = `${weekday}, ${dateLabel}`;
$('[data-day]').textContent = day;
$('[data-month]').textContent = month.toUpperCase();
$('[data-year]').textContent = year;
$('[data-weekday]').textContent = weekday.toUpperCase();
$('[data-time]').textContent = WEDDING.timeLabel;
$('[data-keepsake-date]').textContent = `${day} ${month.toUpperCase()} ${year} · ${WEDDING.city.split(',')[0].toUpperCase()}`;
document.title = `${WEDDING.bride} & ${WEDDING.groom} — Our Wedding`;

function updateCountdown() {
  const difference = Math.max(0, weddingDate.getTime() - Date.now());
  const units = [86400000, 3600000, 60000, 1000];
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  let remainder = difference;
  units.forEach((unit, index) => {
    const count = Math.floor(remainder / unit);
    remainder %= unit;
    $(`#${ids[index]}`).textContent = String(count).padStart(2, '0');
  });
  if (difference === 0) $('.count-label').textContent = 'OUR CELEBRATION DAY HAS ARRIVED';
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// An .ics file opens in Google Calendar, Apple Calendar and Outlook.
$('#calendarBtn').addEventListener('click', () => {
  const start = weddingDate;
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const toICS = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const text = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Journal//Wedding Invite//EN',
    'BEGIN:VEVENT', `UID:wedding-${start.getTime()}@wedding-journal`,
    `DTSTAMP:${toICS(new Date())}`, `DTSTART:${toICS(start)}`, `DTEND:${toICS(end)}`,
    `SUMMARY:${WEDDING.bride} & ${WEDDING.groom}'s Wedding`,
    `LOCATION:${WEDDING.city}`, 'DESCRIPTION:We would love to celebrate with you!',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([text], {type: 'text/calendar;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'our-wedding-save-the-date.ics';
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
});

// Wishes stay in this browser only; replace this with a database for shared guest wishes.
const STORAGE_KEY = 'wedding-journal-wishes-v1';
function readWishes() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}
let wishes = readWishes();
function renderWishes() {
  const list = $('#wishesList');
  list.replaceChildren();
  $('#wishesCount').textContent = `${wishes.length} ${wishes.length === 1 ? 'NOTE' : 'NOTES'}`;
  if (!wishes.length) {
    const empty = document.createElement('div'); empty.className = 'empty-wishes';
    const flourish = document.createElement('span'); flourish.textContent = '✳';
    const title = document.createElement('h3'); title.textContent = 'Every beautiful word matters.';
    const desc = document.createElement('p'); desc.textContent = 'Be the first to leave a wish for the happy couple.';
    empty.append(flourish, title, desc); list.append(empty); return;
  }
  wishes.forEach(({name, message, createdAt}) => {
    const entry = document.createElement('article'); entry.className = 'wish-entry';
    const body = document.createElement('p'); body.textContent = `“${message}”`;
    const meta = document.createElement('div');
    const author = document.createElement('strong'); author.textContent = `— ${name}`;
    const timestamp = document.createElement('time');
    const date = new Date(createdAt);
    timestamp.textContent = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
    meta.append(author, timestamp); entry.append(body, meta); list.append(entry);
  });
}
renderWishes();
$('#wishForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#guestName').value.trim();
  const message = $('#guestMessage').value.trim();
  const feedback = $('#wishFeedback');
  if (!name || !message) { feedback.textContent = 'Please enter your name and your wish.'; return; }
  wishes.unshift({name: name.slice(0,60), message: message.slice(0,500), createdAt: new Date().toISOString()});
  wishes = wishes.slice(0, 40);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    feedback.textContent = 'Your lovely wish has been saved on this device. ♡';
  } catch {
    feedback.textContent = 'Your wish appears here, but this browser could not save it for later.';
  }
  $('#wishForm').reset(); renderWishes();
});

// Keepsake studio
const panel = $('#studioPanel');
const backdrop = $('#studioBackdrop');
const photo = $('#keepsakePhoto');
const photoInput = $('#photoInput');
const zoomInput = $('#zoomInput');
const signatureInput = $('#signatureInput');
const feedback = $('#studioFeedback');
let lastFocus = null;
let uploadedObjectURL = null;
let isUpload = false;
let photoZoom = 1;

// The default image is bundled locally and can be exported without CORS issues.
function setSamplePhoto() {
  if (uploadedObjectURL) { URL.revokeObjectURL(uploadedObjectURL); uploadedObjectURL = null; }
  isUpload = false;
  photoInput.value = '';
  zoomInput.value = '1';
  photoZoom = 1;
  $('#keepsakePreview').style.setProperty('--photo-zoom', '1');
  photo.removeAttribute('crossorigin');
  photo.src = SAMPLE_PHOTO;
}
setSamplePhoto();

function openStudio() {
  lastFocus = document.activeElement;
  panel.classList.add('open'); backdrop.classList.add('open');
  panel.setAttribute('aria-hidden', 'false'); backdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('dialog-open');
  $('#studioClose').focus();
}
function closeStudio() {
  panel.classList.remove('open'); backdrop.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true'); backdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dialog-open');
  feedback.textContent = '';
  if (lastFocus?.focus) lastFocus.focus();
}
$$('[data-open-studio]').forEach(button => button.addEventListener('click', openStudio));
$('#studioClose').addEventListener('click', closeStudio);
backdrop.addEventListener('click', closeStudio);
document.addEventListener('keydown', event => {
  if (!panel.classList.contains('open')) return;
  if (event.key === 'Escape') { closeStudio(); return; }
  if (event.key === 'Tab') {
    const eligible = Array.from(panel.querySelectorAll('button:not(:disabled), input:not(:disabled), label[for="photoInput"]'));
    if (!eligible.length) return;
    const first = eligible[0], last = eligible[eligible.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0]; if (!file) return;
  if (!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type)) {
    feedback.textContent = 'Please choose a JPG, PNG, WEBP or AVIF image.'; photoInput.value = ''; return;
  }
  if (file.size > 15 * 1024 * 1024) {
    feedback.textContent = 'That photo is over 15 MB. Please select a smaller image.'; photoInput.value = ''; return;
  }
  const previous = uploadedObjectURL;
  const next = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    isUpload = true;
    uploadedObjectURL = next;
    photo.removeAttribute('crossorigin'); photo.src = next;
    if (previous) URL.revokeObjectURL(previous);
    zoomInput.value = '1'; photoZoom = 1;
    $('#keepsakePreview').style.setProperty('--photo-zoom','1');
    feedback.textContent = 'Your photo is ready! Download your keepsake below.';
  };
  image.onerror = () => { URL.revokeObjectURL(next); feedback.textContent = 'This photo could not be opened. Try another image.'; };
  image.src = next;
});
zoomInput.addEventListener('input', () => {
  photoZoom = Number(zoomInput.value);
  $('#keepsakePreview').style.setProperty('--photo-zoom', String(photoZoom));
});
signatureInput.addEventListener('input', () => {
  $('#keepsakeSignPreview').textContent = signatureInput.value.trim() || 'WITH LOVE, ALWAYS';
});
$('#resetPhotoBtn').addEventListener('click', () => { setSamplePhoto(); feedback.textContent = 'Sample wedding photo restored.'; });

function canvasLabel(ctx, str, x, y, font, color, tracking = 0) {
  ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (!tracking) ctx.fillText(str, x, y);
  else {
    const letters = Array.from(str);
    const widths = letters.map(letter => ctx.measureText(letter).width);
    const total = widths.reduce((a,b)=>a+b,0)+tracking*(letters.length-1);
    let start = x - total/2;
    letters.forEach((letter,i) => { ctx.textAlign='left'; ctx.fillText(letter,start,y); start += widths[i]+tracking; });
  }
  ctx.restore();
}
function drawLeafBranch(ctx, x, y, flip = 1) {
  ctx.save(); ctx.translate(x,y); ctx.scale(flip,1);
  ctx.strokeStyle='#a7b199'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(0,0);ctx.bezierCurveTo(30,-27,34,-66,50,-106);ctx.stroke();
  for (const [xx,yy,angle] of [[15,-23,-.6],[29,-46,.6],[39,-70,-.5],[46,-95,.6]]) {
    ctx.save(); ctx.translate(xx,yy);ctx.rotate(angle);ctx.fillStyle='#b6bd9f';ctx.beginPath();ctx.ellipse(9,-2,15,6,.3,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  ctx.fillStyle='#d3b7a1';
  for(const [xx,yy] of [[47,-105],[58,-97],[53,-116]]) {ctx.beginPath();ctx.arc(xx,yy,7,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}
function archPath(ctx, x, y, width, height) {
  const radius=width/2;
  ctx.beginPath();ctx.moveTo(x,y+height);ctx.lineTo(x,y+radius);
  ctx.arc(x+radius,y+radius,radius,Math.PI,0,false);
  ctx.lineTo(x+width,y+height);ctx.closePath();
}
function coverImage(ctx, image, x, y, w, h, zoom) {
  const sourceW=image.naturalWidth || image.width, sourceH=image.naturalHeight || image.height;
  if(!sourceW||!sourceH) throw new Error('Photo has not finished loading.');
  const scale=Math.max(w/sourceW,h/sourceH)*zoom;
  const dw=sourceW*scale,dh=sourceH*scale;
  ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
async function loadImage(url, isCrossOrigin = false) {
  return new Promise((resolve,reject) => {
    const img = new Image();
    if (isCrossOrigin) img.crossOrigin = 'anonymous';
    img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Could not load photo.'));
    img.src=url;
  });
}
function fitFont(ctx, text, width, start, family='"Cormorant Garamond",Georgia,serif') {
  let fontSize=start;
  do {ctx.font=`500 ${fontSize}px ${family}`;if(ctx.measureText(text).width<=width)break;fontSize-=2;}while(fontSize>30);
  return fontSize;
}
async function renderKeepsake() {
  // Font CDNs may be unreachable offline. Never block exporting the image for them.
  if (document.fonts?.ready) await Promise.race([document.fonts.ready, new Promise(resolve => window.setTimeout(resolve, 1500))]);
  const canvas = document.createElement('canvas');canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d',{alpha:false});
  ctx.fillStyle='#f8f2e7';ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle='#c8b296';ctx.lineWidth=2;ctx.strokeRect(24,24,1032,1302);
  ctx.strokeStyle='#e4d8c6';ctx.lineWidth=1.5;ctx.strokeRect(36,36,1008,1278);
  canvasLabel(ctx,'A MOMENT TO REMEMBER    ✳    FOREVER',540,88,'700 20px "DM Sans",sans-serif','#867964',3);
  const x=104,y=158,w=872,h=785;
  ctx.save();ctx.strokeStyle='#bead92';ctx.lineWidth=3;
  archPath(ctx,x-10,y-10,w+20,h+20);ctx.stroke();ctx.restore();
  ctx.save();archPath(ctx,x,y,w,h);ctx.clip();
  ctx.fillStyle='#dce1d1';ctx.fillRect(x,y,w,h);
  let source=photo;
  if (!source.complete || !source.naturalWidth) await new Promise((resolve,reject) => {photo.addEventListener('load',resolve,{once:true});photo.addEventListener('error',reject,{once:true});});
  try {coverImage(ctx,source,x,y,w,h,photoZoom);}catch {source=await loadImage(SAMPLE_PHOTO);coverImage(ctx,source,x,y,w,h,photoZoom);}
  ctx.restore();
  canvasLabel(ctx,'THE WEDDING CELEBRATION OF',540,987,'700 17px "DM Sans",sans-serif','#928574',3.1);
  const names=`${WEDDING.bride}  &  ${WEDDING.groom}`;
  const namesSize=fitFont(ctx,names,960,91);
  canvasLabel(ctx,names,540,1070,`500 ${namesSize}px "Cormorant Garamond",Georgia,serif`,'#4a5c4c');
  canvasLabel(ctx,'✧',540,1133,'35px Georgia,serif','#aa9273');
  const dateText=`${day} ${month.toUpperCase()} ${year}   ·   ${WEDDING.city.split(',')[0].toUpperCase()}`;
  canvasLabel(ctx,dateText,540,1180,'700 18px "DM Sans",sans-serif','#898474',2);
  const sign = (signatureInput.value.trim() || 'With love, always').slice(0,38);
  let signSize=fitFont(ctx,sign,810,52,'"Great Vibes","Brush Script MT",cursive');
  canvasLabel(ctx,sign,540,1250,`${signSize}px "Great Vibes","Brush Script MT",cursive`,'#ae8b74');
  drawLeafBranch(ctx,115,1285,1);drawLeafBranch(ctx,965,1285,-1);
  return canvas;
}
$('#downloadBtn').addEventListener('click', async () => {
  const button=$('#downloadBtn');button.disabled=true;
  feedback.textContent='Preparing your high-quality keepsake…';
  try {
    let canvas=await renderKeepsake();
    let blob=await new Promise((resolve,reject) => {try {canvas.toBlob(value=>value?resolve(value):reject(new Error('Unable to export photo')),'image/png');}catch(error){reject(error);}});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download=`${WEDDING.bride}-${WEDDING.groom}-wedding-keepsake.png`;
    document.body.append(link);link.click();link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),3500);
    feedback.textContent='Your 1080 × 1350 PNG is ready. ♡';
  } catch (error) {
    // Try again with the locally bundled default photo if the browser has trouble with the image.
    if (!isUpload) {
      try {
        photo.removeAttribute('crossorigin');photo.src=SAMPLE_PHOTO;
        await new Promise((resolve,reject)=>{if(photo.complete&&photo.naturalWidth)return resolve();photo.addEventListener('load',resolve,{once:true});photo.addEventListener('error',reject,{once:true});});
        const canvas=await renderKeepsake();
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
        if(!blob)throw new Error('No image could be saved.');
        const url=URL.createObjectURL(blob);
        const link=document.createElement('a');link.href=url;link.download=`${WEDDING.bride}-${WEDDING.groom}-wedding-keepsake.png`;document.body.append(link);link.click();link.remove();
        window.setTimeout(()=>URL.revokeObjectURL(url),3500);
        feedback.textContent='Your PNG is ready, using the default wedding photo.';
      } catch { feedback.textContent='Download failed. Try uploading a JPG or PNG photo and download again.'; }
    } else { feedback.textContent='Download failed. Try a different JPG or PNG photo.'; }
  } finally {button.disabled=false;}
});
