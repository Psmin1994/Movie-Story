import React from "react";
import styled from "styled-components";

const UserPage = () => {
  return (
    <Container>
      <MovieChart>
        <NavWrap>
          <NavMenu>
            <li style={{ borderRight: "1px solid #666" }}>
              <ATagWrapper href="/">
                <p
                  style={{
                    color: "#333",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                  }}>
                  무비차트
                </p>
              </ATagWrapper>
            </li>
            <li>
              <ATagWrapper href="/">
                <p
                  style={{
                    color: "#666",
                    fontSize: "1.5rem",
                  }}>
                  상영예정작
                </p>
              </ATagWrapper>
            </li>
          </NavMenu>
        </NavWrap>
      </MovieChart>
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  width: 936px;
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

const ATagWrapper = styled.a`
  display: block;
  padding: 0 1rem;
  text-align: center;
  text-decoration: none;
`;

export default UserPage;
