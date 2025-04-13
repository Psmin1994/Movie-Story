export interface CreateMovieDTO {
  movie_nm: string;
  movie_nm_en: string;
  reopen_date: Date | null;
  open_date: Date;
  nation: string;
  showtime: number;
  genre: string;
  summary: string;
  poster: string;
  still_cut: string;
}
