///////////////////////////////[게임 기본 설정]/////////////////////////////////
const COLS = 10;
const ROWS = 23;
const BLOCK_SIZE = 30;

let DROP_DELAY = 1000; // 블록 낙하 속도(ms)
let PLACE_DELAY = 1000; // 블록이 바닥에 닿은 후 고정까지 딜레이(ms)
let DAS = 160; // 키를 누른 후 반복 시작까지 딜레이(ms)
let ARR = 30;  // 반복 간격(ms)
let SDF = 1;
let softDropMax = true;
let RED_ROW = 2; // 기본 데드라인 (중력 아래)
let gravityDirection = 1; // 1 = 아래, -1 = 위 (중력 방향)

let bossHP = 100; // 보스 최대 HP 100
let currentBossHP = bossHP;
///////////////////////////////[Canvas & 그리드 설정]/////////////////////////////////
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

///////////////////////////////[텍스처 로드]/////////////////////////////////
const blockTexture = new Image();
blockTexture.src = './images/blockTexture2.png';

///////////////////////////////[게임 상태 변수]/////////////////////////////////
let gameRunning = false; // 게임 실행 상태
let isAnimating = false; // 애니메이션 중 여부
let isGameOver = false; // 게임 오버 상태
let gameTime = 0;       // 누적된 게임 시간
let startTime = 0;      // 시작 시각
let dropTimer = 0;      // 블록 낙하 타이머
let placeTimer = 0;     // 바닥 닿은 시점 기록
let lastFrameTime = 0;  // 마지막 프레임 시각
let gamePlayTime = 0;   // 실제 플레이 누적 시간
let lastPPS = 0;        // 마지막 PPS 값 저장

///////////////////////////////[블록 관련 변수]/////////////////////////////////
let currentPiece = null; 
let currentPieceType = '';
let currentX = 0; 
let currentY = 0; 
let isOnGround = false; // 블록이 바닥에 닿았는지
let rotationState = 0;  // 회전 상태

// 고스트 블록
let currentGhostPiece = null;
let currentGhostX = 0;
let currentGhostY = 0;

///////////////////////////////[가방 시스템]/////////////////////////////////
let currentBag = []; // 현재 가방
let nextBag = [];    // 다음 가방

///////////////////////////////[스코어/통계 관련 변수]/////////////////////////////////
let currentStage = 1;
let score = 0;
let totalLinesCleared = 0;
let totalTetrisClear = 0;
let placedPiece = 0;
let tSpinCount = 0;
let currentPps = 0;
/////////////////////////////[사운드]/////////////////////////////
let bgmVolume = 0.5;
let sfxVolume = 0.7;
///////////////////////////////[기타 설정]/////////////////////////////////
let basicBlocks = ['T', 'O', 'J', 'L', 'S', 'Z', 'I'];
const bigTypes = ['bigT', 'bigO', 'bigZ', 'bigS', 'bigJ', 'bigL', 'bigI'];
const tetrashTypes = ['Q', 'X', 'U', 'P', 'V', 'dot'];
//기본 블럭

// 게임 시작 시 설정 적용
function initGameSettings() {
    DAS = gameSettings.das;
    ARR = gameSettings.arr;
    SDF = gameSettings.sdf;
    
    bgmVolume = gameSettings.bgmVolume / 100;
    sfxVolume = gameSettings.sfxVolume / 100;
}

function initGame(){
  //CSS 초기화
  const gameSpace = document.querySelector('.gameSpace');
  const bossSpace = document.querySelector('.bossSpace');
  const gameInfo = document.querySelector('.gameInfo');
  
  if (gameSpace) {
    gameSpace.style.transform = 'scale(80%)';
    gameSpace.style.marginRight = '20%';
  }
  
  if (bossSpace) {
    bossSpace.style.transform = 'translateX(-120%)';
    bossSpace.style.opacity = '0';
    bossSpace.classList.add('hidden');
  }
  
  if (gameInfo) {
    gameInfo.style.transform = 'translateX(0)';
  }

  document.getElementById('bg-img').style.display = 'block';
  document.getElementById("boss-img").src = "images/stageBackground/xMino.gif";
  document.getElementById("backgroundImage").src = "./images/stageBackground/backStage6.png";

  ///////////////////////////////[게임 기본 설정]/////////////////////////////////
  DROP_DELAY = 1000;
  PLACE_DELAY = 1000;
  DAS = 160;
  ARR = 30;
  SDF = 1;
  softDropMax = false;
  RED_ROW = 2;
  gravityDirection = 1;

  bossHP = 100;
  currentBossHP = bossHP;

  ///////////////////////////////[게임 상태 변수]/////////////////////////////////
  gameRunning = false;
  isAnimating = false;
  isGameOver = false;

  gameTime = 0;
  startTime = 0;
  dropTimer = 0;
  placeTimer = 0;
  lastFrameTime = 0;
  gamePlayTime = 0;
  lastPPS = 0;

  MODE_free = false;
  
  ///////////////////////////////[블록 관련 변수]/////////////////////////////////
  currentPiece = null; 
  currentPieceType = '';
  currentX = 0; 
  currentY = 0; 
  isOnGround = false;
  rotationState = 0;

  currentGhostPiece = null;
  currentGhostX = 0;
  currentGhostY = 0;

  ///////////////////////////////[가방 시스템]/////////////////////////////////
  currentBag = [];
  nextBag = [];

  ///////////////////////////////[스코어/통계 관련 변수]/////////////////////////////////
  currentStage = 1;
  score = 0;
  totalLinesCleared = 0;
  totalTetrisClear = 0;
  placedPiece = 0;
  tSpinCount = 0;
  currentPps = 0;

  ///////////////////////////////[키 상태 초기화]/////////////////////////////////
  lastRotationUsed = false;
  lastKickIndex = -1;
  lastRotationKey = "";

  lastSoftDropTime = 0;
  lastMoveKey = null;
  
  ////////////////////////////[hold 변수]/////////////////////////////////
  isUsingHold = false;
  canPlaceHold = false;
  holdingPiece = '';

  countLinesCleared = 0;
  
  blockedCount = 0;
  lastMoveKey = null;

  window.showCountdownAndStart = showCountdownAndStart;
  
  clearedGarbageLine = 0;
  clearedLineWithTetrash = 0;
  clearedTetrisStage4 = 0;
  clearedLinesStage4 = 0;
  clearedTetrisStage6 = 0;

  placedBigPiece = 0;
  tSpinStage7 = 0;
  lastGarbageTime = Date.now();
  garbageInterval = 4000;
  /////////////////////////////////////////조건
  LINES_FOR_STAGE2 = 20;
  GARBAGELINES_FOR_STAGE3 = 10;
  LINES_FOR_STAGE4 = 7;
  TETRIS_FOR_STAGE5 = 3;
  LINES_FOR_STAGE5 = 3;
  PLACED_FOR_STAGE6 = 10;
  TSPIN_FOR_STAGE7 = 3;
  TETRIS_FOR_STAGE7 = 2; 
  countLinesCleared = 0;

  initGrid();
  initGameSettings();
  modeReset();
  initKeyStates();
  renderGame();
  
  if(!MODE_skillCheck && !MODE_free){
    updateMissionDisplay();
  }
  
  updateScoreDisplay();
  endBossStage();
  showDifficulty();
  applyGameSettings();
  initGameLayout();
}

// 셀 그리기
function drawBlock(ctx, x, y, color = 'white', isGhost = false, block_size = BLOCK_SIZE) {
    const px = Math.floor(x * block_size);
    const py = Math.floor(y * block_size);
    const radius = 4;
  
    ctx.save();
  
    if (isGhost) {
      ctx.globalAlpha = 0.45; // 유령 블록은 투명하게
    }
  
    // 둥근 사각형 클리핑
    roundedRectPath(ctx, px, py, block_size, block_size, radius);
    ctx.clip();
  
    // 배경색 채우기
    ctx.fillStyle = color;
    ctx.fillRect(px, py, block_size, block_size);
  
    // 텍스처 이미지가 로드되면 위에 올리기
    if (blockTexture.complete && blockTexture.naturalWidth > 0) {
      ctx.drawImage(blockTexture, px, py, block_size, block_size);
    }
  
    ctx.restore();
  
    // 테두리는 투명하지 않게 그리기 위해 다시 설정
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    roundedRect(ctx, px + 0.5, py + 0.5, block_size - 1, block_size - 1, radius);
    ctx.stroke();
  
    // 투명도 초기화
    if (isGhost) {
      ctx.globalAlpha = 1.0;
    }
  }
  
  // 둥근 사각형 패스만 생성하는 함수 (클리핑용)
  function roundedRectPath(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
  
  // 둥근 사각형 함수
  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

