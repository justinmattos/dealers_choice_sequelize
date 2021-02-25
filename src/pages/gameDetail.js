import axios from 'axios';
import {
  createAndAppend,
  renderContentDivsAndHeaders,
} from '../utils/helperFuncs';

const months = [
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

const renderGameDetail = async ({ nav, pageTitle, content, forms, gameId }) => {
  content.innerHTML = '';
  forms.innerHTML = '';
  nav.innerHTML = 'BACK HOME';
  axios
    .get(`/api/games/${gameId}`)
    .then((response) => {
      const game = response.data,
        releaseDate = new Date(game.releaseDate);
      pageTitle.innerHTML = game.name;
      const [detailDiv, gamerDiv] = renderContentDivsAndHeaders({
        parentDiv: content,
        pageType: 'game',
      });
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
      const gamers = game.game_copies.map((copy) => copy.gamer);
      for (const copy of game.game_copies) {
        createAndAppend({
          parent: gamerUl,
          tag: 'li',
          innerHTML: copy.gamer.username,
          id: copy.gamerId,
          classArray: ['gamer'],
        });
      }
    })
    .catch((err) => console.log(err));
};

export default renderGameDetail;
