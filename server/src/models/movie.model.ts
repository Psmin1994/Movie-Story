import { prisma, handlePrismaError } from "config/prismaClient.js";
import fs from "fs";

class MovieDAO {
  // 전체 영화 정보 조회
  static async getMovie() {
    try {
      const movies = await prisma.movie.findMany();

      return movies;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 정보 가져오기 (ID로)
  static async getMovieById(movieId: number) {
    try {
      let movie = await prisma.movie.findUnique({
        where: { movie_id: movieId },
        include: {
          movie_info: true, // user_info 포함
        },
      });

      return movie;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 상세 정보 가져오기 (ID로)
  static async getMovieInfoById(movieId: number) {
    try {
      const movieInfo = await prisma.movie_info.findUnique({
        where: { movie_id: movieId },
      });

      return movieInfo;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 검색 (제목으로 검색)
  static async getMovieBySearch(searchStr: string) {
    try {
      const movies = await prisma.movie.findMany({
        where: {
          movie_nm: {
            contains: searchStr,
          },
        },
      });

      return movies;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 장르 가져오기 (ID로)
  static async getGenreByMovieId(movieId: number) {
    try {
      const genres = await prisma.genre.findMany({
        where: {
          movie_and_genre: {
            some: {
              movie_id: movieId,
            },
          },
        },
      });

      return genres;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 배우 정보 가져오기 (ID로)
  static async getActorByMovieId(movieId: number) {
    try {
      const actors = await prisma.actor.findMany({
        where: {
          movie_and_actor: {
            some: {
              movie_id: movieId,
            },
          },
        },
      });

      return actors;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 감독 정보 가져오기 (ID로)
  static async getDirectorByMovieId(movieId: number) {
    try {
      const directors = await prisma.director.findMany({
        where: {
          movie_and_director: {
            some: {
              movie_id: movieId,
            },
          },
        },
      });

      return directors;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 장르로 영화 리스트 가져오기
  static async getMovieByGenreId(genreId: number) {
    try {
      const movies = await prisma.movie.findMany({
        where: {
          movie_and_genre: {
            some: {
              genre_id: genreId,
            },
          },
        },
      });

      return movies;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  static getBoxOffice() {
    try {
      // 현재 Node.js 프로세스의 루트 디렉토리
      // process.cwd()

      let readData = fs.readFileSync(`./data/boxOffice.json`, "utf-8");

      let rows = JSON.parse(readData);

      return rows;
    } catch (err) {
      throw err;
    }
  }
}

export default MovieDAO;
