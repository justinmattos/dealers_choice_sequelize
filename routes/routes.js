const {
  models: { Gamer, Game, GameCopy, Console, Friendship },
} = require('../data/data');
const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/gamers', async (req, res, next) => {
  try {
    res.send(await Gamer.findAll());
  } catch (err) {
    next(err);
  }
});

router.post('/gamers', async (req, res, next) => {
  try {
    const newGamer = new Gamer({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    await newGamer.save();
    res.status(201).send(newGamer.id);
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

router.post('/gamers/:id/addFriend', async (req, res, next) => {
  const { id } = req.params;
  const { friendId } = req.body;
  Promise.all([Gamer.findByPk(id), Gamer.findByPk(friendId)])
    .then(([gamer, friend]) => {
      return Friendship.linkFriends(gamer, friend);
    })
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => next(err));
});

router.post('/gamers/:id/addGame', async (req, res, next) => {
  const { id } = req.params;
  const { gameId, consoleId } = req.body;
  Promise.all([
    Gamer.findByPk(id),
    Game.findByPk(gameId),
    Console.findByPk(consoleId),
  ])
    .then(([gamer, game, console]) => {
      const newCopy = new GameCopy();
      newCopy.gamerId = gamer.id;
      newCopy.gameId = game.id;
      newCopy.consoleId = console.id;
      return newCopy.save();
    })
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => next(err));
});

router.get('/games', async (req, res, next) => {
  try {
    res.send(await Game.findAll({ include: { all: true } }));
  } catch (err) {
    next(err);
  }
});

router.post('/games', async (req, res, next) => {
  try {
    const newGame = await new Game({
      name: req.body.gameName,
      releaseDate: req.body.releaseDate,
    });
    await newGame.save();
    res.status(201).send(newGame.id);
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
