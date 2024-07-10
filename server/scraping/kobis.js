// 영화진흥위원회 공공 데이터 추출
import axios from "axios";

try {
  // 일별 박스오피스 API 요청 주소
  let url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";

  // 가져올 날짜 설정
  let targetDt = `20240203`;

  let res = await axios({
    method: "get",
    url: url,
    params: {
      key: "332ba9ce1cb2f258e6e32ab988458a6c",
      // parameter 로 날짜 지정
      targetDt,
    },
  }); // axios(url[, config]) 형태

  // kobis의 일별 박스오피스 Open API로 가져온 설정 날짜의 상영 영화 정보 배열
  let movieList = res.data.boxOfficeResult.dailyBoxOfficeList;

  console.log(movieList[0]);

  // 가져온 데이터에서 영화 상세 정보 데이터를 얻기 위해 영화 코드(movieCd)를 추출
  let movieCd = movieList[0].movieCd;

  // 영화 상세 정보 API 요청 주소
  url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json`;

  res = await axios({
    method: "get",
    url: url,
    params: {
      key: "332ba9ce1cb2f258e6e32ab988458a6c",
      // 가져올 영화의 영화 코드 지정
      movieCd,
    },
  }); // axios(url[, config]) 형태

  console.log(res.data.movieInfoResult.movieInfo);
} catch (err) {
  console.log(err);
}
