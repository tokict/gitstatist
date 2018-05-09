/**
 * Created by tino on 6/28/17.
 */
import { combineReducers } from "redux";
import Users from "./users";
import Server from "./server";
import Projects from "./projects";
import Commits from "./commits";
import Ui from "./ui";

const rootReducer = combineReducers({ Users, Server, Projects, Commits, Ui });

export default rootReducer;
