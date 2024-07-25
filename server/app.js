import express from "express";
import bodyParser from "body-parser";
import morganMiddleware from "./src/middleware/morgan.js";
import movieRouter from "./src/routes/movie.route.js";

const app = express();

let dirname = import.meta.dirname;

// middleware
app.use(express.static(`${dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morganMiddleware);

// router
app.get("/", (req, res) => {
  return res.send("success");
});

app.use("/movie", movieRouter);

// error handler
app.use((err, req, res, next) => {
  console.log("error : \n", err);

  res.status(500).json({
    msg: "Server Error!!",
    error: err,
  });
});

export default app;
