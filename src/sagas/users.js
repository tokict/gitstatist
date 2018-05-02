import { put, takeLatest, all, call, select } from "redux-saga/effects";
import ApiAdapter from "../adapters/adapter";

function* fetchUsers(params) {
  try {
    // const getToken = state => state.Server.token;
    // const getUrl = state => state.Server.url + "/api/v4/";
    // const getProvider = state => state.Server;

    // const provider = yield select(getProvider);
    // const url = yield select(getUrl);
    // const token = yield select(getToken);

    const Api = new ApiAdapter(params);

    yield put({ type: "FETCHING_USERS" });
    const usersData = yield call(Api.getUsers);
    const users = Api.mapUsers(usersData);

    //Map data to our format
    console.log(users);
    yield put({ type: "USERS_FETCHED", users: users, loading: false });
    yield put({
      type: "SET_ACCESS_DATA",
      url: params.url,
      token: params.token,
      provider: params.provider
    });
  } catch (error) {
    console.log(error);
    // yield put({
    //   type: "SET_ACCESS_DATA",
    //   url: null,
    //   token: null
    // });
    yield put({ type: "USERS_FETCHED", loading: false });
  }
}

export const UserSagas = [takeLatest("FETCH_USERS", fetchUsers)];
