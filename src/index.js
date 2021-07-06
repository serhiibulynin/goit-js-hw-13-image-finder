import './sass/main.scss';

import formTpl from "./tpl/form.hbs"
import galleryTpl from "./tpl/gallery.hbs"
import cardTpl from "./tpl/card.hbs"
import ImageApiService from './service/api-service';
import BtnService from './service/btn-service';

import { error,  defaultModules } from '@pnotify/core';
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

const divRef = document.querySelector("#root");


divRef.insertAdjacentHTML('beforeend', formTpl());
divRef.insertAdjacentHTML('beforeend', galleryTpl());

const listRef = document.querySelector('.gallery');
const formRef = document.querySelector('#search-form');
const errorRef = document.querySelector('.error');

loadMoreBtn.refs.button.addEventListener("click", onLoadMore);
formRef.addEventListener('submit', onSubmitImage);

function onSubmitImage(e) {
    e.preventDefault();
    listRef.innerHTML = "";
    imageApiService.query = e.currentTarget.elements.query.value;
    imageApiService.resetPage();
    loadMoreBtn.show();
    showImage();
}

function onLoadMore(e) {
    loadMoreBtn.disable();
    imageApiService.incrementPage();
    showImage();
}

function showImage() {
    imageApiService.fetchImage().then((data) => {
        console.log(data.hits.length)
        console.log(data.hits)
        if (!data.hits.length) {
            error({
                text: 'Images not founded!'
            })
            listRef.innerHTML = "";
            loadMoreBtn.hide();
            return;
        }
        renderImage(data)
    });
}



function renderImage(data) {
    console.log(data.length)
    listRef.insertAdjacentHTML('beforeend', cardTpl(data));
    loadMoreBtn.show();
    loadMoreBtn.enable();
    listRef.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
}
