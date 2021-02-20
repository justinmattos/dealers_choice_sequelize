const {
  syncAndSeed,
  models: { Gamer, Game, GameCopy, Console },
} = require('./data/data');
const express = require('express');
const path = require('path');
const router = require('./routes/routes');

const app = express();

app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/dist', express.static(path.join(__dirname, './dist')));
app.use('/api', router);

app.get('/', async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (err) {
    next(err);
  }
});

const init = async () => {
  try {
    await syncAndSeed();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`App Running on PORT: ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

init();
