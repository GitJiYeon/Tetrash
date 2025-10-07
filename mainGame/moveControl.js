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
  return piece.shape.length === 3 && piece.shape[0].length === 3 &&
         piece.shape[1][1] === 1; // 중심에 블록 있는지 확인
}

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
// 오른쪽 회전 함수 수정
function rotateRight() {
  if (!currentPiece) return;
  
  // O 미노는 회전하지 않음
  if (isOPiece(currentPiece)) return;
  
  const newRotationState = (rotationState + 1) % 4;
  const rotated = { ...currentPiece, shape: rotateMatrixCW(currentPiece.shape) };
  
  // 적절한 킥 테이블 선택
  const kickKey = `${rotationState}>${newRotationState}`;
  let kicks;
  if (isIPiece(currentPiece)) {
    kicks = kickTableI[kickKey] || [[0,0]];
  } else {
    kicks = kickTable[kickKey] || [[0,0]];
  }


  // 킥 테스트 수행
  for (let i = 0; i < kicks.length; i++) {
    const [dx, dy] = kicks[i];
    console.log(`Testing kick [${dx}, ${dy}] at position (${currentX + dx}, ${currentY + dy})`);
  
    if (canPlacePiece(rotated, currentX + dx, currentY + dy)) {
      if(isTspinTriple(dx, dy)){
        tSpinCount++;
      }

      console.log(`Kick [${dx}, ${dy}] successful!`);
      //실제 블록
      currentPiece = rotated;
      currentX += dx;
      currentY += dy;
      rotationState = newRotationState;
      //유령블록
      updateGhostPiece();
      return;
    }else{

    }
  }
}

// 왼쪽 회전 함수 수정
function rotateLeft() {
  if (!currentPiece) return;
  
  // O 미노는 회전하지 않음
  if (isOPiece(currentPiece)) return;
  
  const newRotationState = (rotationState + 3) % 4; // 반시계방향은 +3과 같음
  const rotated = { ...currentPiece, shape: rotateMatrixCCW(currentPiece.shape) };
  const kickKey = `${rotationState}>${newRotationState}`;

  // 적절한 킥 테이블 선택 (역방향 키 사용)
  let kicks;
  if (isIPiece(currentPiece)) {
    kicks = kickTableI[kickKey] || [[0,0]];
  /*} else if (isTPiece(currentPiece)) {
    kicks = kickTableT[kickKey] || [[0,0]];*/
  } else {
    kicks = kickTable[kickKey] || [[0,0]];
  }


  // 킥 테스트 수행 (역방향이므로 dx, dy 부호 반전)
  for (let i = 0; i < kicks.length; i++) {
    const [dx, dy] = kicks[i];
    if (canPlacePiece(rotated, currentX + dx, currentY + dy)) {
      if(isTspinTriple(dx, dy)){
        tSpinCount++;
      }
      //실제블록
      currentPiece = rotated;
      currentX += dx;
      currentY += dy;
      rotationState = newRotationState;

      // 유령블록
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

function softDrop(currentTime) {
  updateGhostPiece();

  if (currentTime - lastSoftDropTime >= softDropDelay) {
    if (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
      if(softDropMax){
        while (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
          currentY += gravityDirection;
        }
      }else{
        currentY += gravityDirection;
      }
      isOnGround = false;
    } else {
      if (!isOnGround) {
        isOnGround = true;
        placeTimer = currentTime; // 바닥에 닿은 순간 기록
      }
    }

    lastSoftDropTime = currentTime;
  }
}

function hardDrop() {
  updateGhostPiece();
  while (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
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
document.addEventListener('keydown', (e) => {
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
function handleInput(currentTime) {
  if (!currentPiece || !gameRunning) return;

  // 좌/우 이동 (DAS + ARR)
  if (lastMoveKey && pressedKeys[lastMoveKey]) {
    if (keyTimers[lastMoveKey] === 0) {
      lastMoveKey === 'ArrowLeft' ? moveLeft() : moveRight();
      keyTimers[lastMoveKey] = currentTime + DAS;
    } else if (currentTime >= keyTimers[lastMoveKey]) {
      lastMoveKey === 'ArrowLeft' ? moveLeft() : moveRight();
      keyTimers[lastMoveKey] = currentTime + ARR;
    }
  }

  // 아래 화살표 처리 → 항상 소프트드롭
  if (pressedKeys['ArrowDown']) {
    if (keyTimers['ArrowDown'] === 0) {
      softDrop(currentTime);
      keyTimers['ArrowDown'] = currentTime + DAS;
    } else if (currentTime >= keyTimers['ArrowDown']) {
      softDrop(currentTime);
      keyTimers['ArrowDown'] = currentTime + ARR;
    }
  }

  // 위 화살표 처리 → 항상 단발 회전
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

