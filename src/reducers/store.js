/**
 * Created by tino on 6/28/17.
 */
/* eslint-disable global-require */
/* eslint-disable no-undef */
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { initialState } from "./initial";

let middleware = [thunk];

if (1) {
  const logger = createLogger({
    collapsed: true
  });
  middleware = [...middleware, logger];
} else {
  middleware = [...middleware];
}

export default function configureStore(persistedReducer) {
  return createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middleware))
  );
}
