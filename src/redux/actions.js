import * as types from "./actionTypes";

// 액션 생성 함수
export const getWebtoonsRequest = () => ({ type: types.GET_WEBTOONS_REQUEST });
export const getWebtoonsSuccess = (webtoons) => ({
  type: types.GET_WEBTOONS_SUCCESS,
  payload: webtoons,
});
export const getWebtoonsFailure = (error) => ({
  type: types.GET_WEBTOONS_FAILURE,
  payload: error,
});
