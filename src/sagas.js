import { all } from "redux-saga/effects";
import { UserSagas } from "./sagas/users";
import { ProjectsSagas } from "./sagas/projects";
import { CommitsSagas } from "./sagas/commits";

export default function* rootSaga() {
  yield all([...UserSagas, ...ProjectsSagas, ...CommitsSagas]);
}
