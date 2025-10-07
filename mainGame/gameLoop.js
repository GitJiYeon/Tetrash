let paused = false; // 일시정지

document.addEventListener("visibilitychange", () => {
  paused = document.hidden;
  if (paused) lastFrameTime = 0; 
});

function gameLoop(now) {
  // 일시정지 후 복귀 시 초기화
  if (!lastFrameTime || paused) lastFrameTime = now;

  let dt = now - lastFrameTime;
  lastFrameTime = now;

  // dt 튐 방지
  if (dt > 100) dt = 100;

  // 애니메이션/일시정지 중 시간 누적X
  if (!isAnimating && gameRunning && !paused) {
      gameTime += dt;
  }

  handleInput(gameTime);
  updateMissionDisplay();

  if (!isAnimating && gameRunning) {
      checkRedZone();

      if (gameTime - dropTimer > DROP_DELAY) {
          if (canPlacePiece(currentPiece, currentX, currentY + gravityDirection)) {
              currentY += gravityDirection;
              isOnGround = false;
          } else {
              if (!isOnGround) {
                  isOnGround = true;
                  placeTimer = gameTime;
              }

              if (gameTime - placeTimer >= PLACE_DELAY) {
                  placePieceOnGrid(currentPiece, currentX, currentY);
                  placeTimer = 0;

                  if (!spawnNewPiece()) return;
              }
          }
          dropTimer = gameTime;
      }

      checkStageProgress();
      updateScoreDisplay(gameTime);

      if (MODE_garbageLine) updateGarbage();
  }

  drawHold();
  drawGrid();
  drawNext();

  if (gameRunning) requestAnimationFrame(gameLoop);
}
