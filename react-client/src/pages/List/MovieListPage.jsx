import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAxios from "hooks/useAxios";
import Slider from "react-slick";
import CustomArrow from "components/ui/CustomArrow";
import MovieList from "./MovieList";

const MovieListPage = () => {
  const navigate = useNavigate();

  const [clicked, setClicked] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 상태

  const {
    data: genreList,
    error: genreErr,
    loading: genreLoading,
  } = useAxios({
    url: "/movie/genre",
  });

  const { data, error, loading } = useAxios({
    url: "/movie",
  });

  if (genreLoading)
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );

  if (genreErr)
    return (
      <Container>
        <p>Error: {genreErr.message}</p>
      </Container>
    );

  if (loading)
    return (
      <Container>
        <p>Loading...1</p>
      </Container>
    );

  if (error)
    return (
      <Container>
        <p>Error: {error.message}</p>
      </Container>
    );

  const settings = {
    arrows: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 3,
    infinite: false,
    beforeChange: (_, newIndex) => setCurrentSlide(newIndex), // 슬라이드 변경 시 업데이트

    prevArrow: <CustomArrow direction="left" currentSlide={currentSlide} size="1" />,
    nextArrow: <CustomArrow direction="right" currentSlide={currentSlide} size="1" />,
  };

  let movies;
  let genreNm = "전체 영화";

  let genres = [{ genre_id: 0, name: "전체보기" }, ...genreList];

  if (clicked) {
    genreNm = genres[clicked].name;

    movies = data.filter((movie) => {
      return movie.genre.includes(genreNm);
    });
  } else {
    movies = data;
  }

  const handleClick = (index) => {
    setClicked(index);
  };

  return (
    <Container>
      <Content>
        <Title>{genreNm}</Title>

        {genreList && (
          <NavMenu className="carousel-container">
            <Slider {...settings}>
              {genres.map(({ genre_id, name }, index) => (
                <li key={genre_id}>
                  <TagWrapper data={{ clicked: clicked === index }} onClick={() => handleClick(index)}>
                    {name}
                  </TagWrapper>
                </li>
              ))}
            </Slider>
          </NavMenu>
        )}

        {movies && (
          <MovieList
            movies={movies}
            onClickItem={(movieId) => {
              navigate(`/movie/${movieId}`);
            }}></MovieList>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  width: 1056px;
  padding: 0 24px;
  margin: 0 auto;
`;

const Content = styled.section`
  height: fit-content;
`;

const Title = styled.h2`
  position: relative;
  left: 66px;
  margin: 2rem 0;

  font-size: 1.5rem;
  font-weight: 700;
`;

const NavMenu = styled.div`
  position: relative;
  width: 924px;
  padding: 1rem;
  margin: 0 auto;
  height: fit-content;
  overflow: visible;
`;

const TagWrapper = styled.strong`
  display: block;
  padding: 0 auto;
  font-size: 1rem;
  text-align: center;

  cursor: pointer;

  color: ${(props) => (props.data.clicked ? "black" : "#666")};
  font-weight: ${(props) => (props.data.clicked ? "bold" : "500")};
`;

export default MovieListPage;
