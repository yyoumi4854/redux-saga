import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import rootReducer from "./reducers";
import logger from "redux-logger";

// Redux Saga 미들웨어 생성
const sagaMiddleware = createSagaMiddleware();

// Store 생성
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));

// Saga middleware 실행
sagaMiddleware.run(rootSaga);

export default store;
