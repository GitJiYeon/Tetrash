// 배열을 랜덤하게 섞는 함수 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
  const shuffled = [...array]; // 원본 배열 복사
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 새로운 가방을 생성하는 함수
function createNewBag() {
  // 기본 7개 블록 타입
  if(MODE_tetrash){
    basicBlocks = ['T', 'O', 'J', 'L', 'S', 'Z', 'I', 
                      'Q', 'X', 'U', 'P', 'V', 'dot', 'dot', 'dot', 'dot']; 
  }else if(MODE_bigBlock){
    basicBlocks = ['T', 'O', 'J', 'L', 'S', 'Z', 'I']
                      + ['bigT', 'bigL']; 
  }else{
    basicBlocks = ['T', 'O', 'J', 'L', 'S', 'Z', 'I']; 
  }

  //7개 블록 랜덤
  return shuffleArray(basicBlocks);
  
}



function checkRedZone() {
  if(isAnimating) return false;

  if(gravityDirection == 1){ //중력 아래
    RED_ROW = 2; // 빨간 영역 행
  }else{ //중력 위
    RED_ROW = 20; // 빨간 영역 행
  }
  
  for (let x = 3; x < 7; x++) {
    if (grid[RED_ROW][x] !== 0) { 
      gameOver();
      return true;
    }
  }
  return false;
}

function gameOver(){
  gameRunning = false;
  isGameOver = true;
  alert("gameover"); 
  console.log("gameover")
  
}

// 블록이 그리드에 배치될 수 있는지 확인
function canPlacePiece(piece, x, y) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const newX = x + col;
        const newY = y + row;
        
        // 경계 체크 수정
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


// 새로운 블록을 스폰시키는 함수
function spawnNewPiece() {
  if(isAnimating) return;
  currentPiece = getNextPiece(); // 가방에서 다음 블록 가져오기
  currentX = Math.floor(COLS / 2) -2; // 중앙에 배치
  rotationState = 0; // 회전 상태 초기화 추가

  checkRedZone();

  if(gravityDirection == 1){ //중력이 아래
    currentY = 0; // 맨 위에서 시작
  }else{ //중력이 위
    currentY = 20; // 맨 아래에서 시작
  }
  
  // 스폰 위치에 블록을 놓을 수 없으면 게임 오버
  if (!canPlacePiece(currentPiece, currentX, currentY)) {
    gameOver();
    return false;
  }
  updateGhostPiece();
  
  showNextBlocks();
  return true;
}
//고스트블록 ==================================================================
function updateGhostPiece() {
  // currentPiece를 복사해서 유령 블록 만들기
  currentGhostPiece = {
    shape: currentPiece.shape.map(row => row.slice()),
    color: currentPiece.color //ghostColor
  };

  currentGhostX = currentX;
  currentGhostY = currentY;

  // 실제 고정된 grid 기준으로 유령 블록의 위치 계산
  while (canPlacePiece(currentGhostPiece, currentGhostX, currentGhostY + gravityDirection)) {
    currentGhostY += gravityDirection;
  }
}
/*function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/

function isGarbageLine(rowIndex) {
  for (let col = 0; col < COLS; col++) {
      if (grid[rowIndex][col] === 0) continue; // 구멍은 제외
      if (grid[rowIndex][col] !== 'gray') return false;
  }
  return true;
}

function checkLineFilled(pieceType) {
  let linesCleared = 0;

  const startRow = gravityDirection === 1 ? ROWS - 1 : 0;
  const endRow = gravityDirection === 1 ? -1 : ROWS;
  const step = gravityDirection === 1 ? -1 : 1;

  for (let row = startRow; row !== endRow; row += step) {
    let isLineFilled = true;

    for (let col = 0; col < COLS; col++) {
        if (grid[row][col] === 0) isLineFilled = false;
    }

    if (isLineFilled) {
      if (['Q', 'X', 'U', 'P', 'V', 'dot'].includes(pieceType)) clearedLineWithTetrash++;
      // 채워진 줄에 gray가 한 칸이라도 있으면 방해줄 카운트
      for (let col = 0; col < COLS; col++) {
          if (grid[row][col] === 'gray') {
              clearedGarbageLine++;
              break; // 한 번만 카운트
          }
      }

      // 한 줄 삭제 → 중력 반대로 행 이동
      let moveRow = row;
      while (gravityDirection === 1 ? moveRow > 0 : moveRow < ROWS - 1) {
          for (let col = 0; col < COLS; col++) {
              grid[moveRow][col] = grid[moveRow - gravityDirection][col];
          }
          moveRow -= gravityDirection;
      }

      // 맨 끝 행 비우기
      const clearRow = gravityDirection === 1 ? 0 : ROWS - 1;
      for (let col = 0; col < COLS; col++) {
          grid[clearRow][col] = 0;
      }

      // 같은 행 다시 체크
      row -= step;
      linesCleared++;
    }
      
  }

  return linesCleared;
}

//=================================================그래픽=============================================
// 현재 떨어지는 블록을 화면에 그리가
function drawCurrentPiece() {
  if (!currentPiece) return;
  
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = currentX + col;
        const y = currentY + row;
        if (y >= 0) { // 화면 위쪽은 그리지 않음
          drawBlock(context, x, y, currentPiece.color);
        }
      }
    }
  }
}

function drawCurrentGhostPiece() {
  if (!currentGhostPiece) return;
  
  for (let row = 0; row < currentGhostPiece.shape.length; row++) {
    for (let col = 0; col < currentGhostPiece.shape[row].length; col++) {
      if (currentGhostPiece.shape[row][col]) {
        const x = currentGhostX + col;
        const y = currentGhostY + row;
        if (y >= 0) { // 화면 위쪽은 그리지 않음
          drawBlock(context, x, y, currentGhostPiece.color, true);
        }
      }
    }
  }
}

function placePieceOnGrid(piece, x, y) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const gridX = x + col;
        const gridY = y + row;
        if (gridY >= 0) { // 화면 위쪽은 무시
          grid[gridY][gridX] = piece.color;
        }
      }
    }
    canPlaceHold = true;//홀드 제어 해제
  }
  
  // 블록이 배치된 후 라인 체크 및 제거
  const clearedLines = checkLineFilled(piece.type);
  
  // 선택사항: 제거된 라인 수에 따른 점수 계산이나 효과음 등을 추가할 수 있음
  if (clearedLines == 1) {
    score += 100;
  }else if(clearedLines == 2){
    score += 300;
  }else if(clearedLines == 3){
    score += 500;
  }else if(clearedLines == 4){
    score += 800;
    totalTetrisClear++;
    if(currentStage == 4)clearedTetrisStage4++; //스4 미션을위한

  }
  placedPiece++;
  totalLinesCleared += clearedLines;
}

// 그리드 그리기
function drawGrid() {
  context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 지우기

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = x * BLOCK_SIZE;
      const py = y * BLOCK_SIZE;

      if (grid[y][x] !== 0) {
        // 블록이 있으면 블록 그림
        drawBlock(context, x, y, grid[y][x]);
      } 
      else if (y == RED_ROW) {
        // 커트라인
        context.fillStyle = 'rgba(255, 222, 89, 0.4)';
        context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeStyle = '#292929';
        context.lineWidth = 1;
        context.strokeRect(px + 0.5, py + 0.5, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      } 
      else {
        // 빈칸 → 반투명 검정
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);

        // 테두리
        context.strokeStyle = 'rgba(255, 222, 89, 0.12)';
        context.lineWidth = 1;
        context.strokeRect(px + 0.5, py + 0.5, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    }
  }


  
  // 그 다음 현재 떨어지는 블록을 그림
  drawCurrentPiece();
  drawCurrentGhostPiece();
}


function showCountdownAndStart(duration = 3) {
  if (!canvas) return; // 캔버스가 없으면 종료
    const ctx = canvas.getContext('2d'); // 여기서 ctx 정의

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
  let counter = duration;

  function drawCountdown() {
      // 캔버스 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      // 중앙에 숫자 표시
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
          ctx.clearRect(0, 0, canvas.width, canvas.height); // 마지막 숫자 지우기
          startGame(); // 카운트 끝나면 게임 시작
      } else {
          drawCountdown();
      }
  }, 1000);
}


// 게임 시작 함수
function startGame() {
  gameRunning = true;
  difficultySetting();

  currentBag = createNewBag();
  nextBag = createNewBag();  // 시작할 때 미리 준비

  // 첫 번째 블록 스폰
  if (spawnNewPiece()) {
    startTime = performance.now();  // 루프 시작 시점 기준
    gamePlayTime = 0;
    dropTimer = 0;   // elapsed 기준으로 0부터 시작
    placeTimer = 0;

    requestAnimationFrame(gameLoop);
  }
}

window.showCountdownAndStart = showCountdownAndStart;

function updateGarbage() {
  const now = Date.now();
  if (now - lastGarbageTime >= garbageInterval) {
    addGarbageRow();
    lastGarbageTime = now;
  }
}

function addGarbageRow() {
    const hole = Math.floor(Math.random() * COLS);
    const row = Array.from({ length: COLS }, (_, x) => (x === hole ? 0 : 'gray'));
  
    // grid 위로 밀기
    for (let y = 0; y < ROWS - 1; y++) {
      grid[y] = grid[y + 1];
    }
    grid[ROWS - 1] = row;
  
    
    liftPieceIfOverlapping();
  }

  // 블록 겹치면 가능한 만큼 위로 올리기
  function liftPieceIfOverlapping() {
    while (!canPlacePiece(currentPiece, currentX, currentY) && currentY > 0) {
      currentY--;
    }
    updateGhostPiece(); // ghost도 갱신
  }


// 텍스처 이미지 로드 후 게임 시작
blockTexture.onload = function() {
  console.log('블록 텍스처 로드 완료');
  drawGrid(); // 초기 그리드 그리기
  drawHold();
  drawNext();
};

// 이미지 로드 실패시에도 게임은 시작
blockTexture.onerror = function() {
  console.log('블록 텍스처 로드 실패, 텍스처 없이 게임 시작');
  drawGrid(); // 초기 그리드 그리기
  drawHold();
  drawNext();
};

// 이미지가 이미 캐시되어 있을 경우를 대비
if (blockTexture.complete) {
  console.log('블록 텍스처가 이미 로드됨');
  drawGrid(); // 초기 그리드 그리기
  drawHold();
  drawNext();
}

/////////////////////애니메이션

function flipGrid() {
  isAnimating = true;
  if (MODE_gravityReverse) gravityDirection = -1;
  else gravityDirection = 1;
  let row = 0;

  drawGrid();
  function step() {
    for (let c = 0; c < COLS; c++) {
      const r = row;
      const oppositeRow = ROWS - 1 - r;
      const tmp = grid[r][c];
      grid[r][c] = grid[oppositeRow][c];
      grid[oppositeRow][c] = tmp;
    }

    row++;
    if (row < Math.floor(ROWS / 2)) {
      setTimeout(step, 100);
    } else {
      // 애니 끝
      isAnimating = false;
      placedPiece--;
      updateGhostPiece();
    }
  }

  step();
}


function flipCurrentPiece() {
  const pieceHeight = currentPiece.shape.length;
  currentY = ROWS - currentY - pieceHeight;
}