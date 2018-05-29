/**
 * Created by tino on 6/28/17.
 */
import { combineReducers } from "redux";
import Users from "./users";
import Server from "./server";
import Projects from "./projects";
import Commits from "./commits";
import Ui from "./ui";
import Progress from "./progress";
import Comments from "./comments";
import MergeRequests from "./mergeRequests";

const appReducer = combineReducers({
  Users,
  Server,
  Projects,
  Commits,
  Ui,
  Progress,
  Comments,
  MergeRequests
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
