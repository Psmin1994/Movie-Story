import getConnection from "../config/dbPool.js";

class movieStorage {
  static async getMovie() {
    try {
      const conn = await getConnection();

      // movie_id, movie_nm, open_date, showtime, poster
      const [rows] = await conn.query(
        "SELECT movie_id, movie_nm, DATE_FORMAT(open_date, '%Y-%m-%d') AS open_date, showtime, poster FROM movie"
      );

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getMovieById(movieId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query("SELECT movie_nm_en, nation, summary, still_cut FROM movie WHERE movie_id = ?", [movieId]);

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getGenreByMovieId(movieId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query(
        "SELECT g.name FROM genre g LEFT JOIN movie_and_genre mNg ON (g.genre_id = mNg.genre_id) WHERE mNg.movie_id = ?",
        [movieId]
      );

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getActorByMovieId(movieId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query(
        "SELECT a.name, a.profile FROM actor a LEFT JOIN movie_and_actor mNa ON (a.actor_id = mNa.actor_id) WHERE mNa.movie_id = ?",
        [movieId]
      );

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getDirectorByMovieId() {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query(
        "SELECT d.name, d.profile FROM director a LEFT JOIN movie_and_director mNd ON (d.director_id = mNd.director_id) WHERE mNd.movie_id = ?",
        [movieId]
      );

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getMovieByGenreId(genreId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query(
        "SELECT m.movie_id, m.movie_nm, m.open_date, m.showtime, m.poster FROM movie m LEFT JOIN movie_and_genre mNg ON (m.movie_id = mNg.movie_id) WHERE mNg.genre_id = ?",
        [genreId]
      );

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }
}

export default movieStorage;
