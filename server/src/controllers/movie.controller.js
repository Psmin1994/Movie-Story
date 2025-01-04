import movieStorage from "../models/movie.model.js";

export default {
  getMovie: async (req, res, next) => {
    try {
      const data = await movieStorage.getMovie();

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getMovieById: async (req, res, next) => {
    try {
      let movieId = req.params.id;

      const data = await movieStorage.getMovieById(movieId);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getMovieBySearch: async (req, res, next) => {
    try {
      let searchStr = req.query.searchStr;

      console.log(req.query);

      const data = await movieStorage.getMovieBySearch(searchStr);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getMovieDetailById: async (req, res, next) => {
    try {
      let movieId = req.params.id;

      const data = await movieStorage.getMovieDetailById(movieId);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getGenreByMovieId: async (req, res, next) => {
    try {
      let movieId = req.params.id;

      const data = await movieStorage.getGenreByMovieId(movieId);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getActorByMovieId: async (req, res, next) => {
    try {
      let movieId = req.params.id;

      const data = await movieStorage.getActorByMovieId(movieId);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getDirectorByMovieId: async (req, res, next) => {
    try {
      let movieId = req.params.id;

      const data = await movieStorage.getDirectorByMovieId(movieId);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getMovieByGenreId: async (req, res, next) => {
    try {
      let genreId = req.params.id;

      const data = await movieStorage.getMovieByGenreId(genreId);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  getBoxOffice: async (req, res, next) => {
    try {
      const data = await movieStorage.getBoxOffice();

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
