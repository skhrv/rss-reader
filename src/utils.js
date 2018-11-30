import isURL from 'validator/lib/isURL';

export const showAlert = (type, msg) => {
  const alert = document.querySelector('.alert');
  if (!alert) {
    const newAlert = document.createElement('div');
    newAlert.classList.add('alert', `alert-${type}`, 'mb-0');
    newAlert.textContent = msg;
    document.body.prepend(newAlert);
    return;
  }
  alert.textContent = msg;
};

export const removeAlert = () => {
  const alert = document.querySelector('.alert');
  if (alert) {
    alert.remove();
  }
};

export const validator = (newFeed, urlFeeds) => {
  if (urlFeeds.includes(newFeed)) {
    return false;
  }
  return isURL(newFeed);
};

export const showLoader = () => {
  const container = document.querySelector('.list-container');
  const loader = document.createElement('div');
  loader.classList.add('loader-inner', 'ball-pulse', 'd-flex', 'justify-content-center');
  loader.innerHTML = '<div class="bg-primary"></div><div class="bg-primary"></div><div class="bg-primary"></div>';
  container.prepend(loader);
};

export const removeLoader = () => {
  const loader = document.querySelector('.loader-inner');
  if (loader) {
    loader.remove();
  }
};
