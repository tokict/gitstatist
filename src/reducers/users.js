import { initialState } from "./initial";

export default function(state = initialState.Users, action) {
  switch (action.type) {
    case "USERS_FETCHED":
      return {
        ...state,
        data: action.users,
        loading: false
      };

    case "FETCHING_USERS":
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
