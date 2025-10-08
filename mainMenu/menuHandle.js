// 메뉴 관리
let currentModeIndex = 1; // 중앙 카드(Marathon)
const modes = ['arcade', 'marathon', 'ultra', 'zen', 'battle'];

const mainMenu = document.getElementById('mainMenu');
const gamePlay = document.getElementById('gamePlay');
const cards = document.querySelectorAll('.mode-card');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');

// Display 전환 함수
function showMainMenu() {
    mainMenu.classList.remove('hidden');
    gamePlay.classList.remove('active');
}

function showGamePlay() {
    // 메인 메뉴 슬라이드 아웃
    mainMenu.classList.add('hidden');

    // 게임 화면 슬라이드 인
    gamePlay.classList.remove('hidden'); // hidden이 있을 경우 제거
    gamePlay.classList.add('active');

    gamePlay.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'opacity') {
            showCountdownAndStart(3); // 3초 카운트
            gamePlay.removeEventListener('transitionend', handler);
        }
    });
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

// 카드 클릭 이벤트
cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        console.log(`${mode} 모드 선택됨`);
        console.log(window.startGame); // 함수가 보이면 OK
        // 게임 시작 함수 호출
        showGamePlay();
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
