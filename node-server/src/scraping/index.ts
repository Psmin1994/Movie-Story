import getPlayingList from "./getPlayingList.js";
import insertPlayingMovie from "./insertPlayingMovie.js";
import updateRank from "./updateRank.js";

export const scraping = async () => {
  try {
    let { urlList, browser, page } = await getPlayingList();

    await insertPlayingMovie(urlList, page, browser);
  } catch (err) {
    console.log(err);
  }
};

export const setBoxOffice = async () => {
  try {
    // 박스 오피스 순위 갱신
    await updateRank();
  } catch (err) {
    console.log(err);
  }
};

const initData = async () => {
  await scraping();

  await setBoxOffice();
};

// initData();
