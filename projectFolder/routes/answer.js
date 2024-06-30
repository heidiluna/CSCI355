const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const scoreFilePath = path.join(__dirname, '../score.json');

// Function to read the current score from score.json
function readScore() {
  return new Promise((resolve, reject) => {
    fs.readFile(scoreFilePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      const scoreData = JSON.parse(data);
      resolve(scoreData.score);
    });
  });
}

// Function to update the score in score.json
function updateScore(newScore) {
  return new Promise((resolve, reject) => {
    const scoreData = { score: newScore };
    fs.writeFile(scoreFilePath, JSON.stringify(scoreData), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// POST handled here
router.post('/', async (req, res) => {
  const { answer, correct_answer, currentQuestionIndex, questions } = req.body;
  const parsedQuestions = JSON.parse(questions);
  // Check if answer selected is correct
  const isCorrect = (answer === correct_answer);
  // answer is correct, score updated
  try {
    let currentScore = await readScore();
    if (isCorrect) {
      currentScore++;
      await updateScore(currentScore); 
    }
    const nextQuestionIndex = parseInt(currentQuestionIndex) + 1;

    // to tell user if previous question was answered correctly or not
    const feedback = isCorrect ? 'Correct!' : 'Incorrect.';

    // goes to next question if there is a next question if not goes to score page
    if (nextQuestionIndex < parsedQuestions.length) {
      res.render('quiz', {
        questions: parsedQuestions,
        currentQuestionIndex: nextQuestionIndex,
        score: currentScore,
        feedback: feedback,
        title: 'Quiz Page'
      });
    } else {
      res.render('scorepage', {
        score: currentScore,
        totalQuestions: parsedQuestions.length,
        title: 'Quiz Results'
      });
    }
  } catch (error) {
    console.error('Error handling answer:', error);
    res.status(500).render('error', { message: 'Something went wrong!', error: error });
  }
});

module.exports = router;



