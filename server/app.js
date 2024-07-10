import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import morganMiddleware from "./src/middleware/morgan.js";
import movieRouter from "./src/routes/movie.route.js";
// schedule
import schedule from "node-schedule";
import scraping from "./scraping/index.js";

schedule.scheduleJob("0 0 6 * * *", async () => {
  let result = await scraping();

  console.log(result);
});

let dirname = import.meta.dirname;

const app = express();

app.set("port", process.env.PORT || 5000);

// middleware
app.use(express.static(`${dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morganMiddleware);

// router
app.use("/movie", movieRouter);

// error handler
app.use((err, req, res, next) => {
  console.log("error : \n", err);

  res.status(500).json({
    msg: "Server Error!!",
    error: err,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server on Port ", process.env.PORT);
});
