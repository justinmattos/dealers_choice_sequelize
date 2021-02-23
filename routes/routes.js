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
        include: { all: true, nested: true },
      })
    );
  } catch (err) {
    next(err);
  }
});

router.get('/games', async (req, res, next) => {
  try {
    res.send(await Game.findAll({ include: { all: true } }));
  } catch (err) {
    next(err);
  }
});

router.get('/games/:id', async (req, res, next) => {
  try {
    res.send(
      await Game.findByPk(req.params.id, {
        include: { all: true, nested: true },
      })
    );
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
