import axios from 'axios';
import {
  createAndAppend,
  alphaSortByUsername,
  gameSortByPlayers,
  renderContentDivsAndHeaders,
  renderFormDivsAndHeaders,
} from '../utils/helperFuncs';
import { renderGameList, renderGamerList } from '../utils/lists';
import { renderAddGameForm, renderAddGamerForm } from '../utils/forms';

const renderMain = async ({ nav, pageTitle, content, forms }) => {
  nav.innerHTML = '';
  pageTitle.innerHTML = 'Welcome Gamers!';
  content.innerHTML = '';
  forms.innerHTML = '';
  const [gamerDiv, gamesDiv] = renderContentDivsAndHeaders({
    parentDiv: content,
    pageType: 'main',
  });
  const [gamerList, gameList] = [
    { parent: gamerDiv, classArray: ['center-list'] },
    { parent: gamesDiv, classArray: ['span-list'] },
  ].map(({ parent, classArray }) =>
    createAndAppend({
      parent: parent,
      tag: 'ul',
      classArray: classArray,
    })
  );
  const [gamerForm, gameForm] = renderFormDivsAndHeaders({
    parentDiv: forms,
    pageType: 'main',
  });
  renderAddGamerForm(gamerForm);
  renderAddGameForm(gameForm);
  axios
    .get('/api/gamers')
    .then((response) => {
      const gamers = response.data;
      gamers.sort(alphaSortByUsername);
      renderGamerList({ parent: gamerList, gamers: gamers });
      return axios.get('/api/games');
    })
    .then((response) => {
      const games = response.data;
      games.sort(gameSortByPlayers);
      renderGameList({ parent: gameList, games: games });
    })
    .catch((err) => console.log(err));
};

export default renderMain;
