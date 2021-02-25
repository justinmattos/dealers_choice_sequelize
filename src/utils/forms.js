import axios from 'axios';
import { createAndAppend } from './helperFuncs';

const renderAddGamerForm = (parent) => {
  const [username, firstName, lastName] = [
    { id: 'username' },
    { id: 'firstName' },
    { id: 'lastName' },
  ].map(({ id }) =>
    createAndAppend({
      parent,
      tag: 'input',
      id: id,
    })
  );
  username.maxlength = 20;
  firstName.maxlength = 20;
  lastName.maxlength = 30;
  username.placeholder = 'username';
  firstName.placeholder = 'first name';
  lastName.placeholder = 'last name';
  createAndAppend({
    parent,
    tag: 'button',
    innerHTML: 'Submit',
    id: 'gamerSubmit',
  });
};

const renderAddGameForm = (parent) => {
  const [gameName, releaseDate] = [
    { id: 'gameName' },
    { id: 'releaseDate' },
  ].map(({ id }) => createAndAppend({ parent, tag: 'input', id: id }));
  gameName.maxlength = 30;
  gameName.placeholder = 'game name';
  releaseDate.type = 'date';
  createAndAppend({
    parent,
    tag: 'button',
    innerHTML: 'Submit',
    id: 'gameSubmit',
  });
};

const renderAddFriendSelect = async ({ parent, gamer, friends }) => {
  const friendIds = friends
    ? [gamer, ...friends].map((friend) => friend.id)
    : [gamer.id];
  try {
    const possFriends = (await axios.get('/api/gamers')).data.filter(
      (possFriend) => !friendIds.includes(possFriend.id)
    );
    const friendSelect = createAndAppend({
      parent,
      tag: 'select',
      id: 'friendSelect',
    });
    for (const possFriend of possFriends) {
      const newSelect = createAndAppend({
        parent: friendSelect,
        tag: 'option',
        innerHTML: possFriend.username,
      });
      newSelect.value = possFriend.id;
    }
    createAndAppend({
      parent,
      tag: 'button',
      innerHTML: 'Submit',
      id: 'addFriendSubmit',
    });
  } catch (err) {
    console.log(err);
  }
};

const renderAddGameSelect = async ({ parent, gamer, games }) => {
  //same as Friend select, want to be able to select and add games/consoles to create new game_copies for a gamer
};

export {
  renderAddGameForm,
  renderAddGamerForm,
  renderAddFriendSelect,
  renderAddGameSelect,
};
