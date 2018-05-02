/**
 * Created by tino on 6/28/17.
 */
import { combineReducers } from "redux";
import Users from "./users";
import Server from "./server";

const rootReducer = combineReducers({ Users, Server });

export default rootReducer;
