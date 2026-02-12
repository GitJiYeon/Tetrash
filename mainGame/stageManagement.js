let stagesDisplay = [];
let stagesDisplayEnglish = [];
function stageMessageSetting(){
  stagesDisplay = [
    { id: 1, mission: `${LINES_FOR_STAGE2}줄을 삭제하세요!`},
    { id: 2, mission: `방해줄 ${GARBAGELINES_FOR_STAGE3}줄 삭제!`},
    { id: 3, mission: `새 블록으로 ${LINES_FOR_STAGE4}줄 삭제!`},
    { id: 4, mission: `4줄 삭제를 ${TETRIS_FOR_STAGE5}번 하세요!`},
    { id: 5, mission: `블록을 ${PLACED_FOR_STAGE6}개 놓으세요!`},
    { id: 6, mission: `T스핀으로 줄 ${TSPIN_FOR_STAGE7}번 !`},
    { id: 7, mission: `보스를 처치하세요!`},
  ];
  stagesDisplayEnglish = [
    { id: 1, mission: `Delete ${LINES_FOR_STAGE2} line`},
    { id: 2, mission: `Delete ${GARBAGELINES_FOR_STAGE3} lines of interference `},
    { id: 3, mission: `Delete ${LINES_FOR_STAGE4} lines into a new block`},
    { id: 4, mission: `Delete 4 lines ${TETRIS_FOR_STAGE5} times`},
    { id: 5, mission: `Place ${PLACED_FOR_STAGE6} block`},
    { id: 6, mission: `Delete line ${TSPIN_FOR_STAGE7} with T-spin!`},
    { id: 7, mission: `ruDefeat the Boss!`},
  ];
}