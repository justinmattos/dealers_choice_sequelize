import axios from 'axios';

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

const gameSortByPlayers = (a, b) => {
  //callback function for sorting games by the number of players (based on game_copies)
  return b.game_copies.length - a.game_copies.length;
};

const renderContentDivsAndHeaders = ({ parentDiv, pageType }) => {
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
    .map(() => createAndAppend({ parent: parentDiv, tag: 'div' }));
  [
    { parent: divA, innerHTML: headerA },
    { parent: divB, innerHTML: headerB },
  ].map(({ parent, innerHTML }) =>
    createAndAppend({ parent: parent, tag: 'h2', innerHTML: innerHTML })
  );
  return [divA, divB];
};

const renderFormDivsAndHeaders = ({ parentDiv, pageType }) => {
  //helper func that creates two form divs and their h2 titles, returning those divs in array
  let headerA = 'Add a ',
    headerB = 'Add a Game';
  switch (pageType) {
    case 'main':
      headerA += 'Gamer';
      break;
    case 'gamer':
      headerA += 'Friend';
      break;
  }
  const [divA, divB] = new Array(2)
    .fill('')
    .map(() => createAndAppend({ parent: parentDiv, tag: 'div' }));
  [
    { parent: divA, innerHTML: headerA },
    { parent: divB, innerHTML: headerB },
  ].map(({ parent, innerHTML }) =>
    createAndAppend({ parent, tag: 'h2', innerHTML: innerHTML })
  );
  return [divA, divB];
};

export {
  createAndAppend,
  alphaSortByUsername,
  gameSortByPlayers,
  renderContentDivsAndHeaders,
  renderFormDivsAndHeaders,
};
