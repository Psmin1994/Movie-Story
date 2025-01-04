import mysql from "mysql2/promise";
import dotenv from "dotenv";

// dotenv는 현재 Node.js 프로세스의 루트 디렉토리
// console.log(process.cwd())
dotenv.config();
// console.log(process.env.DB_USER);

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

// MySQL 연결 확인 함수
const testConnection = async () => {
  try {
    const conn = await pool.getConnection();

    console.log("Database connection successful");

    conn.release();
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};

// 테스트 실행
await testConnection();

export default pool;
