import { initialState } from "./initial";

export default function(state = initialState.Progress, action) {
  switch (action.type) {
    case "UPDATE_PROGRESS":
      return {
        ...state,
        ...action
      };

    default:
      return state;
  }
}
