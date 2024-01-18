import { all, call, put, takeEvery } from "redux-saga/effects";
import * as types from "./actionTypes";
import * as actions from "./actions";
import axios from "axios";
import * as webtoonAPI from "../api/webtoon";

// API 호출을 담당하는 worker saga
function* getWebtoonsSaga() {
  try {
    const response = yield call(webtoonAPI.getWebtoons);
    yield put(actions.getWebtoonsSuccess(response.data));
  } catch (error) {
    yield put(actions.getWebtoonsFailure(error.message));
  }
}

// function* getWebtoonsSaga() {
//   try {
//     const res = yield call(webtoonAPI.getWebtoons);
//     console.log("res", res);
//     if (res.status === 200) {
//       yield put({
//         type: types.GET_WEBTOONS_SUCCESS,
//         payload: res.data,
//       });
//     } else {
//       throw new Error();
//     }
//   } catch (err) {
//     yield put({
//       type: types.GET_WEBTOONS_FAILURE,
//     });
//   }
// }

// Watcher saga: 특정 액션을 감시하고 특정 액션이 발생할 때 worker saga를 호출
function* watchGetWebtoons() {
  yield takeEvery(types.GET_WEBTOONS_REQUEST, getWebtoonsSaga);
}

// Root saga: 여러 watcher saga들을 결합
export default function* rootSaga() {
  yield all([watchGetWebtoons()]);
}
