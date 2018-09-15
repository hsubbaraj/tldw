import { GET_GIFS, UPDATE_URL } from '../actions';

const initialState =  {
  gif_urls: [],
  youtube_url: ""
};

export default function gifs(state = initialState, action) {
  switch (action.type) {
    case GET_GIFS:
      return {
        	...state, 
        	gif_urls: action.payload.gif_urls
      };
    case UPDATE_URL:
    	return {
    		...state,
    		youtube_url: action.payload.url
    	}
    default:
      return state;
  }
}