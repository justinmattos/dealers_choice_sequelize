import axios from 'axios';
import {
  createAndAppend,
  alphaSortByUsername,
  renderContentDivsAndHeaders,
  renderFormDivsAndHeaders,
} from '../utils/helperFuncs';
import { renderAddFriendSelect, renderAddGameSelect } from '../utils/forms';
import { renderGamerList } from '../utils/lists';

const renderGamerDetail = async ({
  nav,
  pageTitle,
  content,
  forms,
  gamerId,
}) => {
  content.innerHTML = '';
  forms.innerHTML = '';
  nav.innerHTML = 'BACK HOME';
  try {
    const gamer = (await axios.get(`/api/gamers/${gamerId}`)).data;
    pageTitle.innerHTML = `${gamer.username}`;
    pageTitle.id = gamer.id;
    const [userDiv, gameDiv] = renderContentDivsAndHeaders({
      parentDiv: content,
      pageType: 'gamer',
    });
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
    let friends;
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
      friends = gamer.friend2;
      friends.sort(alphaSortByUsername);
      renderGamerList({ parent: friendUl, gamers: friends });
    }
    const gameUl = createAndAppend({
      parent: gameDiv,
      tag: 'ul',
      classArray: ['span-list'],
    });
    const games = gamer.game_copies;
    for (const copy of games) {
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
    const [addFriend, addGame] = renderFormDivsAndHeaders({
      parentDiv: forms,
      pageType: 'gamer',
    });
    renderAddFriendSelect({
      parent: addFriend,
      gamer,
      friends,
    });
    renderAddGameSelect({
      parent: addGame,
      gamer,
      games,
    });
  } catch (err) {
    console.log(err);
  }
};

export default renderGamerDetail;
