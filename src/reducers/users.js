import { initialState } from "./initial";

const USER_UPDATED = "USER_UPDATED";

export default function(state = initialState.Users, action) {
  switch (action.type) {
    case USER_UPDATED:
      return {
        ...state,
        users: action.users
      };

    default:
      return state;
  }
}
