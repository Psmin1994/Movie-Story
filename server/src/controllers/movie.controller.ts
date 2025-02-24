import { Request, Response, NextFunction } from "express";
import MovieDAO from "models/movie.model.js";

export default {
  getMovie: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await MovieDAO.getMovie();

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getMovieById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let movieId = parseInt(req.params.id);

      const data = await MovieDAO.getMovieById(movieId);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getMovieInfoById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let movieId = parseInt(req.params.id);

      const data = await MovieDAO.getMovieInfoById(movieId);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getMovieBySearch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let searchStr: string = String(req.query.searchStr || " ");

      const data = await MovieDAO.getMovieBySearch(searchStr);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getGenreByMovieId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let movieId = parseInt(req.params.id);

      const data = await MovieDAO.getGenreByMovieId(movieId);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getActorByMovieId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let movieId = parseInt(req.params.id);

      const data = await MovieDAO.getActorByMovieId(movieId);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getDirectorByMovieId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let movieId = parseInt(req.params.id);

      const data = await MovieDAO.getDirectorByMovieId(movieId);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getMovieByGenreId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let genreId = parseInt(req.params.id);

      const data = await MovieDAO.getMovieByGenreId(genreId);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getBoxOffice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await MovieDAO.getBoxOffice();

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },
};
