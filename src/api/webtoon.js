import axios from "axios";

const instance = axios.create({
  baseURL: "https://korea-webtoon-api.herokuapp.com",
  headers: { "X-Custom-Header": "foobar" },
});

/*
Parameters:
- options: {
    page: number,
    perPage: number,
    service: "naver" | "kakao" | "kakaoPage",
    updateDay: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | "finished" | "naverDaily"
  }
 */
export const getWebtoons = async (options = {}) => {
  const { page = 1, perPage = 10, service = "naver", updateDay = "mon" } = options;

  const result = await instance.get("/", {
    params: {
      page,
      perPage,
      service,
      updateDay,
    },
  });

  return result;
};
