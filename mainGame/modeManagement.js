let MODE_garbageLine = false;
let MODE_bigBlock = false;
let MODE_rythem = false;
let MODE_transformScreen = false;
let MODE_gravityReverse = false;
let MODE_multyBlock = false;
let MODE_tetrash = false;
let MODE_free = false;
let MODE_skillCheck = false;


let difficulty = 0; // 0 easy, 1 nomal, 2 hard

let clearedGarbageLine = 0; //클리어 한 방해줄 라인
let clearedLineWithTetrash = 0; //테트레쉬 블럭으로 클리어한 라인
let clearedTetrisStage4 = 0;
let clearedLinesStage4 = 0;
let clearedTetrisStage6 = 0;

let placedBigPiece = 0;
let tSpinStage7 = 0;
//DROP_DELAY = 1000
//gravityDirection = 1     -1 반전
let lastGarbageTime = Date.now();
let garbageInterval = 4000; // 4초마다 방해줄 추가

/////////////////////////////////////////조건

let LINES_FOR_STAGE2 = 20;        // 2스테이지로 넘어가기 위한 줄 수
let GARBAGELINES_FOR_STAGE3 = 10;   //3스테이지 조건(방해줄 10줄 삭제)
let LINES_FOR_STAGE4 = 7;        // 4스테이지로 넘어가기 위한 줄 수

let TETRIS_FOR_STAGE5 = 3;        // (NOMAL 이상)5스테이지로 넘어가기 위한 줄 수
let LINES_FOR_STAGE5 = 3;         // (EASY)5스테이지로 넘어가기 위한 줄 수

let PLACED_FOR_STAGE6 = 10;
let TSPIN_FOR_STAGE7 = 3;
let TETRIS_FOR_STAGE7 = 2; 

function difficultySetting(){
  if(difficulty == 0){ //easy
    //라운드 조건
    LINES_FOR_STAGE2 = 10;   //10
    GARBAGELINES_FOR_STAGE3 = 3; //3
    LINES_FOR_STAGE4 = 2; //2
    LINES_FOR_STAGE5 = 3; //3 (난이도 하향) 
    PLACED_FOR_STAGE6 = 9; //9
    TETRIS_FOR_STAGE7 = 1; //1 (난이도 하향)

    //세팅
    DROP_DELAY = 2000; //블록 떨어지는 속도 : 1.6초마다
    garbageInterval = 9000; //방해줄 속도 : 9초

    //보스
    bossHP = 20;
    currentBossHP = bossHP;
  }else if(difficulty == 1){ //nomal
    //라운드 조건
    LINES_FOR_STAGE2 = 20; 
    GARBAGELINES_FOR_STAGE3 = 5;
    LINES_FOR_STAGE4 = 4;
    TETRIS_FOR_STAGE5 = 1;
    PLACED_FOR_STAGE6 = 20;
    TSPIN_FOR_STAGE7 = 1;

    //세팅
    DROP_DELAY = 1100; //블록 떨어지는 속도 : 1.1초마다
    garbageInterval = 5000; //방해줄 속도 : 5초
    
    //보스
    bossHP = 35;
    currentBossHP = bossHP;
  }
  else if(difficulty == 2){ //hard

  }
}

let countLinesCleared = 0;

function checkStageProgress() {

  // 1스테이지 → 2스테이지 
  if (currentStage === 1 && totalLinesCleared >= LINES_FOR_STAGE2) {
    currentStage++;
    modeReset();
    MODE_garbageLine = true;  // 방해줄 모드 켜기
    //alert("2스테이지");
    boing(gameSpace);
  // 2스테이지 -> 3스테이지
  }else if (currentStage === 2 && clearedGarbageLine >= GARBAGELINES_FOR_STAGE3) {
    modeReset();
    MODE_tetrash = true;
    currentBag = [];
    nextBag = [];
    getNextPiece();      

    countLinesCleared = totalLinesCleared;
    currentStage++;
    //alert("3스테이지");
    boing(gameSpace);
  // 3스테이지 -> 4스테이지
  }else if (currentStage === 3 && clearedLineWithTetrash >= LINES_FOR_STAGE4) {
    currentStage++;    
    modeReset();
    currentBag = [];
    nextBag = [];  
    getNextPiece();
    MODE_gravityReverse = true;

    flipGrid();
    flipCurrentPiece();
    //alert("4스테이지");
    boing(gameSpace);
  // 4스테이지 -> 5스테이지(NOMAL)
  }else if (difficulty != 0 && currentStage === 4 && clearedTetrisStage4 >= TETRIS_FOR_STAGE5) {
    currentStage++;
    modeReset();
    
    flipGrid();
    clearGrid();
    flipCurrentPiece();
    MODE_bigBlock = true;
    currentBag = [];
    nextBag = [];  

    holdingPiece = '';
    isUsingHold = false;
    canPlaceHold = false;

    currentPiece = getNextPiece();
    //alert("5스테이지");
    boing(gameSpace);
    // 4스테이지 -> 5스테이지(EASY)    
    }else if(difficulty == 0 && currentStage === 4 && clearedLinesStage4 >= LINES_FOR_STAGE5){
    currentStage++;
    modeReset();
    
    flipGrid();
    clearGrid();
    flipCurrentPiece();
    MODE_bigBlock = true;
    currentBag = [];
    nextBag = [];  

    holdingPiece = '';
    isUsingHold = false;
    canPlaceHold = false;

    currentPiece = getNextPiece();
    //alert("5스테이지");
    boing(gameSpace);
  // 5스테이지 -> 6스테이지
  }else if (currentStage === 5 && placedBigPiece >= PLACED_FOR_STAGE6) {
    currentStage++;
    modeReset();
    currentBag = [];
    nextBag = [];  

    holdingPiece = '';
    isUsingHold = false;
    canPlaceHold = false;

    currentPiece = getNextPiece();
    updateGhostPiece();
    //alert("6스테이지");
    boing(gameSpace); 
  // 6스테이지 -> 7스테이지(NOMAL)
  }else if (currentStage === 6 && tSpinStage7 >= TSPIN_FOR_STAGE7 && difficulty != 0) {
    currentStage++;
    modeReset();
    if(difficulty == 0) garbageInterval = 10000;
    else if(difficulty == 1) garbageInterval = 7000;
    else if(difficulty == 2) garbageInterval = 4500;
    MODE_garbageLine = true
    //alert("7스테이지");
    startBossStage();
  // 6스테이지 -> 7스테이지(EASY)
  }else if (currentStage === 6 && clearedTetrisStage6 >= TETRIS_FOR_STAGE7 && difficulty == 0) {
    currentStage++;
    modeReset();
    if(difficulty == 0) garbageInterval = 10000;
    else if(difficulty == 1) garbageInterval = 7000;
    else if(difficulty == 2) garbageInterval = 4500;
    MODE_garbageLine = true
    //alert("7스테이지");
    startBossStage();
  }
}

function modeReset(){
  updateBackDisplay();
  MODE_garbageLine = false;
  MODE_bigBlock = false;
  MODE_rythem = false;
  MODE_transformScreen = false;
  MODE_gravityReverse = false;
  MODE_multyBlock = false;
  MODE_tetrash = false;
  MODE_free = false;
  MODE_skillCheck = false;
  
}
