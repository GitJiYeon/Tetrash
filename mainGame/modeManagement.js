let MODE_garbageLine = false;
let MODE_bigBlock = false;
let MODE_rythem = false;
let MODE_transformScreen = false;
let MODE_gravityReverse = false;
let MODE_multyBlock = false;
let MODE_tetrash = false;

let difficulty = 0; // 0 easy, 1 nomal, 2 hard

let clearedGarbageLine = 0; //클리어 한 방해줄 라인
let clearedLineWithTetrash = 0; //테트레쉬 블럭으로 클리어한 라인
let clearedTetrisStage4 = 0;
let placedBigPiece = 0;
//DROP_DELAY = 1000
//gravityDirection = 1     -1 반전
let lastGarbageTime = Date.now();
let garbageInterval = 4000; // 4초마다 방해줄 추가

/////////////////////////////////////////조건

let LINES_FOR_STAGE2 = 20;        // 2스테이지로 넘어가기 위한 줄 수
let GARBAGELINES_FOR_STAGE3 = 10;   //3스테이지 조건(방해줄 10줄 삭제)
let LINES_FOR_STAGE4 = 7;        // 4스테이지로 넘어가기 위한 줄 수
let TETRIS_FOR_STAGE5 = 3;        // 4스테이지로 넘어가기 위한 줄 수
let PLACED_FOR_STAGE6 = 10;

function difficultySetting(){
  if(difficulty == 0){ //easy
    //라운드 조건
    LINES_FOR_STAGE2 = 0;   //15
    GARBAGELINES_FOR_STAGE3 = 0; //7
    LINES_FOR_STAGE4 = 0; //4
    TETRIS_FOR_STAGE5 = 0; //1
    PLACED_FOR_STAGE6 = 5;

    //세팅
    DROP_DELAY = 1600; //블록 떨어지는 속도 : 1.6초마다
    garbageInterval = 6800; //방해줄 속도 : 6.5초

  }else if(difficulty == 1){ //nomal
    //라운드 조건
    LINES_FOR_STAGE2 = 25;  
    GARBAGELINES_FOR_STAGE3 = 15;
    LINES_FOR_STAGE4 = 8;
    TETRIS_FOR_STAGE5 = 3;
    PLACED_FOR_STAGE6 = 12;

    //세팅
    DROP_DELAY = 1000; //블록 떨어지는 속도 : 1초마다
    garbageInterval = 4000; //방해줄 속도 : 4.5초
    
  }
  else if(difficulty == 2){ //hard


  }
  
}

let countLinesCleared = 0;

function checkStageProgress() {
  const linesClearedThisTurn = checkLineFilled();
  totalLinesCleared += linesClearedThisTurn;

  // 1스테이지 → 2스테이지 
  if (currentStage === 1 && totalLinesCleared >= LINES_FOR_STAGE2) {
    currentStage++;
    modeReset();
    MODE_garbageLine = true;  // 방해줄 모드 켜기
    alert("2스테이지");

  // 2스테이지 -> 3스테이지
  }else if (currentStage === 2 && clearedGarbageLine >= GARBAGELINES_FOR_STAGE3) {
    modeReset();
    MODE_tetrash = true;
    currentBag = [];
    nextBag = [];
    getNextPiece();      

    countLinesCleared = totalLinesCleared;
    currentStage++;
    alert("3스테이지");
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
    alert("4스테이지");
  // 4스테이지 -> 5스테이지
  }else if (currentStage === 4 && clearedTetrisStage4 >= TETRIS_FOR_STAGE5) {
    currentStage++;
    modeReset();
    MODE_bigBlock = true;
    currentBag = [];
    nextBag = [];  
    holdingPiece = '';

    flipGrid();
    clearGrid();
    flipCurrentPiece();
    currentPiece = getNextPiece();

    alert("5스테이지");
  }
  else if (currentStage === 5 && placedBigPiece >= PLACED_FOR_STAGE6) {
    currentStage++;
    modeReset();
    currentBag = [];
    nextBag = [];  
    holdingPiece = '';

    alert("6스테이지");
  }
}

function modeReset(){
  MODE_garbageLine = false;
  MODE_bigBlock = false;
  MODE_rythem = false;
  MODE_transformScreen = false;
  MODE_gravityReverse = false;
  MODE_multyBlock = false;
  MODE_tetrash = false;
}
