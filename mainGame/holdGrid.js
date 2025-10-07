const holdCanvas = document.getElementById('hold');
const holdContext = holdCanvas.getContext('2d');

// 그리드
const hold_COLS = 4;
const hold_ROWS = 4;

const holdGrid = Array.from({ length: hold_ROWS }, () => Array(hold_COLS).fill(0));

let isUsingHold = false;
let canPlaceHold = false;
let holdingPiece = '';

// 그리드 그리기
function drawHold() {
  // 캔버스 지우기 (이전 블록 안 남게)
  holdContext.fillStyle = "black"; // 원하는 배경색
  holdContext.fillRect(0, 0, holdCanvas.width, holdCanvas.height);
  if(holdingPiece !== ''){
    const shape = holdingPiece.shape;
    const type = holdingPiece.type;
    const h = shape.length;
    const w = shape[0].length;

    let color = holdingPiece.color;
    if(!canPlaceHold){
      color = '#4a4a4a';
    }

    // 중앙 정렬
    const offsetX = Math.floor((hold_COLS - w) / 2);

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if(shape[r][c] && type == 'I'){
          drawBlock(holdContext, offsetX + c+0.2, 0.6 + r,color, false, block_size = NEXT_BLOCK_SIZE);
        }else if(shape[r][c] && type == 'O'){
          drawBlock(holdContext, offsetX + c+0.2, 1.1 + r,color, false, block_size = NEXT_BLOCK_SIZE);
        }else if(shape[r][c]){
          drawBlock(holdContext, offsetX + c+0.7, 1.1 + r,color, false, block_size = NEXT_BLOCK_SIZE);
        }
          
      }
    }
  }

  
}



function usingHold(){
  if(!isUsingHold){
    holdingPiece = clonePiece(blocks[currentPiece.type]); //기존 블럭 복사 (할당문제 방지)
    isUsingHold = true;
    canPlaceHold = false;
    spawnNewPiece();
  }else if(isUsingHold && canPlaceHold){
    const tempType = currentPiece.type;

    currentPiece = clonePiece(blocks[holdingPiece.type]);
    holdingPiece = clonePiece(blocks[tempType]);

    canPlaceHold = false;
    currentX = Math.floor(COLS / 2) -2; // 중앙에 배치
    if(gravityDirection == 1){ //중력 아래
      currentY = 0; // 맨 위에서 시작
    }else{ //중력 위
      currentY = 20; // 맨 위에서 시작
    } 
    placeTimer = 0; //바닥 닿은 시간 초기화
    rotationState = 0;
    updateGhostPiece();
  }
}

function clonePiece(piece) {
  return {
    type: piece.type,
    shape: piece.shape.map(row => [...row]),
    color: piece.color
  };
}
