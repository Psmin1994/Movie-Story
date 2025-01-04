import pool from "../config/dbPool.js";

class userStorage {
  static async checkUser(id) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("select EXISTS (SELECT id FROM user WHERE id = ?) AS isExist", [id]);

      await conn.commit();

      return rows[0].isExist;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getUserById(id) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("SELECT * FROM user WHERE id = ?", [id]);

      await conn.commit();

      return rows[0];
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async getUserInfo(userId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("SELECT * FROM userInfo WHERE user_id = ?", [userId]);

      await conn.commit();

      return rows[0];
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async createUser(userInfo) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const row = await conn.query("INSERT INTO user (id, password) VALUES (?, ?)", [userInfo.id, userInfo.password]);

      await conn.query("INSERT INTO userInfo (user_id, nickname) VALUES (?, ?)", [row[0].insertId, userInfo.nickname]);

      await conn.commit();

      return;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }
}

export default userStorage;
