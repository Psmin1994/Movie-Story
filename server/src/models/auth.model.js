import pool from "../config/dbPool.js";

class authStorage {
  static async getOauthUserById(id) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.query("SELECT * FROM oauth_user WHERE provider_user_id = ?", [id]);

      await conn.commit();

      return rows[0];
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async createOauthUser(userInfo) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const row = await conn.query(
        "INSERT INTO oauth_user (provider, provider_user_id, nickname, email ,access_token,refresh_token) VALUES (?, ?, ?, ?, ?, ?)",
        [userInfo.provider, userInfo.provider_user_id, userInfo.nickname, userInfo.email, userInfo.accessToken, userInfo.refreshToken]
      );

      await conn.commit();

      return row[0].insertId;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }

  static async UpdateOauthUser(oauthUser) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const row = await conn.query("UPDATE oauth_user SET access_token = ?, refresh_token = ? WHERE provider_user_id = ?", [
        oauthUser.accessToken,
        oauthUser.refreshToken,
        oauthUser.provider_user_id,
      ]);

      await conn.commit();

      return row;
    } catch (err) {
      await conn.rollback();

      throw err;
    } finally {
      conn.release();
    }
  }
}

export default authStorage;
