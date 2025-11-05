function startFree() {
  gameRunning = true;
  
  currentBag = createNewBag();
  nextBag = createNewBag();
  
  if (spawnNewPiece()) {
    startTime = performance.now();
    gamePlayTime = 0;
    dropTimer = 0;
    placeTimer = 0;
    requestAnimationFrame(freeLoop);
  }
  playBGM(blockDanceBGM, bgmVolume);
}