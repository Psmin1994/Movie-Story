import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "components/ui/Modal";
import useAxiosTrigger from "hooks/useAxiosTrigger";
import BasicButton from "components/ui/BasicButton";

const RegisterModal = (props) => {
  const { isOpen, closeModal, setMode } = props;

  const INITIAL_VALUES = {
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
  };

  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [errData, setErrData] = useState({});

  let { data, loading, error, trigger } = useAxiosTrigger({
    url: `/user/register`,
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
      newErrors.id = "아이디를 입력하세요.";
    } else if (formData.id.length < 4 || formData.id.length > 12) {
      newErrors.id = "아이디는 4글자 이상 12글자 미만이어야합니다.";
    } else if (!/[a-zA-Z]/.test(formData.id)) {
      newErrors.id = "아이디에 영어가 포함되어야합니다.";
    } else if (!/\d/.test(formData.id)) {
      newErrors.id = "아이디에 숫자가 포함되어야합니다.";
    }

    // 비밀번호 유효성 검사
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력하세요.";
    } else if (formData.password.length < 4 || formData.password.length > 12) {
      newErrors.password = "비밀번호는 4글자 이상 12글자 미만이어야합니다.";
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = "비밀번호에 영어가 포함되어야합니다.";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "비밀번호에 숫자가 포함되어야합니다.";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = "비밀번호에 특수문자(!@#$%^&*)가 포함되어야합니다.";
    }

    // 비밀번호 확인 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지않습니다.";
    }

    // 닉네임 유효성 검사
    if (!formData.name) {
      newErrors.name = "이름을 입력하세요.";
    } else if (formData.name.length < 2 || formData.name.length > 8) {
      newErrors.name = "이름은 2글자 이상 8글자 미만이어야합니다.";
    } else if (/[^가-힣]/.test(formData.name)) {
      newErrors.name = "이름은 한글로 작성해주세요.";
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

    // 중복 요청을 방지
    if (loading) return;

    if (validate()) trigger();
  };

  // data가 업데이트되었을 때 후속 처리 (useEffect)
  useEffect(() => {
    if (data && data.success) {
      // 성공 처리 (예: 토큰 저장, 모달 닫기 등)
      alert(data.message);
      setMode("login");
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
      }
    }
    // eslint-disable-next-line
  }, [error]);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      onCloseItem={() => {
        setFormData(INITIAL_VALUES);
        setMode("login");
      }}>
      <Container>
        <Title>Movie Story</Title>

        <LoginForm onSubmit={handleSubmit}>
          <StyledInput name="id" type="text" placeholder="Id" autoComplete="off" value={formData.id} onChange={handleChange}></StyledInput>
          <StyledCheck>확인</StyledCheck>

          <ErrorMessage id="id-msg">{errData.id}</ErrorMessage>

          <StyledInput
            name="password"
            type="password"
            autoComplete="off"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}></StyledInput>
          <ErrorMessage id="password-msg">{errData.password}</ErrorMessage>

          <StyledInput
            name="confirmPassword"
            type="password"
            autoComplete="off"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}></StyledInput>
          <ErrorMessage id="confirm-password-msg">{errData.confirmPassword}</ErrorMessage>

          <StyledInput
            name="name"
            type="text"
            autoComplete="off"
            placeholder="name"
            value={formData.name}
            onChange={handleChange}></StyledInput>
          <ErrorMessage id="name-msg">{errData.name}</ErrorMessage>

          <StyledCommit type="submit" disabled={loading}>
            {loading ? "Trying..." : "Create"}
          </StyledCommit>
        </LoginForm>

        <LinkWrapper>
          <StyledText>이미 계정이 있으신가요?</StyledText>
          <BasicButton title={"로그인"} onClickItem={() => setMode("login")} />
        </LinkWrapper>
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
  width: 256px;

  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  position: relative;

  height: 2rem;
  padding-left: 1rem;

  font-size: 1rem;
  font-weight: 600;

  background-color: #e9e9e9;
  border-radius: 5px;
  border: none;
`;

const StyledCheck = styled.button`
  position: absolute;
  height: 2rem;
  color: #fff;

  font-size: 1rem;
  font-weight: 600;

  background-color: #494949;
  border-radius: 5px;
  border: none;
`;

const StyledCommit = styled.button`
  height: 2rem;
  color: #fff;

  font-size: 1rem;
  font-weight: 600;

  background-color: #494949;
  border-radius: 5px;
  border: none;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
  margin: 8px 0;
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

export default RegisterModal;
