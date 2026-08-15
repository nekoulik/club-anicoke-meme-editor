// === ШАБЛОНЫ ПОСТОВ ===
// Использует переменные и функции из app.js (layers, pushHistory, syncUI, render, on, randomOf)

function charKeyByName(name) {
    return Object.keys(characters).find(k => characters[k].name === name) || Object.keys(characters)[0];
}

function makeText(opts) {
    return Object.assign({
        id: Date.now() + Math.floor(Math.random() * 1e6),
        type: 'text',
        x: canvas.width / 2,
        y: canvas.height / 2,
        fontSize: 40,
        fontFamily: 'Arial',
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 4,
        bold: true,
        italic: false,
        shadow: true,
        opacity: 1
    }, opts);
}

function makeSticker(name, x, y, size, extra) {
    return Object.assign({
        id: Date.now() + Math.floor(Math.random() * 1e6),
        type: 'sticker',
        key: charKeyByName(name),
        name: name,
        x: x,
        y: y,
        size: size,
        rotation: 0,
        flip: false,
        opacity: 1
    }, extra || {});
}

function makeBubble(text, x, y, extra) {
    return Object.assign({
        id: Date.now() + Math.floor(Math.random() * 1e6),
        type: 'bubble',
        text: text,
        x: x,
        y: y,
        width: 220,
        fontSize: 24,
        size: 1,
        tail: 'down',
        bubbleColor: '#ffffff',
        textColor: '#000000',
        opacity: 1
    }, extra || {});
}

function baseReset(keepBackground) {
    layers = [];
    sectionImages = {};
    sectionFilters = {};
    selectedLayer = null;
    if (!keepBackground || !currentBackground) {
        currentBackground = randomOf(Object.keys(backgrounds));
    }
}

const postTemplates = {
    // 📢 Анонс мероприятия
    announce: function () {
        baseReset(true);
        currentLayout = 1;
        const W = canvas.width, H = canvas.height;
        layers.push(
            makeText({
                text: 'АНОНС!',
                y: H * 0.11,
                fontSize: Math.min(72, W * 0.09),
                fontFamily: 'AnicokeCustom, Arial',
                color: '#ffd93d',
                strokeWidth: 6
            }),
            makeText({
                text: '— Название мероприятия —',
                y: H * 0.22,
                fontSize: Math.min(40, W * 0.05)
            }),
            makeText({
                text: '📅 Дата и время\n📍 Место или ссылка',
                y: H * 0.85,
                fontSize: Math.min(30, W * 0.038),
                strokeWidth: 3
            }),
            makeSticker('Радость', W * 0.78, H * 0.62, W * 0.22),
            makeBubble('Всем привет!', W * 0.6, H * 0.45, { tail: 'down-right' })
        );
    },

    // 📊 Опрос на два варианта
    poll: function () {
        baseReset(true);
        currentLayout = 2;
        const W = canvas.width, H = canvas.height;
        layers.push(
            makeText({
                text: 'ОПРОС',
                y: H * 0.09,
                fontSize: Math.min(64, W * 0.08),
                fontFamily: 'AnicokeCustom, Arial',
                color: '#ffd93d',
                strokeWidth: 6
            }),
            makeText({
                text: 'Что лучше?',
                y: H * 0.19,
                fontSize: Math.min(34, W * 0.045)
            }),
            makeText({
                text: 'Вариант А',
                x: W * 0.25,
                y: H * 0.93,
                fontSize: Math.min(30, W * 0.04)
            }),
            makeText({
                text: 'Вариант Б',
                x: W * 0.75,
                y: H * 0.93,
                fontSize: Math.min(30, W * 0.04)
            }),
            makeSticker('Думает', W * 0.5, H * 0.34, W * 0.16)
        );
    }
};

function applyTemplate(key) {
    if (!postTemplates[key]) return;
    postTemplates[key]();
    pushHistory();
    syncUI();
    render();
}

on('tplAnnounce', 'click', () => applyTemplate('announce'));
on('tplPoll', 'click', () => applyTemplate('poll'));