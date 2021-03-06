import axios from 'axios';
import renderMain from './pages/mainPage';
import renderGameDetail from './pages/gameDetail';
import renderGamerDetail from './pages/gamerDetail';

const nav = document.querySelector('nav'),
  pageTitle = document.querySelector('h1'),
  content = document.querySelector('#content'),
  forms = document.querySelector('#forms');

renderMain({ nav, pageTitle, content, forms });

document.addEventListener('click', async (event) => {
  const target = event.target,
    parent = target.parentNode;
  if (target.tagName === 'LI' && [...target.classList].includes('gamer')) {
    renderGamerDetail({ nav, pageTitle, content, forms, gamerId: target.id });
  }
  if (parent.tagName === 'LI' && [...parent.classList].includes('game')) {
    renderGameDetail({ nav, pageTitle, content, forms, gameId: parent.id });
  }
  if (target.tagName === 'NAV') {
    renderMain({ nav, pageTitle, content, forms });
  }
  if (target.tagName === 'BUTTON') {
    if (target.id === 'gamerSubmit') {
      const newGamer = (
        await axios.post('/api/gamers', {
          username: document.querySelector('#username').value,
          firstName: document.querySelector('#firstName').value,
          lastName: document.querySelector('#lastName').value,
        })
      ).data;
      renderGamerDetail({ nav, pageTitle, content, forms, gamerId: newGamer });
    }
    if (target.id === 'gameSubmit') {
      const newGame = (
        await axios.post('/api/games', {
          gameName: document.querySelector('#gameName').value,
          releaseDate: document.querySelector('#releaseDate').value,
        })
      ).data;
      renderGameDetail({ nav, pageTitle, content, forms, gameId: newGame });
    }
    if (target.id === 'addFriendSubmit') {
      axios
        .post(`/api/gamers/${pageTitle.id}/addFriend`, {
          friendId: document.querySelector('#friendSelect').value,
        })
        .then(() => {
          renderGamerDetail({
            nav,
            pageTitle,
            content,
            forms,
            gamerId: pageTitle.id,
          });
        });
    }
    if (target.id === 'addGameSubmit') {
      axios
        .post(`/api/gamers/${pageTitle.id}/addGame`, {
          gameId: document.querySelector('#gameSelect').value,
          consoleId: document.querySelector('#consoleSelect').value,
        })
        .then(() => {
          renderGamerDetail({
            nav,
            pageTitle,
            content,
            forms,
            gamerId: pageTitle.id,
          });
        });
    }
  }
});
