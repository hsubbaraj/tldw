import axios from 'axios';

export const GET_USER_ID = 'GET_USER_ID';
export const GET_GIFS = 'GET_GIFS';
export const UPDATE_URL = 'UPDATE_URL';
export const SUBMIT = 'SUBMIT';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';



export const website = "http://127.0.0.1:5000/"

export const updateUrl = (youtube_url) => {
  return {
    type: UPDATE_URL,
    payload: {
      url: youtube_url,
    }
  };
};

export const getGifsSuccess = (gif_urls, title) => {
  return {
    type: GET_GIFS,
    payload: {
      gifs: gif_urls,
      title: title,
    }
  };
};

export const submit = () => {
  return {
    type: SUBMIT
  }
};

// Async load cart
export const getGifs = (youtube_link) => {
  return (dispatch) => {
    return axios.post(website + 'urlToGifs', {
        url: youtube_link
      })
      .then(response => {
        var gifs = response.data.gifs;
        var title = response.data.title;
        dispatch(getGifsSuccess(gifs, title));
        console.log(gifs);
      })
      .catch(error => {
        throw(error);
      });
  };
};
