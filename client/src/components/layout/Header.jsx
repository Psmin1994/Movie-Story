import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Portal from "utils/Portal";
import useModal from "hooks/useModal";
import useAxiosTrigger from "hooks/useAxiosTrigger";

// 컴포넌트 import
import LoginPage from "pages/Login/LoginPage";

// 이미지 import
import loginIcon from "assets/icons/member/login_36px.png";
import logoutIcon from "assets/icons/member/logout_36px.png";
import userIcon from "assets/icons/member/user_36px.png";
import serviceIcon from "assets/icons/member/service_36px.png";
import searchIcon from "assets/icons/member/search_40px.png";

const Header = () => {
  const navigate = useNavigate();
  // 상태 관리를 위한 useState 훅
  const [searchStr, setSearchStr] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { isOpen, openModal, closeModal } = useModal();

  // access token 검증 요청
  const { data, error, loading, trigger } = useAxiosTrigger({
    url: "/user/info",
  });

  // refresh token으로 access token 재발급 요청
  let {
    data: refresh,
    error: refreshErr,
    loading: refreshLoading,
    trigger: refreshTrigger,
  } = useAxiosTrigger({
    url: "/user/refresh",
  });

  let { trigger: logoutTrigger } = useAxiosTrigger({
    url: "/user/logout",
  });

  useEffect(() => {
    trigger();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (refresh) {
      // 재발급 완료 시, access token 다시 검증 요청
      trigger();
    }
    // eslint-disable-next-line
  }, [refresh]);

  // access token 검증 error 처리
  useEffect(() => {
    if (error?.response) {
      if (error.response.status === 401) {
        refreshTrigger();
      }
    }

    // eslint-disable-next-line
  }, [error]);

  // access token 재발급 error 처리
  useEffect(() => {
    if (refreshErr?.response) {
      console.log(refreshErr.response.data.message);
    }

    // eslint-disable-next-line
  }, [refreshErr]);

  const handleSearch = (searchStr) => {
    // 검색어를 쿼리 파라미터로 전달하면서 네비게이션
    navigate(`/search?searchStr=${searchStr}`);
  };

  // Enter 키 눌렀을 때 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchStr);
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <Title onClick={() => navigate("/")}>Movie Story</Title>

        <MemberInfo>
          {loading || refreshLoading ? null : data && data.nickname ? (
            <>
              <li>
                <span
                  style={{
                    fontSize: "1rem",
                  }}>
                  <span
                    style={{
                      fontWeight: "700",
                      color: "black",
                    }}>
                    {data.nickname}
                  </span>{" "}
                  님
                </span>
              </li>
              <li>
                <IconWrapper
                  onClick={() => {
                    navigate("/user");
                  }}>
                  <img src={userIcon} alt="마이페이지" />
                  <StyledText>My Page</StyledText>
                </IconWrapper>
              </li>
              <li>
                <IconWrapper
                  onClick={async () => {
                    await logoutTrigger();

                    window.location.reload();
                  }}>
                  <img src={logoutIcon} alt="로그아웃" />
                  <StyledText>로그아웃</StyledText>
                </IconWrapper>
              </li>
            </>
          ) : (
            <li>
              <IconWrapper onClick={openModal}>
                <img src={loginIcon} alt="로그인" />
                <StyledText>로그인</StyledText>
              </IconWrapper>
              <Portal>
                <LoginPage isOpen={isOpen} closeModal={closeModal} />
              </Portal>
            </li>
          )}
          <li>
            <IconWrapper
              onClick={() => {
                navigate("/support");
              }}>
              <img src={serviceIcon} alt="고객센터" />
              <StyledText>고객센터</StyledText>
            </IconWrapper>
          </li>
        </MemberInfo>
      </HeaderWrapper>

      <GNB>
        <NavMenu>
          {[
            ["/movie", "영화"],
            ["/", "예매"],
            ["/", "스토어"],
          ].map((item, index) => (
            <li key={index}>
              <LinkWrapper
                to={item[0]}
                data-selected={selectedIndex === index}
                onClick={() => {
                  setSelectedIndex(index); // 선택된 항목의 인덱스를 상태로 관리
                }}>
                <p>{item[1]}</p>
              </LinkWrapper>
            </li>
          ))}
        </NavMenu>

        <Search>
          <TextField
            id="outlined-search"
            label="Search"
            variant="outlined"
            size="small"
            value={searchStr}
            onChange={(event) => {
              setSearchStr(event.target.value);
            }}
            onKeyDown={handleKeyDown} // Enter 키 감지
            style={{
              width: "212px",
            }}
          />
          <SearchIcon onClick={() => handleSearch(searchStr)}>
            <img src={searchIcon} alt="검색"></img>
          </SearchIcon>
        </Search>
      </GNB>
    </Container>
  );
};

const Container = styled.header`
  width: 936px;
  margin: 0 auto;
  padding: 0 24px;
`;

const HeaderWrapper = styled.section`
  padding: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  position: relative;
  left: 1.5rem;
  text-decoration: none;
  font-size: 2rem;
  font-weight: 900;

  color: red;
  cursor: pointer;
`;

const MemberInfo = styled.ul`
  display: flex;
  align-items: center;

  gap: 24px;
`;

const IconWrapper = styled.div`
  display: block;
  min-width: 56px;
  text-align: center;

  color: #666;

  &:hover {
    cursor: pointer;
  }
`;

const StyledText = styled.p`
  padding-top: 0.5rem;
  font-size: 1rem;
`;

const GNB = styled.section`
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0; 
  z-index: 1;*/
  padding: 0.7rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavMenu = styled.ul`
  display: flex;
`;

const LinkWrapper = styled(Link)`
  display: block;
  padding: 0 1rem;
  text-align: center;
  text-decoration: none;

  color: ${(props) => (props["data-selected"] ? "black" : "#666")};
  font-weight: ${(props) => (props["data-selected"] ? "bold" : "500")};
`;

const Search = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  cursor: pointer;
`;

export default Header;
