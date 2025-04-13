import { Request, Response, NextFunction } from "express";
import MovieDAO from "models/movie.model.js";

export default {
  getMovies: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await MovieDAO.getMovies();

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

  getMovieDetailsById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let movieId = parseInt(req.params.id);

      const data = await MovieDAO.getMovieDetailsById(movieId);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getMovieBySearch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let encodedSearchStr: string = String(req.query.searchStr || " ");

      const decodedSearchStr = decodeURIComponent(encodedSearchStr);

      const data = await MovieDAO.getMovieBySearch(decodedSearchStr);

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },

  getGenres: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await MovieDAO.getGenres();

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

  getBoxOffice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await MovieDAO.getBoxOffice();

      res.json(data);
    } catch (err) {
      return next(err);
    }
  },
};
