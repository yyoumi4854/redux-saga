import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWebtoonsRequest } from "./redux/actions";

const App = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state);
  const [requestParams, setRequestParams] = useState({
    page: 1,
    perPage: 10,
    service: "kakao",
    updateDay: "mon"
  });

  useEffect(() => {
    dispatch(getWebtoonsRequest(requestParams));
  }, [dispatch, requestParams]);

  const handleServiceButtonClick = (service) => {
    setRequestParams((prevParams) => ({
      ...prevParams,
      service
    }));
  };

  const handleDayButtonClick = (updateDay) => {
    setRequestParams((prevParams) => ({
      ...prevParams,
      updateDay
    }));
  };

  if (loading === undefined) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Webtoons</h1>
      <div>
        <h2>Service: {requestParams.service}</h2>
        <button onClick={() => handleServiceButtonClick("naver")}>Naver</button>
        <button onClick={() => handleServiceButtonClick("kakao")}>Kakao</button>
        <button onClick={() => handleServiceButtonClick("kakaoPage")}>KakaoPage</button>
      </div>
      <div>
        <h2>Update Day: {requestParams.updateDay}</h2>
        <button onClick={() => handleDayButtonClick("mon")}>Monday</button>
        <button onClick={() => handleDayButtonClick("tue")}>Tuesday</button>
        <button onClick={() => handleDayButtonClick("wed")}>Wednesday</button>
        <button onClick={() => handleDayButtonClick("thu")}>Thursday</button>
        <button onClick={() => handleDayButtonClick("fri")}>Friday</button>
        <button onClick={() => handleDayButtonClick("sat")}>Saturday</button>
        <button onClick={() => handleDayButtonClick("sun")}>Sunday</button>
      </div>
      <ul>
        {data &&
          data.webtoons.map((webtoon) => (
            <li key={webtoon._id}>
              <a href={webtoon.url}>
                <img src={webtoon.img} alt={webtoon.title} />
              </a>
              {webtoon.title} - {webtoon.author}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default App;