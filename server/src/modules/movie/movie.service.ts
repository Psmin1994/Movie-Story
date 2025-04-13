import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async getAllMovies() {
    const movies = await this.prisma.movie.findMany({
      orderBy: [
        {
          reopen_date: {
            sort: 'desc',
            nulls: 'last', // null 값을 마지막에 배치
          },
        },
        { open_date: 'desc' },
      ],
    });
    return movies;
  }

  // 영화 정보 가져오기 (ID로)
  async getMovieById(movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { movie_id: movieId },
    });

    return movie;
  }

  // 영화 상세 정보 가져오기 (ID로)
  async getMovieDetailById(movieId: number) {
    const movieDetail = await this.prisma.movie.findUnique({
      where: { movie_id: movieId },
      include: {
        movie_info: true, // movie_info 포함
      },
    });

    return movieDetail;
  }

  // 영화 검색 (제목으로 검색)
  async searchMovie(searchStr: string) {
    const movies = await this.prisma.movie.findMany({
      where: {
        movie_nm: {
          contains: searchStr,
        },
      },
    });

    return movies;
  }

  // 영화 장르 가져오기
  async getAllGenres() {
    const genres = await this.prisma.genre.findMany({
      orderBy: {
        count: 'desc', // 내림차순 (큰 값 → 작은 값)
      },
    });

    return genres;
  }

  // 영화 배우 정보 가져오기 (ID로)
  async getActorById(movieId: number) {
    const actors = await this.prisma.actor.findMany({
      where: {
        movie_and_actor: {
          some: {
            movie_id: movieId,
          },
        },
      },
    });

    return actors;
  }

  // 영화 감독 정보 가져오기 (ID로)
  async getDirectorById(movieId: number) {
    const directors = await this.prisma.director.findMany({
      where: {
        movie_and_director: {
          some: {
            movie_id: movieId,
          },
        },
      },
    });

    return directors;
  }

  // 박스오피스 데이터 가져오기
  getMovieRanking() {
    try {
      const readData = fs.readFileSync(`./data/boxOffice.json`, 'utf-8');

      return JSON.parse(readData);
    } catch (err) {
      throw err;
    }
  }
}
