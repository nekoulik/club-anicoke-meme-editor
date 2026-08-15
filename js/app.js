const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let layers = [];
let selectedLayer = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let dragLayers = [];
let checkedLayers = new Set();
let layerSearchQuery = '';
let currentBackground = null;
let currentLayout = 1;
let sectionImages = {};
let sectionFilters = {};
let activeGuides = { x: [], y: [] };
let isShiftPressed = false;
let watermark = { enabled: false, position: 'br', size: 120, opacity: 0.8, img: null };
let history = [];
let historyIndex = -1;
const loadedBackgrounds = {};
const loadedStickers = {};

const layouts = {
    1: { name: '1 секция', sections: [{ x: 0, y: 0, w: 1, h: 1 }], svg: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" fill="none" stroke="#ff6b9d" stroke-width="3"/></svg>` },
    2: { name: '2 секции', sections: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 1 }], svg: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="42" height="90" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="53" y="5" width="42" height="90" fill="none" stroke="#ff6b9d" stroke-width="3"/></svg>` },
    3: { name: '3 секции', sections: [{ x: 0, y: 0, w: 1 / 3, h: 1 }, { x: 1 / 3, y: 0, w: 1 / 3, h: 1 }, { x: 2 / 3, y: 0, w: 1 / 3, h: 1 }], svg: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="27" height="90" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="36" y="5" width="27" height="90" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="67" y="5" width="27" height="90" fill="none" stroke="#ff6b9d" stroke-width="3"/></svg>` },
    4: { name: '4 секции', sections: [{ x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 }, { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }], svg: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="42" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="53" y="5" width="42" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="5" y="53" width="42" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="53" y="53" width="42" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/></svg>` },
    5: { name: '5 секций', sections: [{ x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 }, { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.25, h: 0.5 }, { x: 0.75, y: 0.5, w: 0.25, h: 0.5 }], svg: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="42" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="53" y="5" width="42" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="5" y="53" width="42" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="53" y="53" width="20" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="77" y="53" width="18" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/></svg>` },
    6: { name: '6 секций', sections: [{ x: 0, y: 0, w: 1 / 3, h: 0.5 }, { x: 1 / 3, y: 0, w: 1 / 3, h: 0.5 }, { x: 2 / 3, y: 0, w: 1 / 3, h: 0.5 }, { x: 0, y: 0.5, w: 1 / 3, h: 0.5 }, { x: 1 / 3, y: 0.5, w: 1 / 3, h: 0.5 }, { x: 2 / 3, y: 0.5, w: 1 / 3, h: 0.5 }], svg: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="27" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="36" y="5" width="27" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="67" y="5" width="27" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="5" y="53" width="27" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="36" y="53" width="27" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/><rect x="67" y="53" width="27" height="42" fill="none" stroke="#ff6b9d" stroke-width="3"/></svg>` }
};

const filterPresets = {
    none: { name: 'Без фильтра', brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, blur: 0 },
    bw: { name: 'Чёрно-белый', brightness: 105, contrast: 120, saturate: 100, grayscale: 100, sepia: 0, blur: 0 },
    vintage: { name: 'Винтаж', brightness: 95, contrast: 90, saturate: 70, grayscale: 0, sepia: 50, blur: 0 },
    vivid: { name: 'Яркий', brightness: 105, contrast: 115, saturate: 160, grayscale: 0, sepia: 0, blur: 0 },
    soft: { name: 'Мягкий', brightness: 110, contrast: 90, saturate: 90, grayscale: 0, sepia: 10, blur: 1 },
    neon: { name: 'Неон', brightness: 110, contrast: 130, saturate: 200, grayscale: 0, sepia: 0, blur: 0 }
};

function on(id, evt, fn) { const el = document.getElementById(id); if (el) el.addEventListener(evt, fn); }

function getState() {
    return {
        layers: JSON.parse(JSON.stringify(layers)),
        currentBackground, currentLayout,
        canvasWidth: canvas.width, canvasHeight: canvas.height,
        sectionImages: Object.fromEntries(Object.entries(sectionImages).map(([k, img]) => [k, img.src])),
        sectionFilters: JSON.parse(JSON.stringify(sectionFilters)),
        watermark: { enabled: watermark.enabled, position: watermark.position, size: watermark.size, opacity: watermark.opacity, src: watermark.img ? watermark.img.src : null }
    };
}

function pushHistory() {
    history = history.slice(0, historyIndex + 1);
    history.push(getState());
    if (history.length > 30) history.shift();
    historyIndex = history.length - 1;
    scheduleSave();
}

function restoreState(state) {
    layers = state.layers;
    currentBackground = state.currentBackground;
    currentLayout = state.currentLayout;
    selectedLayer = null;
    dragLayers = [];
    checkedLayers.clear();
    if (state.canvasWidth && state.canvasHeight) { canvas.width = state.canvasWidth; canvas.height = state.canvasHeight; }
    sectionImages = {};
    Object.entries(state.sectionImages || {}).forEach(([k, src]) => { const img = new Image(); img.onload = () => render(); img.src = src; sectionImages[k] = img; });
    sectionFilters = state.sectionFilters || {};
    const wm = state.watermark;
    if (wm) {
        watermark.enabled = wm.enabled; watermark.position = wm.position; watermark.size = wm.size; watermark.opacity = wm.opacity;
        if (!wm.src) watermark.img = null;
        else if (!watermark.img || watermark.img.src !== wm.src) { const img = new Image(); img.onload = () => render(); img.src = wm.src; watermark.img = img; }
    }
    syncUI(); render();
}

function undo() { if (historyIndex > 0) { historyIndex--; restoreState(history[historyIndex]); } }
function redo() { if (historyIndex < history.length - 1) { historyIndex++; restoreState(history[historyIndex]); } }

function syncUI() {
    document.querySelectorAll('.layout-btn').forEach((btn, idx) => btn.classList.toggle('active', idx + 1 == currentLayout));
    document.querySelectorAll('.background-item').forEach((item, idx) => item.classList.toggle('active', Object.keys(backgrounds)[idx] === currentBackground));
    const preset = document.getElementById('canvasPreset');
    if (preset) { const val = `${canvas.width}x${canvas.height}`; if ([...preset.options].some(o => o.value === val)) preset.value = val; }
    updateSectionUploads(); updateLayersList(); syncWatermarkUI();
}

let historyTimer = null;
function scheduleHistory() { clearTimeout(historyTimer); historyTimer = setTimeout(() => pushHistory(), 400); }

const SAVE_KEY = 'club-anicoke-meme-editor';
let saveTimer = null;
function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveProject, 500); }

function saveProject() {
    const state = getState();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
    catch (e) {
        try { const light = Object.assign({}, state, { sectionImages: {} }); localStorage.setItem(SAVE_KEY, JSON.stringify(light)); console.warn('⚠️ localStorage переполнен'); }
        catch (e2) { console.warn('⚠️ Не удалось сохранить', e2); }
    }
    const el = document.getElementById('saveStatus');
    if (el) { const t = new Date(); el.textContent = `💾 Сохранено ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`; }
}

function loadProject() {
    try { const raw = localStorage.getItem(SAVE_KEY); if (!raw) return false; const state = JSON.parse(raw); if (!state) return false; restoreState(state); return true; }
    catch (e) { console.warn('Не удалось загрузить', e); return false; }
}

function preloadAssets(callback) {
    if (typeof backgrounds === 'undefined' || typeof characters === 'undefined') {
        console.error('❌ Не загружены characters.js или backgrounds.js');
        if (callback) callback();
        return;
    }
    let loadedCount = 0;
    const totalAssets = Object.keys(backgrounds).length + Object.keys(characters).length;
    function onAssetLoaded() { loadedCount++; if (loadedCount === totalAssets && callback) callback(); }
    Object.keys(backgrounds).forEach(key => {
        const img = new Image();
        img.onload = () => { loadedBackgrounds[key] = img; onAssetLoaded(); };
        img.onerror = () => { console.warn(`Не удалось загрузить фон: ${backgrounds[key].src}`); onAssetLoaded(); };
        img.src = backgrounds[key].src;
    });
    Object.keys(characters).forEach(key => {
        const img = new Image();
        const svgBlob = new Blob([characters[key].svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => { loadedStickers[key] = img; URL.revokeObjectURL(url); onAssetLoaded(); };
        img.src = url;
    });
}

function initLayouts() {
    const grid = document.getElementById('layoutsGrid');
    Object.keys(layouts).forEach(key => {
        const btn = document.createElement('div');
        btn.className = 'layout-btn' + (key == currentLayout ? ' active' : '');
        btn.innerHTML = layouts[key].svg;
        btn.title = layouts[key].name;
        btn.addEventListener('click', () => selectLayout(key));
        grid.appendChild(btn);
    });
    updateSectionUploads();
}

function selectLayout(key) { currentLayout = parseInt(key); sectionImages = {}; sectionFilters = {}; pushHistory(); syncUI(); render(); }

function updateSectionUploads() {
    const container = document.getElementById('sectionUploads');
    container.innerHTML = '';
    layouts[currentLayout].sections.forEach((section, idx) => {
        const f = sectionFilters[idx] || { ...filterPresets.none, preset: 'none' };
        const div = document.createElement('div');
        div.className = 'section-upload';
        div.innerHTML = `
            <label>Секция ${idx + 1}:</label>
            <input type="file" accept="image/*" onchange="loadSectionImage(${idx}, this)">
            <div class="section-filters">
                <select onchange="setSectionPreset(${idx}, this.value)">
                    ${Object.keys(filterPresets).map(k => `<option value="${k}" ${f.preset === k ? 'selected' : ''}>${filterPresets[k].name}</option>`).join('')}
                </select>
                <label>Яркость: <span id="sf-${idx}-brightness-val">${f.brightness}</span>%</label>
                <input type="range" min="20" max="200" value="${f.brightness}" oninput="setSectionFilter(${idx},'brightness',this.value)" onchange="sliderDone()">
                <label>Контраст: <span id="sf-${idx}-contrast-val">${f.contrast}</span>%</label>
                <input type="range" min="20" max="200" value="${f.contrast}" oninput="setSectionFilter(${idx},'contrast',this.value)" onchange="sliderDone()">
                <label>Насыщенность: <span id="sf-${idx}-saturate-val">${f.saturate}</span>%</label>
                <input type="range" min="0" max="200" value="${f.saturate}" oninput="setSectionFilter(${idx},'saturate',this.value)" onchange="sliderDone()">
            </div>`;
        container.appendChild(div);
    });
}

window.loadSectionImage = function (idx, input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { const img = new Image(); img.onload = () => { sectionImages[idx] = img; pushHistory(); render(); }; img.src = e.target.result; };
    reader.readAsDataURL(file);
};

function sectionFilterString(f) {
    if (!f) return 'none';
    return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) grayscale(${f.grayscale}%) sepia(${f.sepia}%) blur(${f.blur}px)`;
}

window.setSectionPreset = function (idx, preset) { const p = filterPresets[preset]; if (!p) return; sectionFilters[idx] = { ...p, preset }; pushHistory(); updateSectionUploads(); render(); };
window.setSectionFilter = function (idx, prop, value) { if (!sectionFilters[idx]) sectionFilters[idx] = { ...filterPresets.none, preset: 'none' }; sectionFilters[idx][prop] = parseInt(value); const el = document.getElementById(`sf-${idx}-${prop}-val`); if (el) el.textContent = value; render(); };

function initStickers() {
    const grid = document.getElementById('stickersGrid');
    Object.keys(characters).forEach(key => {
        const item = document.createElement('div');
        item.className = 'sticker-item';
        item.innerHTML = `${characters[key].svg}<div class="sticker-label">${characters[key].name}</div>`;
        item.addEventListener('click', () => addSticker(key));
        grid.appendChild(item);
    });
}

function addSticker(key) {
    layers.push({ id: Date.now(), type: 'sticker', key, name: characters[key].name, x: canvas.width / 2, y: canvas.height / 2, size: parseInt(document.getElementById('stickerSize').value), rotation: 0, flip: false, opacity: 1 });
    pushHistory(); updateLayersList(); render();
}

function initBackgrounds() {
    const grid = document.getElementById('backgroundsGrid');
    grid.innerHTML = '';
    Object.keys(backgrounds).forEach(key => {
        const item = document.createElement('div');
        item.className = 'background-item';
        item.innerHTML = `<img src="${backgrounds[key].src}" alt="${backgrounds[key].name}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`;
        item.title = backgrounds[key].name;
        item.addEventListener('click', () => selectBackground(key));
        grid.appendChild(item);
    });
}

// ⬇️ ВОТ ЭТА ФУНКЦИЯ — вставь её
function selectBackground(key) {
    currentBackground = key;
    pushHistory();
    syncUI();
    render();
}

// === 2.5. ВАТЕРМАРКА ===
function initWatermark() {
    // Встроенный логотип группы (работает без файлов)
    const builtinLogo = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80" viewBox="0 0 240 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="%23ff6b9d"/><stop offset="1" stop-color="%23c44dff"/></linearGradient></defs><rect x="3" y="3" width="234" height="74" rx="16" fill="%231a1a2e" opacity="0.85" stroke="url(%23g)" stroke-width="3"/><path d="M30 28c-8 0-14 7-15 15s3 12 7 12c3 0 5-3 8-3s5 3 8 3 5-3 8-3 5 3 8 3c4 0 8-4 7-12s-7-15-15-15z" fill="url(%23g)"/><circle cx="27" cy="40" r="2.5" fill="%23fff"/><circle cx="39" cy="40" r="2.5" fill="%23fff"/><text x="58" y="37" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="url(%23g)">CLUB</text><text x="58" y="60" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="%23fff">ANICOKE</text></svg>';

    const def = new Image();
    def.onload = () => { watermark.img = def; render(); };
    def.onerror = () => {
        // Файла logo.png нет — берём встроенный логотип
        const fallback = new Image();
        fallback.onload = () => { watermark.img = fallback; render(); };
        fallback.src = builtinLogo;
    };
    def.src = 'images/logo.png';

    on('watermarkEnabled', 'change', (e) => {
        watermark.enabled = e.target.checked;
        pushHistory();
        render();
    });
    on('watermarkPosition', 'change', (e) => {
        watermark.position = e.target.value;
        pushHistory();
        render();
    });
    on('watermarkSize', 'input', (e) => {
        watermark.size = parseInt(e.target.value);
        document.getElementById('watermarkSizeValue').textContent = e.target.value;
        render();
    });
    on('watermarkSize', 'change', () => pushHistory());
    on('watermarkOpacity', 'input', (e) => {
        watermark.opacity = parseInt(e.target.value) / 100;
        document.getElementById('watermarkOpacityValue').textContent = e.target.value;
        render();
    });
    on('watermarkOpacity', 'change', () => pushHistory());
    on('watermarkFile', 'change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                watermark.img = img;
                watermark.enabled = true;
                pushHistory();
                syncWatermarkUI();
                render();
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function syncWatermarkUI() {
    const en = document.getElementById('watermarkEnabled'); if (en) en.checked = watermark.enabled;
    const pos = document.getElementById('watermarkPosition'); if (pos) pos.value = watermark.position;
    const size = document.getElementById('watermarkSize'); if (size) size.value = watermark.size;
    const sv = document.getElementById('watermarkSizeValue'); if (sv) sv.textContent = watermark.size;
    const op = document.getElementById('watermarkOpacity'); if (op) op.value = Math.round(watermark.opacity * 100);
    const ov = document.getElementById('watermarkOpacityValue'); if (ov) ov.textContent = Math.round(watermark.opacity * 100);
}

function initFormat() { on('canvasPreset', 'change', (e) => { const [w, h] = e.target.value.split('x').map(Number); resizeCanvas(w, h); }); }

function resizeCanvas(w, h) {
    const oldW = canvas.width, oldH = canvas.height;
    if (oldW === w && oldH === h) return;
    const sx = w / oldW, sy = h / oldH, s = (sx + sy) / 2;
    layers.forEach(l => { l.x = Math.round(l.x * sx); l.y = Math.round(l.y * sy); if (l.type === 'sticker' || l.type === 'shape') l.size = Math.max(20, Math.round(l.size * s)); else if (l.type === 'bubble') l.size = Math.max(0.4, Math.min(3, l.size * s)); else l.fontSize = Math.max(8, Math.round(l.fontSize * s)); });
    canvas.width = w; canvas.height = h; pushHistory(); render();
}

on('addBubbleBtn', 'click', () => {
    const text = document.getElementById('bubbleText').value;
    if (!text.trim()) { alert('Введи реплику!'); return; }
    layers.push({ id: Date.now(), type: 'bubble', text: text.trim(), x: canvas.width / 2, y: canvas.height / 3, width: 260, fontSize: 26, size: 1, tail: document.getElementById('tailDirection').value, bubbleColor: document.getElementById('bubbleColor').value, textColor: document.getElementById('bubbleTextColor').value, opacity: 1 });
    document.getElementById('bubbleText').value = '';
    pushHistory(); updateLayersList(); render();
});

on('addShapeBtn', 'click', () => {
    layers.push({ id: Date.now(), type: 'shape', shape: document.getElementById('shapeType').value, color: document.getElementById('shapeColor').value, filled: document.getElementById('shapeFilled').checked, x: canvas.width / 2, y: canvas.height / 2, size: 80, rotation: 0, flip: false, opacity: 1 });
    pushHistory(); updateLayersList(); render();
});

function drawShape(layer) {
    const s = layer.size;
    ctx.save();
    ctx.translate(layer.x, layer.y);
    ctx.rotate((layer.rotation || 0) * Math.PI / 180);
    ctx.scale(layer.flip ? -1 : 1, 1);
    ctx.fillStyle = layer.color;
    ctx.strokeStyle = layer.color;
    ctx.lineWidth = Math.max(2, s / 20);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    switch (layer.shape) {
        case 'arrow':
            ctx.beginPath();
            ctx.moveTo(-s / 2, -s / 6); ctx.lineTo(s / 6, -s / 6); ctx.lineTo(s / 6, -s / 3);
            ctx.lineTo(s / 2, 0); ctx.lineTo(s / 6, s / 3); ctx.lineTo(s / 6, s / 6); ctx.lineTo(-s / 2, s / 6);
            ctx.closePath();
            break;
        case 'rect': ctx.beginPath(); ctx.rect(-s / 2, -s / 2, s, s); break;
        case 'star':
            ctx.beginPath();
            for (let i = 0; i < 10; i++) { const r = i % 2 === 0 ? s / 2 : s / 4; const a = (Math.PI / 5) * i - Math.PI / 2; const x = r * Math.cos(a); const y = r * Math.sin(a); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
            ctx.closePath();
            break;
        case 'circle': ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); break;
        case 'line': ctx.beginPath(); ctx.moveTo(-s / 2, 0); ctx.lineTo(s / 2, 0); break;
    }
    if (layer.filled && layer.shape !== 'line') ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function hitShape(layer, x, y) {
    const dx = x - layer.x, dy = y - layer.y;
    const rad = -(layer.rotation || 0) * Math.PI / 180;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
    const half = layer.size / 2;
    return rx >= -half && rx <= half && ry >= -half && ry <= half;
}

function wrapText(text, maxWidth) {
    const lines = [];
    text.split('\n').forEach(par => {
        const words = par.split(/\s+/).filter(Boolean);
        if (!words.length) { lines.push(''); return; }
        let line = words[0];
        for (let i = 1; i < words.length; i++) { const test = line + ' ' + words[i]; if (ctx.measureText(test).width > maxWidth) { lines.push(line); line = words[i]; } else line = test; }
        lines.push(line);
    });
    return lines;
}

function bubbleMetrics(layer) {
    const fs = Math.round(layer.fontSize * layer.size);
    ctx.font = `bold ${fs}px Arial`;
    const w = layer.width * layer.size, pad = 18 * layer.size;
    const lines = wrapText(layer.text, w - pad * 2);
    const lh = fs * 1.25, h = lines.length * lh + pad * 2;
    return { fs, w, h, lines, lh, pad };
}

function tailGeometry(layer, m) {
    if (layer.tail === 'none') return null;
    const s = layer.size, cx = layer.x, cy = layer.y;
    const halfW = m.w / 2, halfH = m.h / 2;
    let tip, edgeY;
    if (layer.tail === 'up') { tip = { x: cx, y: cy - halfH - 35 * s }; edgeY = cy - halfH; }
    else if (layer.tail === 'down-left') { tip = { x: cx - halfW * 0.5, y: cy + halfH + 35 * s }; edgeY = cy + halfH; }
    else if (layer.tail === 'down-right') { tip = { x: cx + halfW * 0.5, y: cy + halfH + 35 * s }; edgeY = cy + halfH; }
    else { tip = { x: cx, y: cy + halfH + 35 * s }; edgeY = cy + halfH; }
    const bw = 16 * s;
    const bx = Math.max(cx - halfW + bw + 6 * s, Math.min(tip.x, cx + halfW - bw - 6 * s));
    return { tip, edgeY, b1: { x: bx - bw, y: edgeY }, b2: { x: bx + bw, y: edgeY } };
}

function roundRectPath(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

window.cycleTail = function (id) {
    const order = ['down', 'down-left', 'down-right', 'up', 'none'];
    const layer = layers.find(l => l.id === id);
    if (!layer || layer.type !== 'bubble') return;
    layer.tail = order[(order.indexOf(layer.tail) + 1) % order.length];
    pushHistory(); render();
};

const memePhrases = ['КОГДА НАКОНЕЦ ПОФИКСИЛ БАГ', 'СЕНПАЙ ЗАМЕТИЛ МЕНЯ!', 'ВЫШЛА НОВАЯ СЕРИЯ!', 'Я, КОГДА СКАЗАЛ "ЕЩЁ ОДНУ СЕРИЮ"', 'КАВАЙ УРОВНЯ 9000', 'КОГДА ОПЕНИНГ ЛУЧШЕ СЮЖЕТА', 'КТО СЪЕЛ МОЙ РАМЕН?!', 'ПЯТНИЦА. ГРУППА. АНИМЕ.', 'КОГДА ВАЙФУ — ЛУЧШАЯ ГЁРЛ', 'ГОТОВИШЬ КОСПЛЕЙ В 3 ЧАСА НОЧИ', 'Я НЕ КОТИК, Я ВОЛК!', 'КОГДА ВСПОМНИЛ ПРО ДЕДЛАЙН', 'АНИМЕ — ЭТО ДОМАШКА!', 'КОГДА ПРЕПОД ПОХВАЛИЛ ТЕБЯ', 'ОБНИМИ КОТИКА — ПОЛУЧИ +100 К НАСТРОЕНИЮ'];
const bubblePhrases = ['Ня?', 'УwУ', 'Пошли!', 'Это не то, что выглядит!', 'Дай вкусняшку', 'Я ничего не делал(а)', 'Верю в тебя!', 'Кьяа~!'];
function randomOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomMeme() {
    currentBackground = randomOf(Object.keys(backgrounds));
    layers = []; sectionImages = {}; sectionFilters = {}; currentLayout = 1; checkedLayers.clear(); dragLayers = [];
    let baseId = Date.now();
    const charKeys = Object.keys(characters);
    const stickerCount = Math.random() < 0.4 ? 2 : 1;
    const stickers = [];
    for (let i = 0; i < stickerCount; i++) {
        const key = randomOf(charKeys);
        const st = { id: baseId++, type: 'sticker', key, name: characters[key].name, x: Math.round(canvas.width * (0.3 + Math.random() * 0.4)), y: Math.round(canvas.height * (0.45 + Math.random() * 0.3)), size: Math.round(140 + Math.random() * 140), rotation: Math.round(Math.random() * 40 - 20), flip: Math.random() < 0.5, opacity: 1 };
        stickers.push(st); layers.push(st);
    }
    const top = Math.random() < 0.6;
    const phrase = randomOf(memePhrases);
    const fs = Math.max(28, Math.min(56, Math.floor(1500 / phrase.length)));
    layers.push({ id: baseId++, type: 'text', text: phrase, x: canvas.width / 2, y: top ? Math.round(canvas.height * 0.1) : Math.round(canvas.height * 0.9), fontSize: fs, fontFamily: 'Impact', color: '#ffffff', strokeColor: '#000000', strokeWidth: 5, bold: true, italic: false, shadow: false, opacity: 1 });
    if (stickers.length && Math.random() < 0.5) {
        const st = stickers[0];
        layers.push({ id: baseId++, type: 'bubble', text: randomOf(bubblePhrases), x: Math.min(canvas.width - 140, Math.max(140, st.x + (Math.random() < 0.5 ? -1 : 1) * st.size * 0.7)), y: Math.max(90, st.y - st.size * 0.9), width: 200, fontSize: 24, size: 1, tail: 'down', bubbleColor: '#ffffff', textColor: '#000000', opacity: 1 });
    }
    selectedLayer = null; pushHistory(); syncUI(); render();
}

on('randomMemeBtn', 'click', randomMeme);

on('addTextBtn', 'click', () => {
    const text = document.getElementById('textInput').value;
    if (!text.trim()) { alert('Введи текст!'); return; }
    layers.push({
        id: Date.now(), type: 'text', text,
        x: canvas.width / 2, y: canvas.height / 2,
        fontSize: parseInt(document.getElementById('fontSize').value),
        fontFamily: document.getElementById('fontSelect').value,
        color: document.getElementById('textColor').value,
        strokeColor: document.getElementById('strokeColor').value,
        strokeWidth: parseInt(document.getElementById('strokeWidth').value),
        bold: document.getElementById('boldText').checked,
        italic: document.getElementById('italicText').checked,
        shadow: document.getElementById('shadowText').checked,
        neon: document.getElementById('neonText').checked,
        gradient: document.getElementById('gradientText').checked,
        gradientFrom: document.getElementById('gradientFrom').value,
        gradientTo: document.getElementById('gradientTo').value,
        opacity: 1
    });
    document.getElementById('textInput').value = '';
    pushHistory(); updateLayersList(); render();
});

function layerSearchText(layer) {
    const typeWord = layer.type === 'sticker' ? 'стикер' : layer.type === 'shape' ? `фигура ${layer.shape}` : layer.type === 'bubble' ? 'облачко' : 'текст';
    const content = layer.type === 'sticker' ? layer.name : layer.type === 'shape' ? '' : layer.text;
    return `${typeWord} ${content}`.toLowerCase();
}

function updateLayersList() {
    const container = document.getElementById('textLayers');
    container.innerHTML = '';
    let visibleCount = 0;
    [...layers].reverse().forEach(layer => {
        if (layerSearchQuery && !layerSearchText(layer).includes(layerSearchQuery)) return;
        visibleCount++;
        const item = document.createElement('div');
        item.className = 'text-layer-item' + (selectedLayer === layer ? ' active' : '');
        const groupBadge = layer.group ? '🔗 ' : '';
        const label = layer.type === 'sticker' ? `🎭 ${groupBadge}${layer.name}` : layer.type === 'shape' ? `➡️ ${groupBadge}${layer.shape}` : layer.type === 'bubble' ? `💬 ${groupBadge}${layer.text}` : `📝 ${groupBadge}${layer.text}`;
        const opacity = Math.round((layer.opacity !== undefined ? layer.opacity : 1) * 100);
        const isSticker = layer.type === 'sticker';
        const isShape = layer.type === 'shape';
        const isBubble = layer.type === 'bubble';
        const rotation = layer.rotation || 0;
        item.innerHTML = `
            <input type="checkbox" class="layer-check" ${checkedLayers.has(layer.id) ? 'checked' : ''} onchange="toggleLayerCheck(${layer.id}, this.checked)" title="Отметить для группировки">
            <span>${label}</span>
            <div class="layer-controls">
                <button title="Выше" onclick="moveLayer(${layer.id}, 1)">↑</button>
                <button title="Ниже" onclick="moveLayer(${layer.id}, -1)">↓</button>
                ${isSticker || isShape ? `<button title="Отразить" onclick="toggleFlip(${layer.id})">⇄</button>` : ''}
                ${isBubble ? `<button title="Хвостик" onclick="cycleTail(${layer.id})">🎯</button>` : ''}
                <button title="Дублировать" onclick="duplicateLayer(${layer.id})">⧉</button>
                <button class="del" title="Удалить" onclick="deleteLayer(${layer.id})">✕</button>
            </div>
            <input type="range" min="0" max="100" value="${opacity}" class="layer-opacity" title="Прозрачность" oninput="setLayerOpacity(${layer.id}, this.value)" onchange="sliderDone()">
            ${isSticker || isShape ? `<input type="range" min="-180" max="180" value="${rotation}" class="layer-opacity" title="Поворот" oninput="setLayerRotation(${layer.id}, this.value)" onchange="sliderDone()">` : ''}`;
        item.addEventListener('click', (e) => { if (e.target.tagName !== 'BUTTON' && e.target.type !== 'range' && e.target.type !== 'checkbox') { selectedLayer = layer; updateLayersList(); } });
        container.appendChild(item);
    });
    if (visibleCount === 0 && layerSearchQuery) { const empty = document.createElement('div'); empty.className = 'layers-empty'; empty.textContent = '🙈 Ничего не найдено'; container.appendChild(empty); }
}

window.toggleLayerCheck = function (id, checked) { if (checked) checkedLayers.add(id); else checkedLayers.delete(id); };

function groupChecked() {
    if (checkedLayers.size < 2) { showToast('❌ Отметь 2+ слоя', 'error'); return; }
    const gid = Date.now();
    layers.forEach(l => { if (checkedLayers.has(l.id)) l.group = gid; });
    checkedLayers.clear(); pushHistory(); updateLayersList(); render(); showToast('🔗 Сгруппировано');
}

function ungroupChecked() {
    let targets = layers.filter(l => checkedLayers.has(l.id) && l.group);
    if (!targets.length && selectedLayer && selectedLayer.group) targets = layers.filter(l => l.group === selectedLayer.group);
    if (!targets.length) { showToast('❌ Нет группы', 'error'); return; }
    targets.forEach(l => delete l.group);
    checkedLayers.clear(); pushHistory(); updateLayersList(); render(); showToast('✂️ Разгруппировано');
}

function initGroupToolbar() {
    const list = document.getElementById('textLayers');
    if (!list || document.getElementById('groupToolbar')) return;
    const bar = document.createElement('div');
    bar.id = 'groupToolbar'; bar.className = 'group-toolbar';
    bar.innerHTML = `<button class="btn btn-secondary" id="groupBtn" title="Ctrl+G">🔗 Сгруппировать</button><button class="btn btn-secondary" id="ungroupBtn" title="Ctrl+Shift+G">✂️ Разгруппировать</button>`;
    list.parentNode.insertBefore(bar, list);
    document.getElementById('groupBtn').addEventListener('click', groupChecked);
    document.getElementById('ungroupBtn').addEventListener('click', ungroupChecked);
}

window.deleteLayer = function (id) { layers = layers.filter(l => l.id !== id); checkedLayers.delete(id); selectedLayer = null; pushHistory(); updateLayersList(); render(); };

function initLayerSearch() {
    const list = document.getElementById('textLayers');
    if (!list || document.getElementById('layerSearch')) return;
    const input = document.createElement('input');
    input.type = 'text'; input.id = 'layerSearch'; input.className = 'layer-search'; input.placeholder = '🔍 Поиск слоя...';
    input.addEventListener('input', () => { layerSearchQuery = input.value.trim().toLowerCase(); updateLayersList(); });
    const toolbar = document.getElementById('groupToolbar');
    list.parentNode.insertBefore(input, toolbar || list);
}

window.duplicateLayer = function (id) {
    const layer = layers.find(l => l.id === id); if (!layer) return;
    const source = layer.group ? layers.filter(l => l.group === layer.group) : [layer];
    const newGroup = source.length > 1 ? Date.now() : null;
    let selectedClone = null;
    source.forEach(src => {
        const copy = JSON.parse(JSON.stringify(src));
        copy.id = Date.now() + Math.floor(Math.random() * 1e6);
        copy.x += 20; copy.y += 20;
        if (newGroup) copy.group = newGroup; else delete copy.group;
        if (src.id === id) selectedClone = copy;
        layers.push(copy);
    });
    selectedLayer = selectedClone; pushHistory(); updateLayersList(); render();
};

window.moveLayer = function (id, dir) {
    const idx = layers.findIndex(l => l.id === id); if (idx < 0) return;
    const newIdx = idx + dir; if (newIdx < 0 || newIdx >= layers.length) return;
    [layers[idx], layers[newIdx]] = [layers[newIdx], layers[idx]];
    pushHistory(); updateLayersList(); render();
};

window.setLayerOpacity = function (id, value) { const layer = layers.find(l => l.id === id); if (!layer) return; layer.opacity = value / 100; render(); };
window.setLayerRotation = function (id, value) { const layer = layers.find(l => l.id === id); if (!layer || (layer.type !== 'sticker' && layer.type !== 'shape')) return; layer.rotation = parseInt(value); render(); };
window.toggleFlip = function (id) { const layer = layers.find(l => l.id === id); if (!layer || (layer.type !== 'sticker' && layer.type !== 'shape')) return; layer.flip = !layer.flip; pushHistory(); render(); };
window.sliderDone = function () { pushHistory(); };

document.addEventListener('keydown', (e) => {
    const el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); if (selectedLayer) duplicateLayer(selectedLayer.id); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') { e.preventDefault(); if (e.shiftKey) ungroupChecked(); else groupChecked(); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayer) { e.preventDefault(); deleteLayer(selectedLayer.id); return; }
    if (selectedLayer && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const moveSet = selectedLayer.group ? layers.filter(l => l.group === selectedLayer.group) : [selectedLayer];
        moveSet.forEach(l => { if (e.key === 'ArrowLeft') l.x -= step; else if (e.key === 'ArrowRight') l.x += step; else if (e.key === 'ArrowUp') l.y -= step; else if (e.key === 'ArrowDown') l.y += step; });
        render(); scheduleHistory();
    }
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentBackground && loadedBackgrounds[currentBackground]) ctx.drawImage(loadedBackgrounds[currentBackground], 0, 0, canvas.width, canvas.height);
    else { const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); gradient.addColorStop(0, '#1a1a2e'); gradient.addColorStop(1, '#0f3460'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height); }

    const layout = layouts[currentLayout], padding = 10;
    const hasBackground = !!(currentBackground && loadedBackgrounds[currentBackground]);
    layout.sections.forEach((section, idx) => {
        const x = section.x * canvas.width + padding, y = section.y * canvas.height + padding;
        const w = section.w * canvas.width - padding * 2, h = section.h * canvas.height - padding * 2;
        const img = sectionImages[idx];
        if (img) {
            const scale = Math.max(w / img.width, h / img.height);
            const imgW = img.width * scale, imgH = img.height * scale;
            const imgX = x + (w - imgW) / 2, imgY = y + (h - imgH) / 2;
            ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
            ctx.filter = sectionFilterString(sectionFilters[idx]);
            ctx.drawImage(img, imgX, imgY, imgW, imgH); ctx.restore();
        } else if (!hasBackground) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; ctx.font = '16px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(`Секция ${idx + 1}`, x + w / 2, y + h / 2);
        }
        ctx.strokeStyle = '#ff6b9d'; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
    });

    layers.forEach(layer => {
        ctx.save();
        ctx.globalAlpha = layer.opacity !== undefined ? layer.opacity : 1;
        if (layer.type === 'sticker') {
            if (loadedStickers[layer.key]) {
                ctx.translate(layer.x, layer.y);
                ctx.rotate((layer.rotation || 0) * Math.PI / 180);
                ctx.scale(layer.flip ? -1 : 1, 1);
                ctx.drawImage(loadedStickers[layer.key], -layer.size / 2, -layer.size / 2, layer.size, layer.size);
            }
        } else if (layer.type === 'shape') {
            drawShape(layer);
        } else if (layer.type === 'bubble') {
            const m = bubbleMetrics(layer);
            const bx = layer.x - m.w / 2, by = layer.y - m.h / 2, lw = 3 * layer.size;
            const tail = tailGeometry(layer, m);
            if (tail) {
                ctx.beginPath(); ctx.moveTo(tail.b1.x, tail.b1.y); ctx.lineTo(tail.tip.x, tail.tip.y); ctx.lineTo(tail.b2.x, tail.b2.y); ctx.closePath();
                ctx.fillStyle = layer.bubbleColor; ctx.fill();
                ctx.beginPath(); ctx.moveTo(tail.b1.x, tail.b1.y); ctx.lineTo(tail.tip.x, tail.tip.y); ctx.lineTo(tail.b2.x, tail.b2.y);
                ctx.strokeStyle = '#000000'; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke();
            }
            roundRectPath(bx, by, m.w, m.h, 18 * layer.size);
            ctx.fillStyle = layer.bubbleColor; ctx.fill();
            ctx.strokeStyle = '#000000'; ctx.lineWidth = lw; ctx.stroke();
            if (tail) { ctx.fillStyle = layer.bubbleColor; ctx.fillRect(tail.b1.x + 1, tail.edgeY - lw / 2 - 1, (tail.b2.x - tail.b1.x) - 2, lw + 2); }
            ctx.fillStyle = layer.textColor; ctx.font = `bold ${m.fs}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            m.lines.forEach((line, i) => { const ly = by + m.pad + m.lh / 2 + i * m.lh; ctx.fillText(line, layer.x, ly); });
        } else {
            let fontStyle = '';
            if (layer.italic) fontStyle += 'italic ';
            if (layer.bold) fontStyle += 'bold ';
            ctx.font = `${fontStyle}${layer.fontSize}px ${layer.fontFamily}`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            if (layer.shadow) { ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2; }
            const lines = layer.text.split('\n');
            const lineHeight = layer.fontSize * 1.2;
            let fill = layer.color;
            if (layer.gradient) {
                const blockH = (lines.length - 1) * lineHeight + layer.fontSize;
                const g = ctx.createLinearGradient(0, layer.y - blockH / 2, 0, layer.y + blockH / 2);
                g.addColorStop(0, layer.gradientFrom || '#ff6b9d');
                g.addColorStop(1, layer.gradientTo || '#6bbaff');
                fill = g;
            }
            lines.forEach((line, i) => {
                const y = layer.y + (i - (lines.length - 1) / 2) * lineHeight;
                if (layer.strokeWidth > 0) {
                    ctx.strokeStyle = layer.strokeColor;
                    ctx.lineWidth = layer.strokeWidth;
                    ctx.lineJoin = 'round';
                    if (layer.neon) {
                        ctx.save();
                        ctx.shadowColor = layer.strokeColor;
                        ctx.shadowBlur = 20; ctx.strokeText(line, layer.x, y);
                        ctx.shadowBlur = 10; ctx.strokeText(line, layer.x, y);
                        ctx.shadowBlur = 5; ctx.strokeText(line, layer.x, y);
                        ctx.restore();
                    } else {
                        ctx.strokeText(line, layer.x, y);
                    }
                }
                ctx.fillStyle = fill;
                ctx.fillText(line, layer.x, y);
            });
        }
        ctx.restore();
    });

    if (watermark.enabled && watermark.img && watermark.img.width) {
        const img = watermark.img, w = watermark.size, h = w * (img.height / img.width), m = 15;
        let x = m, y = m;
        if (watermark.position === 'tr') { x = canvas.width - w - m; y = m; }
        else if (watermark.position === 'bl') { x = m; y = canvas.height - h - m; }
        else if (watermark.position === 'br') { x = canvas.width - w - m; y = canvas.height - h - m; }
        ctx.save(); ctx.globalAlpha = watermark.opacity; ctx.drawImage(img, x, y, w, h); ctx.restore();
    }

    if (isDragging && activeGuides && (activeGuides.x.length > 0 || activeGuides.y.length > 0)) {
        ctx.save(); ctx.strokeStyle = '#ff6b9d'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        activeGuides.x.forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); });
        activeGuides.y.forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); });
        ctx.restore();
    }
}

document.addEventListener('keydown', (e) => { if (e.key === 'Shift') isShiftPressed = true; });
document.addEventListener('keyup', (e) => { if (e.key === 'Shift') isShiftPressed = false; });

function getLayerBounds(layer) {
    if (layer.type === 'sticker' || layer.type === 'shape') {
        const half = layer.size / 2;
        return { left: layer.x - half, right: layer.x + half, top: layer.y - half, bottom: layer.y + half, centerX: layer.x, centerY: layer.y };
    } else if (layer.type === 'bubble') {
        const m = bubbleMetrics(layer);
        return { left: layer.x - m.w / 2, right: layer.x + m.w / 2, top: layer.y - m.h / 2, bottom: layer.y + m.h / 2, centerX: layer.x, centerY: layer.y };
    } else {
        ctx.font = `${layer.bold ? 'bold ' : ''}${layer.italic ? 'italic ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
        const w = ctx.measureText(layer.text).width, h = layer.fontSize;
        return { left: layer.x - w / 2, right: layer.x + w / 2, top: layer.y - h / 2, bottom: layer.y + h / 2, centerX: layer.x, centerY: layer.y };
    }
}

function findSnapGuides(draggedLayer, allLayers) {
    const guides = { x: [], y: [] }, threshold = 8;
    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const bounds = getLayerBounds(draggedLayer);
    if (Math.abs(bounds.centerX - centerX) < threshold) guides.x.push(centerX);
    if (Math.abs(bounds.centerY - centerY) < threshold) guides.y.push(centerY);
    if (Math.abs(bounds.left - 0) < threshold) guides.x.push(0);
    if (Math.abs(bounds.right - canvas.width) < threshold) guides.x.push(canvas.width);
    if (Math.abs(bounds.top - 0) < threshold) guides.y.push(0);
    if (Math.abs(bounds.bottom - canvas.height) < threshold) guides.y.push(canvas.height);
    allLayers.forEach(other => {
        if (other === draggedLayer) return;
        if (draggedLayer.group && other.group === draggedLayer.group) return;
        const ob = getLayerBounds(other);
        if (Math.abs(bounds.centerX - ob.centerX) < threshold) guides.x.push(ob.centerX);
        if (Math.abs(bounds.centerY - ob.centerY) < threshold) guides.y.push(ob.centerY);
        if (Math.abs(bounds.left - ob.left) < threshold) guides.x.push(ob.left);
        if (Math.abs(bounds.right - ob.right) < threshold) guides.x.push(ob.right);
        if (Math.abs(bounds.top - ob.top) < threshold) guides.y.push(ob.top);
        if (Math.abs(bounds.bottom - ob.bottom) < threshold) guides.y.push(ob.bottom);
        if (Math.abs(bounds.left - ob.right) < threshold) guides.x.push(ob.right);
        if (Math.abs(bounds.right - ob.left) < threshold) guides.x.push(ob.left);
        if (Math.abs(bounds.top - ob.bottom) < threshold) guides.y.push(ob.bottom);
        if (Math.abs(bounds.bottom - ob.top) < threshold) guides.y.push(ob.top);
    });
    return guides;
}

function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

function hitSticker(layer, x, y) {
    const dx = x - layer.x, dy = y - layer.y;
    const rad = -(layer.rotation || 0) * Math.PI / 180;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
    const half = layer.size / 2;
    return rx >= -half && rx <= half && ry >= -half && ry <= half;
}

function hitBubble(layer, x, y) {
    const m = bubbleMetrics(layer);
    return Math.abs(x - layer.x) <= m.w / 2 && Math.abs(y - layer.y) <= m.h / 2;
}

canvas.addEventListener('mousedown', (e) => {
    const { x, y } = canvasPos(e);
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        let hit = false;
        if (layer.type === 'sticker') hit = hitSticker(layer, x, y);
        else if (layer.type === 'shape') hit = hitShape(layer, x, y);
        else if (layer.type === 'bubble') hit = hitBubble(layer, x, y);
        else {
            ctx.font = `${layer.bold ? 'bold ' : ''}${layer.italic ? 'italic ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
            const w = ctx.measureText(layer.text).width, h = layer.fontSize;
            hit = x >= layer.x - w / 2 && x <= layer.x + w / 2 && y >= layer.y - h / 2 && y <= layer.y + h / 2;
        }
        if (hit) {
            selectedLayer = layer; isDragging = true;
            dragLayers = layer.group ? layers.filter(l => l.group === layer.group) : [layer];
            dragOffset.x = x - layer.x; dragOffset.y = y - layer.y;
            updateLayersList(); render(); return;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !selectedLayer) return;
    const { x, y } = canvasPos(e);
    let newX = x - dragOffset.x, newY = y - dragOffset.y;
    if (!isShiftPressed) {
        const tempLayer = { ...selectedLayer, x: newX, y: newY };
        const guides = findSnapGuides(tempLayer, layers);
        const bounds = getLayerBounds(tempLayer);
        if (guides.x.length > 0) { const closest = guides.x.reduce((a, b) => Math.abs(b - bounds.centerX) < Math.abs(a - bounds.centerX) ? b : a); newX += closest - bounds.centerX; }
        if (guides.y.length > 0) { const closest = guides.y.reduce((a, b) => Math.abs(b - bounds.centerY) < Math.abs(a - bounds.centerY) ? b : a); newY += closest - bounds.centerY; }
        activeGuides = guides;
    } else activeGuides = { x: [], y: [] };
    const dx = newX - selectedLayer.x, dy = newY - selectedLayer.y;
    dragLayers.forEach(l => { l.x += dx; l.y += dy; });
    render();
});

canvas.addEventListener('mouseup', () => { if (isDragging) { pushHistory(); activeGuides = { x: [], y: [] }; } isDragging = false; render(); });
canvas.addEventListener('mouseleave', () => { isDragging = false; activeGuides = { x: [], y: [] }; render(); });

canvas.addEventListener('wheel', (e) => {
    const { x, y } = canvasPos(e);
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        const hit = layer.type === 'sticker' ? hitSticker(layer, x, y) : layer.type === 'shape' ? hitShape(layer, x, y) : layer.type === 'bubble' ? hitBubble(layer, x, y) : false;
        if (hit) {
            e.preventDefault();
            if (layer.type === 'sticker' || layer.type === 'shape') { const delta = e.deltaY > 0 ? -10 : 10; layer.size = Math.max(20, Math.min(1000, layer.size + delta)); }
            else { const factor = e.deltaY > 0 ? 0.9 : 1.1; layer.size = Math.max(0.4, Math.min(3, layer.size * factor)); }
            selectedLayer = layer; render(); scheduleHistory(); return;
        }
    }
}, { passive: false });

canvas.addEventListener('dblclick', (e) => {
    const { x, y } = canvasPos(e);
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (layer.type === 'bubble' && hitBubble(layer, x, y)) {
            const newText = prompt('Текст реплики:', layer.text);
            if (newText !== null && newText.trim()) { layer.text = newText.trim(); pushHistory(); updateLayersList(); render(); }
            return;
        }
    }
});

on('fontSize', 'input', (e) => document.getElementById('fontSizeValue').textContent = e.target.value);
on('strokeWidth', 'input', (e) => document.getElementById('strokeWidthValue').textContent = e.target.value);
on('stickerSize', 'input', (e) => document.getElementById('stickerSizeValue').textContent = e.target.value);
on('gradientText', 'change', (e) => { const box = document.getElementById('gradientColors'); if (box) box.style.display = e.target.checked ? 'block' : 'none'; });

on('downloadPng', 'click', () => downloadImage('png'));
on('downloadJpg', 'click', () => downloadImage('jpeg'));
on('downloadWebp', 'click', () => downloadImage('webp'));
on('copyToClipboard', 'click', copyToClipboard);

function downloadImage(format) {
    const link = document.createElement('a');
    link.download = `club-anicoke-meme.${format}`;
    const quality = format === 'png' ? undefined : 0.95;
    link.href = canvas.toDataURL(`image/${format}`, quality);
    link.click();
    showToast(`✅ ${format.toUpperCase()} сохранён`);
}

async function copyToClipboard() {
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('✅ Скопировано в буфер! Вставляй через Ctrl+V');
    } catch (err) { console.error('Не удалось скопировать:', err); showToast('❌ Не удалось скопировать', 'error'); }
}

function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast'); if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideIn 0.3s ease-out reverse'; setTimeout(() => toast.remove(), 300); }, 3000);
}

let clearArmed = false, clearTimer = null;
on('clearAll', 'click', () => {
    const btn = document.getElementById('clearAll');
    if (!clearArmed) { clearArmed = true; btn.textContent = '⚠️ Точно очистить?'; clearTimeout(clearTimer); clearTimer = setTimeout(() => { clearArmed = false; btn.textContent = '🗑️ Очистить всё'; }, 3000); return; }
    clearTimeout(clearTimer); clearArmed = false; btn.textContent = '🗑️ Очистить всё';
    layers = []; sectionImages = {}; sectionFilters = {}; currentBackground = null; selectedLayer = null; dragLayers = []; checkedLayers.clear(); activeGuides = { x: [], y: [] };
    pushHistory(); syncUI(); render(); showToast('🗑️ Холст очищен');
});

initLayouts(); initStickers(); initBackgrounds(); initWatermark(); initFormat(); initGroupToolbar(); initLayerSearch(); syncWatermarkUI();

if (document.fonts && document.fonts.ready) {
    document.fonts.load('bold 40px AnicokeCustom').then(() => render()).catch(() => { });
    document.fonts.ready.then(() => render());
}

preloadAssets(() => {
    console.log('✅ Все фоны и стикеры загружены');
    const restored = loadProject();
    if (!restored) pushHistory();
    render();
});