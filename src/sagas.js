import { delay } from "redux-saga";
import { put, takeEvery, all } from "redux-saga/effects";

function* incrementAsync() {
  yield delay(1000);
  yield put({ type: "USERS_FETCHED" });
}

function* watchUsers() {
  yield takeEvery("FETCH_USERS", incrementAsync);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchUsers()]);
}
