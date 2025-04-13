import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { ScrapingDAO } from './dao/scraping.dao';
import { CreateMovieDTO } from './dto/scraping.dto';
import { getImgUrl } from './scraping.utils'; // 유틸 함수
import * as fs from 'fs';

@Injectable()
export class ScrapingService {
  constructor(private readonly scrapingDAO: ScrapingDAO) {}

  // ✅ sleep 함수 모듈화
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getPlayingList(): Promise<{
    urlList: string[];
    browser: Browser;
    page: Page;
  }> {
    try {
      let urlList: string[] = [];

      const crawlList = async (page: Page) => {
        await page.waitForSelector(
          'div.cm_content_wrap > div > div > div > div.card_content._result_area > div.card_area._panel > div:last-child',
        );

        let movieList = await page.$$(
          'div.cm_content_wrap > div > div > div > div.card_content._result_area > div.card_area._panel > div',
        );

        for (let movie of movieList) {
          let href = await movie.$eval(
            'div.data_area > div > div.title > div > a',
            (el) => el.href,
          );

          urlList.push(
            href[0] === '?'
              ? 'https://search.naver.com/search.naver' + href
              : href,
          );
        }
      };

      const browser = await puppeteer.launch({
        headless: true,
      });

      const page = await browser.newPage();

      await page.goto('https://www.naver.com/');

      await page.type('#query', '현재 상영 영화');
      await page.click('#sform > fieldset > button');

      await page.waitForSelector(
        'div.card_content._result_area > div.cm_paging_area._page > div > span > span._total',
      );

      let pageNum = 1;

      try {
        const pageText = await page.$eval(
          'div.card_content._result_area > div.cm_paging_area._page > div > span > span._total',
          (el) => el.textContent?.trim() || '1',
        );

        pageNum = parseInt(pageText, 10) || 1;
      } catch (error) {
        console.warn('⚠️ Failed to retrieve pageNum. Defaulting to 1.', error);
      }

      for (let i = 1; i < pageNum; i++) {
        await crawlList(page);

        await page.click(
          'div.card_content._result_area > div.cm_paging_area._page > div > a.pg_next.on._next',
        );

        await this.sleep(1000);
      }

      await crawlList(page);

      return {
        urlList,
        browser,
        page,
      };
    } catch (err) {
      throw err;
    }
  }

  async insertPlayingMovie(urlList: string[], page: Page, browser: Browser) {
    try {
      let cnt = 1;
      let total = urlList.length;

      for (let href of urlList) {
        try {
          let index = 2;

          let movieData: CreateMovieDTO = {
            movie_nm: '',
            movie_nm_en: '',
            reopen_date: null,
            open_date: new Date(),
            nation: '',
            showtime: 0,
            genre: '',
            summary: '',
            poster: 'http://localhost:5000/img/empty-poster.jpg',
            still_cut: '',
          };

          let genreData: string[] = [];

          console.log(`${cnt++} / ${total} 진행 중 ...`);

          await page.goto(href);

          await page.waitForSelector(
            'div.sub_tap_area > div > div > ul > li:last-child > a',
          );

          let navArr: string[] = [];

          let navList = await page.$$('div.sub_tap_area > div > div > ul > li');

          for (let node of navList) {
            let nav = await node.$eval('a > span.menu', (el) => el.textContent);
            if (nav) navArr.push(nav);
          }

          await page.waitForSelector(
            `div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`,
          );
          await page.click(
            `div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`,
          );
          await page.waitForSelector('div.detail_info > dl > div:last-child');

          movieData.movie_nm = await page.$eval(
            'div.cm_top_wrap > div.title_area > h2 > span.area_text_title > strong',
            (el) => el?.textContent || '',
          );

          let isExist = await this.scrapingDAO.getMovieId(movieData.movie_nm);

          if (isExist) {
            console.log(`${movieData.movie_nm} skip`);
            continue;
          }

          movieData.movie_nm_en = await page.$eval(
            'div.cm_top_wrap > div.title_area > div > span:nth-child(3)',
            (el) => el?.textContent || '',
          );

          let infoList = await page.$$('div.detail_info > dl > div');
          for (let node of infoList) {
            const key = await node.$eval(
              'dt',
              (element) => element.textContent,
            );
            const value = await node.$eval(
              'dd',
              (element) => element.textContent,
            );
            if (value) {
              switch (key) {
                case '재개봉':
                  movieData.reopen_date = new Date(
                    value.replace(/\.$/, '').replaceAll('.', '-'),
                  );
                  break;
                case '개봉':
                  movieData.open_date = new Date(
                    value.replace(/\.$/, '').replaceAll('.', '-'),
                  );
                  break;
                case '장르':
                  let tmp = value.trim().split(/[,\/\s]+/g);

                  movieData.genre = tmp.join(', ');

                  for (let genre of tmp) genreData.push(genre);
                  break;
                case '국가':
                  movieData.nation = value;
                  break;
                case '러닝타임':
                  movieData.showtime = parseInt(value.replace('분', ''), 10);
                  break;
                default:
                  break;
              }
            }
          }

          await page.waitForSelector(
            'div.cm_content_wrap > div.cm_content_area > div > div.intro_box._content > p',
          );

          movieData.summary = await page.$eval(
            'div.cm_content_wrap > div.cm_content_area > div > div.intro_box._content > p',
            (el) => el?.textContent || '',
          );

          if (navArr.includes('포토')) {
            index = navArr.indexOf('포토') + 1;
            let stillCutArr: string[] = [];

            await page.waitForSelector(
              `div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`,
            );
            await page.click(
              `div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`,
            );
            await page.waitForSelector(
              'div.cm_content_wrap > div > div > div > div:last-child > div > div.movie_photo_list._list > div > ul > li:nth-child(1) > a > img',
            );

            let photoList = await page.$$(
              'div.cm_content_wrap > div > div > div > div.area_card',
            );
            for (let node of photoList) {
              let checked = await node.$eval(
                'div > h3 > strong',
                (el) => el.textContent,
              );

              if (checked == '포스터') {
                let posterUrl = await node.$eval(
                  'div > div.movie_photo_list._list > div > ul > li:nth-child(1) > a > img',
                  (el) => el.src,
                );

                movieData.poster = await getImgUrl(
                  posterUrl,
                  movieData.movie_nm_en,
                  'movie',
                  'poster',
                );
              } else if (checked == '스틸컷') {
                let cutList = await node.$$(
                  'div > div.movie_photo_list._list > div > ul > li',
                );

                if (cutList.length > 6) cutList.length = 6;

                for (let i = 0; i < cutList.length; i++) {
                  let imgUrl = await cutList[i].$eval(
                    'a > img',
                    (el) => el.src,
                  );
                  let newImgUrl = await getImgUrl(
                    imgUrl,
                    `${movieData.movie_nm_en}`,
                    'movie',
                    'stillcut',
                    i,
                  );

                  stillCutArr.push(newImgUrl);
                }

                movieData.still_cut = JSON.stringify(stillCutArr);
              }
            }
          }

          let movieId = await this.scrapingDAO.insertMovie(movieData);

          for (let genreNm of genreData) {
            let exists = await this.scrapingDAO.checkGenre(genreNm);

            if (exists) {
              await this.scrapingDAO.updateGenre(genreNm);
            } else {
              await this.scrapingDAO.insertGenre(genreNm);
            }
          }

          index = navArr.indexOf('출연/제작진') + 1;

          await page.waitForSelector(
            `div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`,
          );
          await page.click(
            `div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`,
          );
          await page.waitForSelector('div.cast_box');

          let castList = await page.$$('div.cast_box');

          if (castList.length > 3) castList.length = 2;

          for (let node of castList) {
            let isActor = await node.$eval('h3', (el) =>
              el.textContent == '감독' ? false : true,
            );

            let itemList = await node.$$('ul > li');
            for (let item of itemList) {
              let castCheck = await item.$eval('span', (el) => el.textContent);

              if (!castCheck || castCheck.trim() == '더보기') continue;

              let [imgUrl, imgName] = await item.$eval(
                'div.thumb > img',
                (el) => [el.src, el.alt],
              );

              imgUrl =
                imgName == '이미지 준비중'
                  ? 'http://localhost:5000/img/empty.png'
                  : await getImgUrl(
                      imgUrl,
                      imgName,
                      isActor ? 'actor' : 'director',
                    );

              const castNm = imgName == '이미지 준비중' ? castCheck : imgName;

              if (isActor) {
                let actorId = await this.scrapingDAO.getActorId(castNm, imgUrl);
                if (!actorId)
                  actorId = await this.scrapingDAO.insertActor(castNm, imgUrl);
                await this.scrapingDAO.insertMovieAndActor(movieId, actorId);
              } else {
                let directorId = await this.scrapingDAO.getDirectorId(
                  castNm,
                  imgUrl,
                );
                if (!directorId)
                  directorId = await this.scrapingDAO.insertDirector(
                    castNm,
                    imgUrl,
                  );
                await this.scrapingDAO.insertMovieAndDirector(
                  movieId,
                  directorId,
                );
              }
            }
          }
        } catch (err) {
          console.log(err);
          continue;
        }
      }

      await browser.close();
    } catch (err) {
      throw err;
    }
  }

  // 박스오피스 순위 업데이트 함수
  async updateRank(): Promise<void> {
    let browser: Browser | null = null;
    const today: {
      movieId: number;
      rank: number;
      change: number;
      new: boolean;
    }[] = [];
    let skip = 0;
    let cnt = 1;

    try {
      // Puppeteer 브라우저 인스턴스 생성
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto('https://www.naver.com/');
      await page.type('#query', '박스 오피스 순위');
      await page.click('#sform > fieldset > button');

      // 상위 10위 영화 리스트 로딩 대기
      await page.waitForSelector(
        'div.cm_content_wrap > div > div > div.mflick > div._panel_popular._tab_content > div.list_image_info.type_pure_top > div > ul:nth-child(1) > li:last-child',
      );

      // 영화 목록 추출
      const boxOfficeList = await page.$$(
        'div.cm_content_wrap > div > div > div.mflick > div._panel_popular._tab_content > div.list_image_info.type_pure_top > div > ul:nth-child(1) > li',
      );

      for (const node of boxOfficeList) {
        if (cnt > 10) break;

        const movieNm = await node.$eval('a > div > div > img', (el) => el.alt);
        const movieId = await this.scrapingDAO.getMovieId(movieNm);

        if (!movieId) {
          skip++;
          continue;
        }

        const rank = await node.$eval(
          'a > div > div > span',
          (el) => el.textContent,
        );

        today.push({
          movieId,
          rank: Number(rank) - skip,
          change: 0,
          new: false,
        });

        console.log(`${cnt++} / 10 완료`);
      }

      // 브라우저 종료
      await browser.close();

      // boxOffice.json 파일 읽기
      const readData = fs.readFileSync(`./data/boxOffice.json`, 'utf-8');
      const prevArr: {
        movieId: number;
        rank: number;
        change: number;
        new: boolean;
      }[] = Object.values(JSON.parse(readData));
      const prevCheckArr = prevArr.map((movie) => movie.movieId);

      // 이전 순위와 비교하여 순위 변화 추적
      today.forEach((movie, i) => {
        if (prevCheckArr.includes(movie.movieId)) {
          const prevIndex = prevCheckArr.indexOf(movie.movieId);
          const prevRank = prevArr[prevIndex].rank;
          const todayRank = today[i].rank;
          today[i].change = prevRank - todayRank;
        } else {
          today[i].new = true;
        }
      });

      // 데이터 저장
      const saveData = JSON.stringify(today);
      fs.writeFileSync('./data/boxOffice.json', saveData);
    } catch (err) {
      console.error('박스오피스 순위 업데이트 중 오류 발생', err);
      throw err;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
