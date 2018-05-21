import { initialState } from "./initial";

export default function(state = initialState.Ui, action) {
  switch (action.type) {
    case "UPDATE_MESSAGES":
      return {
        ...state,
        messages: action.messages
      };

    case "PERIOD_UPDATED":
      return {
        ...state,
        periodFrom: action.periodFrom
      };

    default:
      return state;
  }
}
