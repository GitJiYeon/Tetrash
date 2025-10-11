//===================================무빙===================================================================
// SRS 회전 함수 수정 (시계방향)
function rotateMatrixCW(matrix) {
  const N = matrix.length;
  const M = matrix[0].length;
  const rotated = Array(M).fill(null).map(() => Array(N).fill(0));
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      rotated[j][N - 1 - i] = matrix[i][j];
    }
  }
  return rotated;
}

// SRS 회전 함수 수정 (반시계방향)
function rotateMatrixCCW(matrix) {
  const N = matrix.length;
  const M = matrix[0].length;
  const rotated = Array(M).fill(null).map(() => Array(N).fill(0));
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      rotated[M - 1 - j][i] = matrix[i][j];
    }
  }
  return rotated;
}

// O 미노는 회전하지 않음을 체크하는 함수
function isOPiece(piece) {
  return piece.shape.length === 2 && piece.shape[0].length === 2 && 
         piece.shape[0][0] === 1 && piece.shape[0][1] === 1;
}

// I 미노인지 체크하는 함수
function isIPiece(piece) {
  return piece.shape.length === 4 && piece.shape[0].length === 4;
}

// T인지 체크
function isTPiece(piece) {
  if(piece.type == 'T') return true;
  else return false;
}
/*
function isTspinTriple(dx, dy){
  if (!isTPiece(currentPiece)) return false;

  // 중력에 따라 dy 확인
  const expectedDy = 2 * gravityDirection;
  if ((dx === 1 && dy === expectedDy) || (dx === -1 && dy === expectedDy)) {
    console.log("T스핀 트리플");
    return true;
  }

  return false;
}
*/

let lastRotationUsed = false;
let lastKickIndex = -1;
let lastRotationKey = "";

// T-Spin 감지 함수 (킥 상관없이)
function detectTSpin() {
  if (!isTPiece(currentPiece)) return false;

  // 마지막 동작이 회전이 아니면 T-Spin 아님
  if (!lastRotationUsed) return false;

  // 중심 좌표 (3x3 기준)
  const cx = currentX + 1;
  const cy = currentY + 1;

  // 4개 코너: [좌상, 우상, 좌하, 우하]
  const corners = [
    [cx - 1, cy - 1],
    [cx + 1, cy - 1],
    [cx - 1, cy + 1],
    [cx + 1, cy + 1],
  ];

  let blockedCount = 0;

  corners.forEach(([x, y]) => {
    // 범위 밖이면 무시 (벽 때문에 판정되지 않도록)
    if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return;

    // 블록이 있으면 막힘
    if (grid[y][x] !== 0) blockedCount++;
  });

  // 코너 3개 이상 막혔으면 T-Spin
  const isTSpin = blockedCount >= 3;

  if (isTSpin) showSkillImage('tSpin');

  // 마지막 회전 사용 플래그 초기화
  lastRotationUsed = false;

  return isTSpin;
}

// 오른쪽 회전 함수 수정
function rotateRight() {
  if (!currentPiece) return;
  if (isOPiece(currentPiece)) return;
  
  const newRotationState = (rotationState + 1) % 4;
  const rotated = { ...currentPiece, shape: rotateMatrixCW(currentPiece.shape) };
  
  const kickKey = `${rotationState}>${newRotationState}`;
  let kicks;
  if (isIPiece(currentPiece)) {
    kicks = kickTableI[kickKey] || [[0,0]];
  } else {
    kicks = kickTable[kickKey] || [[0,0]];
  }

  for (let i = 0; i < kicks.length; i++) {
    const [dx, dy] = kicks[i];
    
    if (canPlacePiece(rotated, currentX + dx, currentY + dy)) {
      currentPiece = rotated;
      currentX += dx;
      currentY += dy;
      rotationState = newRotationState;
      
      // T-Spin 체크용 플래그 설정
      lastRotationUsed = true;
      lastKickIndex = i;
      lastRotationKey = kickKey;
      
      updateGhostPiece();
      return;
    }
  }
}

// 왼쪽 회전
function rotateLeft() {
  if (!currentPiece) return;

  // O 미노는 회전하지 않음
  if (isOPiece(currentPiece)) return;

  const newRotationState = (rotationState + 3) % 4; // 반시계 방향
  const rotated = { ...currentPiece, shape: rotateMatrixCCW(currentPiece.shape) };
  const kickKey = `${rotationState}>${newRotationState}`;

  // 적절한 킥 테이블 선택
  let kicks;
  if (isIPiece(currentPiece)) {
    kicks = kickTableI[kickKey] || [[0, 0]];
  } else {
    kicks = kickTable[kickKey] || [[0, 0]];
  }

  // 킥 테스트 수행
  for (let i = 0; i < kicks.length; i++) {
    const [dx, dy] = kicks[i];

    if (canPlacePiece(rotated, currentX + dx, currentY + dy)) {
      // 실제 블록 적용
      currentPiece = rotated;
      currentX += dx;
      currentY += dy;
      rotationState = newRotationState;

      // T-Spin 체크용 상태 저장 (오른쪽 회전과 동일)
      lastRotationUsed = true;
      lastKickIndex = i;
      lastRotationKey = kickKey;

      // 유령 블록 갱신
      updateGhostPiece();
      return;
    }
  }
}



//180도 회전
function rotateMatrix180(matrix) {
  const N = matrix.length;
  const M = matrix[0].length;
  const rotated = Array(N).fill(null).map(() => Array(M).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      rotated[N - 1 - i][M - 1 - j] = matrix[i][j];
    }
  }
  return rotated;
}


function rotate180() {
  if (!currentPiece) return;

  if (isOPiece(currentPiece)) return;

  const newRotationState = (rotationState + 2) % 4;
  const rotated = { ...currentPiece, shape: rotateMatrix180(currentPiece.shape) };

  const kickKey = `${rotationState}>${newRotationState}`;
  const kicks = isIPiece(currentPiece) ? 
    (kickTableI180[kickKey] || [[0, 0]]) : 
    (kickTable180[kickKey] || [[0, 0]]);

  for (let i = 0; i < kicks.length; i++) {
    const [dx, dy] = kicks[i];
    if (canPlacePiece(rotated, currentX + dx, currentY + dy)) {
      currentPiece = rotated;
      currentX += dx;
      currentY += dy;
      rotationState = newRotationState;
      updateGhostPiece();
      return;
    }
  }
}


function moveRight() {
  if (canPlacePiece(currentPiece, currentX + 1, currentY)) {
    currentX++;
    updateGhostPiece();
  }
}

function moveLeft() {
  if (canPlacePiece(currentPiece, currentX - 1, currentY)) {
    currentX--;
    updateGhostPiece();
  }
}

let lastSoftDropTime = 0;

function softDrop(gameTime) {
  updateGhostPiece();

  if (gameTime - lastSoftDropTime >= softDropDelay) {
    if (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
      if(softDropMax){
        while (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
          lastRotationUsed = false;
          currentY += gravityDirection;
        }
      }else{
        lastRotationUsed = false;
        currentY += gravityDirection;
      }
      isOnGround = false;
    } else {
      if (!isOnGround) {
        isOnGround = true;
        placeTimer = gameTime; // 바닥에 닿은 순간 기록
      }
    }

    lastSoftDropTime = gameTime;
  }
}

function hardDrop() {
  updateGhostPiece();
  while (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
    lastRotationUsed = false;
    currentY += gravityDirection;
  }
  placePieceOnGrid(currentPiece, currentX, currentY);
  spawnNewPiece();
  rotationState = 0; // 다음 블록은 초기 방향으로
}



//==== 키 상태 관리 ==============================================================
const keyTimers = {
  ArrowLeft: 0,
  ArrowRight: 0,
  ArrowDown: 0,
  ArrowUp: 0
};

// 단발 키 처리용
const processedOnceKeys = {
  Space: false,
  ShiftLeft: false,
  KeyZ: false,
  KeyA: false,
  ArrowUp: false,   // 단발 회전
  ArrowDown: false  // 중력 반전 시 단발 회전
};

const pressedKeys = {};
let lastMoveKey = null; // 마지막으로 누른 좌우 키 기록

//==== 키 다운/업 이벤트 ========================================================
document.addEventListener('keydown', (e) => { //좌우는 먼저 누른 한쪽만 처리되도록
  pressedKeys[e.code] = true;
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    lastMoveKey = e.code; // 마지막으로 누른 키 갱신
  }
});

document.addEventListener('keyup', (e) => {
  pressedKeys[e.code] = false;
  // 단발 키 리셋
  if (processedOnceKeys[e.code] !== undefined) {
    processedOnceKeys[e.code] = false;
  }
  // 좌우/다운 이동 타이머 리셋
  if (keyTimers[e.code] !== undefined) keyTimers[e.code] = 0;

  // 좌우 키가 모두 떼어지면 lastMoveKey 초기화
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    if (!pressedKeys['ArrowLeft'] && !pressedKeys['ArrowRight']) {
      lastMoveKey = null;
    }
  }
});

//==== 입력 처리 함수 ===========================================================
function handleInput(gameTime) {
  if (!currentPiece || !gameRunning || isAnimating) return;

  // 좌/우 이동 (DAS + ARR)
  if (lastMoveKey && pressedKeys[lastMoveKey]) {
    if (keyTimers[lastMoveKey] === 0) {
      lastMoveKey === 'ArrowLeft' ? moveLeft() : moveRight();
      keyTimers[lastMoveKey] = gameTime + DAS;
    } else if (gameTime >= keyTimers[lastMoveKey]) {
      lastMoveKey === 'ArrowLeft' ? moveLeft() : moveRight();
      keyTimers[lastMoveKey] = gameTime + ARR;
    }
  }

  // 아래 화살표 소프트드롭
  if (pressedKeys['ArrowDown']) {
    if (keyTimers['ArrowDown'] === 0) {
      softDrop(gameTime);
      keyTimers['ArrowDown'] = gameTime + DAS;
    } else if (gameTime >= keyTimers['ArrowDown']) {
      softDrop(gameTime);
      keyTimers['ArrowDown'] = gameTime + ARR;
    }
  }

  // 위 화살표 단발 회전
  if (pressedKeys['ArrowUp']) {
    if (!processedOnceKeys['ArrowUp']) {
      rotateRight();
      processedOnceKeys['ArrowUp'] = true;
    }
  }

  // 단발 키 처리 (스페이스, 홀드, 회전)
  ['Space','ShiftLeft','KeyZ','KeyA'].forEach(key => {
    if (pressedKeys[key] && !processedOnceKeys[key]) {
      switch(key){
        case 'Space': hardDrop(); break;
        case 'ShiftLeft': usingHold(); break;
        case 'KeyZ': rotateLeft(); break;
        case 'KeyA': rotate180(); break;
      }
      processedOnceKeys[key] = true;
    }
  });
}

