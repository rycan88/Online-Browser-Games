// routes/leaderboardRoutes.js
const express = require("express");
const crossBattleLeaderboardRoutes = express.Router();
const connectDB = require("../db/db");

const CROSS_BATTLE_LEADERBOARD = "cross_battle_leaderboard";
async function saveScore(userId, nickname, score) {
  const db = await connectDB();

  const entry = {
    userId,
    nickname,
    score,
    createdAt: new Date(),
  };

  await db.collection(CROSS_BATTLE_LEADERBOARD).insertOne(entry);  
};


async function getTopScores() {
  const db = await connectDB();

  const topScores = await db
    .collection(CROSS_BATTLE_LEADERBOARD)
    .find()
    .sort({ score: -1 })
    .limit(10)
    .toArray();

  return topScores;
};

module.exports = {
    saveScore,
    getTopScores,
    crossBattleLeaderboardRoutes,
};