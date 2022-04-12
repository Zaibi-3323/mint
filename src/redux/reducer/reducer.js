import { combineReducers } from "redux";

import {INCREMENT,DECREMENT,CLEAR} from '../actions/action'

const initialState={
    count:0
}
function counter(state = initialState, action) {
  switch (action.type) {
    // case GIF_FETCH_START:
    //old syntax of ES5
    //   return Object.assign({}, state, { url: "", loading: true });
    case INCREMENT:
      return { ...state, count: state.count+1 };
    case DECREMENT:
      return  { ...state, count: state.count-1 };
    default:
      return state;
  }
}

export default counter;
