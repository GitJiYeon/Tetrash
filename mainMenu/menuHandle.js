

let selectMode = "";

// 메뉴 관리
let currentModeIndex = 1; 
const modes = ['arcadeEasy', 'arcadeNomal', 'arcadeHard', 'skillCheck', '-'];

const mainMenu = document.getElementById('mainMenu');
const gamePlay = document.getElementById('gamePlay');
const cards = document.querySelectorAll('.mode-card');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');
const gameOverMenu = document.getElementById('gameOver');
const bossSpace = document.getElementById('bossSpace');
const gameSpace = document.getElementById('gameSpace');
const skillView = document.getElementById('skillView');

const final_time = document.getElementById(`final_time`);
  const final_score = document.getElementById('final_score');
  const final_pps = document.getElementById('final_pps');
  const final_tSpin = document.getElementById('final_tSpin');
  const final_tetrash = document.getElementById('final_tetrash');
  const final_clearedLines = document.getElementById('final_clearedLines');
  const final_placedPieces = document.getElementById('final_placedPieces');

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', () => {
  const initialLoading = document.getElementById('initialLoading');

  // 3초 후
  setTimeout(() => {
    if (initialLoading) {
      initialLoading.style.display = "none";  // 로딩 화면 숨기기
    }

    // 메인 메뉴만 표시
    mainMenu.classList.add('active');
    mainMenu.classList.remove('hidden');
    
    // 나머지 화면 숨김
    gamePlay.classList.add('hidden');
    gamePlay.classList.remove('active');
    
    gameOverMenu.classList.add('hidden');
    gameOverMenu.classList.remove('active');
  }, 3000);
    
});

function initGameLayout(){
  const gameSpace = document.querySelector('.gameSpace');
    const bossSpace = document.querySelector('.bossSpace');
    const gameInfo = document.querySelector('.gameInfo');
    
    if (gameSpace) {
        gameSpace.style.transform = 'scale(80%)';
        gameSpace.style.marginRight = '20%';
        gameSpace.style.marginLeft = '0px';
    }
    
    if (bossSpace) {
        bossSpace.style.transform = 'translateX(-120%)';
        bossSpace.style.opacity = '0';
        bossSpace.style.display = 'flex';  // defeatBoss에서 none으로 변경했을 수 있음
    }
    
    if (gameInfo) {
        gameInfo.style.transform = 'translateX(0)';
    }
}
// 메인 메뉴로 전환
function showMainMenu() {
    initGameLayout();
    
    // 모든 화면 숨기기
    gamePlay.classList.remove('active');
    gamePlay.classList.add('hidden');
    gameOverMenu.classList.remove('active');
    gameOverMenu.classList.add('hidden');

    // 메인 메뉴 보이기
    mainMenu.classList.remove('hidden');
    mainMenu.classList.add('active');
    
    selectMode = "";
    MODE_skillCheck = false;
    
    initGame();
    stopBGM();
}

// gameOver화면
function showGameOver(isClear) {
  //스코어 기록
  const totalSeconds = Math.floor(gameTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  final_time.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  final_score.textContent = score;
  final_pps.textContent = currentPps;
  final_tSpin.textContent = tSpinCount;
  final_tetrash.textContent = totalTetrisClear;
  final_clearedLines.textContent = totalLinesCleared;
  final_placedPieces.textContent = placedPiece;
  if(isClear){
    document.getElementById('score-image').src = "images/stageBackground/clearEnding.gif";
    document.getElementById('scoreMessage').textContent = "WOW CLEAR!";
  }else{
    document.getElementById('scoreMessage').textContent = "TRY AGAIN,,,";
    document.getElementById('score-image').src = "images/stageBackground/gameOver.png";
  }
  
  
  // 모든 화면 숨기기
  //gamePlay.classList.remove('active');
  //gamePlay.classList.add('hidden');
  mainMenu.classList.remove('active');
  mainMenu.classList.add('hidden');


  // 게임오버 화면 보이기
  gameOverMenu.classList.remove('hidden');
  gameOverMenu.classList.add('active');
}

// gameOver화면
function showSkillView() {
  //스코어 기록
  const totalSeconds = Math.floor(gameTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  final_time.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  final_score.textContent = score;
  final_pps.textContent = currentPps;
  final_tSpin.textContent = tSpinCount;
  final_tetrash.textContent = totalTetrisClear;
  final_clearedLines.textContent = totalLinesCleared;
  final_placedPieces.textContent = placedPiece;
  document.getElementById('scoreMessage').textContent = analyzeSkill();
  
  
  // 모든 화면 숨기기
  //gamePlay.classList.remove('active');
  //gamePlay.classList.add('hidden');
  mainMenu.classList.remove('active');
  mainMenu.classList.add('hidden');


  // 게임오버 화면 보이기
  gameOverMenu.classList.remove('hidden');
  gameOverMenu.classList.add('active');
}

function analyzeSkill(){
  let totalScore = 0;
  const totalSeconds = Math.floor(gameTime / 1000);
  if(score >= 6200){ totalScore += 3}
  else if(score >= 5200){ totalScore += 2}
  else if(score >= 4100){ totalScore++; }
  else{ totalScore-- }
  
  if(currentPps >= 1.8){ totalScore += 5}
  else if(currentPps >= 1.5){ totalScore += 3}
  else if(currentPps >= 1.1){ totalScore += 2}
  else if(currentPps >= 0.8){ totalScore++; }
  else{ totalScore-- }

  if(totalSeconds <= 40){ totalScore += 5}
  else if(totalSeconds <= 70){ totalScore += 3}
  else if(totalSeconds <= 100){ totalScore += 2}
  else if(totalSeconds <= 130){ totalScore++; }
  else if(totalSeconds > 160){ totalScore-- }
   
  if(tSpinCount >= 3){ totalScore += 2}
  else if(tSpinCount >= 1){ totalScore += 2}

  console.log("스코어 : "+totalScore);

  
  document.getElementById("finish-image").src = "images/stageBackground/gameFinish.png";
  if(totalScore <= 5){ 
    return 'EASY모드 추천';
  }else if(totalScore <= 9){
    return 'NOMAL모드 추천';
  }else{  
    return 'HARD모드 추천';
  }
  
  
}

function hideGameOver(){
  gameOverMenu.classList.remove('active');
  gameOverMenu.classList.add('hidden');
}

function showGamePlay(mode) {
    if(mode == '-') return;

    // 먼저 모든 모드 초기화
    MODE_skillCheck = false;
    
    // 난이도 설정
    if(mode == 'arcadeEasy') {
        difficulty = 0;
    } else if(mode == 'arcadeNomal') {
        difficulty = 1;
    } else if(mode == 'arcadeHard') {
        alert("업데이트 예정입니다.");
        return;
    } else if(mode == 'skillCheck') {
        difficulty = 100; // 스킬 체크용
        currentStage = 100;
        MODE_skillCheck = true;
    }

    selectMode = mode;
    
    // 난이도 설정 후 적용
    difficultySetting();
    showDifficulty();
    
    // 모든 화면 숨기기
    mainMenu.classList.remove('active');
    mainMenu.classList.add('hidden');
    gameOverMenu.classList.remove('active');
    gameOverMenu.classList.add('hidden');
    
    if(skillView) {
        skillView.classList.remove('active');
        skillView.classList.add('hidden');
    }

    // 게임 화면 보이기
    gamePlay.classList.remove('hidden');
    gamePlay.classList.add('active');

    playSFX(countDownSound);
    gamePlay.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'opacity') {
            showCountdownAndStart(3, mode);
        }
        gamePlay.removeEventListener('transitionend', handler);
    });
}


// 로그인 화면으로 전환
function showLoginMenu() {
  const popup = document.getElementById('loginPopup');
  popup.classList.remove('hidden');
  popup.classList.add('active');
}

function hideLoginMenu() {
  const popup = document.getElementById('loginPopup');
  popup.classList.remove('active');
  popup.classList.add('hidden');
}

function showRetryPopup() {
  const popup = document.getElementById('retryPopup');
  popup.classList.remove('hidden');
  popup.classList.add('active');
}

function hideRetryPopup() {
  const popup = document.getElementById('retryPopup');
  popup.classList.remove('active');
  popup.classList.add('hidden');
}


function updateCards() {
    cards.forEach((card, index) => {
        card.classList.remove('active', 'left2', 'left', 'right', 'right2', 'hidden');
        
        const diff = (index - currentModeIndex + modes.length) % modes.length;
        
        switch (diff) {
            case 0:
                card.classList.add('active'); // 중앙
                break;
            case 1:
                card.classList.add('right');  // 오른쪽 1
                break;
            case 2:
                card.classList.add('right2'); // 오른쪽 2
                break;
            case modes.length - 1:
                card.classList.add('left');   // 왼쪽 1
                break;
            case modes.length - 2:
                card.classList.add('left2');  // 왼쪽 2
                break;
            default:
                card.classList.add('hidden'); // 나머지 숨김
        }
    });
}


// 왼쪽 화살표
arrowLeft.addEventListener('click', () => {
    currentModeIndex = (currentModeIndex - 1 + modes.length) % modes.length;
    updateCards();
});

// 오른쪽 화살표
arrowRight.addEventListener('click', () => {
    currentModeIndex = (currentModeIndex + 1) % modes.length;
    updateCards();
});

// 키보드 화살표 지원
document.addEventListener('keydown', (e) => {
    if (mainMenu.classList.contains('hidden')) return;
    
    if (e.key === 'ArrowLeft') {
        arrowLeft.click();
    } else if (e.key === 'ArrowRight') {
        arrowRight.click();
    } else if (e.key === 'Enter') {
        cards[currentModeIndex].click();
    }
});

// 카드 클릭
cards.forEach((card) => {
    card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        // 게임 시작 함수 호출
        console.log(mode);
        showGamePlay(mode);
    });
});

// 초기화
updateCards();

// 문서 전체에서 더블클릭 선택 방지
document.addEventListener('mousedown', function(e) {
    if (e.detail > 1) { // 더블클릭 이상
      e.preventDefault();
    }
  });
  

  const spinText = document.querySelector('.spin-text');

// 스킬 이미지를 보여주는 함수
function showSkillImage(skillType) {
  let imagePath = '';

  switch (skillType) {
    case 'tSpin':
      imagePath = './images/skillImages/tSpin.png';
      break;
    case 'tetrash':
      imagePath = './images/skillImages/tetrash.png';
      break;
    case 'perfect':
      imagePath = './images/skillImages/perfect.png';
      break;
    default:
      imagePath = ''; // 기본값 (없을 때)
  }

  if (imagePath) {
    spinText.style.backgroundImage = `url("${imagePath}")`;
    spinText.classList.add('show');

    // 1.5초 후 자동으로 사라지게
    setTimeout(() => {
      spinText.classList.remove('show');
    }, 1500);
  }
}

const menuButton = document.getElementById('menuButton');

menuButton.addEventListener('click', () => {
    gameRunning = false;
    selectMode = "";
    endBossStage();
    showMainMenu(); // 버튼 클릭 시 메뉴 화면으로 전환
});

function startBossStage() {
  // 화면 흔들림
  gameSpace.classList.add('shakeBoss');

  setTimeout(() => {
    // 테트리스 오른쪽으로 이동
    gameSpace.style.marginRight = '4%';
    // 보스 등장
    bossSpace.style.transform = 'translateX(0)';
    bossSpace.style.opacity = '1';
    gameSpace.classList.remove('shakeBoss');
    
  }, 1000);
}
function endBossStage() {
  // 보스 사라짐
  bossSpace.style.transform = 'translateX(-120%)';
  bossSpace.style.opacity = '0';

  initGameLayout();
}


function impactEffect(container){
  container.classList.add('impact1');

  setTimeout(() => {
    container.classList.remove('impact1');
  }, 150); 
}

function shaking(container){
  container.classList.add('shake');
  setTimeout(() => {
    container.classList.remove('shake');
  }, 400); // 흔들림0.4초
}

function shaking2(container){//보스
  container.classList.add('shake2');
  if(currentBossHP > 0){
    document.getElementById("boss-img").src = "images/stageBackground/xMinoHurt.png";
  }else{
    document.getElementById("boss-img").src = "images/stageBackground/xMinoDie.png";
  }

  setTimeout(() => {
    container.classList.remove('shake2');
    if(currentBossHP > 0){
      document.getElementById("boss-img").src = "images/stageBackground/xMino.gif";
    }else{
      document.getElementById("boss-img").src = "images/stageBackground/xMinoDie.png";
    }
  }, 300); // 흔들림0.4초
}

function boing(container){
  container.classList.add('boing');

  setTimeout(() => {
    container.classList.remove('boing');
  }, 200); // 한번 튀는 효과
}



function defeatBoss() {
  // 흔들림 시작
  const bossImg = document.getElementById("boss-img");
  bossImg.src = "images/stageBackground/xMinoDie.png";
  
  bossSpace.classList.add('shakingBoss');

  // 1.5초 동안 흔들리다가
  setTimeout(() => {
    bossSpace.classList.remove('shakingBoss');

    // 터지는 효과로 전환
    bossSpace.classList.add('bossExplode');
    
    // 사운드나 효과 넣고 싶으면 여기에
    // playExplosionSound();

    // 0.6초 후 완전히 사라지기
    setTimeout(() => {
      bossSpace.style.display = 'none';
      bossSpace.classList.remove('bossExplode');
      gameOver(true);
    }, 600);
  }, 2000);
}
