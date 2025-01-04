import React from "react";
import styled from "styled-components";
import useAxios from "hooks/useAxios";

const PostListItem = (props) => {
  const { movieId, rank, change, isNew, onClickItem } = props;

  // 개별 영화 정보 가져오기
  const { data, error, loading } = useAxios({ url: `/movie/basic/${movieId}` });

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

  return (
    <Container className="carousel-item" onClick={() => onClickItem(movieId)}>
      <div
        style={{
          position: "relative",
        }}>
        <Poster src={data[0].poster} alt={data[0].movie_nm}></Poster>
        <Rank>{rank + 1}</Rank>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 1rem",
        }}>
        <MovieNm>{data[0].movie_nm}</MovieNm>
        {isNew ? (
          <IsNew>new</IsNew>
        ) : change > 0 ? (
          <Change>{"\u25B2" + change}</Change>
        ) : change === 0 ? null : (
          <Change $boxColor="blue">{"\u25BC" + Math.abs(change)}</Change>
        )}
      </div>

      <OpenDate>개봉일 : {data[0].open_date}</OpenDate>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;

  text-align: center;
`;

const Poster = styled.img`
  width: 127.2px;
  margin: 0 auto;
  border-radius: 30px;
  object-fit: cover;
`;

const Rank = styled.p`
  position: absolute;
  left: 1.5rem;
  bottom: 1px;
  font-size: 2.5rem;
  font-weight: 600;
  font-style: oblique;
  color: #ffffff;
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
  padding-bottom: 2px;

  font-weight: 800;

  color: ${(props) => (props.$boxColor ? props.$boxColor : "red")};
`;

const IsNew = styled.p`
  font-size: 13px;
  line-height: 12px;
  padding: 0 2px 3px 2px;

  color: white;
  background-color: #c20000;
`;

const OpenDate = styled.p`
  color: grey;
  font-size: 11px;
`;

export default PostListItem;
