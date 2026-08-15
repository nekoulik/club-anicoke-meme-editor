const characters = {
    smile: {
        name: 'Улыбка',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <path d="M75 85 Q80 80 85 85" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M115 85 Q120 80 125 85" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <ellipse cx="70" cy="100" rx="8" ry="5" fill="#ffb8d4" opacity="0.6"/>
            <ellipse cx="130" cy="100" rx="8" ry="5" fill="#ffb8d4" opacity="0.6"/>
            <path d="M85 105 Q100 120 115 105" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    wink: {
        name: 'Подмигивание',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <ellipse cx="80" cy="85" rx="8" ry="10" fill="#333"/>
            <ellipse cx="82" cy="82" rx="3" ry="3" fill="#fff"/>
            <path d="M115 85 Q120 80 125 85" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <ellipse cx="70" cy="100" rx="8" ry="5" fill="#ffb8d4" opacity="0.6"/>
            <ellipse cx="130" cy="100" rx="8" ry="5" fill="#ffb8d4" opacity="0.6"/>
            <path d="M85 105 Q100 115 115 105" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    happy: {
        name: 'Радость',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <path d="M72 85 Q80 80 88 85" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M112 85 Q120 80 128 85" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <ellipse cx="70" cy="100" rx="10" ry="6" fill="#ffb8d4" opacity="0.7"/>
            <ellipse cx="130" cy="100" rx="10" ry="6" fill="#ffb8d4" opacity="0.7"/>
            <path d="M80 105 Q100 125 120 105 Z" fill="#ff6b9d" stroke="#333" stroke-width="2"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    cool: {
        name: 'Крутой',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <rect x="65" y="75" width="30" height="20" rx="5" fill="#333"/>
            <rect x="105" y="75" width="30" height="20" rx="5" fill="#333"/>
            <line x1="95" y1="85" x2="105" y2="85" stroke="#333" stroke-width="3"/>
            <line x1="65" y1="85" x2="55" y2="82" stroke="#333" stroke-width="2"/>
            <line x1="135" y1="85" x2="145" y2="82" stroke="#333" stroke-width="2"/>
            <line x1="70" y1="80" x2="85" y2="80" stroke="#fff" stroke-width="2" opacity="0.5"/>
            <line x1="110" y1="80" x2="125" y2="80" stroke="#fff" stroke-width="2" opacity="0.5"/>
            <path d="M85 110 Q100 118 115 110" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    love: {
        name: 'Влюблённость',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <path d="M75 82 C75 78, 82 78, 82 82 C82 86, 78 90, 78 90 C78 90, 75 86, 75 82 Z" fill="#ff6b9d"/>
            <path d="M118 82 C118 78, 125 78, 125 82 C125 86, 121 90, 121 90 C121 90, 118 86, 118 82 Z" fill="#ff6b9d"/>
            <ellipse cx="70" cy="100" rx="10" ry="6" fill="#ffb8d4" opacity="0.7"/>
            <ellipse cx="130" cy="100" rx="10" ry="6" fill="#ffb8d4" opacity="0.7"/>
            <path d="M85 108 Q100 120 115 108" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    surprised: {
        name: 'Удивление',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <ellipse cx="80" cy="85" rx="10" ry="12" fill="#fff" stroke="#333" stroke-width="2"/>
            <ellipse cx="120" cy="85" rx="10" ry="12" fill="#fff" stroke="#333" stroke-width="2"/>
            <ellipse cx="80" cy="85" rx="5" ry="6" fill="#333"/>
            <ellipse cx="120" cy="85" rx="5" ry="6" fill="#333"/>
            <ellipse cx="82" cy="82" rx="2" ry="2" fill="#fff"/>
            <ellipse cx="122" cy="82" rx="2" ry="2" fill="#fff"/>
            <ellipse cx="100" cy="110" rx="10" ry="12" fill="#333"/>
            <ellipse cx="100" cy="108" rx="8" ry="6" fill="#ff6b9d"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    angry: {
        name: 'Злость',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <line x1="65" y1="72" x2="90" y2="78" stroke="#333" stroke-width="3" stroke-linecap="round"/>
            <line x1="135" y1="72" x2="110" y2="78" stroke="#333" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="80" cy="88" rx="8" ry="6" fill="#333"/>
            <ellipse cx="120" cy="88" rx="8" ry="6" fill="#333"/>
            <path d="M85 112 Q100 105 115 112" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    thinking: {
        name: 'Думает',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <ellipse cx="80" cy="82" rx="8" ry="10" fill="#fff" stroke="#333" stroke-width="2"/>
            <ellipse cx="120" cy="82" rx="8" ry="10" fill="#fff" stroke="#333" stroke-width="2"/>
            <ellipse cx="80" cy="78" rx="4" ry="5" fill="#333"/>
            <ellipse cx="120" cy="78" rx="4" ry="5" fill="#333"/>
            <path d="M90 110 Q100 108 110 110" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="130" cy="120" r="12" fill="#ffe0ec" stroke="#333" stroke-width="1.5"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    },
    sleep: {
        name: 'Сонный',
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="80" rx="60" ry="55" fill="#ff9ec4"/>
            <path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="#ff9ec4"/>
            <path d="M50 50 L35 20 L65 35 Z" fill="#ff9ec4"/>
            <path d="M150 50 L165 20 L135 35 Z" fill="#ff9ec4"/>
            <ellipse cx="100" cy="90" rx="50" ry="45" fill="#ffe0ec"/>
            <path d="M70 88 Q80 85 90 88" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M110 88 Q120 85 130 88" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            <text x="140" y="60" font-size="20" fill="#6bbaff" font-weight="bold">Z</text>
            <text x="155" y="45" font-size="15" fill="#6bbaff" font-weight="bold">z</text>
            <text x="165" y="35" font-size="10" fill="#6bbaff" font-weight="bold">z</text>
            <path d="M90 110 Q100 113 110 110" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>
            <rect x="70" y="130" width="60" height="50" rx="10" fill="#ff6b9d"/>
            <rect x="85" y="145" width="30" height="15" rx="5" fill="#fff" opacity="0.8"/>
        </svg>`
    }
};