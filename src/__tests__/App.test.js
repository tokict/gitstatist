import React from "react";
import ReactDOM from "react-dom";
import "../index.css";
import App from "../App";
import { Provider } from "react-redux";
import { sagaMiddleware, configureStore } from "../reducers/store";
import rootSaga from "../sagas";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Icon } from "semantic-ui-react";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers/rootReducer";
import "semantic-ui-css/semantic.min.css";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["Users.loading", "Commits", "Progress", "Ui.periodFrom"]
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore(persistedReducer);
sagaMiddleware.run(rootSaga);
const persistor = persistStore(store);

const onBeforeLift = () => {
  // take some action before the gate lifts
};

const Loading = () => {
  return <Icon name="spinner" />;
};
const div = document.createElement("div");
it("renders without crashing", () => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate
        loading={<Loading />}
        onBeforeLift={onBeforeLift}
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
