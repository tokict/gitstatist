import { initialState } from "./initial";

export default function(state = initialState.Server, action) {
  switch (action.type) {
    case "SET_ACCESS_DATA":
      return {
        ...state,
        url: action.url,
        token: action.token,
        provider: action.provider
      };

    default:
      return state;
  }
}
