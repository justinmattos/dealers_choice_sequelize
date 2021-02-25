import { createAndAppend } from './helperFuncs';

const renderGamerList = ({ parent, gamers }) => {
  for (const gamer of gamers) {
    createAndAppend({
      parent,
      tag: 'li',
      innerHTML: gamer.username,
      id: gamer.id,
      classArray: ['gamer'],
    });
  }
};

const renderGameList = ({ parent, games }) => {
  for (const game of games) {
    const gameLi = createAndAppend({
      parent,
      tag: 'li',
      innerHTML: '',
      id: game.id,
      classArray: ['game'],
    });
    createAndAppend({
      parent: gameLi,
      tag: 'span',
      innerHTML: game.name,
    });
    createAndAppend({
      parent: gameLi,
      tag: 'span',
      innerHTML: `&nbsp;&ndash; ${game.game_copies.length} players`,
    });
  }
};

export { renderGameList, renderGamerList };
