import { initialState } from "./initial";

const FETCH_USERS = "FETCH_USERS";
const USERS_FETCHED = "USERS_FETCHED";

export default function(state = initialState.Users, action) {
  switch (action.type) {
    case USERS_FETCHED:
      return {
        ...state,
        users: action.users
      };

    default:
      return state;
  }
}
