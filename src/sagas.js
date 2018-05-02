import { all } from "redux-saga/effects";
import { UserSagas } from "./sagas/users";

export default function* rootSaga() {
  yield all([...UserSagas]);
}
