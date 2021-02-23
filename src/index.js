import axios from 'axios';

const content = document.querySelector('#content'),
  nav = document.querySelector('nav'),
  pageTitle = document.querySelector('h1'),
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
let gamerList, gamesList;

const createAndAppend = ({ parent, tag, innerHTML, id, classArray }) => {
  //helper func creates a DOM node, adds info and appends as child to parent node
  const newEl = document.createElement(tag);
  if (innerHTML) newEl.innerHTML = innerHTML;
  if (id) newEl.id = id;
  if (classArray) {
    for (const className of classArray) {
      newEl.classList.toggle(className);
    }
  }
  parent.appendChild(newEl);
  return newEl;
};

const alphaSortByUsername = (a, b) => {
  //callback function for sorting lists alphabetically by username, ignoring case
  if (a.username.toLowerCase() > b.username.toLowerCase()) return 1;
  else if (a.username.toLowerCase() < b.username.toLowerCase()) return -1;
  else return 0;
};

const renderGamers = (gamers) => {
  for (const gamer of gamers) {
    createAndAppend({
      parent: gamerList,
      tag: 'li',
      innerHTML: gamer.username,
      id: gamer.id,
      classArray: ['gamer'],
    });
  }
};

const renderGameList = (games) => {
  for (const game of games) {
    const gameLi = createAndAppend({
      parent: gamesList,
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

const renderContentDivsAndHeaders = (pageType) => {
  //helper func that creates two main divs and their h2 titles, returning those divs in array
  let headerA, headerB;
  switch (pageType) {
    case 'main':
      headerA = 'Cool Gamers';
      headerB = 'Games They Play';
      break;
    case 'gamer':
      headerA = 'Gamer Details';
      headerB = 'Games They Play';
      break;
    case 'game':
      headerA = 'Game Details';
      headerB = 'Played By';
      break;
  }
  const [divA, divB] = new Array(2)
    .fill('')
    .map(() => createAndAppend({ parent: content, tag: 'div' }));
  [
    { parent: divA, innerHTML: headerA },
    { parent: divB, innerHTML: headerB },
  ].map(({ parent, innerHTML }) =>
    createAndAppend({ parent: parent, tag: 'h2', innerHTML: innerHTML })
  );
  return [divA, divB];
};

const renderMain = async () => {
  content.innerHTML = '';
  nav.innerHTML = '';
  pageTitle.innerHTML = 'Welcome Gamers!';
  const [gamerDiv, gamesDiv] = renderContentDivsAndHeaders('main');
  [gamerList, gamesList] = [
    { parent: gamerDiv, classArray: ['center-list'] },
    { parent: gamesDiv, classArray: ['span-list'] },
  ].map(({ parent, classArray }) =>
    createAndAppend({
      parent: parent,
      tag: 'ul',
      classArray: classArray,
    })
  );
  try {
    const gamers = (await axios.get('/api/gamers')).data;
    gamers.sort(alphaSortByUsername);
    renderGamers(gamers);
    const games = (await axios.get('/api/games')).data;
    games.sort((a, b) => b.game_copies.length - a.game_copies.length);
    renderGameList(games);
  } catch (err) {
    console.log(err);
  }
};

const renderUserDetail = async (gamerId) => {
  content.innerHTML = '';
  nav.innerHTML = 'BACK HOME';
  try {
    const gamer = (await axios.get(`/api/gamers/${gamerId}`)).data;
    pageTitle.innerHTML = `${gamer.username}`;
    const [userDiv, gameDiv] = renderContentDivsAndHeaders('gamer');
    const userUl = createAndAppend({
      parent: userDiv,
      tag: 'ul',
      classArray: ['center-list'],
    });
    createAndAppend({
      parent: userUl,
      tag: 'li',
      innerHTML: `Real Name: ${gamer.firstName} ${gamer.lastName}`,
    });
    if (gamer.friend2.length) {
      const friendsLi = createAndAppend({
        parent: userUl,
        tag: 'li',
        classArray: ['friend-list'],
      });
      createAndAppend({
        parent: friendsLi,
        tag: 'label',
        innerHTML: 'Friends:',
      });
      const friendUl = createAndAppend({
        parent: friendsLi,
        tag: 'ul',
      });
      const friends = gamer.friend2;
      friends.sort(alphaSortByUsername);
      for (const friend of friends) {
        const friendLi = createAndAppend({
          parent: friendUl,
          tag: 'li',
          innerHTML: friend.username,
          id: friend.id,
          classArray: ['gamer'],
        });
      }
    }
    const gameUl = createAndAppend({
      parent: gameDiv,
      tag: 'ul',
      classArray: ['span-list'],
    });
    for (const copy of gamer.game_copies) {
      const gameLi = createAndAppend({
        parent: gameUl,
        tag: 'li',
        id: copy.gameId,
        classArray: ['game'],
      });
      createAndAppend({
        parent: gameLi,
        tag: 'span',
        innerHTML: copy.game.name,
      });
      createAndAppend({
        parent: gameLi,
        tag: 'span',
        innerHTML: `&nbsp;&ndash; ${copy.console.name}`,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const renderGameDetail = async (gameId) => {
  content.innerHTML = '';
  nav.innerHTML = 'BACK HOME';
  try {
    const game = (await axios.get(`/api/games/${gameId}`)).data;
    const releaseDate = new Date(game.releaseDate);
    pageTitle.innerHTML = game.name;
    const [detailDiv, gamerDiv] = renderContentDivsAndHeaders('game');
    const detailUl = createAndAppend({
      parent: detailDiv,
      tag: 'ul',
      classArray: ['center-list'],
    });
    createAndAppend({
      parent: detailUl,
      tag: 'li',
      innerHTML: `Released: ${
        months[releaseDate.getMonth()]
      } ${releaseDate.getDate()}, ${releaseDate.getFullYear()}`,
    });
    createAndAppend({
      parent: detailUl,
      tag: 'li',
      innerHTML: `Total Players: ${game.game_copies.length}`,
    });
    const gamerUl = createAndAppend({
      parent: gamerDiv,
      tag: 'ul',
      classArray: ['center-list'],
    });
    for (const copy of game.game_copies) {
      createAndAppend({
        parent: gamerUl,
        tag: 'li',
        innerHTML: copy.gamer.username,
        id: copy.gamerId,
        classArray: ['gamer'],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

renderMain();

document.addEventListener('click', async (event) => {
  const target = event.target,
    parent = target.parentNode;
  if (target.tagName === 'LI' && [...target.classList].includes('gamer')) {
    renderUserDetail(target.id);
  }
  if (parent.tagName === 'LI' && [...parent.classList].includes('game')) {
    renderGameDetail(parent.id);
  }
  if (target.tagName === 'NAV') {
    renderMain();
  }
});
