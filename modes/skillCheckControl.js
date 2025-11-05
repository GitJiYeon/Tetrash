function startSkillCheck() {
  gameRunning = true;
  MODE_skillCheck = true;
  currentStage = 100;
  currentBag = createNewBag();
  nextBag = createNewBag();
  
  if (spawnNewPiece()) {
    startTime = performance.now();
    gamePlayTime = 0;
    dropTimer = 0;
    placeTimer = 0;
    requestAnimationFrame(skillCheckLoop);
  }
  playBGM(blockDanceBGM, bgmVolume);
}

function retrySkillCheck(){
    initGame();
    MODE_skillCheck = true;
    currentStage = 100;
    hideRetryPopup();
    showCountdownAndStart(3, 'skillCheck'); // 3초 카운트
}