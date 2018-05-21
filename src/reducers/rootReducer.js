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

const rootReducer = combineReducers({
  Users,
  Server,
  Projects,
  Commits,
  Ui,
  Progress
});

export default rootReducer;
