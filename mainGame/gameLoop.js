// ============================================================================
// 일시정지 시스템
// ============================================================================

let paused = false;

// 탭 전환 시 자동 일시정지
document.addEventListener("visibilitychange", () => {
  paused = document.hidden;
  if (paused) lastFrameTime = 0;
});

// ============================================================================
// 메인 게임 루프
// ============================================================================

function gameLoop(now) {
  // 일시정지 후 복귀 시 프레임 시간 초기화
  if (!lastFrameTime || paused) {
    lastFrameTime = now;
  }

  // 프레임 간 경과 시간 계산
  let dt = now - lastFrameTime;
  lastFrameTime = now;

  // 비정상적인 dt 값 방지 (최대 100ms)
  if (dt > 100) dt = 100;

  // 게임 시간 업데이트 (애니메이션/일시정지 중에는 제외)
  if (!isAnimating && gameRunning && !paused) {
    gameTime += dt;
  }

  // 입력 처리 (애니메이션 중이 아닐 때만)
  if (!isAnimating) {
    handleInput(gameTime);
  }
  
  // 미션 표시 업데이트
  updateMissionDisplay();

  // 게임 로직 업데이트
  if (!isAnimating && gameRunning) {
    updateGameLogic();
  }

  // 화면 렌더링
  renderGame();

  // 다음 프레임 요청
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// ============================================================================
// 게임 로직 업데이트
// ============================================================================

// 블록 낙하 및 배치 처리
function updateGameLogic() {
  // 블록 낙하 처리
  handleBlockDrop();
  
  // 스테이지 진행 체크
  checkStageProgress();
  
  // 점수 표시 업데이트
  updateScoreDisplay(gameTime);
  
  // 방해줄 모드 활성화 시 처리
  if (MODE_garbageLine) {
    updateGarbage();
  }
}

// 블록 낙하 로직
function handleBlockDrop() {
  // 낙하 딜레이 체크
  if (gameTime - dropTimer <= DROP_DELAY) return;

  // 블록이 아래로 이동 가능한지 확인
  const canMoveDown = canPlacePiece(currentPiece, currentX, currentY + gravityDirection);

  if (canMoveDown) {
    // 블록 낙하
    currentY += gravityDirection;
    isOnGround = false;
  } else {
    // 바닥에 닿음 - 배치 처리
    handleBlockPlacement();
  }

  // 낙하 타이머 갱신
  dropTimer = gameTime;
}

// 블록 배치 처리
function handleBlockPlacement() {
  // 바닥에 처음 닿았을 때 배치 타이머 시작
  if (!isOnGround) {
    isOnGround = true;
    placeTimer = gameTime;
    return;
  }

  // 배치 대기 시간 체크
  if (gameTime - placeTimer < PLACE_DELAY) return;

  // 블록을 그리드에 고정
  placePieceOnGrid(currentPiece, currentX, currentY);
  placeTimer = 0;

  // 다음 블록 스폰 (실패 시 게임 종료)
  if (!spawnNewPiece()) return;
}

// ============================================================================
// 렌더링
// ============================================================================

// 게임 화면 렌더링
function renderGame() {
  drawHold();
  drawGrid();
  drawNext();
}