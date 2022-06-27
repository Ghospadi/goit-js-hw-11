import axios from 'axios';

const key = '28286266-5bd5a7bf32f95f65c7e462f82';
const url = `https://pixabay.com/api/`;

export const settings = {
  params: {
    key,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};

export const fetchPictures = async () => {
  try {
    const response = await axios.get(url, settings);
    const data = response.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const resetPage = () => (settings.params.page = 1);

export const increasePage = () => (settings.params.page += 1);
