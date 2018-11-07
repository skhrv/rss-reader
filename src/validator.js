import isURL from 'validator/lib/isURL';

export default (newFeed, urlFeeds) => {
  if (urlFeeds.includes(newFeed)) {
    return false;
  }
  return isURL(newFeed);
};
