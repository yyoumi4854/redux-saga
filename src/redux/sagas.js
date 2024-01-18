import { all, call, put, takeEvery } from "redux-saga/effects";
import * as types from "./actionTypes";
import * as actions from "./actions";
import axios from "axios";

// API 호출을 담당하는 worker saga
function* getWebtoonsSaga() {
  try {
    const response = yield call(
      axios.get,
      "https://korea-webtoon-api.herokuapp.com"
    );
    yield put(actions.getWebtoonsSuccess(response.data));
  } catch (error) {
    yield put(actions.getWebtoonsFailure(error.message));
  }
}

// Watcher saga: 특정 액션을 감시하고 특정 액션이 발생할 때 worker saga를 호출
function* watchGetWebtoons() {
  yield takeEvery(types.GET_WEBTOONS_REQUEST, getWebtoonsSaga);
}

// Root saga: 여러 watcher saga들을 결합
export default function* rootSaga() {
  yield all([watchGetWebtoons()]);
}
