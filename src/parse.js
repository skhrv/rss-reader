export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  if (!doc.querySelector('channel')) {
    throw new Error('Unable to locate feed');
  }
  const channelTitle = doc.querySelector('channel title').textContent;
  const channelDesc = doc.querySelector('channel description').textContent;
  const items = [...doc.querySelectorAll('item')].map((el) => {
    const title = el.querySelector('title').textContent;
    const link = el.querySelector('link').textContent;
    const desc = el.querySelector('description').textContent;
    return { title, link, desc };
  });
  return { channelTitle, channelDesc, items };
};
