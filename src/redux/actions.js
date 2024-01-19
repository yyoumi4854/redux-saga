import * as types from "./actionTypes";

// 액션 생성 함수
export const getWebtoonsRequest = (page, perPage, service, updateDay) => ({ 
  type: types.GET_WEBTOONS_REQUEST,
  payload: { page, perPage, service, updateDay },
});
export const getWebtoonsSuccess = (webtoons) => ({
  type: types.GET_WEBTOONS_SUCCESS,
  payload: webtoons,
});
export const getWebtoonsFailure = (error) => ({
  type: types.GET_WEBTOONS_FAILURE,
  payload: error,
});
