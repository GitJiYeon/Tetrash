
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());

// 서버 상태 확인
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

// Firestore 연결 테스트
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

// 점수 저장 API
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

// 점수 조회 API
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

// 특정 유저의 점수만 조회
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

// 랭킹 조회 
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

// 유저 정보 조회
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("서버 열림");
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프론트 폴더가 루트
app.use(express.static(path.join(__dirname, "../")));

// 모든 경로를 index.html로 리다이렉트
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../game.html"));
});
