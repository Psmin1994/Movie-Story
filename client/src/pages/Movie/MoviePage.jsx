import React, { useEffect } from "react";
import StillCutItem from "./StillCutItem";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Slider from "react-slick";
import useAxios from "hooks/useAxios";
import BasicButton from "components/ui/BasicButton";
import CustomArrow from "components/ui/CustomArrow";

const MoviePage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    data: movie,
    error,
    loading,
  } = useAxios({
    url: `/movie/${id}`,
  });

  const { data: actor } = useAxios({ url: `/movie/actor/${id}` });
  const { data: director } = useAxios({ url: `/movie/director/${id}` });
  const { data: genre } = useAxios({ url: `/movie/genre/${id}` });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // 페이지가 처음 로드될 때만 실행

  if (loading)
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );

  if (error)
    return (
      <Container>
        <p>Error: {error.message}</p>
      </Container>
    );

  const stillCutSettings = {
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,

    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };

  const castSettings = {
    arrows: true,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,

    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };

  let genreNmArr = genre
    ? genre.map((item) => {
        return item.name;
      })
    : [];

  let genreStr = genreNmArr.join(", ");

  let directorNmArr = director
    ? director.map((item) => {
        return item.name;
      })
    : [];

  let directorStr = directorNmArr.join(", ");

  let actorNmArr = actor
    ? actor.map((item) => {
        return item.name;
      })
    : [];

  let actorStr = actorNmArr.join(", ");

  let movieInfo = movie.movie_info;

  movie.open_date = new Date(movie.open_date).toISOString().slice(0, 10);

  return (
    <Container>
      <ContentWrapper>
        <MovieInfo>
          <PosterWrapper>
            <Poster src={movie.poster} alt={movie.movie_nm}></Poster>
            <ButtonWrapper>
              <BasicButton
                addStyle={{
                  width: "100%",
                }}
                title="좋아요 N"
                onClickItem={() => navigate("/")}
              />

              <BasicButton
                addStyle={{
                  width: "100%",
                }}
                title="예매하기"
                onClickItem={() => navigate("/")}
              />
            </ButtonWrapper>
          </PosterWrapper>

          <InfoContainer>
            <TitleWrap>
              <Title>{movie.movie_nm}</Title>
              <TitleEn>{movieInfo.movie_nm_en}</TitleEn>
            </TitleWrap>

            <InfoWrap>
              {directorStr && <Info>감독 : {directorStr}</Info>}
              {actorStr && <Info>배우 : {actorStr}</Info>}
              {genreStr && <Info>장르 : {genreStr}</Info>}
              <Info>제작국가 : {movieInfo.nation}</Info>
              <Info>
                상영시간 : {movieInfo.showtime} 분 / 개봉일 : {movie.open_date}
              </Info>
            </InfoWrap>

            <SummaryWrap>
              <Summary>{movieInfo.summary}</Summary>
            </SummaryWrap>
          </InfoContainer>
        </MovieInfo>

        {movieInfo.still_cut ? (
          <>
            <HeadingWrapper>
              <Heading>스틸컷</Heading>
            </HeadingWrapper>

            <ListWrapper>
              <Slider {...stillCutSettings}>
                {JSON.parse(movieInfo.still_cut).map((src) => {
                  return <StillCutItem src={src} alt={movie.movie_nm} />;
                })}
              </Slider>
            </ListWrapper>
          </>
        ) : null}

        {directorStr && (
          <>
            <HeadingWrapper>
              <Heading>감독</Heading>
            </HeadingWrapper>

            <ListWrapper>
              <Slider {...castSettings}>
                {director.map((item, index) => {
                  return (
                    <ItemWrapper key={item.director_id}>
                      <Item src={item.profile} alt={item.name} />
                      <p>{item.name}</p>
                    </ItemWrapper>
                  );
                })}
              </Slider>
            </ListWrapper>
          </>
        )}

        {actorStr && (
          <>
            <HeadingWrapper>
              <Heading>배우</Heading>
            </HeadingWrapper>

            <ListWrapper>
              <Slider {...castSettings}>
                {actor.map((item, index) => {
                  return (
                    <ItemWrapper key={item.actor_id}>
                      <Item src={item.profile} alt={item.name} />
                      <p>{item.name}</p>
                    </ItemWrapper>
                  );
                })}
              </Slider>
            </ListWrapper>
          </>
        )}
      </ContentWrapper>

      <SideWrapper>
        <AdList>
          <Ad>광고</Ad>
          <Ad>광고</Ad>
        </AdList>
      </SideWrapper>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  width: 936px;
  padding: 0 24px;
  margin: 0 auto;

  display: flex;
`;

const ContentWrapper = styled.div`
  width: 776px;

  display: flex;
  flex-direction: column;
`;

const MovieInfo = styled.section`
  display: flex;
  height: max-content;
`;

const PosterWrapper = styled.div`
  position: relative;
  display: block;
  width: 216px;
  margin-top: 50px;

  text-align: center;
`;

const Poster = styled.img`
  width: 100%;
  margin-bottom: 1rem;

  border-radius: 1rem;
  object-fit: cover;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InfoContainer = styled.div`
  width: 536px;
  height: fit-content;
  margin-left: 24px;
`;

const TitleWrap = styled.div`
  width: 100%;
  padding: 30px 0;

  display: flex;
  flex-direction: column;
  gap: 10px;

  border-bottom: 1px solid rgba(212, 212, 212, 0.8);
`;

const Title = styled.strong`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: "Verdana", "Geneva", sans-serif;
`;

const TitleEn = styled.p`
  font-size: 0.7rem;
  font-family: "Verdana", "Geneva", sans-serif;
  color: #a3a3a3;
`;

const InfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30px 0;
  border-bottom: 1px solid rgba(212, 212, 212, 0.8);
  gap: 10px;
`;

const Info = styled.strong`
  font-size: 0.8rem;
  line-height: 1.5rem;
  font-family: "Verdana", "Geneva", sans-serif;
`;

const SummaryWrap = styled.div`
  width: 100%;
  padding: 30px 0;
`;

const Summary = styled.strong`
  font-size: 0.8rem;
  line-height: 40px;
  font-family: "Verdana", "Geneva", sans-serif;
`;

const ListWrapper = styled.section`
  position: relative;
  width: 662px;
  margin: 0 auto;
  overflow: visible;
  margin-bottom: 30px;
`;

const HeadingWrapper = styled.div`
  background-color: #f6f6f6;
  text-align: center;
  padding: 10px;
  margin-bottom: 30px;
`;

const Heading = styled.h2`
  font-size: 1rem;
  font-weight: bolder;
  font-family: monospace, "Verdana", "Geneva", sans-serif;
`;

const ItemWrapper = styled.div`
  text-align: center;
`;

const Item = styled.img`
  margin: 0 auto 1rem auto;
  height: 132px;

  border-radius: 10px;
  object-fit: cover;
`;

const SideWrapper = styled.div`
  margin-left: 24px;
  width: 135px;
`;

const AdList = styled.div`
  margin-top: 50px;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Ad = styled.div`
  width: 100%;
  height: 250px;

  border: 1px solid rgba(212, 212, 212, 0.8);
`;

export default MoviePage;
