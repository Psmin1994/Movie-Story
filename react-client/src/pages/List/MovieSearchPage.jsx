import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import useAxiosTrigger from "hooks/useAxiosTrigger";
import MovieList from "./MovieList";

const MovieSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchStr = queryParams.get("searchStr");

  let {
    data: movies,
    loading,
    error,
    trigger,
  } = useAxiosTrigger({
    url: `/movie/search`,
    method: "get",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    params: { searchStr },
  });

  useEffect(() => {
    trigger();

    // eslint-disable-next-line
  }, [searchStr]); // 페이지가 처음 로드될 때만 실행

  if (loading)
    return (
      <ContentWrapper>
        <p>Loading...</p>
      </ContentWrapper>
    );

  if (error)
    return (
      <ContentWrapper>
        <p>Error: {error.message}</p>
      </ContentWrapper>
    );

  return (
    <ContentWrapper>
      <Title>{`"${searchStr}" 검색 결과`}</Title>
      <Content>
        {movies && (
          <MovieList
            movies={movies}
            onClickItem={(movieId) => {
              navigate(`/movie/${movieId}`);
            }}></MovieList>
        )}
      </Content>
    </ContentWrapper>
  );
};

const ContentWrapper = styled.main`
  position: relative;
  width: 1056px;
  padding: 0 24px;
  margin: 0 auto;
`;

const Title = styled.h2`
  position: relative;
  left: 66px;
  margin: 2rem 0;

  font-size: 1.5rem;
  font-weight: 700;
`;

const Content = styled.section`
  height: fit-content;
`;

export default MovieSearchPage;
