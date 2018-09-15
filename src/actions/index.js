import axios from 'axios';

export const GET_USER_ID = 'GET_USER_ID';
export const GET_GIFS = 'GET_GIFS';
export const UPDATE_URL = 'UPDATE_URL';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';



export const website = "http://127.0.0.1:8000/"

export const updateUrl = (youtube_url) => {
  return {
    type: UPDATE_URL,
    payload: {
      url: youtube_url,
    }
  };
};

export const getGifsSuccess = (gif_urls) => {
  return {
    type: GET_GIFS,
    payload: {
      gifs: gif_urls,
    }
  };
};

// Async load cart
export const getGifs = (youtube_link) => {
  return (dispatch) => {
    return axios.post(website + 'forms/api/get_one/', {
        youtube_url: youtube_link
      })
      .then(response => {
        dispatch(getGifsSuccess)
      })
      .catch(error => {
        throw(error);
      });
  };
};
