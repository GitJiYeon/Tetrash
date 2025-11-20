// mainMenu/ranking.js
// 현재 보고 있는 랭킹 난이도 (게임 난이도와 별개)
let currentRankingDifficulty = "easy";

document.getElementById("rankingButton").addEventListener("click", showRanking);

// 랭킹 화면 표시
function showRanking() {
    const ranking = document.getElementById('ranking');
    if (ranking) {
        ranking.classList.remove('hidden');
        ranking.classList.add('active');
        
        // 현재 게임 난이도를 기본값으로 설정
        if (typeof difficulty !== 'undefined') {
            currentRankingDifficulty = (difficulty === 0 ? "easy" : "normal");
        }
        
        loadRanking();
    }
}

// 랭킹 화면 숨기기
function hideRanking() {
    const ranking = document.getElementById('ranking');
    if (ranking) {
        ranking.classList.remove('active');
        ranking.classList.add('hidden');
    }
}

// 랭킹 난이도 변경 (보기 전용)
function changeRankingDifficulty(newDifficulty) {
    // 0: easy, 1: normal
    currentRankingDifficulty = (newDifficulty === 0 ? "easy" : "normal");
    
    // 난이도 버튼 활성화 업데이트
    updateDifficultyButtons();
    
    // 랭킹 다시 로드
    loadRanking();
}

// 난이도 버튼 활성화 상태 업데이트
function updateDifficultyButtons() {
    const easyBtn = document.getElementById('rankingEasyBtn');
    const normalBtn = document.getElementById('rankingNormalBtn');
    
    if (easyBtn && normalBtn) {
        if (currentRankingDifficulty === "easy") {
            easyBtn.classList.add('active');
            normalBtn.classList.remove('active');
        } else {
            easyBtn.classList.remove('active');
            normalBtn.classList.add('active');
        }
    }
}

// 랭킹 데이터 로드
async function loadRanking() {
    try {
        const response = await fetch(`${API_URL}/getRanking/${currentRankingDifficulty}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const ranking = await response.json();
        
        // 난이도 버튼 업데이트
        updateDifficultyButtons();
        
        // 랭킹 UI 업데이트
        await displayRanking(ranking);
        
    } catch (error) {
        alert('랭킹을 불러오는데 실패했습니다.', error);
        console.error("불러오기 실패:", error)
    }
}

// 랭킹 UI 표시
async function displayRanking(ranking) {
    const rankingList = document.querySelector('.rankingList');
    const myRankingBox = document.querySelector('.myLanking');
    
    if (!rankingList || !myRankingBox) return;

    // 리스트 초기화
    rankingList.innerHTML = '';
    myRankingBox.innerHTML = ''; // 내 랭킹

    if (ranking.length === 0) {
        rankingList.innerHTML = '<div style="text-align: center; color: white; padding: 20px;">아직 기록이 없습니다.</div>';
        myRankingBox.innerHTML = '<div style="text-align: center; color: #bbb; padding-top: 10px;">내 기록도 없습니다.</div>';
        return;
    }

    // 현재 로그인된 사용자 UID
    const uid = (window.currentUser && window.currentUser.uid) ? window.currentUser.uid : null;

    // 랭킹 목록 표시
    for (let i = 0; i < ranking.length; i++) {
        const item = ranking[i];
        const score = item.score;

        // 유저 정보 로드
        let userInfo = {
            displayName: '익명',
            photoURL: './images/logo/google.png'
        };

        try {
            const userResponse = await fetch(`${API_URL}/getUserInfo/${item.uid}`);
            if (userResponse.ok) userInfo = await userResponse.json();
        } catch {}

        const minutes = Math.floor(score.time / 60);
        const seconds = score.time % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const ppsStr = score.pps ? score.pps.toFixed(2) : '0.00';

        // 리스트 항목 생성
        const rankItem = document.createElement('div');
        rankItem.className = 'rankItem';
        rankItem.innerHTML = `
            <span class="order">${i + 1}</span>
            <img src="${userInfo.photoURL || './images/logo/google.png'}" class="rankAvatar">
            <div class="rankInfo">
                <span class="rankName">${userInfo.displayName || '익명'}</span>
                <span class="rankStats">time: ${timeStr} | score: ${score.score.toLocaleString()} | pps: ${ppsStr}</span>
            </div>
        `;
        rankingList.appendChild(rankItem);
    }

    //내 랭킹 찾기
    if (!uid) {
        myRankingBox.innerHTML = `<div style="text-align:center; color:#bbb; padding:10px;">로그인하면 내 랭킹을 확인할 수 있습니다.</div>`;
        return;
    }

    const myIndex = ranking.findIndex(entry => entry.uid === uid);

    if (myIndex === -1) {
        myRankingBox.innerHTML = `<div style="text-align:center; color:#bbb; padding:10px;">이번 난이도에서 내 기록이 없습니다.</div>`;
        return;
    }

    // 내 유저 정보 가져외기
    const myScore = ranking[myIndex].score;
    const myUserResponse = await fetch(`${API_URL}/getUserInfo/${uid}`);
    const myInfo = myUserResponse.ok ? await myUserResponse.json() : { displayName: '익명', photoURL: './images/logo/google.png' };

    const minutes = Math.floor(myScore.time / 60);
    const seconds = myScore.time % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const ppsStr = myScore.pps ? myScore.pps.toFixed(2) : '0.00';

    // 내 랭킹 표시
    myRankingBox.innerHTML = `
        <div class="myLankingTitle">내 랭킹</div>
        <div class="myLankingContent">
            <span class="order">${myIndex + 1}</span>
            <img src="${myInfo.photoURL}" class="rankAvatar">
            <div class="rankInfo">
                <span class="rankName">${myInfo.displayName}</span>
                <span class="rankStats">time: ${timeStr} | score: ${myScore.score.toLocaleString()} | pps: ${ppsStr}</span>
            </div>
        </div>
    `;
}

// 전역 함수로 등록
window.showRanking = showRanking;
window.hideRanking = hideRanking;
window.loadRanking = loadRanking;
window.changeRankingDifficulty = changeRankingDifficulty;
