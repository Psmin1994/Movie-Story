import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateMovieDTO } from '../dto/scraping.dto';

@Injectable()
export class ScrapingDAO {
  constructor(private readonly prisma: PrismaService) {}

  // 영화 ID 조회
  async getMovieId(movieNm: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { movie_nm: movieNm },
      select: { movie_id: true },
    });

    return movie?.movie_id ?? null;
  }

  // 영화 추가
  async insertMovie(movieData: CreateMovieDTO) {
    return this.prisma.$transaction(async (tx) => {
      const newMovie = await tx.movie.create({
        data: {
          movie_nm: movieData.movie_nm,
          open_date: movieData.open_date,
          reopen_date: movieData.reopen_date,
          genre: movieData.genre,
          poster: movieData.poster,
        },
      });

      await tx.movie_info.create({
        data: {
          movie_id: newMovie.movie_id,
          movie_nm_en: movieData.movie_nm_en,
          nation: movieData.nation,
          showtime: movieData.showtime,
          summary: movieData.summary,
          still_cut: movieData.still_cut,
        },
      });

      return newMovie.movie_id;
    });
  }

  // 장르 존재 여부 확인
  async checkGenre(genreNm: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { name: genreNm },
      select: { genre_id: true },
    });

    return genre !== null;
  }

  // 장르 업데이트
  async updateGenre(genreNm: string) {
    const genre = await this.prisma.genre.update({
      where: { name: genreNm },
      data: { count: { increment: 1 } },
    });

    return genre?.count ?? null;
  }

  // 장르 추가
  async insertGenre(genreNm: string) {
    const newGenre = await this.prisma.genre.create({
      data: { name: genreNm },
    });

    return newGenre.genre_id;
  }

  // 배우 ID 조회
  async getActorId(castNm: string, imgUrl: string) {
    const actor = await this.prisma.actor.findFirst({
      where: { name: castNm, profile: imgUrl },
      select: { actor_id: true },
    });

    return actor?.actor_id ?? null;
  }

  // 배우 추가
  async insertActor(castNm: string, imgUrl: string) {
    const actor = await this.prisma.actor.create({
      data: { name: castNm, profile: imgUrl },
    });

    return actor.actor_id;
  }

  // 영화 & 배우 연결
  async insertMovieAndActor(movieId: number, actorId: number) {
    await this.prisma.movie_and_actor.create({
      data: { movie_id: movieId, actor_id: actorId },
    });
  }

  // 배우 ID 조회
  async getDirectorId(castNm: string, imgUrl: string) {
    const director = await this.prisma.director.findFirst({
      where: { name: castNm, profile: imgUrl },
      select: { director_id: true },
    });

    return director?.director_id ?? null;
  }

  // 배우 추가
  async insertDirector(castNm: string, imgUrl: string) {
    const director = await this.prisma.director.create({
      data: { name: castNm, profile: imgUrl },
    });

    return director.director_id;
  }

  // 영화 & 배우 연결
  async insertMovieAndDirector(movieId: number, directorId: number) {
    await this.prisma.movie_and_director.create({
      data: { movie_id: movieId, director_id: directorId },
    });
  }
}
