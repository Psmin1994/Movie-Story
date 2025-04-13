import puppeteer, { Browser, Page } from "puppeteer";

// 현재 상영 영화 추출
var getPlayingList = async (): Promise<{ urlList: string[]; browser: Browser; page: Page }> => {
  try {
    let urlList: string[] = [];

    const sleep = (ms: number) => {
      var start = Date.now() + ms;

      while (Date.now() < start) {}
    };

    const crawlList = async () => {
      await page.waitForSelector(
        "div.cm_content_wrap > div > div > div > div.card_content._result_area > div.card_area._panel > div:last-child"
      );

      let movieList = await page.$$("div.cm_content_wrap > div > div > div > div.card_content._result_area > div.card_area._panel > div");

      for (let movie of movieList) {
        let href = await movie.$eval("div.data_area > div > div.title > div > a", (el) => {
          return el.href;
        });

        urlList.push(href[0] == "?" ? "https://search.naver.com/search.naver" + href : href);
      }
    };

    // 옵션으로 headless모드를 끌 수 있다.
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto("https://www.naver.com/");

    await page.type("#query", `현재 상영 영화`);

    await page.click("#sform > fieldset > button");

    await page.waitForSelector("div.card_content._result_area > div.cm_paging_area._page > div > span > span._total");

    // let pageNum = 1;

    let pageNum = parseInt(
      await page.$eval("div.card_content._result_area > div.cm_paging_area._page > div > span > span._total", (el: HTMLElement) => {
        return el.textContent || "1";
      }),
      10
    );

    for (let i = 1; i < pageNum; i++) {
      await crawlList();

      await page.click("div.card_content._result_area > div.cm_paging_area._page > div > a.pg_next.on._next");

      sleep(1000);
    }

    await crawlList();

    // 개봉 예정 영화
    // await page.click("div.list_type > div > div.title_area.type_keep > div > div > div > ul > li:nth-child(3) > a");

    // await crawlList();

    // await page.click("div.card_content._result_area > div.cm_paging_area._page > div > a.pg_next.on._next");

    // sleep(1000);

    // await crawlList();

    return {
      urlList,
      browser,
      page,
    };
  } catch (err) {
    throw err;
  }
};

export default getPlayingList;
