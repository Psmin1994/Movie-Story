import React from "react";
import styled from "styled-components";
import MovieChartListItem from "./MovieChartListItem";
import Slider from "react-slick";
import CustomArrow from "components/ui/CustomArrow";
import "./Carousel.css"; // 추가적인 스타일이 필요하다면 이 파일에서 설정

const MovieChartList = (props) => {
  const { movieChart, onClickItem } = props;

  const settings = {
    arrows: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    infinite: true,

    prevArrow: <CustomArrow direction="left" size="1" />,
    nextArrow: <CustomArrow direction="right" size="1" />,
  };

  return (
    <Wrapper className="carousel-container">
      <Slider {...settings}>
        {movieChart.map((movie, index) => {
          return (
            <MovieChartListItem
              key={movie.movieId}
              movieId={movie.movieId}
              rank={index}
              change={movie.change}
              isNew={movie.new}
              onClickItem={onClickItem}
            />
          );
        })}
      </Slider>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 924px;
  padding: 0 24px;
  margin: 0 auto;
  height: 335px;
  overflow: visible;
`;

export default MovieChartList;
