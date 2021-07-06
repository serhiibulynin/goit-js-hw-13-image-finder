import './sass/main.scss';

import formTpl from './tpl/form.hbs';
import galleryTpl from './tpl/gallery.hbs';
import cardTpl from './tpl/card.hbs';
import ImageApiService from './service/api-service';
import BtnService from './service/btn-service';

import { notice, error, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';

defaultModules.set(PNotifyMobile, {});

const imageApiService = new ImageApiService();
const loadMoreBtn = new BtnService({
  selector: "[data-action='load-more']",
  hidden: true,
});

const divRef = document.querySelector('#root');

divRef.insertAdjacentHTML('beforeend', formTpl());
divRef.insertAdjacentHTML('beforeend', galleryTpl());

const listRef = document.querySelector('.gallery');
const formRef = document.querySelector('#search-form');

loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
formRef.addEventListener('submit', onSubmitImage);

function onSubmitImage(e) {
  e.preventDefault();
  listRef.innerHTML = '';
  imageApiService.query = e.currentTarget.elements.query.value;
  imageApiService.resetPage();
  loadMoreBtn.show();
  showImage(false);
}

function onLoadMore(e) {
  loadMoreBtn.disable();
  imageApiService.incrementPage();
  showImage();
}

function showImage(isLoadMore = true) {
  imageApiService.fetchImage().then(data => {
    if (data.hits.length) {
      renderImage(data);
      return;
    }
    loadMoreBtn.hide();
    if (isLoadMore) {
      notice({
        text: 'This is the last page',
      });

      return;
    }
    error({
      text: 'Images not found!',
    });
  });
}

function renderImage(data) {
  console.log(data.length);
  listRef.insertAdjacentHTML('beforeend', cardTpl(data));
  loadMoreBtn.show();
  loadMoreBtn.enable();
  listRef.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

// const myNotice = notice({
//   text: "I'm a notice.",
//   modules: new Map([
//     ...defaultModules,
//     [PNotifyPaginate, {
//       // Paginate Module Options
//     }]
//   ])
// });
