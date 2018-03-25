import { takeLatest, call, put } from 'redux-saga/effects'
import {
  API_CALL_REQUEST,
  API_CALL_SUCCESS,
  API_CALL_FAILURE,
} from '../constants/actions'

export function* watcherSaga() {
  yield takeLatest(API_CALL_REQUEST, workerSaga)
}

function fetchDog() {
  return fetch('https://dog.ceo/api/breeds/image/random')
    .then(result => result.status === 200 ? result.json() : null)
}

function* workerSaga() {
  try {
    const response = yield call(fetchDog)
    const dog = response.message

    yield put({
      type: API_CALL_SUCCESS,
      dog,
    })
  }
  catch (error) {
    yield put({
      type: API_CALL_FAILURE,
      error,
    })
  }
}
