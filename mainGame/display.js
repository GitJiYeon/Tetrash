////////////////스코어
function updateScoreDisplay(gameTime) {
    document.getElementById('score_value').textContent = score;

    let ppsValue;
    if (isAnimating) {
        // 애니 중에는 이전 PPS 유지
        ppsValue = lastPPS.toFixed(2);
    } else {
        ppsValue = getPPS(gameTime);
        lastPPS = parseFloat(ppsValue);
    }

    document.getElementById('pps_value').textContent = ppsValue;
    document.getElementById('time_value').textContent = formatTime(gameTime);
    document.getElementById('tSpin_value').textContent = tSpinCount + "  " + clearedGarbageLine;
}

function formatTime(gameTime) {
    const totalSeconds = Math.floor(gameTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    return `${minutes}:${secondsStr}`;
}

function getPPS(gameTime) {
    const elapsedTime = gameTime / 1000; 
    if (elapsedTime === 0) return '0.00'; 
    return (placedPiece / elapsedTime).toFixed(2); 
}


/////////////////////미션
function updateMissionDisplay() {
    document.getElementById('stage_value').textContent = currentStage;
    document.getElementById('mission_value').textContent = stagesDisplay.find(stage => stage.id === currentStage)?.mission;
    document.getElementById('progress_value').textContent = makeProgressString();
}

function makeProgressString(){
    if(currentStage == 1){
        return `(${totalLinesCleared} / ${LINES_FOR_STAGE2})`;
    }else if (currentStage == 2){
        return `(${clearedGarbageLine} / ${GARBAGELINES_FOR_STAGE3})`;
    }else if (currentStage == 3){
        return `(${clearedLineWithTetrash} / ${LINES_FOR_STAGE4})`;
    }else if (currentStage == 4){
        return `(${clearedTetrisStage4} / ${TETRIS_FOR_STAGE5})`;
    }else if (currentStage == 5){
        return `(${placedBigPiece} / ${PLACED_FOR_STAGE6})`;
    }
    return '(0 / 0)';
}