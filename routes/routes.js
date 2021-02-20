const {
  models: { Gamer, Game, GameCopy, Console, Friendship },
} = require('../data/data');
const router = require('express').Router();

router.get('/gamers', async (req, res, next) => {
  try {
    res.send(await Gamer.findAll());
  } catch (err) {
    next(err);
  }
});

router.get('/gamers/:id', async (req, res, next) => {
  try {
    res.send(
      await Gamer.findByPk(req.params.id, {
        include: [{ model: Gamer, as: 'friend1' }, { model: GameCopy }],
      })
    );
  } catch (err) {
    next(err);
  }
});

router.get('/games', async (req, res, next) => {
  try {
    res.send(await Game.findAll());
  } catch (err) {
    next(err);
  }
});

router.get('/consoles', async (req, res, next) => {
  try {
    res.send(await Console.findAll());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
