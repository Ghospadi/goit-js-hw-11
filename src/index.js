import './css/styles.css';
import {
  fetchPictures,
  increasePage,
  resetPage,
  settings,
} from './js/pixabay-API';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let flag = true;

inputForm.addEventListener('submit', onFormSubmit);
loadBtn.addEventListener('click', onClick);

function onFormSubmit(e) {
  e.preventDefault();
  settings.params.q = e.currentTarget.elements.searchQuery.value;

  if (settings.params.q === '') {
    return Notify.failure('Please enter your request');
  }

  resetPage();
  clear();

  fetchPictures().then(appendPictures);

  flag = true;
}

function onClick() {
  increasePage();
  fetchPictures().then(appendPictures);
}

function appendPictures(data) {
  if (data.totalHits === 0) {
    hideButton();
    clear();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }

  if(flag) {
    Notify.success(`Hooray! We found ${data.totalHits} images`);
    flag = false;
  }

  gallery.insertAdjacentHTML('beforeend', markupPictureInfo(data.hits));

  showButton();

  showBigPicture();

  if(settings.params.page > 1) {
    smoothScroll();
  }

  if (
    settings.params.page ===
    Math.ceil(data.totalHits / settings.params.per_page) + 1
  ) {
    galleryPicturesFinished();
  }
}

function markupPictureInfo(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
  <p class="info-item"><b>Likes</b>${likes}</p>
  <p class="info-item"><b>Views</b>${views}</p>
  <p class="info-item"><b>Comments</b>${comments}</p>
  <p class="info-item"><b>Downloads</b>${downloads}</p>
  </div>
  
  </div>`;
      }
    )
    .join('');
}

function clear() {
  gallery.innerHTML = '';
}

function hideButton() {
  loadBtn.classList.add('hidden');
}

function showButton() {
  loadBtn.classList.remove('hidden');
}

function galleryPicturesFinished() {
  hideButton();
  return Notify.warning("That's it! You've reached the end of search results");
}

function showBigPicture() {
  var lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}
