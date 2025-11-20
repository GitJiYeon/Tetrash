// 키 설정 저장 객체
const keySettings = {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    softDrop: 'ArrowDown',
    hardDrop: 'Space',
    rotateCW: 'ArrowUp',
    rotateCCW: 'KeyZ',
    rotate180: 'KeyA',
    hold: 'ShiftLeft'
};

// 게임 설정 저장 객체
const gameSettings = {
    das: 160,
    arr: 30,
    sdf: 30,
    bgmVolume: 70,
    sfxVolume: 80,
    sdfMax: false,
};

let isListeningForKey = false;
let currentListeningButton = null;

// 로컬 스토리지에서 설정 불러오기
function loadSettingsFromStorage() {
    try {
        const savedSettings = localStorage.getItem('tetrisSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            
            // 키 설정 불러오기
            if (parsed.keys) {
                Object.assign(keySettings, parsed.keys);
            }
            
            // 게임 설정 불러오기
            if (parsed.game) {
                Object.assign(gameSettings, parsed.game);
            }
            
            console.log('설정 불러오기 완료:', parsed);
            
            // 게임 설정 즉시 적용
            applyGameSettings();
            
            // 키 설정 새로고침
            if (typeof refreshKeySettings === 'function') {
                refreshKeySettings();
            }
        }
    } catch (e) {
        console.error('설정 불러오기 실패:', e);
    }
}

// 로컬 스토리지에 설정 저장
function saveSettingsToStorage() {
    try {
        const allSettings = {
            keys: keySettings,
            game: gameSettings
        };
        localStorage.setItem('tetrisSettings', JSON.stringify(allSettings));
        console.log('설정 저장 완료:', allSettings);
    } catch (e) {
        console.error('설정 저장 실패:', e);
    }
}

// 세팅 팝업 표시
function showSetting() {
    document.getElementById('setting').classList.remove('hidden');
    document.getElementById('setting').classList.add('active');
    loadSettings();
}

// 세팅 팝업 숨기기
function hideSetting() {
    document.getElementById('setting').classList.remove('active');
    setTimeout(() => {
        document.getElementById('setting').classList.add('hidden');
    }, 300);
}

// 키 이름을 표시용으로 변환
function getKeyDisplayName(keyCode) {
    const keyNames = {
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'Space': 'Space',
        'ShiftLeft': 'Shift',
        'ShiftRight': 'Shift',
        'ControlLeft': 'Ctrl',
        'ControlRight': 'Ctrl'
    };
    
    if (keyCode.startsWith('Key') && keyCode.length === 4) {
        return keyCode.slice(-1);
    }
    
    if (keyCode.startsWith('Digit')) {
        return keyCode.slice(-1);
    }
    
    return keyNames[keyCode] || keyCode;
}

// 키 버튼 클릭 이벤트 설정
function setupKeyButtons() {
    const keyButtons = document.querySelectorAll('.keyButton');
    
    keyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isListeningForKey && currentListeningButton === this) {
                stopListeningForKey();
                return;
            }
            
            if (isListeningForKey) {
                stopListeningForKey();
            }
            
            startListeningForKey(this);
        });
    });
}

// 키 입력 대기 시작
function startListeningForKey(button) {
    isListeningForKey = true;
    currentListeningButton = button;
    button.classList.add('listening');
    button.textContent = 'Press Key...';
}

// 키 입력 대기 중지
function stopListeningForKey() {
    if (currentListeningButton) {
        currentListeningButton.classList.remove('listening');
        const action = currentListeningButton.dataset.action;
        currentListeningButton.textContent = getKeyDisplayName(keySettings[action]);
    }
    isListeningForKey = false;
    currentListeningButton = null;
}

// 키보드 입력 감지
document.addEventListener('keydown', function(e) {
    if (!isListeningForKey) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (e.key === 'Escape') {
        stopListeningForKey();
        return;
    }
    
    const action = currentListeningButton.dataset.action;
    const newKey = e.code;
    
    const isDuplicate = Object.entries(keySettings).some(([key, value]) => {
        return key !== action && value === newKey;
    });
    
    if (isDuplicate) {
        alert('이미 다른 동작에 할당된 키입니다!');
        stopListeningForKey();
        return;
    }
    
    keySettings[action] = newKey;
    currentListeningButton.textContent = getKeyDisplayName(newKey);
    
    stopListeningForKey();
}, true);

// 슬라이더 값 업데이트
document.getElementById('dasSlider')?.addEventListener('input', (e) => {
    gameSettings.das = parseInt(e.target.value);
    document.getElementById('dasValue').textContent = e.target.value + 'ms';
});

document.getElementById('arrSlider')?.addEventListener('input', (e) => {
    gameSettings.arr = parseInt(e.target.value);
    document.getElementById('arrValue').textContent = e.target.value + 'ms';
});

document.getElementById('sdfSlider')?.addEventListener('input', (e) => {
    gameSettings.sdf = parseInt(e.target.value);
    document.getElementById('sdfValue').textContent = e.target.value + 'x';
});

document.getElementById('bgmSlider')?.addEventListener('input', (e) => {
    gameSettings.bgmVolume = parseInt(e.target.value);
    document.getElementById('bgmValue').textContent = e.target.value + '%';
});

document.getElementById('sfxSlider')?.addEventListener('input', (e) => {
    gameSettings.sfxVolume = parseInt(e.target.value);
    document.getElementById('sfxValue').textContent = e.target.value + '%';
});

// 토글 스위치 이벤트
document.getElementById('ghostToggle')?.addEventListener('change', (e) => {
    gameSettings.showGhost = e.target.checked;
});

document.getElementById('sdfMaxToggle')?.addEventListener('change', (e) => {
    gameSettings.sdfMax = e.target.checked;
});

// 설정 불러오기 (UI 업데이트용)
function loadSettings() {
    // 키 설정 표시
    document.querySelectorAll('.keyButton').forEach(button => {
        const action = button.dataset.action;
        if (keySettings[action]) {
            button.textContent = getKeyDisplayName(keySettings[action]);
        }
    });
    
    // 슬라이더 값 설정
    document.getElementById('dasSlider').value = gameSettings.das;
    document.getElementById('dasValue').textContent = gameSettings.das + 'ms';
    
    document.getElementById('arrSlider').value = gameSettings.arr;
    document.getElementById('arrValue').textContent = gameSettings.arr + 'ms';
    
    document.getElementById('sdfSlider').value = gameSettings.sdf;
    document.getElementById('sdfValue').textContent = gameSettings.sdf + 'x';
    
    document.getElementById('bgmSlider').value = gameSettings.bgmVolume;
    document.getElementById('bgmValue').textContent = gameSettings.bgmVolume + '%';
    
    document.getElementById('sfxSlider').value = gameSettings.sfxVolume;
    document.getElementById('sfxValue').textContent = gameSettings.sfxVolume + '%';
    
    // 토글 스위치 설정
    document.getElementById('ghostToggle').checked = gameSettings.showGhost;
    document.getElementById('sdfMaxToggle').checked = gameSettings.sdfMax;
}

// 설정 초기화
function resetSettings() {
    if (confirm('초기화??')) {
        // 키 설정 초기화
        keySettings.moveLeft = 'ArrowLeft';
        keySettings.moveRight = 'ArrowRight';
        keySettings.softDrop = 'ArrowDown';
        keySettings.hardDrop = 'Space';
        keySettings.rotateCW = 'ArrowUp';
        keySettings.rotateCCW = 'KeyZ';
        keySettings.rotate180 = 'KeyA';
        keySettings.hold = 'ShiftLeft';
        
        // 게임 설정 초기화
        gameSettings.das = 160;
        gameSettings.arr = 30;
        gameSettings.sdf = 1;
        gameSettings.bgmVolume = 70;
        gameSettings.sfxVolume = 80;
        gameSettings.showGhost = true;
        gameSettings.sdfMax = false;
        
        // 로컬 스토리지에 저장
        saveSettingsToStorage();
        
        // UI 업데이트
        loadSettings();
        
        // 게임 설정 적용
        applyGameSettings();
        
        // 키 설정 새로고침
        if (typeof refreshKeySettings === 'function') {
            refreshKeySettings();
        }
    }
}

// 설정 저장
function saveSettings() {
    // 로컬 스토리지에 저장
    saveSettingsToStorage();
    
    // 게임 설정을 즉시 적용
    applyGameSettings();
    
    // 키 설정 새로고침
    if (typeof refreshKeySettings === 'function') {
        refreshKeySettings();
    }
    
    hideSetting();
}

// 게임 설정 적용
function applyGameSettings() {
    if (typeof DAS !== 'undefined') DAS = gameSettings.das;
    if (typeof ARR !== 'undefined') ARR = gameSettings.arr;
    if (typeof SDF !== 'undefined') SDF = gameSettings.sdf;

    softDropMax = gameSettings.sdfMax;
    document.getElementById('sdfMaxToggle').checked = gameSettings.sdfMax;

    console.log(`DAS: ${gameSettings.das}ms`);
    console.log(`ARR: ${gameSettings.arr}ms`);
    console.log(`SDF: ${gameSettings.sdf}x`);
    console.log(`BGM Volume: ${gameSettings.bgmVolume}%`);
    console.log(`SFX Volume: ${gameSettings.sfxVolume}%`);
}



// 페이지 로드 시 설정 불러오기 및 적용
window.addEventListener('DOMContentLoaded', () => {
    setupKeyButtons();
    loadSettingsFromStorage(); // 로컬 스토리지에서 설정 불러오기 및 즉시 적용
});