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

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    // 메인 메뉴만 표시
    mainMenu.classList.add('active');
    mainMenu.classList.remove('hidden');
    
    // 나머지 화면 숨김
    gamePlay.classList.add('hidden');
    gamePlay.classList.remove('active');
    
    gameOverMenu.classList.add('hidden');
    gameOverMenu.classList.remove('active');
});

// 메인 메뉴로 전환
function showMainMenu() {
    console.log('메인 메뉴로 전환');
    
    // 모든 화면 숨기기
    gamePlay.classList.remove('active');
    gamePlay.classList.add('hidden');
    gameOverMenu.classList.remove('active');
    gameOverMenu.classList.add('hidden');

    // 메인 메뉴 보이기
    mainMenu.classList.remove('hidden');
    mainMenu.classList.add('active');
}

// gameOver화면
function showGameOver(isClear) {
  //스코어 기록
  const totalSeconds = Math.floor(gameTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const final_time = document.getElementById(`final_time`);
  const final_score = document.getElementById('final_score');
  const final_pps = document.getElementById('final_pps');
  const final_tSpin = document.getElementById('final_tSpin');
  const final_tetrash = document.getElementById('final_tetrash');

  final_time.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  final_score.textContent = score;
  final_pps.textContent = currentPps;
  final_tSpin.textContent = tSpinCount;
  final_tetrash.textContent = totalTetrisClear;
  if(isClear){
    document.getElementById('scoreMessage').textContent = "WOW CLEAR!";
  }else{
    document.getElementById('scoreMessage').textContent = "TRY AGAIN,,,";
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


function showGamePlay(mode) {
  //modes = ['arcadeEasy', 'arcadeNomal', 'arcadeHard', 'skillCheck', '-'];
    if(mode == '-') return;
   // 모든 화면 숨기기
    mainMenu.classList.remove('active');
    mainMenu.classList.add('hidden');
    gameOverMenu.classList.remove('active');
    gameOverMenu.classList.add('hidden');

    // 게임 화면 보이기
    gamePlay.classList.remove('hidden');
    gamePlay.classList.add('active');

    gamePlay.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'opacity') {
            showCountdownAndStart(3, mode); // 3초 카운트
            gamePlay.removeEventListener('transitionend', handler);
        }
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
cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        console.log(`${mode} 모드 선택됨`);
        console.log(window.startGame);
        // 게임 시작 함수 호출
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
      imagePath = '/images/skillImages/tSpin.png';
      break;
    case 'tetrash':
      imagePath = '/images/skillImages/tetrash.png';
      break;
    case 'perfect':
      imagePath = '/images/skillImages/perfect.png';
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

function shaking2(container){
  container.classList.add('shake2');

  setTimeout(() => {
    container.classList.remove('shake2');
  }, 300); // 흔들림0.4초
}





function defeatBoss() {
  // 흔들림 시작
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
  }, 1500);
}
