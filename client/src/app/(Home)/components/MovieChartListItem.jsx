import React from "react";
import styled from "styled-components";
import useAxios from "hooks/useAxios";

const PostListItem = (props) => {
  const { movieId, rank, change, isNew, onClickItem } = props;

  // 개별 영화 정보 가져오기
  const { data, error, loading } = useAxios({ url: `/movie/overview/${movieId}` });

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

  let openDate = data.reopen_date
    ? new Date(data.reopen_date).toISOString().slice(0, 10)
    : new Date(data.open_date).toISOString().slice(0, 10);

  return (
    <Container className="carousel-item">
      <PosterWrapper>
        <Poster src={data.poster} alt={data.movie_nm} onClick={() => onClickItem(movieId)}></Poster>
        <Rank>{rank + 1}</Rank>
      </PosterWrapper>

      <DescWrapper onClick={() => onClickItem(movieId)}>
        <MovieNm>{data.movie_nm}</MovieNm>
        {isNew ? (
          <IsNew>new</IsNew>
        ) : change > 0 ? (
          <Change>{"\u25B2" + change}</Change>
        ) : change === 0 ? null : (
          <Change $boxColor="blue">{"\u25BC" + Math.abs(change)}</Change>
        )}
      </DescWrapper>

      <OpenDate>
        {data.reopen_date ? `재개봉일` : `개봉일`} : {openDate}
      </OpenDate>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  text-align: center;
`;

const PosterWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Poster = styled.img`
  width: 135.2px;
  margin: 0 auto;
  border-radius: 30px;
  object-fit: cover;

  cursor: pointer;
`;

const Rank = styled.p`
  position: absolute;
  left: 32px;
  bottom: 1px;
  font-size: 2.5rem;
  font-weight: 600;
  font-style: oblique;
  color: #ffffff;
`;

const DescWrapper = styled.div`
  margin: 0 1rem;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;

const MovieNm = styled.p`
  margin-right: 5px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Change = styled.p`
  font-size: 13px;
  font-weight: 800;
  padding-bottom: 2px;

  color: ${(props) => (props.$boxColor ? props.$boxColor : "red")};
`;

const IsNew = styled.p`
  padding: 0 2px 3px 2px;
  font-size: 13px;
  line-height: 12px;

  color: white;
  background-color: #c20000;
`;

const OpenDate = styled.p`
  margin-top: 0.5rem;
  color: grey;
  font-size: 11px;
`;

export default PostListItem;
