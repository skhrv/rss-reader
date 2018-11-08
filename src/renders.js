export const renderChannelList = (channels) => {
  const container = document.querySelector('.channel-list');
  const innerHTML = channels.map(({ channelTitle, channelDesc }) => `<div class="list-group-item flex-column align-items-start">
  <h5 class="mb-1 channel-title">${channelTitle}</h5>
  <p class="mb-1 channel-desc">${channelDesc}</p>
  </div>`).join('');
  container.innerHTML = innerHTML;
  const header = document.createElement('h2');
  header.classList.add('ml-4');
  header.textContent = 'Feeds';
  container.prepend(header);
};

export const renderArticleList = (articles, handleBtnDesc) => {
  const container = document.querySelector('.article-list');
  const innerHTML = articles.map(({ title, link }) => `<div class="list-group-item">
    <a href="${link}" class="mr-2">${title}</a>
    <button type="button" class="btn btn-light btn-sm btn-description">Description</button>
  </div>`).join('');
  container.innerHTML = innerHTML;
  const header = document.createElement('h2');
  header.classList.add('ml-4');
  header.textContent = 'Articles';
  container.prepend(header);
  const btnDesc = document.querySelectorAll('.btn-description');
  if (btnDesc) {
    btnDesc.forEach(el => el.addEventListener('click', handleBtnDesc));
  }
};
