import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAxios from "hooks/useAxios";
import Slider from "react-slick";
import CustomArrow from "components/ui/CustomArrow";
import { getNext30Days } from "utils/date.util.js";
import Side from "components/layout/Side";

const BookPage = () => {
  const navigate = useNavigate();

  const INITIAL_VALUES = {
    date: "",
  };

  const [formData, setFormData] = useState(INITIAL_VALUES);

  console.log(formData);

  const handleClick = (index, { year, month, day }) => {
    // 월과 일을 두 자릿수로 맞추기 위해 padStart 사용
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    // YYYY-MM-DD 형식으로 반환
    let date = `${year}-${formattedMonth}-${formattedDay}`;

    setClicked(index);
    setFormData({
      ...formData,
      date,
    });
  };

  const [clicked, setClicked] = useState(0);

  // 영화, 극장, 영화시간, 상영관
  // const { data, error, loading } = useAxios({
  //   url: "/movie",
  // });

  // if (loading)
  //   return (
  //     <Container>
  //       <p>Loading...</p>
  //     </Container>
  //   );

  // if (error)
  //   return (
  //     <Container>
  //       <p>Error: {error.message}</p>
  //     </Container>
  //   );

  const settings = {
    arrows: true,
    speed: 500,
    slidesToShow: 11,
    slidesToScroll: 5,
    infinite: false,

    prevArrow: <CustomArrow direction="left" size="1" />,
    nextArrow: <CustomArrow direction="right" size="1" />,
  };

  const dates = getNext30Days();

  return (
    <Container>
      <SideAd>
        <Side />
      </SideAd>

      <Title>예매하기</Title>

      <Content>
        <DateList>
          <Slider {...settings}>
            {dates.map(({ year, month, day, weekday }, index) => (
              <DateWrapper
                key={index}
                data={{ clicked: clicked === index }}
                onClick={() => {
                  handleClick(index, { year, month, day });
                }}>
                {day === 1 && <YearText>{year}</YearText>}
                <DateText>{`${month}.${day} ${weekday}`}</DateText>
              </DateWrapper>
            ))}
          </Slider>
        </DateList>

        <ChoiceWrapper>
          <MovieChoice>
            <p>영화</p>
            <MovieList></MovieList>
          </MovieChoice>

          <TheaterChoice>
            <p>극장</p>
            <MovieList></MovieList>
          </TheaterChoice>

          <TimeChoice>
            <p>시간</p>
            <MovieList></MovieList>
          </TimeChoice>
        </ChoiceWrapper>
      </Content>

      <Ad>광고</Ad>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  width: 1058px;
  padding: 0 24px;
  margin: 0 auto;
`;

const SideAd = styled.div`
  position: absolute;
  right: 0;

  transform: translateX(100%);
`;

const Title = styled.h2`
  margin: 2rem 0;
  padding-left: 66px;

  font-size: 1.5rem;
  font-weight: 700;
`;

const Content = styled.section`
  height: fit-content;
  margin-bottom: 24px;
  border: 0.5px solid #666;
`;

const DateList = styled.div`
  width: 976px;
  padding: 0 40px;
  overflow: visible;
  border-bottom: 0.5px solid #666;
`;

const DateWrapper = styled.li`
  position: relative;
  display: block;
  text-align: center;

  background-color: ${(props) => (props.data.clicked ? "rgba(212, 212, 212, 0.5)" : "#fff")};

  border-bottom: ${(props) => props.data.clicked && "1px solid red"};

  &:hover {
    cursor: pointer;
  }
`;

const YearText = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%); //  자기 자신의 크기만큼 왼쪽으로 이동하여 정중앙 정렬
  font-size: 0.7rem;
  color: #666;
`;

const DateText = styled.strong`
  padding: 0 auto;
  line-height: 40px;

  font-size: 1rem;
  font-weight: 500;
  color: black;
`;

const ChoiceWrapper = styled.div`
  display: flex;
  height: 530px;
`;

const MovieChoice = styled.div`
  width: 240px;
  padding: 1rem;
  border-right: 0.5px solid #666;
`;

const MovieList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const TheaterChoice = styled.div`
  width: 330px;
  padding: 1rem;
  border-right: 0.5px solid #666;
`;

const TimeChoice = styled.div`
  padding: 1rem;
`;

const Ad = styled.div`
  height: 100px;
  margin-bottom: 24px;

  border: 1px solid rgba(212, 212, 212, 0.8);
`;

export default BookPage;
