/**
 * Created by tino on 6/28/17.
 */
/* eslint-disable global-require */
/* eslint-disable no-undef */
import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { initialState } from "./initial";

export const sagaMiddleware = createSagaMiddleware();
let middleware = [sagaMiddleware];

if (1) {
  const logger = createLogger({
    predicate: (getState, action) => action.type !== "UPDATE_PROGRESS",
    collapsed: true
  });
  middleware = [...middleware, logger];
} else {
  middleware = [...middleware];
}

export function configureStore(persistedReducer) {
  return createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middleware))
  );
}
