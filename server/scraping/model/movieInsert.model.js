import getConnection from "../../src/config/dbPool.js";

class postStorage {
  static async existMovieNm(movieNm) {
    try {
      const conn = await getConnection();

      let sql = "select EXISTS (SELECT movie_id FROM movie WHERE movie_nm = ? LIMIT 1) AS isExist;";

      let [rows] = await conn.query(sql, [movieNm]);

      conn.release();

      return rows[0].isExist;
    } catch (err) {
      throw err;
    }
  }

  static async insertMovie(movieData) {
    try {
      const conn = await getConnection();

      let sql = "INSERT INTO movie (movie_nm, movie_nm_en, open_date, nation, showtime, summary, poster) VALUES (?, ?, ?, ?, ?, ?, ?);";

      // 객체의 value를 배열로 변환
      let sqlParams = Object.values(movieData);

      let rows = await conn.query(sql, sqlParams);

      conn.release();

      return rows[0].insertId;
    } catch (err) {
      throw err;
    }
  }

  static async getMovieId(movieNm) {
    try {
      const conn = await getConnection();

      let sql = "SELECT movie_id FROM movie WHERE movie_nm = ? LIMIT 1;";

      let [rows] = await conn.query(sql, [movieNm]);

      conn.release();

      return rows[0].movie_id;
    } catch (err) {
      throw err;
    }
  }

  static async existGenreNm(genreNm) {
    try {
      const conn = await getConnection();

      let sql = "SELECT EXISTS (SELECT genre_id FROM genre WHERE name = ? LIMIT 1) AS isExist;";

      let [rows] = await conn.query(sql, [genreNm]);

      conn.release();

      return rows[0].isExist;
    } catch (err) {
      throw err;
    }
  }

  static async getGenreId(genreNm) {
    try {
      const conn = await getConnection();

      let sql = "SELECT genre_id FROM genre WHERE name = ? LIMIT 1";

      let [rows] = await conn.query(sql, [genreNm]);

      conn.release();

      return rows[0].genre_id;
    } catch (err) {
      throw err;
    }
  }

  static async insertGenre(genreNm) {
    try {
      const conn = await getConnection();

      let sql = `INSERT INTO genre (name) VALUES (?);`;

      let rows = await conn.query(sql, [genreNm]);

      conn.release();

      return rows[0].insertId;
    } catch (err) {
      throw err;
    }
  }

  static async insertMovieAndGenre(movieId, genreId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query("INSERT INTO movie_and_genre (movie_id, genre_id) VALUES (?,?)", [movieId, genreId]);

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  // static async existPhotoNm(photo) {
  //   try {
  //     const conn = await getConnection();

  //     let sql = "SELECT EXISTS (SELECT photo_id FROM photo WHERE photo = ? LIMIT 1) AS isExist;";

  //     let [rows] = await conn.query(sql, [photo]);

  //     conn.release();

  //     return rows[0].isExist;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // static async getPhotoId(photo) {
  //   try {
  //     const conn = await getConnection();

  //     let sql = "SELECT photo_id FROM photo WHERE photo = ? LIMIT 1";

  //     let [rows] = await conn.query(sql, [photo]);

  //     conn.release();

  //     return rows[0].photo_id;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  static async insertPhoto(photo) {
    try {
      const conn = await getConnection();

      let sql = `INSERT INTO photo (photo) VALUES (?);`;

      let rows = await conn.query(sql, [photo]);

      conn.release();

      return rows[0].insertId;
    } catch (err) {
      throw err;
    }
  }

  static async insertMovieAndPhoto(movieId, photoId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query("INSERT INTO movie_and_photo (movie_id, photo_id) VALUES (?,?)", [movieId, photoId]);

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async existCastNm(castNm, role) {
    try {
      const conn = await getConnection();

      let sql = `SELECT EXISTS (SELECT ${role}_id FROM ${role} WHERE name = ? LIMIT 1) AS isExist;`;

      let [rows] = await conn.query(sql, [castNm]);

      conn.release();

      return rows[0].isExist;
    } catch (err) {
      throw err;
    }
  }

  static async getCastId(castNm, role) {
    try {
      const conn = await getConnection();

      let sql = `SELECT ${role}_id FROM ${role} WHERE name = ? LIMIT 1`;

      let [rows] = await conn.query(sql, [castNm]);

      conn.release();

      return role == "actor" ? rows[0].actor_id : rows[0].director_id;
    } catch (err) {
      throw err;
    }
  }

  static async insertCast(imgUrl, CastNm, role) {
    try {
      const conn = await getConnection();

      let sql = `INSERT INTO ${role} (profile, name) VALUES (?, ?);`;

      let rows = await conn.query(sql, [imgUrl, CastNm]);

      conn.release();

      return rows[0].insertId;
    } catch (err) {
      throw err;
    }
  }

  static async existMovieAndActor(movieId, actorId) {
    try {
      const conn = await getConnection();

      let sql = `SELECT EXISTS (SELECT actor_id FROM movie_and_actor WHERE movie_id = ? AND actor_id = ? LIMIT 1) AS isExist;`;

      let [rows] = await conn.query(sql, [movieId, actorId]);

      conn.release();

      return rows[0].isExist;
    } catch (err) {
      throw err;
    }
  }

  static async insertMovieAndCast(movieId, CastId, role) {
    try {
      const conn = await getConnection();

      let sql = `INSERT  INTO movie_and_${role} (movie_id, ${role}_id) VALUES (?,?)`;

      const [rows] = await conn.query(sql, [movieId, CastId]);

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async deletePostById(postId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query("DELETE FROM posts WHERE post_id = ?", [postId]);

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getComments(postId) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query("SELECT comment_id, content FROM comments WHERE post_id = ?", [postId]);

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async addComment(postId, content) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query("INSERT INTO comments (content, post_id) VALUE (?, ?)  ", [content, postId]);

      conn.release();

      return rows;
    } catch (err) {
      throw err;
    }
  }
}

export default postStorage;
