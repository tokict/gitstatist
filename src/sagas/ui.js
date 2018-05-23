import { put, takeLatest, all, call, select } from "redux-saga/effects";
import ApiAdapter from "../adapters/adapter";
import moment from "moment";

const getUnknown = state => state.Users.unknown;
const getMessages = state => state.Ui.messages;

function* unknownUsersUpdated(params) {
  try {
    //Check if the user got this message before for first time and for any aditional users, display it again
    const unknown = yield select(getUnknown);
    const messages = yield select(getMessages);

    if (unknown.length) {
      if (
        !messageExist(messages.new, "unknownUsers") &&
        !messageExist(messages.read, "unknownUsers")
      ) {
        //Create a message
        const m = {
          type: "unknownUsers",
          color: "orange",
          icon: "warning",
          header: "We found some unknown commit authors",
          content: "Click the user icon in the menu on top to see them"
        };

        messages.new.push(m);

        yield put({ type: "UPDATE_MESSAGES", messages });
      }

      //Create a message
      if (
        unknown.length < params.unknown.length &&
        !messageExist(messages.new, "unknownUsersExtra")
      ) {
        //Create a message
        const m = {
          type: "unknownUsersExtra",
          color: "orange",
          icon: "warning",
          header: "We found more unknown commit authors",
          content: "Click the user icon in the menu on top to see them"
        };

        messages.new.push(m);

        yield put({ type: "UPDATE_MESSAGES", messages });
      }
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: "SET_ACCESS_DATA",
      url: null,
      token: null
    });
    yield put({ type: "USERS_FETCHED", loading: false });
  }
}

function messageExist(messages, messageType) {
  for (let msg in messages) {
    if (messages[msg].type && messages[msg].type == messageType) {
      return true;
    }
  }
  return false;
}

function* dismissMessage(params) {
  const messages = yield select(getMessages);
  const newFolder = messages.new;
  const readFolder = messages.read;
  const newMessages = [];
  const readMessages = messages.read;

  //Filter out dismissed type and move it to read
  for (let msg in newFolder) {
    if (newFolder[msg].type != params.messageType) {
      newMessages.push(newFolder[msg]);
    } else {
      readMessages.push(newFolder[msg]);
    }
  }
  messages.new = newMessages;
  messages.read = readMessages;

  yield put({ type: "UPDATE_MESSAGES", messages });
}

export const UiSagas = [
  takeLatest("UNKNOWN_USERS_UPDATED", unknownUsersUpdated),
  takeLatest("DISMISS_MESSAGE", dismissMessage)
];
