// 세팅 팝업 표시
function showSetting() {
    document.getElementById('setting').classList.remove('hidden');
    document.getElementById('setting').classList.add('active');
}

// 세팅 팝업 숨기기
function hideSetting() {
    document.getElementById('setting').classList.remove('active');
    setTimeout(() => {
        document.getElementById('setting').classList.add('hidden');
    }, 300);
}

// 슬라이더 값 업데이트
document.getElementById('dasSlider')?.addEventListener('input', (e) => {
    document.getElementById('dasValue').textContent = e.target.value + 'ms';
});

document.getElementById('arrSlider')?.addEventListener('input', (e) => {
    document.getElementById('arrValue').textContent = e.target.value + 'ms';
});

document.getElementById('sdfSlider')?.addEventListener('input', (e) => {
    document.getElementById('sdfValue').textContent = e.target.value + 'x';
});

document.getElementById('bgmSlider')?.addEventListener('input', (e) => {
    document.getElementById('bgmValue').textContent = e.target.value + '%';
});

document.getElementById('sfxSlider')?.addEventListener('input', (e) => {
    document.getElementById('sfxValue').textContent = e.target.value + '%';
});

// 설정 초기화
function resetSettings() {
    if (confirm('초기화?')) {
        document.getElementById('dasSlider').value = 133;
        document.getElementById('dasValue').textContent = '133ms';
        document.getElementById('arrSlider').value = 10;
        document.getElementById('arrValue').textContent = '10ms';
        document.getElementById('sdfSlider').value = 20;
        document.getElementById('sdfValue').textContent = '20x';
        document.getElementById('bgmSlider').value = 70;
        document.getElementById('bgmValue').textContent = '70%';
        document.getElementById('sfxSlider').value = 80;
        document.getElementById('sfxValue').textContent = '80%';
    }
}

// 설정 저장
function saveSettings() {
    // 저장 완료
    hideSetting();
}