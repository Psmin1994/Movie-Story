import movieStorage from "../models/movie.model.js";

export default {
  getMovie: async (req, res) => {
    const data = await movieStorage.getAllMovie();

    res.json(data);
  },
};
