import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs/';
import axios from 'axios';
import validator from './validator';
import parse from './parse';
import { renderChannelList, renderArticleList } from './renders';

const state = {
  urlFeeds: [],
  form: { valid: null },
  feeds: {
    channels: [],
    items: [],
  },
};

const app = () => {
  const inputFeedURL = document.querySelector('#inputFeedURL');
  inputFeedURL.addEventListener('input', () => {
    const newFeed = inputFeedURL.value;
    state.form.valid = validator(newFeed, state.urlFeeds);
  });
  const btnAddFeed = document.querySelector('#btnAddFeed');
  btnAddFeed.addEventListener('click', () => {
    const newFeed = inputFeedURL.value;
    state.urlFeeds.push(newFeed);
    inputFeedURL.value = '';
  });
  const formAddFeed = document.querySelector('#formAddFeed');
  formAddFeed.addEventListener('submit', (e) => {
    btnAddFeed.click();
    e.preventDefault();
  });

  watch(state, 'form', () => {
    if (state.form.valid) {
      inputFeedURL.classList.add('is-valid');
      inputFeedURL.classList.remove('is-invalid');
      btnAddFeed.removeAttribute('disabled', '');
    } else {
      inputFeedURL.classList.remove('is-valid');
      inputFeedURL.classList.add('is-invalid');
      btnAddFeed.setAttribute('disabled', '');
    }
  });
  watch(state, 'urlFeeds', () => {
    const urlFeed = state.urlFeeds.slice(-1);
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const urlWithProxy = `${corsProxy}${urlFeed}`;
    axios.get(urlWithProxy).then((res) => {
      const { items, channelTitle, channelDesc } = parse(res.data);
      state.feeds.channels.push({ channelTitle, channelDesc });
      state.feeds.items.push(...items);
    });
  });
  watch(state, 'feeds', () => {
    renderChannelList(state.feeds.channels);
    renderArticleList(state.feeds.items);
  });
};

app();
