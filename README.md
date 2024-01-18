# 10. redux-saga

redux-thunk는 함수를 디스패치 할 수 있게 해주는 미들웨어</br>
redux-saga는 액션을 모니터링하고 있다가, 특정 액션이 발생하면 이에 따른 **특정 작업**을 하는 방식으로 사용</br>

- 특정 작업 : 특정 자바스크립트를 실행, 다른 액션 디스패치, 현재 상태 불러오기

redux-saga로 redux-thunk로 못하는 다양한 작업들 처리

1. 비동기 작업할 때 기존 요청 취소 처리
2. 특정 액션이 발생할 때 이에 따라 다른 액션이 디스패치되게끔, 자바스크립트 코드 실행
3. 웹소켓을 사용하는 경우 Channel이라는 기능을 사용하여 더욱 효율적으로 코드 관리
4. API 요청이 실패했을 때 재요청하는 작업 가능

이 외에도 다양한 까다로운 비동기 작업들을 redux-saga를 사용하여 처리 가능</br>
redux-saga는 다양항 상황에 쓸 수 있는 만큼, 제공되는 기능도 많고, 사용방법도 진입장벽이 꾀나 큼

## Generator 문법 배우기

핵심 기능 :

- 함수를 작성 했을 때 함수를 특정 구간에 멈춰놓을 수도 있고, 원할 때 다시 돌아가게 할 수도 있다.
- 결과값을 여러번 반환 가능

```js
function weirdFunction() {
  return 1;
  return 2;
  return 3;
  return 4;
  return 5;
}
```

함수에서 값을 여러번 걸쳐서 반환 불가능 -> 이 코드는 무조건 1을 반환

하지만, 제너레이터 함수를 사용하면 함수에서 값을 순차적으로 반환 가능</br>
또한 함수의 흐름을 도중에 멈춰놓았다가 나중에 이어서 진행 가능

```js
function* generatorFunction() {
  console.log("안녕하세요?");
  yield 1;
  console.log("제너레이터 함수");
  yield 2;
  console.log("function*");
  yield 3;
  return 4;
}

const generator = generatorFunction();
generator.next(); // 안녕하세요. {value: 1, done: false}
generator.next(); // 제너레이터 함수 {value: 2, done: false}
generator.next(); // function* {value: 3, done: false}
generator.next(); // {value: 4, done: true}
generator.next(); // {value: undefined, done: true}
```

- 제너레이터 함수를 만들 때 `function*` 키워드 사용
- 재너레이터 함수를 호출했을 때 한 객체 반환됨 -> 이를 제너레이터라고 부름

제너레이터 함수를 호출한다 해서 해당 함수 안의 코드가 바로 시작되지는 않음</br>
generator.next()를 호출해야만 코드 실행되며, yield를 한 값을 반환하고 코드의 흐름을 멈춤</br>
코드 흐름이 멈추고 나서 `generator.next()`를 다시 호출하면 흐름이 이어서 다시 시작

`next`를 호출 할 때 인자를 전달하여 이를 제너레이터 함수 내부에서 사용 가능

```js
function* sumGenerator() {
    console.log('sumGenerator이 시작됐습니다.');
    let a = yield;
    console.log('a값을 받았습니다.');
    let b = yield;
    console.log('b값을 받았습니다.');
    yield a + b;
}

cons sum = sumGenerator();
sum.next(); // sumGenerator이 시작됐습니다. {value: undefined, done: false}
sum.next(1); // a값을 받았습니다. {value: undefined, done: false}
```

# Generator로 액션 모니터링하기

```js
function* watchGenerator() {
  console.log("모니터링 시작!");
  while (true) {
    const action = yield;
    if (action.type === "HELLO") {
      console.log("안녕하세요?");
    }
    if (action.type === "BYE") {
      console.log("안녕히가세요.");
    }
  }
}
const watch = watchGenerator();
watch.next(); // 모니터링 시작! {value: undefined, done: false}
watch.next({ type: "HELLO" }); // 안녕하세요? {value: undefined, done: false}
watch.next({ type: "BYE" }); // 안녕히가세요. {value: undefined, done: false}
watch.next({ type: "GO" }); // 안녕히가세요. {value: undefined, done: false}
```

redux-saga에서는 액션을 모니터링하고, 특정 액션이 발생했을때 우리가 원하는 자바스크립트 코드 실행시켜줌

## 리덕스 사가 설치 및 비동기 카운터 만들기

### thunk를 사용해서 구현했던 비동기 카운터 기능을 redux-saga를 사용하여 구현

```bash
npm i redux-saga
```

```js
// modules/counter.js
function* increaseSaga() {
  yield delay(1000); // 1초를 기다립니다.
  yield put(increase()); // put은 특정 액션을 디스패치 해줍니다.
}
function* decreaseSaga() {
  yield delay(1000); // 1초를 기다립니다.
  yield put(decrease()); // put은 특정 액션을 디스패치 해줍니다.
}
```

`redux-saga/effects`에는 다양한 유틸함수들이 들어있다.</br>

- put : 매우 중요!!, 이 함수를 통하여 **새로운 액션 디스패치** 가능
- takeEvery : 특정 액션 타입에 대하여 **디스패치 되는 모든 액션들을 처리**
- takeLatest : 특정 액션 타입에 대하여 디스패치된 **가장 마지막 액션만을 처리**하는 함수
  - 특정 액션을 처리하고 있는 동안 동일한 타입의 새로운 디스패치되면 기존에 하던 작업을 무시 처리하고 새로운 작업을 시작

`counterSaga`라는 함수를 만들어서 두 액션을 모니터링

```js
// modules/counter.js
export function* counterSaga() {
  yield takeEvery(INCREASE_ASYNC, increaseSaga); // 모든 INCREASE_ASYNC 액션을 처리
  yield takeLatest(DECREASE_ASYNC, decreaseSaga); // 가장 마지막으로 디스패치된 DECREASE_ASYNC 액션만을 처리
}
```

### 루트 사가 만들기

프로젝트에서 여러개의 사가를 만들게 될텐데, 이를 모두 합쳐서 루트 사가로 만들기

```js
// modules/index.js
import { combineReducers } from "redux";
import counter, { counterSaga } from "./counter";
import posts from "./posts";
import { all } from "redux-saga/effects";

const rootReducer = combineReducers({ counter, posts });
export function* rootSaga() {
  yield all([counterSaga()]); // all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
}

export default rootReducer;
```

### 리덕스 스토어에 redux-saga 미들웨어 적용

# 11. redux-saga로 프로미스 다루기

redux-thunk는 redux-thunk함수를 만들어서 이 함수가 디스패치 될 때 비동기 작업을 처리하고, 액션 객체를 디스패치하거나 스토어의 현재 상태를 조회 할 수 있다.

```js
export const getPosts = () => async (dispatch) => {
  dispatch({ type: GET_POSTS }); // 요청이 시작됨
  try {
    const posts = postsAPI.getPosts(); // API 호출
    dispatch({ type: GET_POSTS_SUCCESS, posts }); // 성공
  } catch (e) {
    dispatch({ type: GET_POSTS_ERROR, error: e }); // 실패
  }
};
```

redux-thunk에서는 함수를 만들어서 해당 함수에서 비동기 작업을 하고 필요한 시점에 특정 액션을 디스패치한다.</br>
redux-saga는 비동기 작업을 처리 할 때 다른 방식으로 처리

redux-saga에서는 특정 액션을 모니터링하도록 하고, 해당 액션이 주어지면 이에 따라 제너레이터 함수를 실행하여 비동기가 작업을 처리 후 액션을 디스패치

```js
import * as postsAPI from "../api/posts"; // api/posts 안의 함수 모두 불러오기
import {
  reducerUtils,
  handleAsyncActions,
  handleAsyncActionsById,
} from "../lib/asyncUtils";
import { call, put, takeEvery } from "redux-saga/effects";

/* 액션 타입 */

// 포스트 여러개 조회하기
const GET_POSTS = "GET_POSTS"; // 요청 시작
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS"; // 요청 성공
const GET_POSTS_ERROR = "GET_POSTS_ERROR"; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";

export const getPosts = () => ({ type: GET_POSTS });
// payload는 파라미터 용도, meta는 리듀서에서 id를 알기위한 용도
export const getPost = (id) => ({ type: GET_POST, payload: id, meta: id });

function* getPostsSaga() {
  try {
    const posts = yield call(postsAPI.getPosts); // call 을 사용하면 특정 함수를 호출하고, 결과물이 반환 될 때까지 기다려줄 수 있습니다.
    yield put({
      type: GET_POSTS_SUCCESS,
      payload: posts,
    }); // 성공 액션 디스패치
  } catch (e) {
    yield put({
      type: GET_POSTS_ERROR,
      error: true,
      payload: e,
    }); // 실패 액션 디스패치
  }
}

// 액션이 지니고 있는 값을 조회하고 싶다면 action을 파라미터로 받아와서 사용 할 수 있습니다.
function* getPostSaga(action) {
  const param = action.payload;
  const id = action.meta;
  try {
    const post = yield call(postsAPI.getPostById, param); // API 함수에 넣어주고 싶은 인자는 call 함수의 두번째 인자부터 순서대로 넣어주면 됩니다.
    yield put({
      type: GET_POST_SUCCESS,
      payload: post,
      meta: id,
    });
  } catch (e) {
    yield put({
      type: GET_POST_ERROR,
      error: true,
      payload: e,
      meta: id,
    });
  }
}

// 사가들을 합치기
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
}

// 3번째 인자를 사용하면 withExtraArgument 에서 넣어준 값들을 사용 할 수 있습니다.
export const goToHome =
  () =>
  (dispatch, getState, { history }) => {
    history.push("/");
  };

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했습니다.
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial(),
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, "posts", true)(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActionsById(GET_POST, "post", true)(state, action);
    default:
      return state;
  }
}
```
