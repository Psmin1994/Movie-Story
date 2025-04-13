import React from "react";
import styled from "styled-components";

// 이미지 import
import blogIcon from "assets/icons/contact/blog.png";
import githubIcon from "assets/icons/contact/github.png";

const Footer = () => {
  return (
    <Container>
      <FooterContent>
        <ContactWrapper>
          <Logo>PSMIN</Logo>
          <Contact href="https://github.com/Psmin1994" rel="noopener noreferrer" target="_blank">
            <img src={githubIcon} alt="깃허브 저장소" />
          </Contact>
          <Contact href="https://psmin1994.github.io/" rel="noopener noreferrer" target="_blank">
            <img src={blogIcon} alt="개인 블로그" />
          </Contact>
        </ContactWrapper>

        <p>정책</p>
      </FooterContent>
    </Container>
  );
};

const Container = styled.footer`
  margin-top: auto;
  background-color: #b7b7b7;
`;

const FooterContent = styled.div`
  width: 936px;
  margin: 0 auto;
  padding: 2rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ContactWrapper = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif;
  color: #666;
`;

const Contact = styled.a`
  display: block;
  text-decoration: none;
`;

export default Footer;
