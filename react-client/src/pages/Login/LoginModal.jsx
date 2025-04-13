import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "components/ui/Modal";
import useAxiosTrigger from "hooks/useAxiosTrigger";
import BasicButton from "components/ui/BasicButton";

// 이미지 import
import naverIcon from "assets/icons/login/naver_20px.png";
import googleIcon from "assets/icons/login/google_24px.png";
import githubIcon from "assets/icons/login/github_28px.png";
import kakaoIcon from "assets/icons/login/kakao_28px.png";

const LoginModal = (props) => {
  const { isOpen, closeModal, setMode } = props;

  const INITIAL_VALUES = {
    id: "",
    password: "",
  };

  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [errData, setErrData] = useState({});

  let { data, loading, error, trigger } = useAxiosTrigger({
    url: `/user/login`,
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: formData,
  });

  // client 측 validation
  const validate = () => {
    const newErrors = {};

    // 아이디 유효성 검사
    if (!formData.id) {
      newErrors.id = "아이디를 입력하세요";
    }

    // 비밀번호 유효성 검사
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력하세요";
    }

    setErrData(newErrors);

    // 오류가 없다면 true 반환
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      // 객체 안에서 key를 []로 감싸면 이 안의 레퍼런스가 가리키는 실제 값이 key로 사용
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 요청이 진행 중일 때는 버튼을 비활성화하여 중복 요청을 방지
    if (loading) return;

    if (validate()) trigger();
  };

  // data가 업데이트되었을 때 처리 (useEffect)
  useEffect(() => {
    if (data && data.success) {
      // 로그인 성공 처리
      alert(data.message);
      closeModal(); // 모달 닫기
      setFormData(INITIAL_VALUES); // 로그인 후 formData 리셋
      window.location.reload();
    }
    // eslint-disable-next-line
  }, [data]); // data가 변경될 때마다 실행

  // error가 발생한 경우 처리 (useEffect)
  useEffect(() => {
    if (error && error.response) {
      let err = error.response;

      let statueCode = err.status;

      if (statueCode < 500) {
        alert(err.data.message);
        setFormData(INITIAL_VALUES); // 로그인 후 formData 리셋
      }
    }
    // eslint-disable-next-line
  }, [error]);

  // 로그인 페이지로 이동할 때 현재 URL을 쿼리 스트링으로 전달
  const handleNaverLogin = () => {
    // 현재 페이지
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl); // URL 인코딩

    window.location.href = `http://localhost:5000/auth/naver?state=${encodedUrl}`;
  };

  const handleKakaoLogin = () => {
    // 현재 페이지
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl); // URL 인코딩

    window.location.href = `http://localhost:5000/auth/kakao?state=${encodedUrl}`;
  };

  const handleGoogleLogin = () => {
    // 현재 페이지
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl); // URL 인코딩

    window.location.href = `http://localhost:5000/auth/google?state=${encodedUrl}`;
  };

  // 로그인 페이지로 이동할 때 현재 URL을 쿼리 스트링으로 전달
  const handleGithubLogin = () => {
    // 현재 페이지
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl); // URL 인코딩

    window.location.href = `http://localhost:5000/auth/github?state=${encodedUrl}`;
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} onCloseItem={() => setFormData(INITIAL_VALUES)}>
      <Container>
        <Title>Movie Story</Title>

        <LoginForm onSubmit={handleSubmit}>
          <StyledInput name="id" type="text" placeholder="ID" autoComplete="off" value={formData.id} onChange={handleChange}></StyledInput>
          <ErrorMessage id="id-msg">{errData.id}</ErrorMessage>

          <StyledInput
            name="password"
            type="password"
            autoComplete="off"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}></StyledInput>
          <ErrorMessage id="password-msg">{errData.password}</ErrorMessage>

          <StyledCommit type="submit" disabled={loading}>
            {loading ? "Trying..." : "Login"}
          </StyledCommit>
        </LoginForm>

        <LinkWrapper>
          <StyledText>계정이 없으신가요? </StyledText>
          <BasicButton title={"회원가입"} onClickItem={() => setMode("register")} />
        </LinkWrapper>

        <StyledDiv>
          <Line />
          <p style={{ padding: "0 0.5rem", fontSize: "0.8rem", color: "#494949" }}>OR</p>
          <Line />
        </StyledDiv>

        <OAuth>
          <Kakao onClick={handleKakaoLogin}>
            <StyledImg src={kakaoIcon} alt="카카오 로그인" />
          </Kakao>
          <Naver onClick={handleNaverLogin}>
            <StyledImg src={naverIcon} alt="네이버 로그인" />
          </Naver>
          <Google onClick={handleGoogleLogin}>
            <StyledImg src={googleIcon} alt="구글 로그인" />
          </Google>
          <Github onClick={handleGithubLogin}>
            <StyledImg src={githubIcon} alt="깃허브 로그인" />
          </Github>
        </OAuth>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  padding: 48px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #ed3124;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  width: 256px;
  height: 2rem;
  padding-left: 1rem;

  font-size: 1rem;
  font-weight: 600;

  background-color: #e9e9e9;
  border-radius: 5px;
  border: 0;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
  margin: 8px 0;
`;

const StyledCommit = styled.button`
  height: 2rem;
  color: #fff;

  font-size: 1rem;
  font-weight: 600;

  background-color: #494949;
  border-radius: 5px;
  border: 0;
`;

const LinkWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; // 수직
`;

const StyledText = styled.span`
  font-size: 1rem;
  color: #a4a2a2;
  padding-right: 0.5rem;
`;

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e9e9e9;
`;

const OAuth = styled.ul`
  display: flex;
  flex-direction: row;

  gap: 1rem;
`;

const Kakao = styled.button`
  position: relative;
  width: 42px;
  height: 42px;

  background-color: #ffd233;
  border-radius: 50%;
  border: none;

  cursor: pointer;
`;

const Naver = styled.button`
  position: relative;
  width: 42px;
  height: 42px;

  background-color: #00c300;
  border-radius: 50%;
  border: none;

  cursor: pointer;
`;

const Google = styled.button`
  position: relative;
  width: 42px;
  height: 42px;

  background-color: #ffffff;
  border-radius: 50%;
  border: 0.5px solid #cacaca;

  cursor: pointer;
`;

const Github = styled.button`
  position: relative;
  width: 42px;
  height: 42px;

  background-color: #000000;
  border-radius: 50%;
  border: none;

  cursor: pointer;
`;

const StyledImg = styled.img`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`;

export default LoginModal;
