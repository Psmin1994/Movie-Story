import mysql from "mysql2/promise";
import dotenv from "dotenv";

// dotenv는 현재 Node.js 프로세스의 루트 디렉토리
// console.log(process.cwd());
dotenv.config({ path: "./server/.env" });

// 새로운 Pool 생성
let pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: process.env.DB_CONN_LIMIT,
  waitForConnections: true,
  queueLimit: 0,
  keepAliveInitialDelay: 10000, // 0 by default.
  enableKeepAlive: true, // false by default
});

// getConnection을 사용하여 Connection을 가져오는 함수
const getConnection = async () => {
  try {
    const connection = await pool.getConnection(); // getConnection()은 Promise를 반환합니다.
    return connection;
  } catch (err) {
    console.error("getConnection error:\n", err);

    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Connection lost. Reconnecting...");

      try {
        // 연결이 끊긴 경우 재시도
        const newConnection = await pool.getConnection();

        return newConnection;
      } catch (reConnErr) {
        console.error("Reconnection failed:", reConnErr);

        throw reConnErr; // 재시도도 실패하면 에러를 다시 throw하여 상위로 전파
      }
    } else {
      throw err; // 다른 에러는 그대로 상위로 전파
    }
  }
};

export default getConnection;
