import app from "../app.js";
import redisClient from "../src/config/redis.js";
import "dotenv/config";

// schedule
import schedule from "node-schedule";
import scraping from "../scraping/index.js";

// sec min hour day month 요일
schedule.scheduleJob("0 0 6 * * *", async () => {
  // 매일 오전 6시 스크래핑 실행
  await scraping();
});

app.set("port", process.env.PORT || 5000);

const server = app.listen(process.env.PORT, () => {
  console.log("Server on Port", process.env.PORT);
});

const shutdown = async () => {
  console.log("Shutting Down Server...");

  try {
    await redisClient.quit(); // Redis 연결 닫기
    console.log("Redis connection closed");
  } catch (err) {
    console.error("Error closing Redis connection", err);
  }

  server.close(() => {
    console.log("Server shut down");
    process.exit(0);
  });

  // 5초 후 강제 종료
  setTimeout(() => {
    console.error("Forcing shutdown due to open connections...");
    process.exit(1);
  }, 5000);
};

// 애플리케이션 종료 시점
process.on("SIGINT", shutdown);
