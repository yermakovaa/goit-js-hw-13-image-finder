import './css/main.css';
import cardsImgsTpl from './templates/cards.hbs';
import NewsApiService from './js/apiService';
import LoadMoreBtn from './js/load-more-btn';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  cardsContainer: document.querySelector('.gallery'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchCards);
refs.cardsContainer.addEventListener('click', onOpenModal);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.query.value;

  if (newsApiService.query === '') {
    return info({
      text: 'Enter the value!',
      delay: 1500,
      closerHover: true,
    });
  }

  loadMoreBtn.show();
  newsApiService.resetPage();
  clearCardsContainer();
  fetchCards();
}

function fetchCards() {
  loadMoreBtn.disable();
  newsApiService
    .fetchCards()
    .then(images => {
      appendCardsMarkup(images);
      loadMoreBtn.enable();
      if (images.length === 0) {
        loadMoreBtn.hide();
        error({
          text: 'No matches found!',
          delay: 1500,
          closerHover: true,
        });
      }
    })
    .catch(err => console.log(err));
}

function appendCardsMarkup(images) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', cardsImgsTpl(images));
}

function clearCardsContainer() {
  refs.cardsContainer.innerHTML = '';
}

function onOpenModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  const largeImageURL = `<img src= ${e.target.dataset.source}>`;
  basicLightbox.create(largeImageURL).show();
}
