export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const channelTitle = doc.querySelector('channel title').textContent;
  const channelDesc = doc.querySelector('channel description').textContent;
  const items = [...doc.querySelectorAll('item')].map((el) => {
    const title = el.querySelector('title').textContent;
    const link = el.querySelector('link').textContent;
    return { title, link };
  });
  return { channelTitle, channelDesc, items };
};
