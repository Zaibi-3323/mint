import { takeEvery,all } from "@redux-saga/core/effects";

import {DECREMENT,INCREMENT} from  '../actions/action'
import {testingFunction} from './saga'



export function* watchOutFunctions(){
    yield all([
        takeEvery(DECREMENT,testingFunction),
        takeEvery(INCREMENT,testingFunction)
    ])
   
}

