import { put, takeLatest, all, call, select } from "redux-saga/effects";
import ApiAdapter from "../adapters/adapter";
import moment from "moment";

export default class Users {
  constructor(params) {
    this.stored = params ? params : null;
    this.fetchUsers = this.fetchUsers.bind(this);
  }

  *fetchUsers(params) {
    try {
      const provider = params ? params.provider : this.stored.provider;
      const url = params ? params.url : this.stored.url;
      const token = params ? params.token : this.stored.token;

      this.stored = {
        url,
        provider,
        token
      };

      this.Api = ApiAdapter(this.stored);

      yield put({ type: "FETCHING_USERS" });
      const ud = yield call(this.Api.fetchUsers);

      const usersData = ud.data;
      const users = this.Api.mapUsers(usersData);

      //Map data to our format
      yield put({ type: "USERS_FETCHED", users: users, loading: false });
      yield put({
        type: "SET_ACCESS_DATA",
        url: this.url,
        token: this.token,
        provider: this.provider
      });
      return usersData;
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
}

export const UserSagas = [takeLatest("FETCH_USERS", new Users().fetchUsers)];
