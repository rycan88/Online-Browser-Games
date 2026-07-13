// routes/leaderboardRoutes.js
const express = require("express");
const crossBattleLeaderboardRoutes = express.Router();
const connectDB = require("../db/db");
const { getPSTDate } = require("../serverUtils");

const CROSS_BATTLE_LEADERBOARD = process.env.NODE_ENV === 'production' ? "cross_battle_leaderboard" : "cross_battle_leaderboard_dev";

async function saveScore(userId, nickname, score, letters, validWords, invalidWords, unusedLetters, coords) {
  const db = await connectDB();

  const entry = {
    userId, 
    nickname,
    score,
    letters,
    validWords,
    invalidWords,
    unusedLetters,
    coords,
    datePST: getPSTDate(),
    createdAt: new Date(),
  };

  await db.collection(CROSS_BATTLE_LEADERBOARD).insertOne(entry);  
};


async function getTopScores() {
  const db = await connectDB();

  const today = getPSTDate();

  const topScores = await db
    .collection(CROSS_BATTLE_LEADERBOARD)
    .find({ datePST: today})
    .sort({ score: -1 })
    .limit(100)
    .toArray();

  return topScores;
};

async function getPlayerResults(userId) {
  const db = await connectDB();

  const today = getPSTDate();
  
  const myResults = await db
    .collection(CROSS_BATTLE_LEADERBOARD)
    .findOne({ datePST: today, userId: userId})

  return myResults;
}



module.exports = {
    saveScore,
    getTopScores,
    getPlayerResults,
    crossBattleLeaderboardRoutes,
};