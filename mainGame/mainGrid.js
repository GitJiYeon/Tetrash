// ============================================================================
// 유틸리티 함수
// ============================================================================

// Fisher-Yates 알고리즘 배열 섞기
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// 가방 시스템
// ============================================================================

// 모드에 따라 새로운 블록 가방 생성
function createNewBag() {
  let basicBlocks;
  
  if (MODE_tetrash) {
    basicBlocks = ['T', 'O', 'J', 'L', 'S', 'Z', 'I', 
                   'Q', 'X', 'U', 'P', 'V', 'dot', 'dot', 'dot', 'dot'];
  } else if (MODE_bigBlock) {
    basicBlocks = ['bigT', 'bigO', 'bigJ', 'bigL', 'bigS', 'bigZ', 'bigI'];
  } else {
    basicBlocks = ['T', 'O', 'J', 'L', 'S', 'Z', 'I'];
  }
  
  return shuffleArray(basicBlocks);
}

// ============================================================================
// 게임 오버
// ============================================================================

// 레드존(위험 영역)에 블록이 있는지 확인
function checkRedZone() {
  if (isAnimating) return false;
  
  // 중력 방향에 따라 레드존 위치 결정
  RED_ROW = (gravityDirection === 1) ? 2 : 20;
  
  // 중앙 4칸(3-6) 체크
  for (let x = 3; x < 7; x++) {
    if (grid[RED_ROW][x] !== 0) {
      gameOver(false);
      return true;
    }
  }
  return false;
}

// 게임 오버 처리
function gameOver(isClear) {
  gameRunning = false;
  isGameOver = true;
  showGameOver(isClear);
  console.log("gameover");
}

// ============================================================================
// 보스
// ============================================================================

function damageBoss(amount) {
    currentBossHP -= amount;
    const hpBar = document.getElementById('currentHP');
    const percent = (currentBossHP / bossHP) * 100;
    hpBar.style.width = percent + '%';
    
    if (currentBossHP < 1){
      defeatBoss();
      gameRunning = false;
      return;
    }
}
// ============================================================================
// 블록 배치 & 충돌 감지
// ============================================================================

// 블록이 현재 위치에 배치 가능한지 확인
function canPlacePiece(piece, x, y) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        
        // 경계 체크
        if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) {
          return false;
        }
        
        // 블록 충돌 체크
        if (grid[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

// 새로운 블록 스폰
function spawnNewPiece() {
  if (isAnimating) return;
  lastRotationUsed = false;
  currentPiece = getNextPiece();
  if (currentPiece.type === 'bigI') {
    // bigI 블록은 특수 처리
    currentX = 1;
    currentY = (gravityDirection === 1) ? 0 : 20;
  }else {
  // 중력 방향에 따른 스폰 위치 설정
    currentX = Math.floor(COLS / 2) - 2;
    currentY = (gravityDirection === 1) ? 0 : 20;
  }

  
  // 스폰 위치 유효성 검사
  if (!canPlacePiece(currentPiece, currentX, currentY) || checkRedZone()) {
    gameOver(false);
    return false;
  }
  
  updateGhostPiece();
  showNextBlocks();
  return true;
}

// ============================================================================
// 고스트 블록
// ============================================================================

// 고스트 블록 위치 업데이트
function updateGhostPiece() {
  currentGhostPiece = {
    shape: currentPiece.shape.map(row => row.slice()),
    color: currentPiece.color
  };
  
  currentGhostX = currentX;
  currentGhostY = currentY;
  
  // 중력 방향으로 떨어뜨려 최종 위치 계산
  while (canPlacePiece(currentGhostPiece, currentGhostX, currentGhostY + gravityDirection)) {
    currentGhostY += gravityDirection;
  }
}

// ============================================================================
// 라인 클리어 
// ============================================================================

// 특정 라인이 방해줄인지 확인
function isGarbageLine(rowIndex) {
  for (let col = 0; col < COLS; col++) {
    if (grid[rowIndex][col] === 0) continue;
    if (grid[rowIndex][col] !== 'gray') return false;
  }
  return true;
}

// 채워진 라인 확인 및 제거
function checkLineFilled(pieceType) {
  let linesCleared = 0;
  
  // 중력 방향에 따라 스캔 방향 결정
  const startRow = gravityDirection === 1 ? ROWS - 1 : 0;
  const endRow = gravityDirection === 1 ? -1 : ROWS;
  const step = gravityDirection === 1 ? -1 : 1;
  
  for (let row = startRow; row !== endRow; row += step) {
    // 라인이 꽉 찼는지 확인
    let isLineFilled = true;
    for (let col = 0; col < COLS; col++) {
      if (grid[row][col] === 0) {
        isLineFilled = false;
        break;
      }
    }
    
    if (isLineFilled) {
      // 테트라쉬 블록으로 클리어한 경우 카운트
      if (['Q', 'X', 'U', 'P', 'V', 'dot'].includes(pieceType)) {
        clearedLineWithTetrash++;
      }
      
      // 방해줄 포함 여부 확인
      for (let col = 0; col < COLS; col++) {
        if (grid[row][col] === 'gray') {
          clearedGarbageLine++;
          break;
        }
      }
      
      // 라인 제거 및 블록 이동
      let moveRow = row;
      while (gravityDirection === 1 ? moveRow > 0 : moveRow < ROWS - 1) {
        for (let col = 0; col < COLS; col++) {
          grid[moveRow][col] = grid[moveRow - gravityDirection][col];
        }
        moveRow -= gravityDirection;
      }
      
      // 최상단/최하단 행 초기화
      const clearRow = gravityDirection === 1 ? 0 : ROWS - 1;
      for (let col = 0; col < COLS; col++) {
        grid[clearRow][col] = 0;
      }
      
      // 같은 행 재검사
      row -= step;
      linesCleared++;
    }
  }
  
  return linesCleared;
}

// ============================================================================
// 블록 배치 및 점수 계산
// ============================================================================


// 블록을 그리드에 배치하고 점수 계산
function placePieceOnGrid(piece, x, y) {
  // 블록을 그리드에 배치
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const gridX = x + col;
        const gridY = y + row;
        if (gridY >= 0) {
          grid[gridY][gridX] = piece.color;
        }
      }
    }
  }
  
  //빅블록 애니메이션
  if(MODE_bigBlock){impactEffect(gameSpace)}
  canPlaceHold = true; // 홀드 사용 가능하도록 설정
  
  // 라인 제거 전 T-Spin 체크
  const isTSpin = detectTSpin();

  // 라인 체크 및 제거
  const clearedLines = checkLineFilled(piece.type);
  if(currentStage == 7 && clearedLines != 0) {
    damageBoss(clearedLines);
    shaking2(bossSpace);
  }
  // 점수 계산
  const tSpinTable = [0, 300, 800, 1200];
  if (isTSpin) {
    if(currentStage == 6 && clearedLines !== 0) tSpinStage7++;
      tSpinCount++;
      score += tSpinTable[clearedLines];
      console.log("T스핀" + tSpinTable[clearedLines]);
    //보스전 T스핀 추가데미지
    if(currentStage == 7 && clearedLines != 0){
      damageBoss(clearedLines);
    }

  }
  // 초기화
  lastRotationUsed = false;
  // 점수 계산
  const scoreTable = [0, 100, 300, 500, 800];
  score += scoreTable[clearedLines] || 0;
  
  // 테트리스 클리어 카운트
  if (clearedLines === 4) {
    if(currentStage == 7 && clearedLines != 0) damageBoss(1);
    totalTetrisClear++;
    showSkillImage('tetrash');
    if (currentStage === 4) clearedTetrisStage4++;
  }
  
  // 퍼펙트 클리어 체크
  isPerfectClear();
  
  // 통계 업데이트
  if (bigTypes.includes(piece.type)) placedBigPiece++;
  placedPiece++;
  totalLinesCleared += clearedLines;
}

// 퍼펙트 클리어 확인
function isPerfectClear() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== 0) return false;
    }
  }
  
  showSkillImage('perfect');
  score += 2000;
  return true;
}

// ============================================================================
// 그래픽 
// ============================================================================

// 현재 떨어지는 블록 그리기
function drawCurrentPiece() {
  if (!currentPiece) return;
  
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = currentX + col;
        const y = currentY + row;
        if (y >= 0) {
          drawBlock(context, x, y, currentPiece.color);
        }
      }
    }
  }
}

// 고스트 블록 그리기
function drawCurrentGhostPiece() {
  if (!currentGhostPiece) return;
  
  for (let row = 0; row < currentGhostPiece.shape.length; row++) {
    for (let col = 0; col < currentGhostPiece.shape[row].length; col++) {
      if (currentGhostPiece.shape[row][col]) {
        const x = currentGhostX + col;
        const y = currentGhostY + row;
        if (y >= 0) {
          drawBlock(context, x, y, currentGhostPiece.color, true);
        }
      }
    }
  }
}

// 그리드 전체 그리기
function drawGrid() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = x * BLOCK_SIZE;
      const py = y * BLOCK_SIZE;
      
      if (grid[y][x] !== 0) {
        // 블록이 있는 경우
        drawBlock(context, x, y, grid[y][x]);
      } else if (y === RED_ROW) {
        // 레드존 (커트라인)
        context.fillStyle = 'rgba(255, 222, 89, 0.4)';
        context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeStyle = '#292929';
        context.lineWidth = 1;
        context.strokeRect(px + 0.5, py + 0.5, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      } else {
        // 빈 칸
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeStyle = 'rgba(255, 222, 89, 0.12)';
        context.lineWidth = 1;
        context.strokeRect(px + 0.5, py + 0.5, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    }
  }
  
  drawCurrentGhostPiece();
  drawCurrentPiece();
}

// ============================================================================
// 게임 시작 
// ============================================================================

// 카운트다운 후 게임 시작
function showCountdownAndStart(duration = 3) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let counter = duration;
  
  function drawCountdown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(counter, centerX, centerY);
  }
  
  drawCountdown();
  
  const interval = setInterval(() => {
    counter--;
    if (counter <= 0) {
      clearInterval(interval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      startGame();
    } else {
      drawCountdown();
    }
  }, 1000);
}

// 게임 시작
function startGame() {
  gameRunning = true;
  difficultySetting();
  stageMessageSetting();
  
  currentBag = createNewBag();
  nextBag = createNewBag();
  
  if (spawnNewPiece()) {
    startTime = performance.now();
    gamePlayTime = 0;
    dropTimer = 0;
    placeTimer = 0;
    requestAnimationFrame(gameLoop);
  }
}

window.showCountdownAndStart = showCountdownAndStart;

// ============================================================================
// 방해줄 
// ============================================================================

// 방해줄 업데이트 (시간 기반)
function updateGarbage() {
  const now = Date.now();
  if (now - lastGarbageTime >= garbageInterval) {
    addGarbageRow();
    lastGarbageTime = now;
  }
}

// 방해줄 추가
function addGarbageRow() {
  const hole = Math.floor(Math.random() * COLS);
  const row = Array.from({ length: COLS }, (_, x) => (x === hole ? 0 : 'gray'));
  
  // 모든 행을 위로 밀어올림
  for (let y = 0; y < ROWS - 1; y++) {
    grid[y] = grid[y + 1];
  }
  grid[ROWS - 1] = row;
  
  liftPieceIfOverlapping();
}

// 블록이 그리드와 겹치면 위로 이동
function liftPieceIfOverlapping() {
  while (!canPlacePiece(currentPiece, currentX, currentY) && currentY > 0) {
    currentY--;
  }
  updateGhostPiece();
}

// ============================================================================
// 텍스처 로딩
// ============================================================================

blockTexture.onload = function() {
  console.log('블록 텍스처 로드 완료');
  drawGrid();
  drawHold();
  drawNext();
};

blockTexture.onerror = function() {
  console.log('블록 텍스처 로드 실패, 텍스처 없이 게임 시작');
  drawGrid();
  drawHold();
  drawNext();
};

if (blockTexture.complete) {
  console.log('블록 텍스처가 이미 로드됨');
  drawGrid();
  drawHold();
  drawNext();
}

// ============================================================================
// 애니메이션
// ============================================================================

// 그리드 상하 반전 애니메이션
function flipGrid() {
  isAnimating = true;
  
  if (MODE_gravityReverse) {
    gravityDirection = -1;
    RED_ROW = 20;
  } else {
    gravityDirection = 1;
    RED_ROW = 2;
  }
  
  let row = 0;
  drawGrid();
  
  function step() {
    // 현재 행과 대칭 행을 교환
    for (let c = 0; c < COLS; c++) {
      const oppositeRow = ROWS - 1 - row;
      const tmp = grid[row][c];
      grid[row][c] = grid[oppositeRow][c];
      grid[oppositeRow][c] = tmp;
    }
    
    row++;
    if (row < Math.floor(ROWS / 2)) {
      setTimeout(step, 100);
    } else {
      isAnimating = false;
      updateGhostPiece();
    }
  }
  
  step();
}

// 현재 블록 Y좌표 반전
function flipCurrentPiece() {
  const pieceHeight = currentPiece.shape.length;
  currentY = ROWS - currentY - pieceHeight;
  
}

// 그리드 클리어 애니메이션
function clearGrid() {
  isAnimating = true;
  let row = 0;
  
  function step() {
    // 현재 행의 모든 칸 비우기
    for (let c = 0; c < COLS; c++) {
      grid[row][c] = 0;
    }
    
    drawGrid();
    
    row++;
    if (row < ROWS) {
      setTimeout(step, 30);
    } else {
      isAnimating = false;
      placedPiece--;
      updateGhostPiece();
    }
  }
  
  step();
}