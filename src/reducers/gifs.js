import { GET_GIFS, UPDATE_URL, SUBMIT } from '../actions';

const initialState =  {
  gif_urls: [],
  youtube_url: "",
  title: "",
  submitted: false,
  done: false
};

export default function gifs(state = initialState, action) {
  switch (action.type) {
    case SUBMIT:
      return {
          ...state,
          submitted: true
      };
    case GET_GIFS:
      return {
        	...state, 
        	gif_urls: action.payload.gifs,
          title: action.payload.title,
          submitted: false,
          done: true
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