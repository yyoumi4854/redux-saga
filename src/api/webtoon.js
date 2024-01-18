import axios from "axios";

const instance = axios.create({
  baseURL: "https://korea-webtoon-api.herokuapp.com",
  headers: { "X-Custom-Header": "foobar" },
});

export const getWebtoons = async () => {
  const result = await instance.get("/");
  return result;
};
