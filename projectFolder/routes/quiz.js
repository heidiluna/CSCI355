const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const API_URL = 'https://opentdb.com/api.php';
const scoreFilePath = path.join(__dirname, '../score.json');

//reset score in score.json file
function resetScore() {
  return new Promise((resolve, reject) => {
    const initialScore = { score: 0 };
    fs.writeFile(scoreFilePath, JSON.stringify(initialScore), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

//fetch questions from API, async 
async function fetchQuestions(params) {
  //param oject contains amoiut, categot,difficulty,type
  try {
    const response = await axios.get(API_URL, { params });
    if (response.status === 200) {
      return response.data.results;
    } else {
      throw new Error('Failed to fetch questions');
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

//start a new quiz
router.post('/', async (req, res, next) => {
  const { numQuestions, category, difficulty, type } = req.body;

  try {
    // Reset score when starting a new quiz
    await resetScore();

    // Fetch questions
    const questions = await fetchQuestions({
      amount: numQuestions,
      category: category,
      difficulty: difficulty,
      type: type
    });

    if (!questions || questions.length === 0) {
      throw new Error('No questions fetched from API');
    }

    // reset
    const currentQuestionIndex = 0; 
    const score = 0; 

    res.render('quiz', {
      questions: questions,
      currentQuestionIndex: currentQuestionIndex,
      score: score,
      title: 'Quiz Page'
    });

  } catch (error) {
    console.error('Error starting new quiz:', error);
    res.status(500).render('error', { message: 'Error starting new quiz', error: error });
  }
});

module.exports = router;



