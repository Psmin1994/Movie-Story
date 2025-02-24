import app from "app.js";
import "dotenv/config";

// redis 사용 시 활성화
// import redisClient from "config/redisClient.js";

// schedule
import schedule from "node-schedule";
import { scraping, setBoxOffice } from "scraping/index.js";

// sec min hour day month 요일
schedule.scheduleJob("0 0 6 * * *", async () => {
  // 매일 오전 6시 스크래핑 실행
  await scraping();
});

// sec min hour day month 요일
schedule.scheduleJob("0 30 6 * * 1", async () => {
  // 매주 월요일 오전 6시 30분 박스오피스 갱신
  await setBoxOffice();
});

app.set("port", process.env.PORT || 5000);

const server = app.listen(process.env.PORT, () => {
  console.log("Server on Port", process.env.PORT);
});

const shutdown = async () => {
  console.log("Shutting Down Server...");

  try {
    // Redis 연결 닫기
    // await redisClient.quit();

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
