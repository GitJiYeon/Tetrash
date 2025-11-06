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
        currentPps = parseFloat(ppsValue);
    }

    document.getElementById('pps_value').textContent = ppsValue;
    document.getElementById('time_value').textContent = formatTime(gameTime);
    document.getElementById('tSpin_value').textContent = tSpinCount;
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


function updateBackDisplay(){
    if(currentStage == 1){
        document.getElementById('bg-img').src = "./images/stageBackground/sMino.gif";
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage3.png";
    }else if(currentStage == 2){
        document.getElementById('bg-img').src = "./images/stageBackground/oMino.gif";
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage3.png";
    }else if(currentStage == 3){
        document.getElementById('bg-img').src = "./images/stageBackground/pMino.gif";
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage4.png";
    }else if(currentStage == 4){
        document.getElementById('bg-img').src = "./images/stageBackground/zMino.gif";
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage4.png";
    }else if(currentStage == 5){
        document.getElementById('bg-img').src = "./images/stageBackground/zMino.gif";
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage4.png";
    }else if(currentStage == 6){
        document.getElementById('bg-img').src = "./images/stageBackground/lMino.gif";
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage5.png";
    }else if(currentStage == 7){
        document.getElementById('bg-img').src = "./images/stageBackground/tMino.gif";
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage5.png";
    }else{
        document.getElementById("backgroundImage").src = "./images/stageBackground/backStage6.png";
    }
}
/////////////////////미션
function updateMissionDisplay() {
    if(MODE_free){
        document.getElementById('stage_value').textContent = "F";
        document.getElementById('mission_value').textContent = "자유롭게 테스트 하세요!"
        document.getElementById('progress_value').textContent = "free";
    }else if(MODE_skillCheck){
        document.getElementById('stage_value').textContent = "N";
        document.getElementById('mission_value').textContent = "30줄을 클리어하세요!"
        document.getElementById('progress_value').textContent = makeProgressString();
    }else if(!MODE_free && !MODE_skillCheck){
        document.getElementById('stage_value').textContent = currentStage;
        document.getElementById('mission_value').textContent = stagesDisplay.find(stage => stage.id === currentStage)?.mission;
        if(currentStage == 4 && difficulty == 0){//EASY모드
            document.getElementById('mission_value').textContent = `${LINES_FOR_STAGE5}줄을 삭제!`;
        } 
        if(currentStage == 6 && difficulty == 0){//EASY모드
            document.getElementById('mission_value').textContent = `4줄 삭제 ${TETRIS_FOR_STAGE7}번! `;
        }
        document.getElementById('progress_value').textContent = makeProgressString();
    }
    
}

function makeProgressString(){
    if(MODE_skillCheck){
        return `(${totalLinesCleared} / 30)`;
    }
    if(currentStage == 1){
        return `(${totalLinesCleared} / ${LINES_FOR_STAGE2})`;
    }else if (currentStage == 2){
        return `(${clearedGarbageLine} / ${GARBAGELINES_FOR_STAGE3})`;
    }else if (currentStage == 3){
        return `(${clearedLineWithTetrash} / ${LINES_FOR_STAGE4})`;
    }else if (difficulty != 0 && currentStage == 4){ //NOMAL
        return `(${clearedTetrisStage4} / ${TETRIS_FOR_STAGE5})`;
    }else if(difficulty == 0 && currentStage == 4){ //EASY
        return `(${clearedLinesStage4} / ${LINES_FOR_STAGE5})`;
    }else if (currentStage == 5){
        return `(${placedBigPiece} / ${PLACED_FOR_STAGE6})`;
    }else if (difficulty != 0 && currentStage == 6){ //NOMAL
        return `(${tSpinStage7} / ${TSPIN_FOR_STAGE7})`;
    }else if (difficulty == 0 && currentStage == 6){ //EASY
        return `(${clearedTetrisStage6} / ${TETRIS_FOR_STAGE7})`;
    }else if(currentStage == 7){
        return `HP(${currentBossHP}/${bossHP})`;
    }
    return '(0 / 0)';
}

function showDifficulty(){
    if(difficulty == 0){
        document.getElementById('difficulty_value').textContent = 'EASY MODE';
    }else if(difficulty == 1){
        document.getElementById('difficulty_value').textContent = 'NOMAL MODE';
    }else if(difficulty == 2){
        document.getElementById('difficulty_value').textContent = 'HARD MODE';
    }else if(difficulty == 100){//스킬쳌
        document.getElementById('difficulty_value').textContent = 'SKILL CHECK!';
        document.getElementById('bg-img').style.display = 'none';
    }
     
}