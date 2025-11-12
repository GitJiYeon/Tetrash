let bgm; 
const tetrashInDreamBGM = './audio/tetrash_in_dream.mp3';
const blockDanceBGM = './audio/block_dance.mp3';
const placeSound = './audio/placeSound.mp3';
const tetrashSound = './audio/tetrashSound.mp3';
const tSpinSound = './audio/tSpinSound.mp3';
const countDownSound = './audio/countDownSound.mp3';
const lineClearSound = './audio/lineClearSound.mp3';


function playBGM(path = 'sounds/game_bgm.mp3', volume = 1) {
  if (bgm) {
    bgm.pause();
  }
  bgm = new Audio(path);
  bgm.loop = true;
  bgm.volume = volume; 
  bgm.play()
    .then(() => console.log('시작'))
    .catch(err => console.log('사용자 상호작용 필요:', err));
}

function stopBGM() {
  if (bgm) {
    bgm.pause();
    bgm.currentTime = 0; // 처음으로 되돌림
    console.log('정지');
  }
}

function playSFX(soundPath, volume = 1) {
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch(err => {
        console.warn("재생 실패:", err);
    });
}