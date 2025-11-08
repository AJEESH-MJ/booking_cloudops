import app from './app.js';
// import './config/database.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// console.log('MONGO_URI=', process.env.MONGO_URI);
