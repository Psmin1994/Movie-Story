// rsc
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "hooks/useAxios";
import styled from "styled-components";
import BasicButton from "components/ui/BasicButton";
import MovieChartList from "./MovieChartList";

const MainPage = () => {
  const navigate = useNavigate();

  const [clicked, setClicked] = useState(0);

  const { data, error, loading } = useAxios({
    url: "/movie/chart",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // 페이지가 처음 로드될 때만 실행

  const handleClick = (index) => {
    setClicked(index);
  };

  return (
    <main>
      <Trailer>
        <ContentWrapper>
          <video width="936px" height="fit-content" src="http://localhost:5000/video/블루 록_1080x608.mp4" autoPlay muted></video>

          <Description>
            <Title>블루 록</Title>
            <BasicButton
              title="상세보기"
              addStyle={{
                width: "fit-content",
                backgroundColor: "#fff",
                border: "1px solid #000",
              }}
              onClickItem={() => navigate("/movie")}
            />
          </Description>
        </ContentWrapper>
      </Trailer>

      <ContentWrapper>
        <MovieChart>
          <NavWrap>
            <NavMenu>
              {["무비차트", "상영예정작"].map((item, index) => (
                <li key={index}>
                  <TagWrapper data={{ clicked: clicked === index }} onClick={() => handleClick(index)}>
                    <p>{item}</p>
                  </TagWrapper>
                </li>
              ))}
            </NavMenu>

            <BasicButton title={"전체보기"} onClickItem={() => navigate("/movie")} />
          </NavWrap>

          {loading ? (
            <p>Data is currently loading...</p>
          ) : error ? (
            <p>There was an error loading</p>
          ) : (
            data && (
              <MovieChartList
                movieChart={data}
                onClickItem={(movieId, data) => {
                  navigate(`/movie/${movieId}`, { state: data });
                }}></MovieChartList>
            )
          )}
        </MovieChart>

        <Store>매점 상품</Store>
      </ContentWrapper>
    </main>
  );
};

const Trailer = styled.section`
  height: fit-content;
  background-color: #000;
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 936px;
  padding: 0 24px;
  margin: 0 auto;
`;

const Description = styled.div`
  width: 100%;
  position: absolute;
  left: 10%;
  bottom: 15%;
  display: flex;
`;

const Title = styled.strong`
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.72);
  color: #fff;

  margin-right: 30px;
`;

const MovieChart = styled.section`
  height: fit-content;
`;

const NavWrap = styled.div`
  padding: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavMenu = styled.ul`
  display: flex;
`;

const TagWrapper = styled.strong`
  display: block;
  padding: 0 1rem;
  text-align: center;
  border-right: 1px solid #666;
  font-size: 1.5rem;

  cursor: pointer;

  color: ${(props) => (props.data.clicked ? "black" : "#666")};
  font-weight: ${(props) => (props.data.clicked ? "bold" : "500")};
`;

const Store = styled.section`
  height: 528px;
`;

export default MainPage;
