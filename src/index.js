import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import configureStore from "./reducers/store";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import { Icon } from "semantic-ui-react";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/rootReducer";
import "semantic-ui-css/semantic.min.css";
const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore(persistedReducer);
const persistor = persistStore(store);

const onBeforeLift = () => {
  // take some action before the gate lifts
};

const Loading = () => {
  return <Icon name="spinner" />;
};

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
  document.getElementById("root")
);
registerServiceWorker();
