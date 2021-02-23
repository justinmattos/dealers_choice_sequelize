const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const dataB = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize',
  { logging: false }
);

class Gamer extends Model {}
Gamer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    firstName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  { sequelize: dataB, modelName: 'gamers' }
);

class Game extends Model {}
Game.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize: dataB, modelName: 'games' }
);

class Console extends Model {}
Console.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  },
  { sequelize: dataB, modelName: 'consoles' }
);

class GameCopy extends Model {
  static async addGame({ gamer, game, console }) {
    const newGameCopy = new GameCopy();
    [newGameCopy.gamerId, newGameCopy.gameId, newGameCopy.consoleId] = [
      gamer.id,
      game.id,
      console.id,
    ];
    await newGameCopy.save();
  }
}
GameCopy.init({}, { sequelize: dataB, modelName: 'game_copies' });

GameCopy.belongsTo(Gamer);
GameCopy.belongsTo(Game);
GameCopy.belongsTo(Console);
Gamer.hasMany(GameCopy);
Game.hasMany(GameCopy);
Console.hasMany(GameCopy);

class Friendship extends Model {
  static async linkFriends(friendA, friendB) {
    const [friendship1, friendship2] = new Array(2)
      .fill('')
      .map((elem) => new Friendship());
    friendship1.friend1 = friendA.id;
    friendship1.friend2 = friendB.id;
    friendship2.friend1 = friendB.id;
    friendship2.friend2 = friendA.id;
    await Promise.all([friendship1.save(), friendship2.save()]);
  }
}
Friendship.init({}, { sequelize: dataB, modelName: 'friendships' });

Friendship.belongsTo(Gamer, { as: 'friend1' });
Friendship.belongsTo(Gamer, { as: 'friend2' });
Gamer.belongsToMany(Gamer, {
  as: 'friend2',
  foreignKey: 'friend1',
  through: Friendship,
});
Gamer.belongsToMany(Gamer, {
  as: 'friend1',
  foreignKey: 'friend2',
  through: Friendship,
});

Console.belongsToMany(Gamer, { through: 'gamer_console' });
Gamer.belongsToMany(Console, { through: 'gamer_console' });

const gamers = [
  {
    username: 'composerBeforeSunset',
    firstName: 'Timothy',
    lastName: 'Lebowski',
  },
  {
    username: 'AlexPlaysGames',
    firstName: 'Alexandra',
    lastName: 'Jahoda',
  },
  {
    username: 'RandomGamerGirl',
    firstName: 'Marcella',
    lastName: 'Stojanovski',
  },
  {
    username: 'RandomGamerGuy',
    firstName: 'Lex',
    lastName: 'Stojanovski',
  },
  {
    username: 'DefaultUsername',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    username: 'Pl4y3r0n3',
    firstName: 'NotMy',
    lastName: 'RealName',
  },
];

const games = [
  {
    name: 'Breath of the Wild',
    releaseDate: 'March 3, 2017',
  },
  {
    name: 'Hades',
    releaseDate: 'December 6, 2018',
  },
  {
    name: 'League of Legends',
    releaseDate: 'October 27, 2009',
  },
  {
    name: 'AC: New Horizons',
    releaseDate: 'March 20, 2020',
  },
  {
    name: 'Rocket League',
    releaseDate: 'July 7, 2015',
  },
];

const consoles = [
  { name: 'Playstation 5' },
  { name: 'Nintendo Switch' },
  { name: 'PC' },
];

const syncAndSeed = async () => {
  try {
    await dataB.sync({ force: true });

    const [
      composerBeforeSunset,
      alexPlaysGames,
      randomGamerGirl,
      randomGamerGuy,
      defaultUsername,
      pl4y3r0n3,
    ] = gamers.map(
      ({ username, firstName, lastName }) =>
        new Gamer({
          username: username,
          firstName: firstName,
          lastName: lastName,
        })
    );
    await Promise.all([
      composerBeforeSunset.save(),
      alexPlaysGames.save(),
      randomGamerGirl.save(),
      randomGamerGuy.save(),
      defaultUsername.save(),
      pl4y3r0n3.save(),
    ]);
    await Friendship.linkFriends(randomGamerGirl, randomGamerGuy);
    await Friendship.linkFriends(defaultUsername, randomGamerGirl);
    await Friendship.linkFriends(defaultUsername, randomGamerGuy);
    await Friendship.linkFriends(defaultUsername, alexPlaysGames);
    await Friendship.linkFriends(pl4y3r0n3, randomGamerGirl);
    await Friendship.linkFriends(pl4y3r0n3, randomGamerGuy);

    const [
      breathOfTheWild,
      hades,
      leagueOfLegends,
      animalCrossingNH,
      rocketLeague,
    ] = games.map(
      ({ name, releaseDate }) =>
        new Game({ name: name, releaseDate: releaseDate })
    );
    await Promise.all([
      breathOfTheWild.save(),
      hades.save(),
      leagueOfLegends.save(),
      animalCrossingNH.save(),
      rocketLeague.save(),
    ]);

    const [playstation5, nintendoSwitch, pc] = consoles.map(
      ({ name }) => new Console({ name: name })
    );
    await Promise.all([playstation5.save(), nintendoSwitch.save(), pc.save()]);

    const gameCopies = [
      {
        gamer: composerBeforeSunset,
        game: breathOfTheWild,
        console: nintendoSwitch,
      },
      {
        gamer: alexPlaysGames,
        game: breathOfTheWild,
        console: nintendoSwitch,
      },
      {
        gamer: randomGamerGirl,
        game: breathOfTheWild,
        console: nintendoSwitch,
      },
      {
        gamer: randomGamerGuy,
        game: breathOfTheWild,
        console: nintendoSwitch,
      },
      {
        gamer: defaultUsername,
        game: breathOfTheWild,
        console: nintendoSwitch,
      },
      {
        gamer: alexPlaysGames,
        game: hades,
        console: nintendoSwitch,
      },
      {
        gamer: alexPlaysGames,
        game: animalCrossingNH,
        console: nintendoSwitch,
      },
      {
        gamer: randomGamerGirl,
        game: leagueOfLegends,
        console: pc,
      },
      {
        gamer: randomGamerGuy,
        game: leagueOfLegends,
        console: pc,
      },
      {
        gamer: randomGamerGirl,
        game: rocketLeague,
        console: pc,
      },
      {
        gamer: randomGamerGuy,
        game: rocketLeague,
        console: pc,
      },
      {
        gamer: pl4y3r0n3,
        game: leagueOfLegends,
        console: pc,
      },
      {
        gamer: defaultUsername,
        game: rocketLeague,
        console: playstation5,
      },
      {
        gamer: defaultUsername,
        game: animalCrossingNH,
        console: nintendoSwitch,
      },
    ];
    await Promise.all(
      gameCopies.map(({ gamer, game, console }) =>
        GameCopy.addGame({ gamer: gamer, game: game, console: console })
      )
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  syncAndSeed,
  models: { Gamer, Game, Friendship, GameCopy, Console },
};
