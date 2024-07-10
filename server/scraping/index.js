import getList from "./getList.js";
import insertData from "./insertData.js";
import getBoxOffice from "./getBoxOffice.js";

let scraping = async () => {
  try {
    let [urlList, browser, page] = await getList();

    await insertData(urlList, page);

    let boxOfficeArr = await getBoxOffice(browser, page);

    return boxOfficeArr;
  } catch (err) {
    throw err;
  }
};

export default scraping;
