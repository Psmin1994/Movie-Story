import React from "react";
import styled from "styled-components";

const Side = () => {
  return (
    <SideWrapper>
      <AdList>
        <Ad>광고</Ad>
        <Ad>광고</Ad>
      </AdList>
    </SideWrapper>
  );
};

const SideWrapper = styled.div`
  width: 156px;
`;

const AdList = styled.div`
  margin-top: 2rem;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Ad = styled.div`
  width: 100%;
  height: 250px;

  border: 1px solid rgba(212, 212, 212, 0.8);
`;

export default Side;
