const express = require('express');
const path = require('path');
const app = express();
//to make sure css files work
app.use(express.static(path.join(__dirname, 'public')));
// set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// route setup
const indexRouter = require('./routes/index');
const quizRouter = require('./routes/quiz'); 
const answerRouter = require('./routes/answer'); 
// define routes
app.use('/', indexRouter); 
app.use('/quiz', quizRouter); 
app.use('/answer', answerRouter); 
// Error handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!', error: err });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



