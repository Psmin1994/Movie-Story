import { prisma, handlePrismaError } from "config/prismaClient.js";
import { CreateMovieDTO } from "dtos/movie.dto";

class MovieDAO {
  // 영화 ID 가져오기
  static async getMovieId(movieNm: string) {
    try {
      const movie = await prisma.movie.findUnique({
        where: { movie_nm: movieNm },
        select: { movie_id: true },
      });

      return movie?.movie_id ?? null; // null 또는 undefined 면 우측 값 반환
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화 추가
  static async insertMovie(movieData: CreateMovieDTO) {
    try {
      // 트랜잭션을 사용하여 데이터베이스 작업 처리
      const movieId = await prisma.$transaction(async (prismaTransaction) => {
        // 영화 추가
        const newMovie = await prismaTransaction.movie.create({
          data: {
            movie_nm: movieData.movie_nm,
            open_date: movieData.open_date,
            reopen_date: movieData.reopen_date,
            genre: movieData.genre,
            poster: movieData.poster,
          },
        });

        await prismaTransaction.movie_info.create({
          data: {
            movie_id: newMovie.movie_id,
            movie_nm_en: movieData.movie_nm_en,
            nation: movieData.nation,
            showtime: movieData.showtime,
            summary: movieData.summary,
            still_cut: movieData.still_cut,
          },
        });

        // 반환된 새로운 영화 객체의 ID를 반환
        return newMovie.movie_id;
      });

      return movieId;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 장르 ID 가져오기
  static async checkGenreById(genreNm: string) {
    try {
      const genre = await prisma.genre.findUnique({
        where: { name: genreNm },
        select: { genre_id: true },
      });
      return genre !== null;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 장르 ID 가져오기
  static async updateGenre(genreNm: string) {
    try {
      const genre = await prisma.genre.update({
        where: { name: genreNm },
        data: {
          count: {
            increment: 1, // count 값을 1 증가
          },
        },
      });

      return genre?.count ?? null;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 장르 추가
  static async insertGenre(genreNm: string) {
    try {
      // 트랜잭션 : 모든 쿼리 성공 시, 커밋(commit)
      await prisma.$transaction(async (prismaTransaction) => {
        await prismaTransaction.genre.create({
          data: { name: genreNm },
        });

        await prismaTransaction.genre.update({
          where: { name: genreNm },
          data: {
            count: {
              increment: 1, // count 값을 1 증가
            },
          },
        });
      });
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 배우 ID 가져오기 (actor)
  static async getActorId(castNm: string, imgUrl: string) {
    try {
      const actor = await prisma.actor.findFirst({
        where: {
          name: castNm,
          profile: imgUrl,
        },
        select: { actor_id: true },
      });
      return actor?.actor_id ?? null;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 배우 추가 (actor)
  static async insertActor(castNm: string, imgUrl: string) {
    try {
      const cast = await prisma.actor.create({
        data: {
          name: castNm,
          profile: imgUrl,
        },
      });
      return cast.actor_id;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화와 배우 연결 (movie_and_actor)
  static async insertMovieAndActor(movieId: number, actorId: number) {
    try {
      await prisma.movie_and_actor.create({
        data: {
          movie_id: movieId,
          actor_id: actorId,
        },
      });
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 감독 ID 가져오기 (director)
  static async getDirectorId(castNm: string, imgUrl: string) {
    try {
      const director = await prisma.director.findFirst({
        where: { name: castNm, profile: imgUrl },
        select: { director_id: true },
      });
      return director?.director_id ?? null;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 감독 추가 (director)
  static async insertDirector(castNm: string, imgUrl: string) {
    try {
      const cast = await prisma.director.create({
        data: {
          name: castNm,
          profile: imgUrl,
        },
      });

      return cast.director_id;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 영화와 감독 연결 (movie_and_director)
  static async insertMovieAndDirector(movieId: number, directorId: number) {
    try {
      await prisma.movie_and_director.create({
        data: {
          movie_id: movieId,
          director_id: directorId,
        },
      });
    } catch (err) {
      throw handlePrismaError(err);
    }
  }
}

export default MovieDAO;
