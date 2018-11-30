import 'bootstrap/dist/css/bootstrap.min.css';
import 'loaders.css/loaders.min.css';
import { watch } from 'melanke-watchjs/';
import axios from 'axios';
import $ from 'jquery';
import _ from 'lodash/fp';
import parse from './parse';
import { renderChannelList, renderArticleList } from './renders';
import {
  showAlert, removeAlert, validator, showLoader, removeLoader,
} from './utils';
import 'bootstrap';

const app = () => {
  const state = {
    urlFeeds: [],
    loading: false,
    error: null,
    form: { valid: null },
    feeds: {
      channels: [],
      items: [],
    },
    modal: {
      show: false,
      content: '',
    },
  };

  const corsProxy = 'https://cors-anywhere.herokuapp.com/';

  const inputFeedURL = document.querySelector('#inputFeedURL');
  inputFeedURL.addEventListener('input', () => {
    const newFeed = inputFeedURL.value;
    state.form.valid = validator(newFeed, state.urlFeeds);
  });

  const btnAddFeed = document.querySelector('#btnAddFeed');
  btnAddFeed.addEventListener('click', () => {
    const newFeed = inputFeedURL.value;
    if (newFeed.length === 0) {
      state.form.valid = false;
      return;
    }
    const urlWithProxy = `${corsProxy}${newFeed}`;
    state.loading = true;
    state.error = null;
    axios.get(urlWithProxy).then((res) => {
      state.loading = false;
      state.urlFeeds.push(newFeed);
      const { items, channelTitle, channelDesc } = parse(res.data);
      state.feeds.channels.push({ channelTitle, channelDesc });
      state.feeds.items.push(...items);
    }).catch((error) => {
      state.loading = false;
      state.error = error.message;
    });
  });

  const formAddFeed = document.querySelector('#formAddFeed');
  formAddFeed.addEventListener('submit', (e) => {
    btnAddFeed.click();
    e.preventDefault();
  });

  const updateFeed = () => {
    const requests = state.urlFeeds.map((urlFeed) => {
      const urlWithProxy = `${corsProxy}${urlFeed}`;
      state.error = null;
      return axios.get(urlWithProxy);
    });
    axios.all(requests).then((responses) => {
      const allNewItems = responses.map((res) => {
        const { items } = parse(res.data);
        const newItems = items.filter(item => !state.feeds.items.some(_.isEqual(item)));
        return newItems;
      }).flat();
      state.feeds.items.push(...allNewItems);
      setTimeout(updateFeed, 5000);
    }).catch(() => {
      setTimeout(updateFeed, 5000);
    });
  };
  setTimeout(updateFeed, 5000);

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

  watch(state, 'loading', () => {
    if (state.loading) {
      removeAlert();
      showLoader();
      inputFeedURL.setAttribute('disabled', '');
      btnAddFeed.setAttribute('disabled', '');
    } else if (state.error) {
      removeLoader();
      removeAlert();
      inputFeedURL.removeAttribute('disabled', '');
      btnAddFeed.removeAttribute('disabled', '');
      showAlert('danger', state.error);
    } else {
      removeLoader();
      removeAlert();
      inputFeedURL.value = '';
      inputFeedURL.removeAttribute('disabled', '');
      btnAddFeed.removeAttribute('disabled', '');
      showAlert('success', 'Feed added successfully');
    }
  });
  const handleBtnDsc = (e) => {
    const currentTitle = e.target.previousElementSibling.textContent;
    const { desc } = state.feeds.items.find(({ title }) => title === currentTitle);
    state.modal.content = desc;
    state.modal.show = true;
  };
  $('.modal-description').on('show.bs.modal', function handle() {
    $(this).find('.modal-body p').text(state.modal.content);
  });
  $('.modal-description').on('hide.bs.modal', () => {
    state.modal.content = '';
    state.modal.show = false;
  });
  watch(state, 'feeds', () => {
    const sortedItems = [...state.feeds.items].sort(({ pubDate: a }, { pubDate: b }) => b - a);
    renderChannelList(state.feeds.channels);
    renderArticleList(sortedItems, handleBtnDsc);
  });
  watch(state, 'modal', () => {
    if (state.modal.show) {
      $('.modal-description').modal();
    }
  });
};

app();
