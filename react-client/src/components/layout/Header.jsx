import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Portal from "components/ui/Portal";
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
  const [clicked, setClicked] = useState(0);

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
    if (error && error.response) {
      if (error.response.data.message === "Access token expired") {
        refreshTrigger();
      }
    }

    // eslint-disable-next-line
  }, [error]);

  // access token 재발급 error 처리
  useEffect(() => {
    if (refreshErr && refreshErr.response) {
      console.log(refreshErr.response.data.message);
    }

    // eslint-disable-next-line
  }, [refreshErr]);

  const handleSearch = (searchStr) => {
    if (!searchStr?.trim()) return; // 빈 검색어 방지

    // 검색어를 쿼리 파라미터로 전달하면서 네비게이션
    navigate(`/search?searchStr=${encodeURIComponent(searchStr)}`);

    setSearchStr("");
  };

  // Enter 키 눌렀을 때 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchStr);
    }
  };

  const handleClick = (index) => {
    setClicked(index);
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
            ["/book", "예매"],
            ["/", "스토어"],
          ].map((item, index) => (
            <li key={index}>
              <LinkWrapper to={item[0]} data={{ clicked: clicked === index }} onClick={() => handleClick(index)}>
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
  width: 1056px;
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
  left: 2rem;
  text-decoration: none;
  font-size: 2.5rem;
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
  width: 66px;
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
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(212, 212, 212, 0.8);
`;

const NavMenu = styled.ul`
  display: flex;
  gap: 24px;
`;

const LinkWrapper = styled(Link)`
  width: 66px;
  display: block;
  text-align: center;
  text-decoration: none;

  color: ${(props) => (props.data.clicked ? "black" : "#666")};
  font-weight: ${(props) => (props.data.clicked ? "bold" : "500")};
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
