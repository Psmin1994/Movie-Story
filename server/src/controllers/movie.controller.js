import movieStorage from "../models/movie.model.js";

export default {
  getMovie: async (req, res) => {
    const data = await movieStorage.getMovie();

    res.json(data);
  },

  getMovieById: async (req, res) => {
    let movieId = req.params.id;

    const data = await movieStorage.getMovieById(movieId);

    res.json(data);
  },

  getGenreByMovieId: async (req, res) => {
    let movieId = req.params.id;

    const data = await movieStorage.getGenreByMovieId(movieId);

    res.json(data);
  },

  getActorByMovieId: async (req, res) => {
    let movieId = req.params.id;

    const data = await movieStorage.getActorByMovieId(movieId);

    res.json(data);
  },

  getDirectorByMovieId: async (req, res) => {
    let movieId = req.params.id;

    const data = await movieStorage.getDirectorByMovieId(movieId);

    res.json(data);
  },

  getMovieByGenreId: async (req, res) => {
    let genreId = req.params.id;

    const data = await movieStorage.getMovieByGenreId(genreId);

    res.json(data);
  },
};
