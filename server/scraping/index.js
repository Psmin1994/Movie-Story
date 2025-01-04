import getPlayingList from "./getPlayingList.js";
import insertPlayingMovie from "./insertPlayingMovie.js";
import setBoxOffice from "./setBoxOffice.js";

let scraping = async () => {
  try {
    // 현재 상영 중인 영화 리스트
    let [urlList, browser, page] = await getPlayingList();

    await insertPlayingMovie(urlList, page);

    await setBoxOffice(browser, page);
  } catch (err) {
    console.log(err);
  }
};

export default scraping;
