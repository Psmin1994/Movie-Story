"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BasicButton from "@/components/ui/BasicButton";
import MovieChartList from "./MovieChartList";

const MovieChartSection = ({ movieChart }: { movieChart: any }) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(0);

  return (
    <ContentWrapper>
      <MovieChart>
        <NavWrap>
          <NavMenu>
            {["무비차트", "상영예정작"].map((item, index) => (
              <li key={index}>
                <TagWrapper $clicked={clicked === index} onClick={() => setClicked(index)}>
                  <p>{item}</p>
                </TagWrapper>
              </li>
            ))}
          </NavMenu>

          <BasicButton title={"전체보기"} onClickItem={() => router.push("/movie")} />
        </NavWrap>

        <MovieChartList movieChart={movieChart} onClickItem={(movieId) => router.push(`/movie/${movieId}`)} />
      </MovieChart>

      <Store>매점 상품</Store>
    </ContentWrapper>
  );
};

export default MovieChartSection;

// styled-components 생략 가능
const ContentWrapper = styled.div`
  position: relative;
  width: 1056px;
  padding: 0 24px;
  margin: 0 auto;
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

const TagWrapper = styled.strong<{ $clicked: boolean }>`
  padding: 0 1rem;
  display: block;
  text-align: center;
  font-size: 1.5rem;
  border-right: 1px solid #666;
  cursor: pointer;
  color: ${(props) => (props.$clicked ? "black" : "#666")};
  font-weight: ${(props: { $clicked: any }) => (props.$clicked ? "bold" : "500")};
`;

const Store = styled.section`
  height: 528px;
`;
