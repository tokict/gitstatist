import { initialState } from "./initial";

export default function(state = initialState.MergeRequests, action) {
  switch (action.type) {
    case "MERGE_REQUESTS_FETCHED":
      return {
        ...state,
        data: action.mergeRequests,
        loading: false
      };

    case "FETCHING_MERGE_REQUESTS":
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
