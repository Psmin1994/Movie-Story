import pool from "../config/dbPool.js";
import fs from "fs";

class movieStorage {
  static async getMovie() {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();
      // movie_id, movie_nm, open_date, showtime, poster
      const [rows] = await conn.query(
        "SELECT movie_id, movie_nm, DATE_FORMAT(open_date, '%Y-%m-%d') AS open_date, showtime, poster FROM movie"
      );

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getMovieBySearch(searchStr) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // movie_id, movie_nm, open_date, showtime, poster
      const [rows] = await conn.query(
        `SELECT movie_id, movie_nm, DATE_FORMAT(open_date, '%Y-%m-%d') AS open_date, showtime, poster FROM movie WHERE movie_nm LIKE '%${searchStr}%'`
      );

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getMovieById(movieId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        "SELECT movie_nm, poster, DATE_FORMAT(open_date, '%Y-%m-%d') AS open_date, showtime FROM movie WHERE movie_id = ?",
        [movieId]
      );

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getMovieDetailById(movieId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("SELECT *, DATE_FORMAT(open_date, '%Y-%m-%d') AS open_date FROM movie WHERE movie_id = ?", [movieId]);

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getGenreByMovieId(movieId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        "SELECT g.name FROM genre g LEFT JOIN movie_and_genre mNg ON (g.genre_id = mNg.genre_id) WHERE mNg.movie_id = ?",
        [movieId]
      );

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getActorByMovieId(movieId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        "SELECT a.name, a.profile FROM actor a LEFT JOIN movie_and_actor mNa ON (a.actor_id = mNa.actor_id) WHERE mNa.movie_id = ?",
        [movieId]
      );

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getDirectorByMovieId(movieId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        "SELECT d.name, d.profile FROM director d LEFT JOIN movie_and_director mNd ON (d.director_id = mNd.director_id) WHERE mNd.movie_id = ?",
        [movieId]
      );

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getMovieByGenreId(genreId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        "SELECT m.movie_id, m.movie_nm, m.open_date, m.showtime, m.poster FROM movie m LEFT JOIN movie_and_genre mNg ON (m.movie_id = mNg.movie_id) WHERE mNg.genre_id = ?",
        [genreId]
      );

      await conn.commit();

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static getBoxOffice() {
    try {
      // 현재 Node.js 프로세스의 루트 디렉토리
      // console.log(process.cwd())

      let readData = fs.readFileSync(`./scraping/boxOffice.json`, "utf-8");

      let rows = JSON.parse(readData);

      return rows;
    } catch (err) {
      throw err;
    }
  }
}

export default movieStorage;
