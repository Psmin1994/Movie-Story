import React from "react";
import styled from "styled-components";
import useAxios from "hooks/useAxios";

const PostListItem = (props) => {
  const { movieId, onClickItem } = props;

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
      <Poster src={data.poster} alt={data.movie_nm} onClick={() => onClickItem(movieId)}></Poster>

      <MovieNm>{data.movie_nm}</MovieNm>

      <OpenDate>
        {data.reopen_date ? `재개봉일` : `개봉일`} : {openDate}
      </OpenDate>
    </Container>
  );
};

const Container = styled.div`
  width: 231px;
  margin: 24px auto;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Poster = styled.img`
  width: 164px;
  margin: 0 auto;
  border-radius: 30px;
  object-fit: cover;

  cursor: pointer;
`;

const MovieNm = styled.p`
  margin-top: 1rem;
  font-size: 13px;
  font-weight: 800;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OpenDate = styled.p`
  margin-top: 0.5rem;
  color: grey;
  font-size: 11px;
`;

export default PostListItem;
