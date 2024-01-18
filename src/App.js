import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWebtoonsRequest } from "./redux/actions";

const App = () => {
  const dispatch = useDispatch();
  /* 
  주석 제거하면 오류가 뜸
  */
  const { loading, data, error } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getWebtoonsRequest());
  }, [dispatch]);

  if (loading === undefined) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Webtoons</h1>
      <ul>
        {/* {data.webtoons &&
          data.map((webtoon) => (
            <li key={webtoon.id}>
              {webtoon.title} - {webtoon.author}
            </li>
          ))} */}
      </ul>
    </div>
  );
};

export default App;
