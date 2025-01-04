import fs from "fs";
import movieStorage from "./model/movieInsert.model.js";

let setBoxOffice = async (browser, page) => {
  try {
    await page.goto("https://www.naver.com/");

    await page.type("#query", `박스 오피스 순위`);

    await page.click("#sform > fieldset > button");

    await page.waitForSelector(
      "div.cm_content_wrap > div > div > div.mflick > div._panel_popular._tab_content > div.list_image_info.type_pure_top > div > ul:nth-child(1) > li:last-child"
    );

    let boxOfficeList = await page.$$(
      "div.cm_content_wrap > div > div > div.mflick > div._panel_popular._tab_content > div.list_image_info.type_pure_top > div > ul:nth-child(1) > li"
    );

    let today = [];

    let cnt = 1;
    let skip = 0;

    for (let node of boxOfficeList) {
      if (cnt > 10) break;

      let movieNm = await node.$eval("a > div > div > img", (el) => {
        return el.alt;
      });

      let movieId = null;

      try {
        movieId = await movieStorage.getMovieId(movieNm);
      } catch {
        movieId = false;
      }

      if (movieId == false) {
        skip++;

        continue;
      }

      let movie = {};

      let rank = await node.$eval("a > div > div > span", (el) => {
        return el.textContent;
      });

      movie.movieId = movieId;
      movie.rank = Number(rank) - skip;
      movie.change = 0;
      movie.new = false;

      today.push(movie);

      console.log(`${cnt++} / 10 완료`);
    }

    // 브라우저를 종료한다.
    await browser.close();

    // 현재 Node.js 프로세스의 루트 디렉토리
    // console.log(process.cwd())
    let readData = fs.readFileSync("./scraping/boxOffice.json", "utf-8");

    // readData은 JSON 문자열이므로 객체로 파싱
    let prevArr = Object.values(JSON.parse(readData));

    let prevCheckArr = prevArr.map((Obj) => {
      return Obj.movieId;
    });

    today.forEach((movie, i) => {
      if (prevCheckArr.includes(movie.movieId)) {
        let prevIndex = prevCheckArr.indexOf(movie.movieId);

        let prevRank = prevArr[prevIndex].rank;
        let todayRank = today[i].rank;

        today[i].change = prevRank - todayRank;
      } else {
        today[i].new = true;
      }
    });

    // 객체를 JSON 문자열로 변환
    let saveData = JSON.stringify(today);

    fs.writeFileSync("./scraping/boxOffice.json", saveData);
  } catch (err) {
    throw err;
  }
};

export default setBoxOffice;
