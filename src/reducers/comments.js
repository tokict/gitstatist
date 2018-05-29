import { initialState } from "./initial";

export default function(state = initialState.Comments, action) {
  switch (action.type) {
    case "COMMENTS_FETCHED":
      return {
        ...state,
        data: action.comments,
        loading: false
      };

    case "FETCHING_COMMENTS":
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
