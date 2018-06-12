import { initialState } from "./initial";

export default function(state = initialState.Projects, action) {
  switch (action.type) {
    case "PROJECTS_UPDATED":
      return {
        ...state,
        data: action.projects,
        loading: false
      };
    case "SELECTED_PROJECTS_UPDATED":
      return {
        ...state,
        selected: action.selected
      };
      break;
    case "FETCHING_PROJECTS":
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
