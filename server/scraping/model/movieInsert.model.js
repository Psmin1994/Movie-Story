import pool from "../../src/config/dbPool.js";

class postStorage {
  static async existMovieNm(movieNm) {
    const conn = await pool.getConnection();

    try {
      let sql = "select EXISTS (SELECT movie_id FROM movie WHERE movie_nm = ? LIMIT 1) AS isExist;";

      await conn.beginTransaction();

      let [rows] = await conn.query(sql, [movieNm]);

      await conn.commit();

      return rows[0].isExist;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getMovieId(movieNm) {
    const conn = await pool.getConnection();

    try {
      let sql = "SELECT movie_id FROM movie WHERE movie_nm = ? LIMIT 1;";

      await conn.beginTransaction();

      let [rows] = await conn.query(sql, [movieNm]);

      await conn.commit();

      return rows[0].movie_id;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async insertMovie(movieData) {
    const conn = await pool.getConnection();

    try {
      let sql =
        "INSERT IGNORE INTO movie (movie_nm, movie_nm_en, open_date, nation, showtime, summary, poster, still_cut) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

      // 객체의 value를 배열로 변환
      let sqlParams = Object.values(movieData);

      await conn.beginTransaction();

      let rows = await conn.query(sql, sqlParams);

      await conn.commit();

      return rows[0].insertId;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async existGenreNm(genreNm) {
    const conn = await pool.getConnection();

    try {
      let sql = "SELECT EXISTS (SELECT genre_id FROM genre WHERE name = ? LIMIT 1) AS isExist;";

      await conn.beginTransaction();

      let [rows] = await conn.query(sql, [genreNm]);

      await conn.commit();

      return rows[0].isExist;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getGenreId(genreNm) {
    const conn = await pool.getConnection();

    try {
      let sql = "SELECT genre_id FROM genre WHERE name = ? LIMIT 1";

      await conn.beginTransaction();

      let [rows] = await conn.query(sql, [genreNm]);

      await conn.commit();

      return rows[0].genre_id;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async insertGenre(genreNm) {
    const conn = await pool.getConnection();

    try {
      let sql = `INSERT IGNORE INTO genre (name) VALUES (?);`;

      await conn.beginTransaction();

      let rows = await conn.query(sql, [genreNm]);

      await conn.commit();

      return rows[0].insertId;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async insertMovieAndGenre(movieId, genreId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("INSERT IGNORE INTO movie_and_genre (movie_id, genre_id) VALUES (?,?)", [movieId, genreId]);

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async existCastNm(castNm, role) {
    const conn = await pool.getConnection();

    try {
      let sql = `SELECT EXISTS (SELECT ${role}_id FROM ${role} WHERE name = ? LIMIT 1) AS isExist;`;

      await conn.beginTransaction();

      let [rows] = await conn.query(sql, [castNm]);

      await conn.commit();

      return rows[0].isExist;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getCastId(castNm, role) {
    const conn = await pool.getConnection();

    try {
      let sql = `SELECT ${role}_id FROM ${role} WHERE name = ? LIMIT 1`;

      await conn.beginTransaction();

      let [rows] = await conn.query(sql, [castNm]);

      await conn.commit();

      return role == "actor" ? rows[0].actor_id : rows[0].director_id;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async insertCast(imgUrl, CastNm, role) {
    const conn = await pool.getConnection();

    try {
      let sql = `INSERT IGNORE INTO ${role} (profile, name) VALUES (?, ?);`;

      await conn.beginTransaction();

      let rows = await conn.query(sql, [imgUrl, CastNm]);

      await conn.commit();

      return rows[0].insertId;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async insertMovieAndCast(movieId, castId, role) {
    const conn = await pool.getConnection();

    try {
      let sql = `INSERT IGNORE INTO movie_and_${role} (movie_id, ${role}_id) VALUES (?,?)`;

      await conn.beginTransaction();

      const [rows] = await conn.query(sql, [movieId, castId]);

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async deletePostById(postId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("DELETE FROM posts WHERE post_id = ?", [postId]);

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getComments(postId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("SELECT comment_id, content FROM comments WHERE post_id = ?", [postId]);

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async addComment(postId, content) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("INSERT IGNORE INTO comments (content, post_id) VALUE (?, ?)  ", [content, postId]);

      await conn.commit();

      return rows;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }
}

export default postStorage;
