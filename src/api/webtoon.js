import axios from "axios";

const instance = axios.create({
  baseURL: "https://korea-webtoon-api.herokuapp.com",
  headers: { "X-Custom-Header": "foobar" },
});

/*
page : number
perPage : number
service : naver | kakao | kakaoPage
updateDay : mon | tue | wed | thu | fri | sat | sun | finished | naverDaily
 */
export const getWebtoons = async (
  page = 1,
  perPage = 10,
  service = "naver",
  updateDay
) => {
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
