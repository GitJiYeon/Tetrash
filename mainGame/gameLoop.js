//====게임 루프==============================================================================================================================
let lastPPS = 0; // 마지막 PPS 값 저장
let lastFrameTime = 0;     
let gamePlayTime = 0;    

function gameLoop(now) {
  // lastFrameTime 초기화
  if (!lastFrameTime) lastFrameTime = now;
  const dt = now - lastFrameTime; // ms
  lastFrameTime = now;

  // 애니메이션/일시정지 중이 아닐 때만 실제 플레이 시간 누적
  if (!isAnimating && gameRunning) {
    gamePlayTime += dt;
  }

  // gamePlayTime을 현재 게임 시간으로 사용 (ms)
  const currentTime = gamePlayTime;

  handleInput(currentTime);
  updateMissionDisplay();
  if (!isAnimating) {
    checkRedZone();
    updateScoreDisplay(currentTime);

    if (currentTime - dropTimer > DROP_DELAY) {
      if (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
        currentY += gravityDirection;
        isOnGround = false;
      } else {
        if (!isOnGround) {
          isOnGround = true;
          placeTimer = currentTime;
        }

        if (currentTime - placeTimer >= PLACE_DELAY) {
          placePieceOnGrid(currentPiece, currentX, currentY);
          placeTimer = 0;

          if (!spawnNewPiece()) {
            return;
          }
        }
      }
      dropTimer = currentTime;
    }

    checkStageProgress();

    if (MODE_garbageLine) {
      updateGarbage();
    }
  }

  if (!gameRunning) return;

  drawHold();
  drawGrid();
  drawNext();

  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}