import express from "express";
import ctrl from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/movie", ctrl.getMovie);

export default router;
