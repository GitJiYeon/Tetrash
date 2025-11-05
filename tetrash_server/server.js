import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from 'fs';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const serviceAccount = JSON.parse(
  readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());

app.get("/test", async (req, res) => {
  try {
    const testRef = await db.collection("_test").add({
      message: "connection test",
      timestamp: new Date().toISOString()
    });
    await testRef.delete();
    res.json({ status: "OK", message: "Firestore 연결 성공" });
  } catch (error) {
    res.status(500).json({ 
      status: "ERROR", 
      message: "Firestore 연결 실패",
      details: error.message 
    });
  }
});

app.post("/saveScore", async (req, res) => {
  try {
    const { uid, score, timestamp } = req.body;
    if (!uid || !score) {
      return res.status(400).json({ error: "uid와 score는 필수입니다." });
    }
    const docRef = await db.collection("scores").add({
      uid,
      score,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("점수 저장 완료:", docRef.id);
    res.status(200).json({ message: "점수 저장 완료", id: docRef.id });
  } catch (error) {
    console.error("점수 저장 실패:", error);
    res.status(500).json({ error: "서버 오류", details: error.message });
  }
});

app.get("/getScores", async (req, res) => {
  try {
    const snapshot = await db.collection("scores").get();
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    const scores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(scores);
  } catch (error) {
    console.error("점수 불러오기 실패:", error);
    res.status(500).json({ error: "서버 오류", details: error.message });
  }
});

app.get("/getScores/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const snapshot = await db.collection("scores").where("uid", "==", uid).get();
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    const scores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(scores);
  } catch (error) {
    console.error("점수 불러오기 실패:", error);
    res.status(500).json({ error: "서버 오류", details: error.message });
  }
});

app.get("/getRanking/:difficulty", async (req, res) => {
  try {
    const { difficulty } = req.params;
    
    const snapshot = await db.collection("scores").get();
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const allScores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    const userBestScores = {};
    allScores.forEach(item => {
      const scoreDifficulty = item.score?.difficulty || "easy";
      if (scoreDifficulty === difficulty) {
        const uid = item.uid;
        if (!userBestScores[uid] || item.score.time < userBestScores[uid].score.time) {
          userBestScores[uid] = item;
        }
      }
    });

    const ranking = Object.values(userBestScores)
      .sort((a, b) => a.score.time - b.score.time)
      .slice(0, 10);

    res.status(200).json(ranking);
  } catch (error) {
    res.status(500).json({ error: "서버 오류", details: error.message });
  }
});

app.get("/getUserInfo/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const userRecord = await admin.auth().getUser(uid);
    res.status(200).json({
      uid: userRecord.uid,
      displayName: userRecord.displayName || "익명",
      photoURL: userRecord.photoURL || null,
      email: userRecord.email
    });
  } catch (error) {
    res.status(200).json({ 
      uid: req.params.uid,
      displayName: "알 수 없음",
      photoURL: null
    });
  }
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../")));

// 서버 시작 (맨 마지막!)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});