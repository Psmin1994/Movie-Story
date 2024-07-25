import fs from "fs";

let getBoxOffice = async (browser, page) => {
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

    let today = {};

    let cnt = 1;

    for (let node of boxOfficeList) {
      let moveNm = await node.$eval("a > div > div > img", (el) => {
        return el.alt;
      });

      let rank = await node.$eval("a > div > div > span", (el) => {
        return el.textContent;
      });

      if (+rank < 11) {
        today[moveNm] = {};

        today[moveNm].rank = Number(rank);
        today[moveNm].change = 0;
        today[moveNm].new = false;

        console.log(`${cnt++} / 10 완료`);
      } else {
        break;
      }
    }

    // 브라우저를 종료한다.
    await browser.close();

    let dirname = import.meta.dirname;

    let readData = fs.readFileSync(`${dirname}/boxOffice.json`, "utf-8");

    // readData은 JSON 문자열이므로 객체로 파싱
    let yesterday = JSON.parse(readData);

    let prev = Object.keys(yesterday);
    let cur = Object.keys(today);

    for (let movie of cur) {
      if (prev.includes(movie)) {
        let prevRank = yesterday[movie].rank;
        let curRank = today[movie].rank;

        today[movie].change = prevRank - curRank;
      } else {
        today[movie].new = true;
      }
    }

    // 객체를 JSON 문자열로 변환
    let saveData = JSON.stringify(today);

    fs.writeFileSync(`${dirname}/boxOffice.json`, saveData);
  } catch (err) {
    throw err;
  }
};

export default getBoxOffice;
