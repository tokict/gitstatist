import { initialState } from "./initial";

export default function(state = initialState.Users, action) {
  switch (action.type) {
    case "USERS_FETCHED":
      return {
        ...state,
        data: action.users,
        loading: false
      };

    case "USERS_UPDATED":
      return {
        ...state,
        data: action.users,
        loading: false
      };

    case "UNKNOWN_USERS_UPDATED":
      return {
        ...state,
        unknown: action.unknown
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
