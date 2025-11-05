// saveScore.js
const API_URL = 'https://calm-florencia-tetrash-6578a127.koyeb.app';
async function saveScore(score) {
    const auth = window.auth;
    
    if (!auth) {
        console.error("Firebase auth가 초기화되지 않았습니다.");
        return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        console.log("로그인 필요");
        alert("로그인이 필요합니다.");
        return;
    }

    const uid = user.uid;
    
    try {
        console.log("서버에 점수 저장 시도:", score);
        
        // ✅ 난이도가 문자열인지 확인
        const difficulty = typeof score.difficulty === 'string' 
            ? score.difficulty 
            : (score.difficulty === 0 ? "easy" : "normal");
        
        console.log("난이도:", difficulty);
        
        // 기존 점수 데이터 가져오기
        const res = await fetch(`${API_URL}/getScores`);
        
        if (!res.ok) {
            throw new Error(`서버 응답 오류: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
            console.error("서버 응답이 배열이 아닙니다:", data);
            throw new Error("잘못된 서버 응답");
        }
        
        console.log("기존 점수 데이터:", data);

        // ✅ 해당 유저의 해당 난이도 최고 기록 찾기
        const userScoresForDifficulty = data.filter(s => {
            const sDifficulty = typeof s.score?.difficulty === 'string' 
                ? s.score.difficulty 
                : (s.score?.difficulty === 0 ? "easy" : "normal");
            
            return s.uid === uid && sDifficulty === difficulty;
        });

        console.log(`${uid}의 ${difficulty} 기록:`, userScoresForDifficulty);

        // ✅ 최고 기록 찾기 (가장 빠른 시간)
        let isBestRecord = false;
        
        if (userScoresForDifficulty.length === 0) {
            // 첫 기록
            isBestRecord = true;
            console.log("첫 기록입니다!");
        } else {
            // 기존 기록 중 가장 빠른 시간
            const bestTime = Math.min(...userScoresForDifficulty.map(s => s.score.time));
            
            if (score.time < bestTime) {
                isBestRecord = true;
                console.log(`새로운 최고기록! (기존: ${bestTime}초, 신기록: ${score.time}초)`);
            } else {
                console.log(`최고기록 아님 (기존: ${bestTime}초, 현재: ${score.time}초)`);
            }
        }

        if (isBestRecord) {
            // ✅ score 객체에 difficulty를 문자열로 저장
            const scoreToSave = {
                ...score,
                difficulty: difficulty  // 문자열로 통일
            };

            // 서버에 저장
            const saveRes = await fetch(`${API_URL}/saveScore`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    uid, 
                    score: scoreToSave, 
                    timestamp: new Date().toISOString() 
                }),
            });

            if (!saveRes.ok) {
                throw new Error(`저장 실패: ${saveRes.status}`);
            }

            const result = await saveRes.json();
            console.log("저장 결과:", result);
            alert(`🎉 최고 기록 저장 완료!\n시간: ${score.time}초`);
        } else {
            alert("최고 기록이 아닙니다.");
        }

    } catch (err) {
        console.error("서버 통신 실패:", err);
        alert("점수 저장 실패: " + err.message);
    }
}

window.saveScore = saveScore;
console.log('✅ saveScore 함수 등록 완료');