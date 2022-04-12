import {put} from "redux-saga/effects"
import {countActions} from '../actions/action';


export function* testingFunction(){
alert("testing saga middleware")
  yield(
    put({
      type:countActions.clear
    })
  )
 
}



