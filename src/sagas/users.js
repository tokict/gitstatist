import { put, takeLatest, all, call, select } from "redux-saga/effects";
import ApiAdapter from "../adapters/adapter";

function* fetchUsers(params) {
  try {
    const Api = new ApiAdapter(params);

    yield put({ type: "FETCHING_USERS" });
    const ud = yield call(Api.fetchUsers);
    const usersData = ud.data;
    const users = Api.mapUsers(usersData);

    //Map data to our format
    yield put({ type: "USERS_FETCHED", users: users, loading: false });
    yield put({
      type: "SET_ACCESS_DATA",
      url: params.url,
      token: params.token,
      provider: params.provider
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: "SET_ACCESS_DATA",
      url: null,
      token: null
    });
    yield put({ type: "USERS_FETCHED", loading: false });
  }
}

export const UserSagas = [takeLatest("FETCH_USERS", fetchUsers)];
