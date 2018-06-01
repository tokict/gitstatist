import { initialState } from "./initial";

export default function(state = initialState.Projects, action) {
  switch (action.type) {
    case "PROJECTS_UPDATED":
      return {
        ...state,
        data: action.projects,
        loading: false
      };

    case "FETCHING_PROJECTS":
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
