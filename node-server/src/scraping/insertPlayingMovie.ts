import { Page, Browser } from "puppeteer";
import getImgUrl from "./getImgUrl.js";
import { CreateMovieDTO } from "dtos/movie.dto";
import MovieDAO from "./model/movieInsert.model.js";

var insertPlayingMovie = async (urlList: string[], page: Page, browser: Browser) => {
  try {
    let cnt = 1;
    let total = urlList.length;

    for (let href of urlList) {
      try {
        let index = 2;

        let movieData: CreateMovieDTO = {
          movie_nm: "",
          movie_nm_en: "",
          reopen_date: null,
          open_date: new Date(),
          nation: "",
          showtime: 0,
          genre: "",
          summary: "",
          poster: "http://localhost:5000/img/empty-poster.jpg",
          still_cut: "",
        };

        let genreData: string[] = [];

        console.log(`${cnt++} / ${total} 진행 중 ...`);

        // 영화 기본 정보 페이지로 이동
        await page.goto(href);

        await page.waitForSelector("div.sub_tap_area > div > div > ul > li:last-child > a");

        let navArr: string[] = [];

        let navList = await page.$$("div.sub_tap_area > div > div > ul > li");

        for (let node of navList) {
          let nav = await node.$eval("a > span.menu", (el) => el.textContent);

          if (nav) navArr.push(nav);
        }

        // 정보 페이지 이동
        await page.waitForSelector(`div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`);

        await page.click(`div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`);

        await page.waitForSelector("div.detail_info > dl > div:last-child");

        // 영화 데이터 추출
        movieData.movie_nm = await page.$eval("div.cm_top_wrap > div.title_area > h2 > span.area_text_title > strong", (el) => {
          return el?.textContent || "";
        });

        let isExist = await MovieDAO.getMovieId(movieData.movie_nm);

        if (isExist) {
          console.log(`${movieData.movie_nm} skip`);
          continue;
        }

        movieData.movie_nm_en = await page.$eval("div.cm_top_wrap > div.title_area > div > span:nth-child(3)", (el) => {
          return el?.textContent || "";
        });

        let infoList = await page.$$("div.detail_info > dl > div");

        for (let node of infoList) {
          const key = await node.$eval("dt", (element) => {
            return element.textContent;
          });

          const value = await node.$eval("dd", (element) => {
            return element.textContent;
          });

          if (value) {
            switch (key) {
              case "재개봉":
                movieData.reopen_date = new Date(value.replace(/\.$/, "").replaceAll(".", "-"));
                break;

              case "개봉":
                movieData.open_date = new Date(value.replace(/\.$/, "").replaceAll(".", "-"));
                break;

              // 장르 데이터는 따로 저장
              case "장르":
                movieData.genre = value.replace(/[,\/\s]+/, ",");

                let tmp = value.split(/[,\/\s]+/);

                for (let genre of tmp) genreData.push(genre);
                break;

              case "국가":
                movieData.nation = value;
                break;

              case "러닝타임":
                movieData.showtime = parseInt(value.replace("분", ""), 10);
                break;

              default:
                break;
            }
          }
        }

        await page.waitForSelector("div.cm_content_wrap > div.cm_content_area > div > div.intro_box._content > p");

        movieData.summary = await page.$eval("div.cm_content_wrap > div.cm_content_area > div > div.intro_box._content > p", (el) => {
          return el?.textContent || "";
        });

        // 포토 페이지가 있을 경우
        if (navArr.includes("포토")) {
          index = navArr.indexOf("포토") + 1;

          let stillCutArr: string[] = [];

          await page.waitForSelector(`div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`);

          // 포토 페이지로 이동
          await page.click(`div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`);

          await page.waitForSelector(
            "div.cm_content_wrap > div > div > div > div:last-child > div > div.movie_photo_list._list > div > ul > li:nth-child(1) > a > img"
          );

          let photoList = await page.$$("div.cm_content_wrap > div > div > div > div.area_card");

          for (let node of photoList) {
            let checked = await node.$eval("div > h3 > strong", (el) => {
              return el.textContent;
            });

            if (checked == "포스터") {
              let posterUrl = await node.$eval("div > div.movie_photo_list._list > div > ul > li:nth-child(1) > a > img", (el) => {
                return el.src;
              });

              movieData.poster = await getImgUrl(posterUrl, movieData.movie_nm_en, `movie/${movieData.movie_nm_en}/poster`);
            } else if (checked == "스틸컷") {
              let cutList = await node.$$("div > div.movie_photo_list._list > div > ul > li");

              // 영화 스틸 컷 6장 까지만 추출
              if (cutList.length > 6) cutList.length = 6;

              for (let i = 0; i < cutList.length; i++) {
                let imgUrl = await cutList[i].$eval("a > img", (el) => {
                  return el.src;
                });

                let newImgUrl = await getImgUrl(imgUrl, `${movieData.movie_nm_en}_${i}`, `movie/${movieData.movie_nm_en}/stillcut`);

                stillCutArr.push(newImgUrl);
              }

              movieData.still_cut = JSON.stringify(stillCutArr);
            }
          }
        }

        // *************************************************
        // movie 테이블 삽입
        let movieId = await MovieDAO.insertMovie(movieData);

        // genre 테이블 삽입
        for (let genreNm of genreData) {
          let exists = await MovieDAO.checkGenreById(genreNm);

          if (exists) {
            await MovieDAO.updateGenre(genreNm);
          } else {
            await MovieDAO.insertGenre(genreNm);
          }
        }

        // *****************************************************
        // 감독/출연 페이지로 이동
        index = navArr.indexOf("출연/제작진") + 1;

        await page.waitForSelector(`div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`);

        await page.click(`div.sub_tap_area > div > div > ul > li:nth-child(${index}) > a`);

        await page.waitForSelector("div.cast_box");

        let castList = await page.$$("div.cast_box");

        if (castList.length > 3) castList.length = 2;

        for (let node of castList) {
          // node가 배우인지 감독인지 구분
          let isActor = await node.$eval("h3", (el) => {
            return el.textContent == "감독" ? false : true;
          });

          let itemList = await node.$$("ul > li");

          for (let item of itemList) {
            // 이름 추출
            let castCheck = await item.$eval("span", (el) => {
              return el.textContent;
            });

            if (!castCheck || castCheck.trim() == "더보기") continue;

            let [imgUrl, imgName] = await item.$eval("div.thumb > img", (el) => {
              return [el.src, el.alt];
            });

            // 이미지 추출
            imgUrl =
              imgName == "이미지 준비중"
                ? "http://localhost:5000/img/empty.png"
                : await getImgUrl(imgUrl, imgName, isActor ? "actor" : "director");

            // *****************************************
            // actor, director 테이블 삽입
            const castNm = imgName == "이미지 준비중" ? castCheck : imgName;

            if (isActor) {
              let actorId = await MovieDAO.getActorId(castNm, imgUrl);

              if (!actorId) actorId = await MovieDAO.insertActor(castNm, imgUrl);

              await MovieDAO.insertMovieAndActor(movieId, actorId);
            } else {
              let directorId = await MovieDAO.getDirectorId(castNm, imgUrl);

              if (!directorId) directorId = await MovieDAO.insertDirector(castNm, imgUrl);

              await MovieDAO.insertMovieAndDirector(movieId, directorId);
            }
          }
        }
      } catch (err) {
        console.log(err);

        continue;
      }
    }

    // 브라우저를 종료한다.
    await browser.close();
  } catch (err) {
    throw err;
  }
};

export default insertPlayingMovie;
