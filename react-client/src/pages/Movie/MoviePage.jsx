import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "hooks/useAxios";
import BasicButton from "components/ui/BasicButton";
import styled from "styled-components";
import Slider from "react-slick";
import CustomArrow from "components/ui/CustomArrow";
import StillCutItem from "./StillCutItem";
import Side from "components/layout/Side";

const MoviePage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    data: movie,
    error,
    loading,
  } = useAxios({
    url: `/movie/detail/${id}`,
  });

  const { data: actor } = useAxios({ url: `/movie/actor/${id}` });
  const { data: director } = useAxios({ url: `/movie/director/${id}` });

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
    infinite: true,
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

  let movieInfo = movie.movie_info;

  movie.open_date = new Date(movie.open_date).toISOString().slice(0, 10);

  movie.reopen_date = movie.reopen_date ? new Date(movie.reopen_date).toISOString().slice(0, 10) : null;

  return (
    <Container>
      <Content>
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
              {director && (
                <Info>
                  {`감독 : ${director
                    .map((item) => {
                      return item.name;
                    })
                    .join(", ")}`}
                </Info>
              )}

              {actor && (
                <Info>
                  {`배우 : ${actor
                    .map((item) => {
                      return item.name;
                    })
                    .join(", ")}`}
                </Info>
              )}

              {movie.genre && <Info>장르 : {movie.genre.replaceAll(",", ", ")}</Info>}

              <Info>제작국가 : {movieInfo.nation}</Info>
              <Info>
                상영시간 : {movieInfo.showtime} 분 {movie.reopen_date ? `/ 재개봉일 : ${movie.reopen_date} ` : null}/ 개봉일 :{" "}
                {movie.open_date}
              </Info>
            </InfoWrap>

            <SummaryWrap>
              <Summary>{movieInfo.summary}</Summary>
            </SummaryWrap>
          </InfoContainer>
        </MovieInfo>

        {movieInfo.still_cut && (
          <section>
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
          </section>
        )}

        {director && (
          <section>
            <HeadingWrapper>
              <Heading>감독</Heading>
            </HeadingWrapper>

            <ListWrapper>
              <Slider {...castSettings}>
                {director.map(({ director_id, name, profile }) => {
                  return (
                    <ItemWrapper key={director_id}>
                      <Item src={profile} alt={name} />
                      <p>{name}</p>
                    </ItemWrapper>
                  );
                })}
              </Slider>
            </ListWrapper>
          </section>
        )}

        {actor && (
          <section>
            <HeadingWrapper>
              <Heading>배우</Heading>
            </HeadingWrapper>

            <ListWrapper>
              <Slider {...castSettings}>
                {actor.map(({ actor_id, name, profile }) => {
                  return (
                    <ItemWrapper key={actor_id}>
                      <Item src={profile} alt={name} />
                      <p>{name}</p>
                    </ItemWrapper>
                  );
                })}
              </Slider>
            </ListWrapper>
          </section>
        )}
      </Content>

      <Side />
    </Container>
  );
};

const Container = styled.main`
  width: 1056px;
  padding: 0 24px;
  margin: 0 auto;
  position: relative;
  display: flex;
`;

const Content = styled.div`
  width: 876px;
  display: flex;
  flex-direction: column;
  margin-right: 24px;
`;

const MovieInfo = styled.section`
  margin-top: 50px;
  display: flex;
  height: max-content;
`;

const PosterWrapper = styled.div`
  width: 246px;
  margin-top: 20px;
  position: relative;
  display: block;
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
  width: 606px;
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
  font-size: 0.8rem;
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
  font-size: 0.9rem;
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

const ListWrapper = styled.div`
  position: relative;
  width: 744px;
  padding: 0 24px;
  margin: 0 auto;
  overflow: visible;
  margin-bottom: 30px;
`;

const ItemWrapper = styled.div`
  min-width: 174px;
  display: flex;
  text-align: center;
`;

const Item = styled.img`
  height: 130px;
  margin: 0 auto;
  border-radius: 20px;

  margin-bottom: 16px;
  object-fit: cover;
`;

export default MoviePage;
