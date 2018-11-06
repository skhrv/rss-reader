import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs/';
import validator from './validator';

const state = {
  feeds: new Set(),
  valid: true,
};

const app = () => {
  const inputFeedURL = document.querySelector('#inputFeedURL');
  inputFeedURL.addEventListener('input', () => {
    const newFeed = inputFeedURL.value;
    state.valid = validator(newFeed, state);
  });
  const btnAddFeed = document.querySelector('#btnAddFeed');
  btnAddFeed.addEventListener('click', () => {
    const newFeed = inputFeedURL.value;
    state.feeds.add(newFeed);
    inputFeedURL.value = '';
  });

  watch(state, 'valid', () => {
    if (state.valid) {
      inputFeedURL.classList.add('is-valid');
      inputFeedURL.classList.remove('is-invalid');
      btnAddFeed.removeAttribute('disabled', '');
    } else {
      inputFeedURL.classList.remove('is-valid');
      inputFeedURL.classList.add('is-invalid');
      btnAddFeed.setAttribute('disabled', '');
    }
  });
};

app();
