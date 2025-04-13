import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getAllMovies() {
    return this.movieService.getAllMovies();
  }

  @Get('genre')
  getAllGenres() {
    return this.movieService.getAllGenres();
  }

  @Get('chart')
  getMovieRanking() {
    return this.movieService.getMovieRanking();
  }

  @Get('search')
  searchMovie(@Query('searchStr') searchStr: string) {
    const decodedSearchStr = decodeURIComponent(searchStr ?? '');

    return this.movieService.searchMovie(decodedSearchStr);
  }

  @Get('overview/:id')
  getMovieById(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.getMovieById(id);
  }

  @Get('detail/:id')
  getMovieDetailById(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.getMovieDetailById(id);
  }

  @Get('actor/:id')
  getActorById(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.getActorById(id);
  }

  @Get('director/:id')
  getDirectorById(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.getDirectorById(id);
  }
}
