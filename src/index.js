import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/styles.css';

const form = document.querySelector('#search-form');
const divGallery = document.querySelector('.gallery');
const buttonMore = document.querySelector('.load-more');

form.addEventListener('submit', onSubmit);
buttonMore.addEventListener('click', onLoad);

let page = 1;
let input = '';

function onSubmit(evt) {
  evt.preventDefault();

  const inputValue = evt.currentTarget.searchQuery.value.trim();

  input = inputValue;

  if (!inputValue) {
    return;
  }

  axios({
    method: 'get',
    url: 'https://pixabay.com/api/',
    params: {
      key: '38423226-4fc7a222ecd92bb97a505eda6',
      q: inputValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    },
  }).then(response => {
    if (!response.data.total) {
      buttonMore.hidden = true;
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 5000,
        }
      );
      divGallery.innerHTML = '';
      return;
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.total} images.`,
        {
          timeout: 5000,
        }
      );
    }
    divGallery.innerHTML = '';
    marcup(response.data.hits);
  });
}

function axiosApi(inputValue, page) {
  axios({
    method: 'get',
    url: 'https://pixabay.com/api/',
    params: {
      key: '38423226-4fc7a222ecd92bb97a505eda6',
      q: inputValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    },
  }).then(response => {
    marcup(response.data.hits);
  });
}

function onLoad() {
  page += 1;
  axiosApi(input, page);
}

function marcup(data) {
  const marcup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}"> <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <p><b>Likes</b> <br>${likes}</br></p>
        </p>
        <p class="info-item">
          <p><b>Views</b> <br>${views}</br></p>
        </p>
        <p class="info-item">
          <p><b>Comments</b> <br>${comments}</br></p>
        </p>
        <p class="info-item">
          <p><b>Downloads</b> <br>${downloads}</br></p>
        </p>
      </div>
    </div>`
    )
    .join('');
  divGallery.insertAdjacentHTML('beforeend', marcup);
  buttonMore.hidden = false;
}
