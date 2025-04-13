import React from "react";
import styled from "styled-components";
import MovieListItem from "./MovieListItem";

const MovieList = (props) => {
  const { movies, onClickItem } = props;

  return (
    <GridContainer className="grid-container">
      {movies.map((movie) => {
        return <MovieListItem key={movie.movie_id} movieId={movie.movie_id} onClickItem={onClickItem} />;
      })}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  width: 972px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

export default MovieList;
