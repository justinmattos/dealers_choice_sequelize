import axios from 'axios';
const gamerList = document.querySelector('#gamer-list'),
  gamesList = document.querySelector('#game-list');

const renderGamers = (gamers) => {
  for (const gamer of gamers) {
    const newLi = document.createElement('li');
    newLi.innerHTML = gamer.username;
    newLi.id = gamer.id;
    gamerList.appendChild(newLi);
  }
};

const renderGameList = (games) => {
  for (const game of games) {
    console.log(game);
  }
};

const init = async () => {
  try {
    const gamers = (await axios.get('/api/gamers')).data;
    console.log(gamers);
    renderGamers(gamers);
  } catch (err) {
    console.log(err);
  }
};

init();
