let stagesDisplay = {};
function stageMessageSetting(){
  stagesDisplay = [
    { id: 1, mission: `${LINES_FOR_STAGE2}줄을 삭제하세요!`},
    { id: 2, mission: `방해줄을 ${GARBAGELINES_FOR_STAGE3}줄 삭제하세요!`},
    { id: 3, mission: `새 블록으로 ${LINES_FOR_STAGE4}줄 삭제!`},
    { id: 4, mission: `테트리스를 ${TETRIS_FOR_STAGE5}번 하세요!`},
    { id: 5, mission: `블록을 ${PLACED_FOR_STAGE6}개 놓으세요!`},
  ];
}