import axios from 'axios';

const content = document.querySelector('#content');
let gamerList, gamesList;

const createAndAppend = ({ parent, tag, innerHTML, id, classArray }) => {
  //write a helper function to simplify render functions below
};

const renderGamers = (gamers) => {
  for (const gamer of gamers) {
    const newLi = document.createElement('li');
    newLi.innerHTML = gamer.username;
    newLi.id = gamer.id;
    newLi.classList.toggle('gamer');
    gamerList.appendChild(newLi);
  }
};

const renderGameList = (games) => {
  for (const game of games) {
    const newLi = document.createElement('li');
    newLi.innerHTML = `${game.name} - ${game.game_copies.length} players`;
    newLi.id = game.id;
    gamesList.appendChild(newLi);
  }
};

const renderMain = async () => {
  content.innerHTML = '';
  const [gamerDiv, gamesDiv] = new Array(2)
    .fill('')
    .map(() => document.createElement('div'));
  const [gamerH2, gamesH2] = new Array(2)
    .fill('')
    .map(() => document.createElement('h2'));
  [gamerDiv, gamesDiv].forEach((div) => content.appendChild(div));
  gamerDiv.appendChild(gamerH2);
  gamesDiv.appendChild(gamesH2);
  gamerH2.innerHTML = 'Cool Gamers';
  gamesH2.innerHTML = 'Games They Play';
  [gamerList, gamesList] = new Array(2)
    .fill('')
    .map(() => document.createElement('ul'));
  gamerDiv.appendChild(gamerList);
  gamesDiv.appendChild(gamesList);
  try {
    const gamers = (await axios.get('/api/gamers')).data;
    renderGamers(gamers);
    const games = (await axios.get('/api/games')).data;
    renderGameList(games);
  } catch (err) {
    console.log(err);
  }
};

const renderUserDetail = async (gamerId) => {
  try {
    const gamer = (await axios.get(`/api/gamers/${gamerId}`)).data;
    content.innerHTML = '';
    const userDiv = document.createElement('div');
    content.appendChild(userDiv);
    const header = document.createElement('h2');
    header.innerHTML = gamer.username;
    userDiv.appendChild(header);
    const userUl = document.createElement('ul');
    userDiv.appendChild(userUl);
    const nameLi = document.createElement('li');
    nameLi.innerHTML = `${gamer.firstName} ${gamer.lastName}`;
    userUl.appendChild(nameLi);
    if (gamer.friend2) {
      const friendLabel = document.createElement('li');
      friendLabel.innerHTML = 'Friends:';
      userUl.appendChild(friendLabel);
      const friendUl = document.createElement('ul');
      friendLabel.appendChild(friendUl);
      for (const friend of gamer.friend2) {
        const friendLi = document.createElement('li');
        friendLi.innerHTML = friend.username;
        friendLi.id = friend.id;
        friendLi.classList.toggle('gamer');
        friendUl.appendChild(friendLi);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

renderMain();

document.addEventListener('click', async (event) => {
  const target = event.target;
  if (target.tagName === 'LI' && [...target.classList].includes('gamer')) {
    console.log(target.id);
    renderUserDetail(target.id);
  }
  if (target.tagName === 'H1') {
    renderMain();
  }
});
