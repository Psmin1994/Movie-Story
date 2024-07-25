import "dotenv/config";
import app from "../app.js";

// schedule
import schedule from "node-schedule";
import scraping from "../scraping/index.js";

schedule.scheduleJob("0 0 6 * * *", async () => {
  // 매일 오전 6시 스크래핑 실행
  await scraping();
});

app.set("port", process.env.PORT || 5000);

app.listen(process.env.PORT, () => {
  console.log("Server on Port ", process.env.PORT);
});
