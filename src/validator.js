import isURL from 'validator/lib/isURL';

export default (newFeed, state) => {
  if (state.feeds.has(newFeed)) {
    return false;
  }
  return isURL(newFeed);
};
