const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');

// 그리드
const next_COLS = 4;
const next_ROWS = 20;
const NEXT_BLOCK_SIZE = 28;
const nextGrid = Array.from({ length: next_ROWS }, () => Array(next_COLS).fill(0));

// 그리드 그리기
function drawNext() {
  showNextBlocks();
}
// 다음 블록을 가방에서 가져오기
function getNextPiece() {
  // 현재 가방이 비어있으면 새 가방을 만들어야 함
  if (currentBag.length === 0) {
    currentBag = nextBag.length > 0 ? nextBag : createNewBag();
    nextBag = createNewBag(); 
  }
  const pieceType = currentBag.shift();
  return blocks[pieceType];
  
}

function showNextBlocks() {
  // 캔버스 지우기 (이전 블록 안 남게)
  nextContext.fillStyle = "black"; // 원하는 배경색
  nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  // 🔥 currentBag + nextBag 합치기
  const combinedQueue = [...currentBag, ...nextBag];

  for (let i = 0; i < 5; i++) {
    const type = combinedQueue[i];   // 블록타입 문자열
    const piece = blocks[type];       // 블록 객체
    if (!piece || !piece.shape) continue;

    const shape = piece.shape;
    const h = shape.length;
    const w = shape[0].length;

    // 중앙 정렬
    const offsetX = Math.floor((next_COLS - w) / 2);
    // 블록마다 세로 간격 띄우기 
    const offsetY = i * 4;

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (shape[r][c] && (type == "I" || type == "O")) {//I혹은 O미노일떄
          drawBlock(nextContext, offsetX + c+0.2, offsetY + r,piece.color, false, block_size = NEXT_BLOCK_SIZE);
        }else if(shape[r][c]){
          drawBlock(nextContext, offsetX + c+0.7, offsetY + r,piece.color, false, block_size = NEXT_BLOCK_SIZE);
        }
      }
    }
  }
}

