import { initialState } from "./initial";

export default function(state = initialState.Commits, action) {
  switch (action.type) {
    case "COMMITS_FETCHED":
      return {
        ...state,
        data: action.commits,
        loading: false
      };

    case "FETCHING_COMMITS":
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
